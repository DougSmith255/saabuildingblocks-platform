import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - exclude from static export
export const dynamic = 'error';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/roles
 * List all roles with their permissions
 * Access: All authenticated users (read-only for non-admins)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all roles with permission count
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select(`
        id,
        name,
        description,
        is_system,
        created_at,
        updated_at,
        role_permissions (
          permission_id,
          permissions (
            id,
            name,
            resource,
            action,
            description
          )
        )
      `)
      .order('name');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return NextResponse.json(
        { error: 'Failed to fetch roles' },
        { status: 500 }
      );
    }

    // Transform data to include permission count and flatten permissions
    const transformedRoles = roles?.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      is_system: role.is_system,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permission_count: role.role_permissions?.length || 0,
      permissions: role.role_permissions?.map((rp: any) => rp.permissions) || []
    }));

    return NextResponse.json({
      success: true,
      roles: transformedRoles
    });
  } catch (error) {
    console.error('Error in GET /api/roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/roles
 * Create a new custom role
 * Access: Admin only
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, permission_ids } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    if (!permission_ids || !Array.isArray(permission_ids) || permission_ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one permission is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for duplicate role name
    const { data: existingRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', name.trim())
      .single();

    if (existingRole) {
      return NextResponse.json(
        { error: 'A role with this name already exists' },
        { status: 409 }
      );
    }

    // Create role
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        is_system: false
      })
      .select()
      .single();

    if (roleError) {
      console.error('Error creating role:', roleError);
      return NextResponse.json(
        { error: 'Failed to create role' },
        { status: 500 }
      );
    }

    // Assign permissions to role
    const rolePermissions = permission_ids.map((permission_id: string) => ({
      role_id: role.id,
      permission_id
    }));

    const { error: permissionsError } = await supabase
      .from('role_permissions')
      .insert(rolePermissions);

    if (permissionsError) {
      console.error('Error assigning permissions:', permissionsError);
      // Rollback: delete the role
      await supabase.from('roles').delete().eq('id', role.id);
      return NextResponse.json(
        { error: 'Failed to assign permissions to role' },
        { status: 500 }
      );
    }

    // Log audit event
    await supabase.from('audit_logs').insert({
      event_type: 'role_created',
      event_category: 'authorization',
      success: true,
      metadata: {
        role_id: role.id,
        role_name: role.name,
        permission_count: permission_ids.length
      }
    });

    return NextResponse.json({
      success: true,
      role: {
        ...role,
        permission_count: permission_ids.length
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
