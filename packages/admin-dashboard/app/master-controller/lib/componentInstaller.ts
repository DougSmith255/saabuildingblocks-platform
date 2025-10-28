// Component Installation Logic for ShadCN Components

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

export interface InstallationResult {
  success: boolean;
  componentId: string;
  message: string;
  error?: string;
}

/**
 * Install a single ShadCN component
 */
export async function installComponent(componentId: string): Promise<InstallationResult> {
  try {
    const command = `npx shadcn@latest add ${componentId} --yes`;
    const { stderr } = await execAsync(command, {
      cwd: process.cwd(),
    });

    if (stderr && !stderr.includes('warn')) {
      throw new Error(stderr);
    }

    return {
      success: true,
      componentId,
      message: `Successfully installed ${componentId}`,
    };
  } catch (error) {
    return {
      success: false,
      componentId,
      message: `Failed to install ${componentId}`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check if a component is installed by checking if the file exists
 */
export function checkInstalled(componentId: string): boolean {
  const componentsPath = join(process.cwd(), 'components', 'ui', `${componentId}.tsx`);
  return existsSync(componentsPath);
}

/**
 * Install all components in a specific category
 */
export async function installCategory(
  componentIds: string[]
): Promise<InstallationResult[]> {
  const results: InstallationResult[] = [];

  for (const componentId of componentIds) {
    const result = await installComponent(componentId);
    results.push(result);
  }

  return results;
}

/**
 * Get the installation status of all components
 */
export function getInstallationStatus(componentIds: string[]): Record<string, boolean> {
  const status: Record<string, boolean> = {};

  for (const componentId of componentIds) {
    status[componentId] = checkInstalled(componentId);
  }

  return status;
}

/**
 * Batch install multiple components
 */
export async function batchInstall(componentIds: string[]): Promise<InstallationResult[]> {
  return Promise.all(componentIds.map(installComponent));
}
