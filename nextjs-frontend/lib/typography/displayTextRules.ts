/**
 * Display Text Decision Logic
 *
 * Determines when to apply .text-display class based on:
 * - "Bold, confident, structural text"
 * - "Organizes the page visually"
 * - "Moments of emphasis and attention"
 * - "Short, memorable statements"
 */

export type DisplayTextContext =
  | 'hero'
  | 'section-title'
  | 'card-title'
  | 'navigation'
  | 'button'
  | 'badge'
  | 'label'
  | 'body'
  | 'footer'
  | 'caption'
  | 'quote';

export type HTMLTag =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'div' | 'button' | 'a' | 'label';

export interface DisplayTextElement {
  tag: HTMLTag;
  content: string;
  context: DisplayTextContext;
  length?: number;
  isInteractive?: boolean;
  isPrimary?: boolean;
}

/**
 * Character length thresholds for display text eligibility
 */
const LENGTH_THRESHOLDS = {
  ALWAYS_DISPLAY_MAX: 50,  // < 50 chars = likely display text
  NEVER_DISPLAY_MIN: 100,   // > 100 chars = never display text
  CONTEXTUAL_RANGE: [50, 100] as const // 50-100 chars = context-dependent
} as const;

/**
 * Tags that ALWAYS use display text regardless of context
 */
const ALWAYS_DISPLAY_TAGS: ReadonlySet<HTMLTag> = new Set([
  'h1'  // Page titles are always structural
]);

/**
 * Tags that NEVER use display text regardless of context
 */
const NEVER_DISPLAY_TAGS: ReadonlySet<HTMLTag> = new Set([
  // Body content should use readable text
]);

/**
 * Contexts that ALWAYS use display text
 */
const ALWAYS_DISPLAY_CONTEXTS: ReadonlySet<DisplayTextContext> = new Set([
  'hero',        // Hero sections need bold, confident text
  'navigation',  // Navigation items are structural
  'badge',       // Badges are short, emphatic
  'label'        // Labels organize visually
]);

/**
 * Contexts that NEVER use display text
 */
const NEVER_DISPLAY_CONTEXTS: ReadonlySet<DisplayTextContext> = new Set([
  'body',        // Body content needs readability
  'caption'      // Captions are supplementary
]);

/**
 * Main decision function: Should this element use display text?
 */
export function shouldUseDisplayText(element: DisplayTextElement): boolean {
  const { tag, content, context, length, isInteractive, isPrimary } = element;
  const contentLength = length ?? content.length;

  // RULE 1: Always display tags (H1)
  if (ALWAYS_DISPLAY_TAGS.has(tag)) {
    return true;
  }

  // RULE 2: Never display tags (none currently, but extensible)
  if (NEVER_DISPLAY_TAGS.has(tag)) {
    return false;
  }

  // RULE 3: Always display contexts
  if (ALWAYS_DISPLAY_CONTEXTS.has(context)) {
    return true;
  }

  // RULE 4: Never display contexts
  if (NEVER_DISPLAY_CONTEXTS.has(context)) {
    return false;
  }

  // RULE 5: Content length - too long is never display text
  if (contentLength > LENGTH_THRESHOLDS.NEVER_DISPLAY_MIN) {
    return false;
  }

  // RULE 6: Short content is likely display text
  if (contentLength < LENGTH_THRESHOLDS.ALWAYS_DISPLAY_MAX) {
    // Short heading content = display text
    if (tag.startsWith('h')) {
      return true;
    }

    // Short interactive primary elements = display text
    if (isInteractive && isPrimary) {
      return true;
    }
  }

  // RULE 7: Context-specific rules for medium length (50-100 chars)
  if (contentLength >= LENGTH_THRESHOLDS.CONTEXTUAL_RANGE[0] &&
      contentLength <= LENGTH_THRESHOLDS.CONTEXTUAL_RANGE[1]) {

    // Section titles and card titles use display text if H2-H3
    if ((context === 'section-title' || context === 'card-title') &&
        (tag === 'h2' || tag === 'h3')) {
      return true;
    }

    // Primary buttons use display text
    if (context === 'button' && isPrimary) {
      return true;
    }
  }

  // RULE 8: Heading tags (H2-H6) in structural contexts
  if (tag === 'h2' && (context === 'section-title' || context === 'hero')) {
    return true;
  }

  if ((tag === 'h3' || tag === 'h4') && context === 'card-title') {
    return true;
  }

  // RULE 9: Interactive elements (buttons, links) that are primary CTAs
  if (isInteractive && isPrimary && contentLength < LENGTH_THRESHOLDS.ALWAYS_DISPLAY_MAX) {
    return true;
  }

  // RULE 10: Quotes can be display text if short and emphatic
  if (context === 'quote' && contentLength < LENGTH_THRESHOLDS.ALWAYS_DISPLAY_MAX) {
    return true;
  }

  // Default: no display text
  return false;
}

