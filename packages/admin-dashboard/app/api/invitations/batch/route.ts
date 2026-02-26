/**
 * Batch Agent Activation API Route
 *
 * POST /api/invitations/batch - Batch create users and send activation emails (admin only)
 *
 * For existing agents who need portal accounts. Pre-populates user records
 * with name, email, legal_name, exp_email, and optionally marks onboarding
 * as completed (since these agents already did onboarding in person).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/app/master-controller/lib/supabaseClient';
import { verifyAdminAuth } from '@/app/api/middleware/adminAuth';
import {
  createInvitation,
  createAuditLog,
} from '@saa/shared/lib/supabase/invitation-service';
import { sendAgentActivationEmail } from '@/lib/email/send';
import { emailQueue } from '@/lib/email/send';

export const dynamic = 'force-dynamic';

// All 10 onboarding steps marked as complete
const COMPLETED_ONBOARDING_PROGRESS = {
  step1_welcome_video: true,
  step2_okta_account: true,
  step3_broker_tasks: true,
  step4_choose_crm: true,
  step5_training: true,
  step6_community: true,
  step7_karrie_session: true,
  step8_link_page: true,
  step9_elite_courses: true,
  step10_download_app: true,
};

interface AgentInput {
  name: string;
  email: string;
  legalName?: string;
  expEmail?: string;
  state?: string;
}

interface AgentResult {
  email: string;
  name: string;
  status: 'sent' | 'skipped' | 'failed';
  userId?: string;
  reason?: string;
}

/**
 * POST /api/invitations/batch
 *
 * Admin-only endpoint to batch-create user accounts and send activation emails.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      agents,
      skipOnboarding = true,
      dryRun = false,
    }: {
      agents: AgentInput[];
      skipOnboarding?: boolean;
      dryRun?: boolean;
    } = body;

    // Validate input
    if (!Array.isArray(agents) || agents.length === 0) {
      return NextResponse.json(
        { error: 'agents array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (agents.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 agents per batch' },
        { status: 400 }
      );
    }

    // Validate each agent entry
    const validationErrors: string[] = [];
    const emailSet = new Set<string>();

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      if (!agent.name || typeof agent.name !== 'string' || !agent.name.trim()) {
        validationErrors.push(`Agent ${i + 1}: name is required`);
      }
      if (!agent.email || typeof agent.email !== 'string' || !agent.email.includes('@')) {
        validationErrors.push(`Agent ${i + 1}: valid email is required`);
      } else {
        const normalizedEmail = agent.email.trim().toLowerCase();
        if (emailSet.has(normalizedEmail)) {
          validationErrors.push(`Agent ${i + 1}: duplicate email ${agent.email}`);
        }
        emailSet.add(normalizedEmail);
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation errors', details: validationErrors },
        { status: 400 }
      );
    }

    // Process each agent
    const results: AgentResult[] = [];

    for (const agent of agents) {
      const email = agent.email.trim().toLowerCase();
      const name = agent.name.trim();
      const firstName = name.split(' ')[0] || name;

      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, status, email')
          .eq('email', email)
          .single();

        if (existingUser) {
          results.push({
            email,
            name,
            status: 'skipped',
            userId: existingUser.id,
            reason: `User already exists (status: ${existingUser.status})`,
          });
          continue;
        }

        // Check for existing pending invitation
        const { data: existingInvitation } = await supabase
          .from('user_invitations')
          .select('id')
          .eq('email', email)
          .eq('status', 'pending')
          .gt('expires_at', new Date().toISOString())
          .single();

        if (existingInvitation) {
          results.push({
            email,
            name,
            status: 'skipped',
            reason: 'Active invitation already exists',
          });
          continue;
        }

        if (dryRun) {
          results.push({
            email,
            name,
            status: 'sent',
            reason: 'dry run - would create user and send email',
          });
          continue;
        }

        // Create user record
        const username = email.split('@')[0];
        const now = new Date().toISOString();

        const userRecord: Record<string, unknown> = {
          name,
          email,
          username,
          role: 'user',
          status: 'invited',
          created_at: now,
          updated_at: now,
        };

        // Pre-populate optional fields
        if (agent.legalName) {
          userRecord.legal_name = agent.legalName.trim();
        }
        if (agent.expEmail) {
          userRecord.exp_email = agent.expEmail.trim().toLowerCase();
        }
        if (agent.state) {
          userRecord.state = agent.state.trim().toUpperCase();
        }

        // Set first_name and last_name from name
        const nameParts = name.split(' ');
        userRecord.first_name = nameParts[0];
        if (nameParts.length > 1) {
          userRecord.last_name = nameParts.slice(1).join(' ');
        }
        userRecord.full_name = name;

        // Skip onboarding for existing agents
        if (skipOnboarding) {
          userRecord.onboarding_completed_at = now;
          userRecord.onboarding_progress = COMPLETED_ONBOARDING_PROGRESS;
        }

        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert(userRecord)
          .select()
          .single();

        if (userError) {
          results.push({
            email,
            name,
            status: 'failed',
            reason: `Failed to create user: ${userError.message}`,
          });
          continue;
        }

        // Create invitation
        const { data: invitation, error: invitationError } = await createInvitation(
          supabase,
          {
            userId: newUser.id,
            email,
            expiresInHours: 48,
            createdBy: authResult.userId!,
          }
        );

        if (invitationError || !invitation) {
          // Rollback user creation
          await supabase.from('users').delete().eq('id', newUser.id);

          results.push({
            email,
            name,
            status: 'failed',
            reason: `Failed to create invitation: ${invitationError?.message || 'Unknown error'}`,
          });
          continue;
        }

        // Send activation email via rate-limited queue
        const emailResult = await emailQueue.add(() =>
          sendAgentActivationEmail(email, firstName, invitation.token, 48)
        );

        if (!emailResult.success) {
          console.error(`[Batch] Email failed for ${email}:`, emailResult.error);
          // Don't rollback — user and invitation exist, email can be resent
          results.push({
            email,
            name,
            status: 'failed',
            userId: newUser.id,
            reason: `User created but email failed: ${emailResult.error}`,
          });
          continue;
        }

        results.push({
          email,
          name,
          status: 'sent',
          userId: newUser.id,
        });
      } catch (agentError) {
        results.push({
          email,
          name,
          status: 'failed',
          reason: agentError instanceof Error ? agentError.message : 'Unknown error',
        });
      }
    }

    // Build summary
    const summary = {
      total: results.length,
      sent: results.filter(r => r.status === 'sent').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      failed: results.filter(r => r.status === 'failed').length,
    };

    // Create audit log
    if (!dryRun) {
      await createAuditLog(supabase, {
        userId: authResult.userId!,
        action: 'batch_invitation.created',
        resourceType: 'invitation',
        resourceId: 'batch',
        details: {
          summary,
          dryRun,
          skipOnboarding,
          agentCount: agents.length,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });
    }

    return NextResponse.json({
      success: true,
      dryRun,
      results,
      summary,
    }, { status: dryRun ? 200 : 201 });
  } catch (error) {
    console.error('[Batch Invitation] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
