import fs from 'fs';
import path from 'path';

/**
 * Email Template Merger
 *
 * Combines base email templates (header/footer) with dynamic email body content.
 * Supports two template types:
 * - Team Members (no unsubscribe)
 * - External Contacts (with unsubscribe link)
 */

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

export type TemplateType = 'team' | 'external';

export interface MergeOptions {
  emailTitle?: string;
  emailBody: string;
  contactEmail?: string;
  ghlLocationId?: string;
}

/**
 * Load a base template from the file system
 */
function loadBaseTemplate(type: TemplateType): string {
  const fileName = `base-email-template-${type}.html`;
  const filePath = path.join(TEMPLATES_DIR, fileName);

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to load base template: ${type}. Error: ${error}`);
  }
}

/**
 * Generate GoHighLevel unsubscribe URL
 *
 * GoHighLevel uses a special unsubscribe link format that includes the contact email
 * and location ID. When clicked, it automatically unsubscribes the contact.
 */
function generateUnsubscribeUrl(contactEmail: string, locationId: string): string {
  // GoHighLevel unsubscribe URL format
  // This will be processed by GHL to unsubscribe the contact
  const encodedEmail = encodeURIComponent(contactEmail);
  return `https://services.leadconnectorhq.com/unsubscribe/${locationId}/${encodedEmail}`;
}

/**
 * Merge base template with email body content
 *
 * @param type - Template type ('team' or 'external')
 * @param options - Merge options including emailBody and contact info
 * @returns Complete HTML email ready to send
 */
export function mergeEmailTemplate(
  type: TemplateType,
  options: MergeOptions
): string {
  const {
    emailTitle = 'Smart Agent Alliance',
    emailBody,
    contactEmail,
    ghlLocationId = 'wmYRsn57bNL8Z2tMlIZ7', // Default location ID
  } = options;

  // Load the appropriate base template
  let baseTemplate = loadBaseTemplate(type);

  // Replace {{emailTitle}} placeholder
  baseTemplate = baseTemplate.replace(/\{\{emailTitle\}\}/g, emailTitle);

  // Replace {{emailBody}} placeholder
  baseTemplate = baseTemplate.replace(/\{\{emailBody\}\}/g, emailBody);

  // For external template, add unsubscribe URL
  if (type === 'external' && contactEmail) {
    const unsubscribeUrl = generateUnsubscribeUrl(contactEmail, ghlLocationId);
    baseTemplate = baseTemplate.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
  }

  return baseTemplate;
}

/**
 * Determine which template type to use based on contact tags
 *
 * @param contactTags - Array of tag strings from GoHighLevel contact
 * @returns 'team' if contact has 'active downline' tag, otherwise 'external'
 */
export function getTemplateTypeForContact(contactTags: string[]): TemplateType {
  // Normalize tags to lowercase for comparison
  const normalizedTags = contactTags.map(tag => tag.toLowerCase());

  // Check if contact has "active downline" tag
  const isActiveDownline = normalizedTags.some(tag =>
    tag.includes('active') && tag.includes('downline')
  );

  return isActiveDownline ? 'team' : 'external';
}

/**
 * Complete email assembly function
 *
 * This is the main function you'll use in the automation script.
 * It automatically determines the template type and merges everything.
 */
export async function assembleEmail(options: {
  contactEmail: string;
  contactTags: string[];
  emailTitle?: string;
  emailBody: string;
  ghlLocationId?: string;
}): Promise<string> {
  const templateType = getTemplateTypeForContact(options.contactTags);

  return mergeEmailTemplate(templateType, {
    emailTitle: options.emailTitle,
    emailBody: options.emailBody,
    contactEmail: options.contactEmail,
    ghlLocationId: options.ghlLocationId,
  });
}
