/**
 * Divi Shortcode Parser
 *
 * Comprehensive parser for Divi Builder shortcodes used in WordPress content.
 * Converts Divi shortcode structure to clean content or component mappings.
 *
 * @module lib/divi-parser
 * @example
 * ```typescript
 * import { DiviParser } from '@/lib/divi-parser';
 *
 * const parser = new DiviParser();
 * const result = parser.parse(wordpressContent);
 * console.log(result.sections); // Array of parsed sections
 * console.log(result.plainText); // Clean text without shortcodes
 * ```
 */

/**
 * Represents a Divi module with its type, attributes, and content
 */
export interface DiviModule {
  type: string;
  attributes: Record<string, string>;
  content: string;
  children?: DiviModule[];
  metadata?: {
    originalShortcode: string;
    depth: number;
  };
}

/**
 * Represents a parsed Divi section structure
 */
export interface DiviSection {
  id: string;
  type: 'section';
  attributes: Record<string, string>;
  rows: DiviRow[];
  metadata?: {
    backgroundColor?: string;
    backgroundImage?: string;
    customCss?: string;
  };
}

/**
 * Represents a Divi row within a section
 */
export interface DiviRow {
  id: string;
  type: 'row';
  attributes: Record<string, string>;
  columns: DiviColumn[];
  metadata?: {
    columnStructure?: string;
    customPadding?: string;
  };
}

/**
 * Represents a Divi column within a row
 */
export interface DiviColumn {
  id: string;
  type: 'column';
  attributes: Record<string, string>;
  modules: DiviModule[];
}

/**
 * Parse result containing structured sections and plain text
 */
export interface ParseResult {
  sections: DiviSection[];
  plainText: string;
  metadata: {
    totalSections: number;
    totalRows: number;
    totalModules: number;
    moduleTypes: Record<string, number>;
    hasErrors: boolean;
    errors: string[];
  };
}

/**
 * Divi shortcode parser class
 */
export class DiviParser {
  private sectionCounter = 0;
  private rowCounter = 0;
  private columnCounter = 0;
  private errors: string[] = [];

  /**
   * Known Divi module types and their conversion strategies
   */
  private readonly MODULE_TYPES = {
    // Layout modules
    'et_pb_section': { category: 'layout', hasChildren: true },
    'et_pb_row': { category: 'layout', hasChildren: true },
    'et_pb_column': { category: 'layout', hasChildren: true },

    // Content modules
    'et_pb_text': { category: 'content', hasChildren: false },
    'et_pb_image': { category: 'media', hasChildren: false },
    'et_pb_button': { category: 'interactive', hasChildren: false },
    'et_pb_cta': { category: 'interactive', hasChildren: false },
    'et_pb_video': { category: 'media', hasChildren: false },
    'et_pb_audio': { category: 'media', hasChildren: false },
    'et_pb_slider': { category: 'interactive', hasChildren: true },
    'et_pb_gallery': { category: 'media', hasChildren: true },
    'et_pb_portfolio': { category: 'content', hasChildren: true },
    'et_pb_blog': { category: 'content', hasChildren: true },
    'et_pb_testimonial': { category: 'content', hasChildren: false },
    'et_pb_pricing_table': { category: 'interactive', hasChildren: true },
    'et_pb_accordion': { category: 'interactive', hasChildren: true },
    'et_pb_toggle': { category: 'interactive', hasChildren: true },
    'et_pb_tabs': { category: 'interactive', hasChildren: true },
    'et_pb_contact_form': { category: 'interactive', hasChildren: true },
    'et_pb_map': { category: 'media', hasChildren: true },
    'et_pb_divider': { category: 'design', hasChildren: false },
    'et_pb_code': { category: 'content', hasChildren: false },
    'et_pb_blurb': { category: 'content', hasChildren: false },
    'et_pb_counter': { category: 'content', hasChildren: false },
    'et_pb_number_counter': { category: 'content', hasChildren: false },
    'et_pb_circle_counter': { category: 'content', hasChildren: false },
    'et_pb_bar_counter': { category: 'content', hasChildren: true },
    'et_pb_social_media_follow': { category: 'interactive', hasChildren: true },
    'et_pb_fullwidth_header': { category: 'layout', hasChildren: false },
    'et_pb_fullwidth_slider': { category: 'interactive', hasChildren: true },
    'et_pb_fullwidth_portfolio': { category: 'content', hasChildren: true },
    'et_pb_fullwidth_post_slider': { category: 'content', hasChildren: true },
    'et_pb_fullwidth_code': { category: 'content', hasChildren: false },
  };

