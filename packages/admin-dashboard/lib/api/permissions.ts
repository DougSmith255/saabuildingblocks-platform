/**
 * Permissions API Client
 * Provides type-safe functions for permission operations
 */

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface PermissionCategory {
  'User Management': Permission[];
  'Role Management': Permission[];
  'Content': Permission[];
  'System': Permission[];
  'Profile': Permission[];
  [key: string]: Permission[]; // Index signature for compatibility with Record<string, Permission[]>
}

/**
 * Fetch all permissions
 */
export async function getPermissions(): Promise<{
  success: boolean;
  permissions: Permission[];
  categorized: PermissionCategory;
}> {
  const response = await fetch('/api/permissions', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch permissions');
  }

  return response.json();
}
