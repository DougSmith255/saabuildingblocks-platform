'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: 'default' | 'small' | 'compact';
  className?: string;
}

export default function Accordion({
  items,
  allowMultiple = false,
  variant = 'default',
  className = ''
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return allowMultiple ? [...prev, index] : [index];
      }
    });
  };

  const isExpanded = (index: number) => expandedItems.includes(index);

  useEffect(() => {
    // Smooth height animation
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        if (isExpanded(index)) {
          ref.style.maxHeight = `${ref.scrollHeight}px`;
        } else {
          ref.style.maxHeight = '0px';
        }
      }
    });
  }, [expandedItems]);

  const variantClasses = {
    default: '',
    small: 'accordion-small',
    compact: 'gap-2'
  };

  return (
    <div className={`
      w-full flex flex-col gap-3
      opacity-90 backdrop-blur-[15px]
      ${variantClasses[variant]}
      ${className}
    `}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`
            bg-[rgba(26,26,26,0.8)] backdrop-blur-[20px]
            rounded-xl border-[3px] border-white/8
            shadow-[0_4px_20px_rgba(0,0,0,0.1)]
            transition-all duration-500
            ${isExpanded(index) ? 'border-white/12 shadow-[0_4px_25px_rgba(0,0,0,0.2)]' : ''}
          `}
        >
          {/* Header */}
          <button
            onClick={() => toggleItem(index)}
            className={`
              w-full flex items-center justify-between
              ${variant === 'small' ? 'p-3 px-4' : 'p-4 px-5 md:p-5 md:px-6'}
              bg-none border-none text-left cursor-pointer
              rounded-xl overflow-hidden
              font-heading font-bold text-white/70
              ${variant === 'small' ? 'text-base' : 'text-lg md:text-xl'}
              transition-colors duration-300

              hover:text-gold-primary

              ${isExpanded(index) ? `
                text-gold-primary
                [text-shadow:0_0_2px_#ffd700,0_0_6px_#ffd700,0_0_10px_#ffd700]
                animate-[titleCtaPulse_3s_ease-in-out_infinite]
              ` : ''}
            `}
            aria-expanded={isExpanded(index)}
          >
            <h3 className="flex-1 m-0 min-w-0 text-[--size-h3] font-bold leading-[1.25]">
              {item.title}
            </h3>

            {/* Arrow */}
            <span
              className={`
                relative ml-4
                text-[calc(var(--size-arrow,clamp(1.2rem,2vw,2.5rem))*1.5)]
                leading-none transition-all duration-400
                ${isExpanded(index) ? `
                  text-gold-primary rotate-90
                  [text-shadow:0_0_2px_#ffd700,0_0_6px_#ffd700,0_0_10px_#ffd700]
                  animate-[ctaArrowPulse_3s_ease-in-out_infinite]
                ` : 'text-white/70'}
              `}
              aria-hidden="true"
            >
              🢗
            </span>
          </button>

          {/* Content */}
          <div
            ref={el => contentRefs.current[index] = el}
            className={`
              overflow-hidden
              transition-all duration-400
              ${isExpanded(index) ? 'opacity-100 bg-white/8' : 'opacity-0'}
            `}
            style={{
              maxHeight: isExpanded(index) ? '2000px' : '0px',
              padding: isExpanded(index)
                ? variant === 'small'
                  ? '0 1rem 0.75rem'
                  : '0 1.25rem 1rem'
                : '0'
            }}
          >
            <div className={`
              mt-2 font-body text-white/90
              ${variant === 'small' ? 'text-sm' : 'text-base'}
              leading-relaxed
            `}>
              {item.content}
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes ctaArrowPulse {
          0%, 100% {
            color: var(--gold-primary, #FFD700);
            text-shadow: 0 0 2px #ffd700, 0 0 6px #ffd700, 0 0 10px #ffd700;
          }
          50% {
            color: var(--gold-primary, #FFD700);
            text-shadow: 0 0 4px #ffd700, 0 0 10px #ffd700, 0 0 16px #ffd700;
          }
        }

        @keyframes titleCtaPulse {
          0%, 100% {
            color: var(--gold-primary, #FFD700);
            text-shadow: 0 0 2px #ffd700, 0 0 6px #ffd700, 0 0 10px #ffd700;
          }
          50% {
            color: var(--gold-primary, #FFD700);
            text-shadow: 0 0 4px #ffd700, 0 0 10px #ffd700, 0 0 16px #ffd700;
          }
        }
      `}</style>
    </div>
  );
}