  /**
   * Parse WordPress content containing Divi shortcodes
   *
   * @param content - Raw WordPress content with Divi shortcodes
   * @returns Parsed structure with sections, rows, columns, and modules
   */
  public parse(content: string): ParseResult {
    // Reset counters and errors
    this.sectionCounter = 0;
    this.rowCounter = 0;
    this.columnCounter = 0;
    this.errors = [];

    try {
      // Extract all sections
      const sections = this.extractSections(content);

      // Generate plain text version (all shortcodes removed)
      const plainText = this.extractPlainText(content);

      // Calculate metadata
      const metadata = this.calculateMetadata(sections);

      return {
        sections,
        plainText,
        metadata,
      };
    } catch (error) {
      this.errors.push(`Parse error: ${error instanceof Error ? error.message : String(error)}`);
      return {
        sections: [],
        plainText: this.extractPlainText(content),
        metadata: {
          totalSections: 0,
          totalRows: 0,
          totalModules: 0,
          moduleTypes: {},
          hasErrors: true,
          errors: this.errors,
        },
      };
    }
  }

  /**
   * Extract all sections from content
   */
  private extractSections(content: string): DiviSection[] {
    const sections: DiviSection[] = [];
    const sectionRegex = /\[et_pb_section([^\]]*)\](.*?)\[\/et_pb_section\]/gs;

    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      const [fullMatch, attributesStr, sectionContent] = match;

