/**
 * Role Management API Client
 * Provides type-safe functions for role CRUD operations
 */

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  permission_count: number;
  permissions: Permission[];
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permission_ids: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permission_ids: string[];
}

/**
 * Fetch all roles
 */
export async function getRoles(): Promise<{ success: boolean; roles: Role[] }> {
  const response = await fetch('/api/roles', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch roles');
  }

  return response.json();
}

/**
 * Fetch a specific role by ID
 */
export async function getRole(id: string): Promise<{ success: boolean; role: Role }> {
  const response = await fetch(`/api/roles/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch role');
  }

  return response.json();
}

/**
 * Create a new role
 */
export async function createRole(data: CreateRoleData): Promise<{ success: boolean; role: Role }> {
  const response = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create role');
  }

  return response.json();
}

/**
 * Update a role
 */
export async function updateRole(
  id: string,
  data: UpdateRoleData
): Promise<{ success: boolean; role: Role }> {
  const response = await fetch(`/api/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update role');
  }

  return response.json();
}

/**
 * Delete a role
 */
export async function deleteRole(id: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/roles/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete role');
  }

  return response.json();
}
