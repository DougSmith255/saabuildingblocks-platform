'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps {
  /** Array of FAQ items with question and answer */
  items: FAQItem[];
  /** Optional className for the container */
  className?: string;
  /** Whether to allow multiple items open at once (default: false) */
  allowMultiple?: boolean;
  /** Default open index (default: null - all closed) */
  defaultOpenIndex?: number | null;
}

/**
 * FAQ Accordion Component
 *
 * Reusable FAQ component with expandable items.
 * Uses CSS variables for consistent styling across the site.
 *
 * CSS Variables (set in globals.css or Master Controller):
 * --faq-bg: Background color of FAQ items (default: rgba(255,255,255,0.05))
 * --faq-border: Border color (default: rgba(255,255,255,0.1))
 * --faq-border-hover: Border color on hover (default: rgba(255,215,0,0.3))
 * --faq-question-color: Question text color (default: #e5e4dd)
 * --faq-answer-color: Answer text color (default: #dcdbd5)
 * --faq-icon-color: Chevron icon color (default: #ffd700)
 * --faq-radius: Border radius (default: 0.75rem)
 *
 * @example
 * <FAQ items={[
 *   { question: "What is...?", answer: "It is..." },
 *   { question: "How does...?", answer: "It works by..." }
 * ]} />
 */
export function FAQ({
  items,
  className = '',
  allowMultiple = false,
  defaultOpenIndex = null
}: FAQProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(
    defaultOpenIndex !== null ? new Set([defaultOpenIndex]) : new Set()
  );

  const toggleItem = (index: number) => {
    setOpenIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isOpen = (index: number) => openIndices.has(index);

  return (
    <div className={`saa-faq space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="saa-faq-item rounded-xl overflow-hidden transition-all duration-300 ease-out"
          style={{
            backgroundColor: 'var(--faq-bg, rgba(255,255,255,0.05))',
            border: '1px solid',
            borderColor: 'var(--faq-border, rgba(255,255,255,0.1))',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--faq-border-hover, rgba(255,215,0,0.3))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--faq-border, rgba(255,255,255,0.1))';
          }}
        >
          {/* Question Button */}
          <button
            onClick={() => toggleItem(index)}
            className="saa-faq-question w-full flex items-center justify-between p-5 text-left"
            aria-expanded={isOpen(index)}
          >
            <span
              className="text-h5 pr-4"
              style={{ color: 'var(--faq-question-color, #e5e4dd)' }}
            >
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                isOpen(index) ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--faq-icon-color, #ffd700)' }}
            />
          </button>

          {/* Answer */}
          <div
            className={`saa-faq-answer overflow-hidden transition-all duration-300 ease-out ${
              isOpen(index) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-5 pt-0 pb-6 text-body">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FAQ;
