import type { TypographySettings, BrandColorsSettings, SpacingSettings } from '../types';

export interface ExportedSettings {
  version: string;
  timestamp: string;
  typography: TypographySettings;
  brandColors: BrandColorsSettings;
  spacing: SpacingSettings;
}

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Export all store settings as JSON
 */
export function exportSettings(
  typography: TypographySettings,
  brandColors: BrandColorsSettings,
  spacing: SpacingSettings
): string {
  const exportData: ExportedSettings = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    typography,
    brandColors,
    spacing,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Validate imported settings structure
 */
function validateImportedSettings(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
  settings?: ExportedSettings;
} {
  const errors: ValidationError[] = [];

  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Import data must be a valid object' }],
    };
  }

  const settings = data as Partial<ExportedSettings>;

  // Check version
  if (!settings.version || typeof settings.version !== 'string') {
    errors.push({ field: 'version', message: 'Missing or invalid version field' });
  }

  // Check typography
  if (!settings.typography || typeof settings.typography !== 'object') {
    errors.push({ field: 'typography', message: 'Missing or invalid typography settings' });
  } else {
    const requiredTypographyKeys = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'quote', 'link', 'button'];
    const typographyKeys = Object.keys(settings.typography);
    const missingKeys = requiredTypographyKeys.filter((key) => !typographyKeys.includes(key));
    if (missingKeys.length > 0) {
      errors.push({
        field: 'typography',
        message: `Missing typography keys: ${missingKeys.join(', ')}`,
      });
    }
  }

  // Check brand colors
  if (!settings.brandColors || typeof settings.brandColors !== 'object') {
    errors.push({ field: 'brandColors', message: 'Missing or invalid brand colors settings' });
  } else {
    const requiredColorKeys = [
      'accentGreen',
      'headingText',
      'bodyText',
      'brandGold',
      'darkGray',
      'mediumGray',
    ];
    const colorKeys = Object.keys(settings.brandColors);
    const missingKeys = requiredColorKeys.filter((key) => !colorKeys.includes(key));
    if (missingKeys.length > 0) {
      errors.push({
        field: 'brandColors',
        message: `Missing color keys: ${missingKeys.join(', ')}`,
      });
    }
  }

  // Check spacing
  if (!settings.spacing || typeof settings.spacing !== 'object') {
    errors.push({ field: 'spacing', message: 'Missing or invalid spacing settings' });
  } else {
    const requiredSpacingKeys = ['containerPadding', 'gridGap', 'sectionMargin', 'gridMinWidth'];
    const spacingKeys = Object.keys(settings.spacing);
    const missingKeys = requiredSpacingKeys.filter((key) => !spacingKeys.includes(key));
    if (missingKeys.length > 0) {
      errors.push({
        field: 'spacing',
        message: `Missing spacing keys: ${missingKeys.join(', ')}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    settings: errors.length === 0 ? (settings as ExportedSettings) : undefined,
  };
}

/**
 * Import and validate settings from JSON
 */
export function importSettings(
  jsonString: string
): {
  success: boolean;
  errors?: ValidationError[];
  settings?: ExportedSettings;
} {
  try {
    // Parse JSON
    const data = JSON.parse(jsonString);

    // Validate structure
    const validation = validateImportedSettings(data);

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    return {
      success: true,
      settings: validation.settings,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          field: 'json',
          message: error instanceof Error ? error.message : 'Failed to parse JSON',
        },
      ],
    };
  }
}

/**
 * Apply imported settings to stores
 */
export function applyImportedSettings(
  settings: ExportedSettings,
  typographyStore: { batchUpdate: (s: Partial<TypographySettings>) => void },
  brandColorsStore: { batchUpdate: (s: Partial<BrandColorsSettings>) => void },
  spacingStore: { batchUpdate: (s: Partial<SpacingSettings>) => void }
): void {
  // Apply all settings using batch update to prevent multiple CSS re-injections
  typographyStore.batchUpdate(settings.typography);
  brandColorsStore.batchUpdate(settings.brandColors);
  spacingStore.batchUpdate(settings.spacing);

  console.log('[Export/Import] Settings applied successfully from version:', settings.version);
  console.log('[Export/Import] Import timestamp:', settings.timestamp);
}
