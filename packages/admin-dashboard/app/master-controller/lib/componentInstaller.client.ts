// Client-side stub for component installation
// TODO: Move actual installation logic to API routes

export interface InstallationResult {
  success: boolean;
  componentId: string;
  message: string;
  error?: string;
}

/**
 * Stub: Install a single ShadCN component (client-side placeholder)
 * Real implementation should be moved to API route
 */
export async function installComponent(componentId: string): Promise<InstallationResult> {
  return {
    success: false,
    componentId,
    message: `Installation feature not yet implemented. Component: ${componentId}`,
    error: 'This feature requires server-side API implementation',
  };
}

/**
 * Stub: Check if a component is installed
 * Real implementation should be moved to API route
 */
export function checkInstalled(_componentId: string): boolean {
  return false;
}

/**
 * Stub: Install all components in a specific category
 */
export async function installCategory(
  componentIds: string[]
): Promise<InstallationResult[]> {
  return componentIds.map(id => ({
    success: false,
    componentId: id,
    message: 'Category installation not yet implemented',
    error: 'This feature requires server-side API implementation',
  }));
}

/**
 * Stub: Get the installation status of all components
 */
export function getInstallationStatus(componentIds: string[]): Record<string, boolean> {
  const status: Record<string, boolean> = {};
  for (const componentId of componentIds) {
    status[componentId] = false;
  }
  return status;
}

/**
 * Stub: Batch install multiple components
 */
export async function batchInstall(componentIds: string[]): Promise<InstallationResult[]> {
  return componentIds.map(id => ({
    success: false,
    componentId: id,
    message: 'Batch installation not yet implemented',
    error: 'This feature requires server-side API implementation',
  }));
}