      try {
        const attributes = this.parseAttributes(attributesStr);
        const rows = this.extractRows(sectionContent);

        sections.push({
          id: `section-${++this.sectionCounter}`,
          type: 'section',
          attributes,
          rows,
          metadata: {
            backgroundColor: attributes.background_color,
            backgroundImage: attributes.background_image,
            customCss: attributes.custom_css,
          },
        });
      } catch (error) {
        this.errors.push(`Section parsing error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return sections;
  }

  /**
   * Extract rows from section content
   */
  private extractRows(content: string): DiviRow[] {
    const rows: DiviRow[] = [];
    const rowRegex = /\[et_pb_row([^\]]*)\](.*?)\[\/et_pb_row\]/gs;

    let match;
    while ((match = rowRegex.exec(content)) !== null) {
      const [fullMatch, attributesStr, rowContent] = match;

      try {
        const attributes = this.parseAttributes(attributesStr);
        const columns = this.extractColumns(rowContent);

        rows.push({
          id: `row-${++this.rowCounter}`,
          type: 'row',
          attributes,
          columns,
          metadata: {
            columnStructure: attributes.column_structure,
            customPadding: attributes.custom_padding,
          },
        });
      } catch (error) {
        this.errors.push(`Row parsing error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return rows;
  }

  /**
   * Extract columns from row content
   */
  private extractColumns(content: string): DiviColumn[] {
    const columns: DiviColumn[] = [];
    const columnRegex = /\[et_pb_column([^\]]*)\](.*?)\[\/et_pb_column\]/gs;

    let match;
    while ((match = columnRegex.exec(content)) !== null) {
      const [fullMatch, attributesStr, columnContent] = match;

      try {
        const attributes = this.parseAttributes(attributesStr);
        const modules = this.extractModules(columnContent);

        columns.push({
          id: `column-${++this.columnCounter}`,
          type: 'column',
          attributes,
          modules,
        });
      } catch (error) {
        this.errors.push(`Column parsing error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return columns;
  }

  /**
   * Extract modules from column content
   */
  private extractModules(content: string): DiviModule[] {
    const modules: DiviModule[] = [];

    // Match all Divi modules
    const moduleRegex = /\[et_pb_(\w+)([^\]]*)\](.*?)\[\/et_pb_\1\]/gs;

    let match;
    while ((match = moduleRegex.exec(content)) !== null) {
      const [fullMatch, moduleType, attributesStr, moduleContent] = match;
      const fullModuleType = `et_pb_${moduleType}`;

      // Skip layout modules (already handled)
      if (['et_pb_section', 'et_pb_row', 'et_pb_column'].includes(fullModuleType)) {
        continue;
      }

      try {
        const attributes = this.parseAttributes(attributesStr);
        const moduleInfo = this.MODULE_TYPES[fullModuleType as keyof typeof this.MODULE_TYPES];

        const module: DiviModule = {
          type: fullModuleType,
          attributes,
          content: this.cleanContent(moduleContent),
          metadata: {
            originalShortcode: fullMatch,
            depth: 0,
          },
        };

        // Parse nested modules if applicable
        if (moduleInfo?.hasChildren && moduleContent.includes('[et_pb_')) {
          module.children = this.extractModules(moduleContent);
        }

        modules.push(module);
      } catch (error) {
        this.errors.push(`Module parsing error (${fullModuleType}): ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return modules;
  }

  /**
   * Parse shortcode attributes string into key-value pairs
   *
   * @param attributesStr - Raw attributes string from shortcode
   * @returns Object with parsed attributes
   */
  private parseAttributes(attributesStr: string): Record<string, string> {
    const attributes: Record<string, string> = {};

    if (!attributesStr || attributesStr.trim().length === 0) {
      return attributes;
    }

    // Match attribute="value" or attribute='value' patterns
    const attrRegex = /(\w+)=["']([^"']*?)["']/g;

    let match;
    while ((match = attrRegex.exec(attributesStr)) !== null) {
      const [, key, value] = match;
      attributes[key] = this.decodeAttributeValue(value);
    }

    return attributes;
  }

  /**
   * Decode and clean attribute values
   */
  private decodeAttributeValue(value: string): string {
    return value
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\|\|/g, '|') // Divi uses || as separator
      .trim();
  }

  /**
   * Clean content by removing HTML tags and extra whitespace
   */
  private cleanContent(content: string): string {
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp;
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Extract plain text from content (remove all shortcodes)
   */
  private extractPlainText(content: string): string {
    let text = content;

    // Remove all shortcodes
    text = text.replace(/\[et_pb_[^\]]*\]/g, '');
    text = text.replace(/\[\/et_pb_[^\]]*\]/g, '');

    // Clean HTML
    text = text.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    text = this.decodeAttributeValue(text);

    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  /**
   * Calculate metadata statistics
   */
  private calculateMetadata(sections: DiviSection[]): ParseResult['metadata'] {
    const moduleTypes: Record<string, number> = {};
    let totalModules = 0;
    let totalRows = 0;

    sections.forEach(section => {
      totalRows += section.rows.length;

      section.rows.forEach(row => {
        row.columns.forEach(column => {
          column.modules.forEach(module => {
            totalModules++;
            moduleTypes[module.type] = (moduleTypes[module.type] || 0) + 1;

            // Count nested modules
            if (module.children) {
              const countNested = (modules: DiviModule[]) => {
                modules.forEach(m => {
                  totalModules++;
                  moduleTypes[m.type] = (moduleTypes[m.type] || 0) + 1;
                  if (m.children) countNested(m.children);
                });
              };
              countNested(module.children);
            }
          });
        });
      });
    });

    return {
      totalSections: sections.length,
      totalRows,
      totalModules,
      moduleTypes,
      hasErrors: this.errors.length > 0,
      errors: this.errors,
    };
  }

  /**
   * Convert parsed Divi structure to HTML
   *
   * @param parseResult - Parsed Divi structure
   * @returns Clean HTML representation
   */
  public toHTML(parseResult: ParseResult): string {
    const html: string[] = [];

    parseResult.sections.forEach(section => {
      html.push('<section>');

      section.rows.forEach(row => {
        html.push('<div class="row">');

        row.columns.forEach(column => {
          html.push('<div class="column">');

          column.modules.forEach(module => {
            html.push(this.moduleToHTML(module));
          });

          html.push('</div>');
        });

        html.push('</div>');
      });

      html.push('</section>');
    });

    return html.join('\n');
  }

  /**
   * Convert individual module to HTML
   */
  private moduleToHTML(module: DiviModule): string {
    const { type, content, attributes } = module;

    switch (type) {
      case 'et_pb_text':
        return `<div class="text-module">${content}</div>`;

      case 'et_pb_image':
        return `<img src="${attributes.src || ''}" alt="${attributes.alt || ''}" />`;

      case 'et_pb_button':
        return `<a href="${attributes.button_url || '#'}" class="button">${content}</a>`;

      case 'et_pb_video':
        return `<video src="${attributes.src || ''}" controls></video>`;

      case 'et_pb_heading':
        return `<h2>${content}</h2>`;

      default:
        return `<div class="module-${type}">${content}</div>`;
    }
  }

  /**
   * Extract media URLs from parsed content
   *
   * @param parseResult - Parsed Divi structure
   * @returns Array of media URLs
   */
  public extractMediaURLs(parseResult: ParseResult): string[] {
    const urls: Set<string> = new Set();

    parseResult.sections.forEach(section => {
      // Section background images
      if (section.metadata?.backgroundImage) {
        urls.add(section.metadata.backgroundImage);
      }

      section.rows.forEach(row => {
        row.columns.forEach(column => {
          column.modules.forEach(module => {
            // Extract URLs from various module types
            if (module.type === 'et_pb_image' && module.attributes.src) {
              urls.add(module.attributes.src);
            }
            if (module.type === 'et_pb_video' && module.attributes.src) {
              urls.add(module.attributes.src);
            }
            if (module.type === 'et_pb_audio' && module.attributes.audio) {
              urls.add(module.attributes.audio);
            }
            if (module.attributes.background_image) {
              urls.add(module.attributes.background_image);
            }
          });
        });
      });
    });

    return Array.from(urls).filter(url => url && url.length > 0);
  }
}

/**
 * Convenience function to parse Divi content
 */
export function parseDiviContent(content: string): ParseResult {
  const parser = new DiviParser();
  return parser.parse(content);
}

/**
 * Convenience function to extract plain text from Divi content
 */
export function extractPlainTextFromDivi(content: string): string {
  const parser = new DiviParser();
  const result = parser.parse(content);
  return result.plainText;
}

/**
 * Convenience function to extract media URLs from Divi content
 */
export function extractMediaFromDivi(content: string): string[] {
  const parser = new DiviParser();
  const result = parser.parse(content);
  return parser.extractMediaURLs(result);
}