/**
 * Helper: Determine context from semantic clues
 */
export function inferContext(element: {
  tag: HTMLTag;
  className?: string;
  parentContext?: DisplayTextContext;
  role?: string;
}): DisplayTextContext {
  const { tag, className = '', parentContext, role } = element;

  // Check class names for context hints
  if (className.includes('hero')) return 'hero';
  if (className.includes('nav')) return 'navigation';
  if (className.includes('badge')) return 'badge';
  if (className.includes('label')) return 'label';
  if (className.includes('button') || tag === 'button') return 'button';
  if (className.includes('card') && tag.startsWith('h')) return 'card-title';
  if (className.includes('footer')) return 'footer';
  if (className.includes('caption')) return 'caption';

  // Check ARIA roles
  if (role === 'navigation') return 'navigation';
  if (role === 'banner') return 'hero';

  // Infer from tag and parent context
  if (tag === 'h1') return parentContext === 'hero' ? 'hero' : 'section-title';
  if (tag === 'h2') return parentContext ?? 'section-title';
  if (tag === 'h3' || tag === 'h4') return parentContext ?? 'card-title';

  // Default to body context
  return 'body';
}

/**
 * Helper: Get readable explanation for display text decision
 */
export function explainDecision(element: DisplayTextElement): string {
  const decision = shouldUseDisplayText(element);
  const reasons: string[] = [];

  if (ALWAYS_DISPLAY_TAGS.has(element.tag)) {
    reasons.push(`${element.tag.toUpperCase()} tags always use display text`);
  }

  if (ALWAYS_DISPLAY_CONTEXTS.has(element.context)) {
    reasons.push(`${element.context} context always uses display text`);
  }

  if (NEVER_DISPLAY_CONTEXTS.has(element.context)) {
    reasons.push(`${element.context} context never uses display text`);
  }

  const length = element.length ?? element.content.length;
  if (length > LENGTH_THRESHOLDS.NEVER_DISPLAY_MIN) {
    reasons.push(`Content too long (${length} > ${LENGTH_THRESHOLDS.NEVER_DISPLAY_MIN} chars)`);
  } else if (length < LENGTH_THRESHOLDS.ALWAYS_DISPLAY_MAX) {
    reasons.push(`Short, memorable content (${length} < ${LENGTH_THRESHOLDS.ALWAYS_DISPLAY_MAX} chars)`);
  }

  if (element.isPrimary && element.isInteractive) {
    reasons.push('Primary interactive element (CTA)');
  }

  return decision
    ? `✓ USE DISPLAY TEXT: ${reasons.join(', ')}`
    : `✗ NO DISPLAY TEXT: ${reasons.join(', ') || 'Default body text'}`;
}

/**
 * Batch analysis: Analyze multiple elements
 */
export function analyzeElements(elements: DisplayTextElement[]): {
  element: DisplayTextElement;
  shouldUseDisplay: boolean;
  explanation: string;
}[] {
  return elements.map(element => ({
    element,
    shouldUseDisplay: shouldUseDisplayText(element),
    explanation: explainDecision(element)
  }));
}
