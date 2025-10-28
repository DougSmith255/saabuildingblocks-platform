import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering - exclude from static export
export const dynamic = 'force-dynamic';

// Next.js 16 requires generateStaticParams for dynamic routes even when excluded
export async function generateStaticParams() {
  return [];
}

type RouteContext = {
  params: { id: string };
};

/**
 * GET /api/roles/[id]
 * Get a specific role with permissions
 * Access: All authenticated users
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { id } = params;

    const { data: role, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error || !role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Transform permissions
    const transformedRole = {
      ...role,
      permission_count: role.role_permissions?.length || 0,
      permissions: role.role_permissions?.map((rp: any) => rp.permissions) || []
    };

    return NextResponse.json({
      success: true,
      role: transformedRole
    });
  } catch (error) {
    console.error('Error in GET /api/roles/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/roles/[id]
 * Update role permissions
 * Access: Admin only
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { id } = params;
    const body = await request.json();
    const { name, description, permission_ids } = body;

    // Get existing role
    const { data: existingRole, error: fetchError } = await supabase
      .from('roles')
      .select('id, name, is_system')
      .eq('id', id)
      .single();

    if (fetchError || !existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Prevent modifying system roles
    if (existingRole.is_system) {
      return NextResponse.json(
        { error: 'Cannot modify system roles' },
        { status: 403 }
      );
    }

    // Validation
    if (!permission_ids || !Array.isArray(permission_ids) || permission_ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one permission is required' },
        { status: 400 }
      );
    }

    // Check for duplicate name (if name is being changed)
    if (name && name !== existingRole.name) {
      const { data: duplicateRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', name.trim())
        .neq('id', id)
        .single();

      if (duplicateRole) {
        return NextResponse.json(
          { error: 'A role with this name already exists' },
          { status: 409 }
        );
      }

      // Update role name/description
      const { error: updateError } = await supabase
        .from('roles')
        .update({
          name: name.trim(),
          description: description?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating role:', updateError);
        return NextResponse.json(
          { error: 'Failed to update role' },
          { status: 500 }
        );
      }
    }

    // Delete existing permissions
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', id);

    if (deleteError) {
      console.error('Error deleting permissions:', deleteError);
      return NextResponse.json(
        { error: 'Failed to update permissions' },
        { status: 500 }
      );
    }

    // Insert new permissions
    const rolePermissions = permission_ids.map((permission_id: string) => ({
      role_id: id,
      permission_id
    }));

    const { error: insertError } = await supabase
      .from('role_permissions')
      .insert(rolePermissions);

    if (insertError) {
      console.error('Error inserting permissions:', insertError);
      return NextResponse.json(
        { error: 'Failed to update permissions' },
        { status: 500 }
      );
    }

    // Log audit event
    await supabase.from('audit_logs').insert({
      event_type: 'role_updated',
      event_category: 'authorization',
      success: true,
      metadata: {
        role_id: id,
        role_name: name || existingRole.name,
        permission_count: permission_ids.length
      }
    });

    return NextResponse.json({
      success: true,
      role: {
        id,
        name: name || existingRole.name,
        description,
        permission_count: permission_ids.length
      }
    });
  } catch (error) {
    console.error('Error in PUT /api/roles/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roles/[id]
 * Delete a custom role
 * Access: Admin only
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // Lazy initialization - create client at runtime, not build time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { id } = params;

    // Get role details
    const { data: role, error: fetchError } = await supabase
      .from('roles')
      .select('id, name, is_system')
      .eq('id', id)
      .single();

    if (fetchError || !role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Prevent deleting system roles
    if (role.is_system) {
      return NextResponse.json(
        { error: 'Cannot delete system roles (Admin, Agent, Viewer)' },
        { status: 403 }
      );
    }

    // Check if role has active users
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role_id', id)
      .limit(1);

    if (userRolesError) {
      console.error('Error checking user roles:', userRolesError);
      return NextResponse.json(
        { error: 'Failed to check role usage' },
        { status: 500 }
      );
    }

    if (userRoles && userRoles.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role with active users. Reassign users first.' },
        { status: 409 }
      );
    }

    // Delete role (cascade will delete role_permissions)
    const { error: deleteError } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting role:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete role' },
        { status: 500 }
      );
    }

    // Log audit event
    await supabase.from('audit_logs').insert({
      event_type: 'role_deleted',
      event_category: 'authorization',
      success: true,
      metadata: {
        role_id: id,
        role_name: role.name
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/roles/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
