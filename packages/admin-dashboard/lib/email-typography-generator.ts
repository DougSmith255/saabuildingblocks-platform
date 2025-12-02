import { EmailTypographySettings } from '../app/master-controller/stores/emailTypographyStore';

/**
 * Generates email-safe CSS from typography settings
 * Returns inline CSS rules that can be injected into email templates
 */
export function generateEmailTypographyCSS(settings: EmailTypographySettings): string {
  const getFontFallback = (fontFamily: string): string => {
    const fallbacks: Record<string, string> = {
      'Taskor': 'Georgia, "Times New Roman", serif',
      'Amulya': 'Georgia, "Times New Roman", serif',
      'Synonym': 'Arial, Helvetica, sans-serif',
    };
    return fallbacks[fontFamily] || 'Arial, Helvetica, sans-serif';
  };

  return `
    /* H1 Styles */
    .body-content h1 {
      color: ${settings.h1_color};
      font-family: '${settings.h1_font_family}', ${getFontFallback(settings.h1_font_family)};
      font-weight: ${settings.h1_font_weight};
      font-size: ${settings.h1_font_size};
      line-height: ${settings.h1_line_height};
      letter-spacing: ${settings.h1_letter_spacing};
      text-shadow: ${settings.h1_text_shadow};
      margin-top: 0;
    }

    /* H2 Styles */
    .body-content h2 {
      color: ${settings.h2_color};
      font-family: '${settings.h2_font_family}', ${getFontFallback(settings.h2_font_family)};
      font-weight: ${settings.h2_font_weight};
      font-size: ${settings.h2_font_size};
      line-height: ${settings.h2_line_height};
      letter-spacing: ${settings.h2_letter_spacing};
      margin-top: 0;
    }

    /* H3 Styles */
    .body-content h3 {
      color: ${settings.h3_color};
      font-family: '${settings.h3_font_family}', ${getFontFallback(settings.h3_font_family)};
      font-weight: ${settings.h3_font_weight};
      font-size: ${settings.h3_font_size};
      line-height: ${settings.h3_line_height};
      letter-spacing: ${settings.h3_letter_spacing};
      margin-top: 0;
    }

    /* Body/Paragraph Styles */
    .body-content p,
    .body-content,
    body {
      color: ${settings.body_color};
      font-family: '${settings.body_font_family}', ${getFontFallback(settings.body_font_family)};
      font-weight: ${settings.body_font_weight};
      font-size: ${settings.body_font_size};
      line-height: ${settings.body_line_height};
      letter-spacing: ${settings.body_letter_spacing};
    }

    /* Link Styles */
    .body-content a {
      color: ${settings.link_color};
      text-decoration: none;
    }

    .body-content a:hover {
      color: ${settings.link_hover_color};
      text-decoration: underline;
    }

    /* Additional heading levels inherit from H3 */
    .body-content h4,
    .body-content h5,
    .body-content h6 {
      color: ${settings.h3_color};
      font-family: '${settings.h3_font_family}', ${getFontFallback(settings.h3_font_family)};
      font-weight: ${settings.h3_font_weight};
      margin-top: 0;
    }
  `.trim();
}

/**
 * Generates font-face declarations for custom fonts
 */
export function generateFontFaceCSS(): string {
  return `
    /* Custom Fonts from Cloudflare R2 */
    @font-face {
        font-family: 'Taskor';
        src: url('https://pub-43c65e30ac5f41d49271b025c1e3f3d7.r2.dev/Fonts/taskor-regular-webfont.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Amulya';
        src: url('https://pub-43c65e30ac5f41d49271b025c1e3f3d7.r2.dev/Fonts/Amulya-Variable.woff2') format('woff2');
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Amulya';
        src: url('https://pub-43c65e30ac5f41d49271b025c1e3f3d7.r2.dev/Fonts/Amulya-VariableItalic.woff2') format('woff2');
        font-weight: 100 900;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'Synonym';
        src: url('https://pub-43c65e30ac5f41d49271b025c1e3f3d7.r2.dev/Fonts/Synonym-Variable.woff2') format('woff2');
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
    }
  `.trim();
}

/**
 * Injects typography CSS into an HTML email template
 */
export function injectTypographyIntoTemplate(
  templateHtml: string,
  settings: EmailTypographySettings
): string {
  const fontFaceCSS = generateFontFaceCSS();
  const typographyCSS = generateEmailTypographyCSS(settings);
  const combinedCSS = `${fontFaceCSS}\n\n${typographyCSS}`;

  // Find the closing </style> tag and inject before it
  const styleCloseTag = '</style>';
  const styleCloseIndex = templateHtml.indexOf(styleCloseTag);

  if (styleCloseIndex === -1) {
    // No style tag found, inject in <head>
    const headCloseTag = '</head>';
    const headCloseIndex = templateHtml.indexOf(headCloseTag);

    if (headCloseIndex !== -1) {
      return (
        templateHtml.slice(0, headCloseIndex) +
        `<style>\n${combinedCSS}\n</style>\n` +
        templateHtml.slice(headCloseIndex)
      );
    }

    // No head tag either, return unchanged
    return templateHtml;
  }

  // Inject before closing style tag
  return (
    templateHtml.slice(0, styleCloseIndex) +
    `\n\n/* Dynamic Typography Settings */\n${typographyCSS}\n\n` +
    templateHtml.slice(styleCloseIndex)
  );
}
