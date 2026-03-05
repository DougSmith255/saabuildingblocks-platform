/**
 * FAQ Utilities
 *
 * Handles extraction of FAQ data from blog content for:
 * 1. RankMath FAQ blocks (already have proper class names)
 * 2. Non-RankMath FAQ sections (H2 "Frequently Asked Questions" + H3 questions + P answers)
 *
 * Also generates JSON-LD schema for FAQPage structured data.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Decode HTML entities in a string
 */
function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '\u2013') // en-dash
    .replace(/&#8212;/g, '\u2014') // em-dash
    .replace(/&#8216;/g, '\u2018') // left single quote
    .replace(/&#8217;/g, '\u2019') // right single quote / apostrophe
    .replace(/&#8220;/g, '\u201C') // left double quote
    .replace(/&#8221;/g, '\u201D') // right double quote
    .replace(/&nbsp;/g, ' ');
}

/**
 * Strip HTML tags from a string
 */
function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Extract FAQ items from RankMath FAQ blocks
 * These have structure: <div class="rank-math-faq-item"><h3 class="rank-math-question">Q</h3><div class="rank-math-answer">A</div></div>
 */
function extractRankMathFAQ(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Match rank-math-faq-item blocks (the actual class used by RankMath)
  const faqItemPattern = /<div[^>]*class="[^"]*rank-math-faq-item[^"]*"[^>]*>[\s\S]*?<h3[^>]*class="[^"]*rank-math-question[^"]*"[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<div[^>]*class="[^"]*rank-math-answer[^"]*"[^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/div>/gi;

  let match;
  while ((match = faqItemPattern.exec(content)) !== null) {
    const question = decodeHTMLEntities(stripHTML(match[1]));
    const answer = decodeHTMLEntities(stripHTML(match[2]));

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

/**
 * Extract FAQ items from non-RankMath FAQ sections
 * These have structure: <h2>Frequently Asked Questions</h2> followed by <h3>Question?</h3><p>Answer</p>
 */
function extractPlainFAQ(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Find the FAQ heading
  const faqHeadingMatch = content.match(/<h2[^>]*>[^<]*Frequently Asked Questions[^<]*<\/h2>/i);
  if (!faqHeadingMatch) {
    return faqs;
  }

  // Get content after the FAQ heading
  const faqStartIndex = content.indexOf(faqHeadingMatch[0]) + faqHeadingMatch[0].length;
  const afterFAQ = content.substring(faqStartIndex);

  // Find the next major section (another H2) or end of content
  const nextH2Match = afterFAQ.match(/<h2[^>]*>/i);
  const faqSection = nextH2Match
    ? afterFAQ.substring(0, afterFAQ.indexOf(nextH2Match[0]))
    : afterFAQ;

  // Extract H3 questions followed by their answers
  // Pattern: <h3...>Question?</h3> followed by <p>Answer</p> (possibly multiple paragraphs)
  const h3Pattern = /<h3[^>]*>([^<]+\??)<\/h3>/gi;
  let h3Match;
  const questions: { question: string; index: number }[] = [];

  while ((h3Match = h3Pattern.exec(faqSection)) !== null) {
    const questionText = decodeHTMLEntities(stripHTML(h3Match[1]));
    // Only include if it looks like a question (ends with ? or is interrogative)
    if (questionText.endsWith('?') || /^(what|why|how|when|where|who|is|are|can|do|does|will|should)/i.test(questionText)) {
      questions.push({
        question: questionText,
        index: h3Match.index + h3Match[0].length
      });
    }
  }

  // For each question, extract the answer (content until next H3 or end of FAQ section)
  for (let i = 0; i < questions.length; i++) {
    const startIndex = questions[i].index;
    const endIndex = i + 1 < questions.length
      ? faqSection.indexOf('<h3', startIndex)
      : faqSection.length;

    const answerHTML = faqSection.substring(startIndex, endIndex);

    // Extract text from paragraphs in the answer
    const paragraphs: string[] = [];
    const pPattern = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pPattern.exec(answerHTML)) !== null) {
      const text = decodeHTMLEntities(stripHTML(pMatch[1]));
      if (text) {
        paragraphs.push(text);
      }
    }

    const answer = paragraphs.join(' ').trim();

    if (answer) {
      faqs.push({
        question: questions[i].question,
        answer
      });
    }
  }

  return faqs;
}

/**
 * Extract all FAQ items from blog content
 * Checks for RankMath FAQ first, falls back to plain FAQ extraction
 */
export function extractFAQs(content: string): FAQItem[] {
  // Check if content has RankMath FAQ (wp-block-rank-math-faq-block is the actual class)
  if (/wp-block-rank-math-faq-block|rank-math-faq-item/i.test(content)) {
    const rankMathFAQs = extractRankMathFAQ(content);
    if (rankMathFAQs.length > 0) {
      return rankMathFAQs;
    }
  }

  // Fall back to plain FAQ extraction
  return extractPlainFAQ(content);
}

/**
 * Generate FAQ JSON-LD schema
 */
export function generateFAQSchema(faqs: FAQItem[]): object | null {
  if (faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Transform non-RankMath FAQ HTML to RankMath-style markup
 * This allows the existing FAQ accordion styling to work
 */
export function transformFAQToRankMathMarkup(content: string): string {
  // If already has RankMath FAQ block, return unchanged
  if (/wp-block-rank-math-faq-block|rank-math-faq-item/i.test(content)) {
    return content;
  }

  // Find the FAQ heading
  const faqHeadingMatch = content.match(/<h2[^>]*>([^<]*Frequently Asked Questions[^<]*)<\/h2>/i);
  if (!faqHeadingMatch) {
    return content;
  }

  const faqStartIndex = content.indexOf(faqHeadingMatch[0]);
  const faqHeadingEndIndex = faqStartIndex + faqHeadingMatch[0].length;
  const afterFAQ = content.substring(faqHeadingEndIndex);

  // Find the next major section (another H2) or end of content
  const nextH2Match = afterFAQ.match(/<h2[^>]*>/i);
  const faqSectionEnd = nextH2Match
    ? faqHeadingEndIndex + afterFAQ.indexOf(nextH2Match[0])
    : content.length;

  const faqSection = content.substring(faqHeadingEndIndex, faqSectionEnd);

  // Extract and transform H3 Q&A pairs
  const faqs = extractPlainFAQ(content);
  if (faqs.length === 0) {
    return content;
  }

  // Build RankMath-style markup (matching wp-block-rank-math-faq-block structure)
  let rankMathFAQ = `<div class="wp-block-rank-math-faq-block">`;

  faqs.forEach((faq) => {
    rankMathFAQ += `
<div class="rank-math-faq-item">
<h3 class="rank-math-question">${faq.question}</h3>
<div class="rank-math-answer">${faq.answer}</div>
</div>`;
  });

  rankMathFAQ += `
</div>`;

  // Replace the original FAQ section with RankMath markup
  const beforeFAQ = content.substring(0, faqHeadingEndIndex);
  const afterFAQSection = content.substring(faqSectionEnd);

  return beforeFAQ + rankMathFAQ + afterFAQSection;
}
