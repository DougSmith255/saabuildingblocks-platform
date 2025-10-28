'use client';

import React, { useEffect, useRef } from 'react';

export interface TextScrambleProps {
  /** Text content to scramble */
  children: React.ReactNode;
  /** Text to scramble to (defaults to children) */
  text?: string;
  /** Array of phrases to cycle through */
  phrases?: string[];
  /** Scramble animation on hover */
  onHover?: boolean;
  /** Color variant for scramble characters */
  variant?: 'default' | 'gold' | 'white' | 'dark' | 'subtle';
  /** Additional CSS classes */
  className?: string;
  /** Enable 3D glass effect with internal lightning */
  glassEffect?: boolean;
  /** Enable dynamic lighting system */
  dynamicLighting?: boolean;
}

/**
 * Text Scramble Animation Component
 *
 * Creates a cyberpunk-style text scramble effect using smaller-width special characters.
 * Text inherits ALL parent styles (font family, size, weight, color, etc.).
 * Supports advanced 3D glass effects with internal lightning and dynamic lighting.
 *
 * @example
 * ```tsx
 * // Basic scramble
 * <TextScramble text="Build A Real Estate Business That Scales">
 *   Build A Real Estate Business That Scales
 * </TextScramble>
 *
 * // Phrase cycling with gold variant
 * <TextScramble
 *   phrases={["Build Your Empire", "Scale Your Business", "Achieve Freedom"]}
 *   variant="gold"
 * >
 *   Real Estate Success
 * </TextScramble>
 *
 * // Hover-triggered scramble
 * <TextScramble onHover variant="subtle">
 *   Hover to scramble me
 * </TextScramble>
 *
 * // 3D glass effect with internal lightning
 * <TextScramble glassEffect dynamicLighting>
 *   Glass Text with Lightning
 * </TextScramble>
 *
 * // Glass effect only (static lighting)
 * <TextScramble glassEffect>
 *   Static Glass Effect
 * </TextScramble>
 * ```
 */
export function TextScramble({
  children,
  text,
  phrases = [],
  onHover = false,
  variant = 'default',
  className = '',
  glassEffect = false,
  dynamicLighting = false
}: TextScrambleProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const scrambleRef = useRef<TextScrambler | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const el = elementRef.current;
    const scrambler = new TextScrambler(el);
    scrambleRef.current = scrambler;

    // Get text to scramble from prop or children
    const scrambleText = text || (typeof children === 'string' ? children : el.innerText);

    // If phrases are provided, cycle through them
    if (phrases.length > 0) {
      const allPhrases = [scrambleText, ...phrases];
      let counter = 0;

      const next = () => {
        scrambler.setText(allPhrases[counter]).then(() => {
          setTimeout(next, 2000); // 2 second delay between phrases
        });
        counter = (counter + 1) % allPhrases.length;
      };

      // Start after brief delay
      const timeout = setTimeout(() => next(), 500);
      return () => clearTimeout(timeout);
    }

    // Single scramble on load (if not hover-only)
    if (!onHover) {
      const timeout = setTimeout(() => {
        scrambler.setText(scrambleText);
      }, 500);
      return () => clearTimeout(timeout);
    }

    // Setup hover handler if onHover is true
    if (onHover) {
      const handleHover = () => {
        scrambler.setText(scrambleText);
      };
      el.addEventListener('mouseenter', handleHover);
      return () => el.removeEventListener('mouseenter', handleHover);
    }
  }, [text, children, phrases, onHover]);

  const variantClasses = {
    default: '',
    gold: 'text-scramble--gold',
    white: 'text-scramble--white',
    dark: 'text-scramble--dark',
    subtle: 'text-scramble--subtle'
  };

  const glassClasses = glassEffect ? 'text-scramble--glass' : '';
  const lightingClasses = dynamicLighting ? 'text-scramble--dynamic-lighting' : '';

  return (
    <>
      <span
        ref={elementRef}
        className={`text-scramble ${variantClasses[variant]} ${glassClasses} ${lightingClasses} ${className}`}
      >
        {children}
      </span>
      <style jsx>{`
        .text-scramble {
          display: inline-block;
        }

        :global(.scramble-char) {
          color: rgba(255, 255, 255, 0.5);
        }

        :global(.text-scramble--gold .scramble-char) {
          color: rgba(255, 215, 0, 0.7);
        }

        :global(.text-scramble--white .scramble-char) {
          color: rgba(255, 255, 255, 0.8);
        }

        :global(.text-scramble--dark .scramble-char) {
          color: rgba(0, 0, 0, 0.5);
        }

        :global(.text-scramble--subtle .scramble-char) {
          color: rgba(128, 128, 128, 0.4);
        }

        /* ===== 3D GLASS EFFECT WITH INTERNAL LIGHTNING ===== */
        :global(.text-scramble--glass) {
          position: relative;
          color: rgba(200, 220, 255, 0.9);
          font-weight: 700;
          letter-spacing: 0.02em;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;

          /* Glass material base */
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(200, 220, 255, 0.08) 50%,
            rgba(100, 150, 255, 0.05) 100%
          );
          background-clip: text;
          -webkit-background-clip: text;

          /* 3D extrusion with glass depth */
          text-shadow:
            /* Front glass layers */
            0 0 2px rgba(200, 220, 255, 0.4),
            0 0 5px rgba(180, 200, 255, 0.3),
            0 0 10px rgba(160, 180, 255, 0.2),
            /* Glass depth (subtle) */
            1px 1px 2px rgba(255, 255, 255, 0.3),
            2px 2px 4px rgba(255, 255, 255, 0.2),
            3px 3px 6px rgba(255, 255, 255, 0.1),
            /* Inner shadows for depth */
            -1px -1px 2px rgba(0, 0, 0, 0.15),
            -2px -2px 4px rgba(0, 0, 0, 0.1),
            /* External cast shadow */
            4px 4px 12px rgba(0, 0, 0, 0.4),
            6px 6px 20px rgba(0, 0, 0, 0.3);

          /* Glass surface reflections */
          filter: brightness(1.1) saturate(1.2);
        }

        /* Glass character overlay - specular highlights */
        :global(.text-scramble--glass::before) {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.2) 25%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(0, 0, 0, 0.05) 75%,
            rgba(0, 0, 0, 0.1) 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          pointer-events: none;
        }

        /* Internal lightning glow effect */
        :global(.text-scramble--glass::after) {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 230, 100, 0) 0%,
            rgba(255, 230, 100, 0.15) 50%,
            rgba(255, 200, 50, 0.1) 100%
          );
          opacity: 0;
          filter: blur(8px);
          z-index: -1;
          animation: lightningGlow 8s ease-in-out infinite;
        }

        /* ===== DYNAMIC LIGHTING SYSTEM ===== */
        :global(.text-scramble--dynamic-lighting) {
          animation:
            glassIlluminate 8s ease-in-out infinite,
            ambientReflection 6s ease-in-out infinite alternate;
        }

        /* Lightning flash illumination */
        @keyframes glassIlluminate {
          0%, 88% {
            filter: brightness(1.1) saturate(1.2);
          }
          89% {
            filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 15px rgba(255, 230, 100, 0.3));
          }
          90% {
            filter: brightness(1.8) saturate(1.8) drop-shadow(0 0 25px rgba(255, 230, 100, 0.6));
          }
          91% {
            filter: brightness(2.2) saturate(2.0) drop-shadow(0 0 35px rgba(255, 230, 100, 0.8));
          }
          92% {
            filter: brightness(1.5) saturate(1.5) drop-shadow(0 0 20px rgba(255, 230, 100, 0.4));
          }
          93%, 100% {
            filter: brightness(1.1) saturate(1.2);
          }
        }

        /* Ambient environment reflections */
        @keyframes ambientReflection {
          0% {
            text-shadow:
              0 0 2px rgba(200, 220, 255, 0.4),
              0 0 5px rgba(180, 200, 255, 0.3),
              0 0 10px rgba(160, 180, 255, 0.2),
              1px 1px 2px rgba(255, 255, 255, 0.3),
              2px 2px 4px rgba(255, 255, 255, 0.2),
              3px 3px 6px rgba(255, 255, 255, 0.1),
              -1px -1px 2px rgba(0, 0, 0, 0.15),
              -2px -2px 4px rgba(0, 0, 0, 0.1),
              4px 4px 12px rgba(0, 0, 0, 0.4),
              6px 6px 20px rgba(0, 0, 0, 0.3);
          }
          50% {
            text-shadow:
              0 0 3px rgba(220, 230, 255, 0.5),
              0 0 7px rgba(200, 210, 255, 0.4),
              0 0 12px rgba(180, 190, 255, 0.3),
              1px 1px 3px rgba(255, 255, 255, 0.4),
              2px 2px 5px rgba(255, 255, 255, 0.3),
              3px 3px 7px rgba(255, 255, 255, 0.2),
              -1px -1px 3px rgba(0, 0, 0, 0.2),
              -2px -2px 5px rgba(0, 0, 0, 0.15),
              4px 4px 14px rgba(0, 0, 0, 0.45),
              6px 6px 22px rgba(0, 0, 0, 0.35);
          }
          100% {
            text-shadow:
              0 0 2px rgba(200, 220, 255, 0.4),
              0 0 5px rgba(180, 200, 255, 0.3),
              0 0 10px rgba(160, 180, 255, 0.2),
              1px 1px 2px rgba(255, 255, 255, 0.3),
              2px 2px 4px rgba(255, 255, 255, 0.2),
              3px 3px 6px rgba(255, 255, 255, 0.1),
              -1px -1px 2px rgba(0, 0, 0, 0.15),
              -2px -2px 4px rgba(0, 0, 0, 0.1),
              4px 4px 12px rgba(0, 0, 0, 0.4),
              6px 6px 20px rgba(0, 0, 0, 0.3);
          }
        }

        /* Internal lightning glow animation */
        @keyframes lightningGlow {
          0%, 88% {
            opacity: 0;
          }
          89% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.6;
          }
          91% {
            opacity: 1;
          }
          92% {
            opacity: 0.4;
          }
          93%, 100% {
            opacity: 0;
          }
        }

        /* Enhanced shadow effects during lightning */
        :global(.text-scramble--glass.text-scramble--dynamic-lighting) {
          /* Variable shadow intensity synced with lightning */
          --shadow-base: 0.4;
          --shadow-lightning: 0.8;
        }

        /* Specular highlights become more prominent during lightning */
        :global(.text-scramble--glass.text-scramble--dynamic-lighting::before) {
          animation: specularHighlight 8s ease-in-out infinite;
        }

        @keyframes specularHighlight {
          0%, 88% {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.2) 25%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(0, 0, 0, 0.05) 75%,
              rgba(0, 0, 0, 0.1) 100%
            );
          }
          90%, 91% {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(255, 245, 200, 0.5) 25%,
              rgba(255, 230, 100, 0.3) 50%,
              rgba(255, 200, 50, 0.2) 75%,
              rgba(0, 0, 0, 0.1) 100%
            );
          }
          92%, 100% {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.2) 25%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(0, 0, 0, 0.05) 75%,
              rgba(0, 0, 0, 0.1) 100%
            );
          }
        }

        /* Glass edge illumination */
        :global(.text-scramble--glass.text-scramble--dynamic-lighting) {
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 2px 2px 4px rgba(255, 255, 255, 0.05),
            inset -2px -2px 4px rgba(0, 0, 0, 0.1);
          animation:
            glassIlluminate 8s ease-in-out infinite,
            ambientReflection 6s ease-in-out infinite alternate,
            edgeGlow 8s ease-in-out infinite;
        }

        @keyframes edgeGlow {
          0%, 88% {
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 2px 2px 4px rgba(255, 255, 255, 0.05),
              inset -2px -2px 4px rgba(0, 0, 0, 0.1);
          }
          90%, 91% {
            box-shadow:
              inset 0 0 0 1px rgba(255, 245, 200, 0.4),
              inset 2px 2px 6px rgba(255, 230, 100, 0.3),
              inset -2px -2px 6px rgba(255, 200, 50, 0.2);
          }
          92%, 100% {
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 2px 2px 4px rgba(255, 255, 255, 0.05),
              inset -2px -2px 4px rgba(0, 0, 0, 0.1);
          }
        }

        /* Yellow tint spreading through glass during lightning */
        :global(.text-scramble--glass.text-scramble--dynamic-lighting) {
          position: relative;
        }

        :global(.text-scramble--glass.text-scramble--dynamic-lighting)::after {
          animation: lightningGlow 8s ease-in-out infinite;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 230, 100, 0) 0%,
            rgba(255, 230, 100, 0.2) 40%,
            rgba(255, 200, 50, 0.15) 70%,
            rgba(255, 180, 30, 0.1) 100%
          );
        }

        /* Shadow layer animations */
        :global(.text-scramble--glass .scramble-char) {
          animation: charLightning 8s ease-in-out infinite;
        }

        @keyframes charLightning {
          0%, 88% {
            color: rgba(255, 255, 255, 0.5);
            filter: brightness(1);
          }
          90%, 91% {
            color: rgba(255, 240, 150, 0.8);
            filter: brightness(1.5) drop-shadow(0 0 5px rgba(255, 230, 100, 0.5));
          }
          92%, 100% {
            color: rgba(255, 255, 255, 0.5);
            filter: brightness(1);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          :global(.text-scramble--glass) {
            text-shadow:
              0 0 1px rgba(200, 220, 255, 0.4),
              0 0 3px rgba(180, 200, 255, 0.3),
              1px 1px 2px rgba(255, 255, 255, 0.3),
              2px 2px 6px rgba(0, 0, 0, 0.4);
          }
        }

        /* Performance optimization - reduce complexity on low-end devices */
        @media (prefers-reduced-motion: reduce) {
          :global(.text-scramble--dynamic-lighting) {
            animation: none !important;
          }

          :global(.text-scramble--glass::after) {
            animation: none !important;
            opacity: 0 !important;
          }

          :global(.text-scramble--glass.text-scramble--dynamic-lighting::before) {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Text Scrambler Class
 * Handles the scramble animation logic
 */
class TextScrambler {
  private el: HTMLElement;
  private chars = '.^/÷?>_';
  private queue: Array<{
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }> = [];
  private frame = 0;
  private frameRequest?: number;
  private resolve?: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 60);
      const end = start + Math.floor(Math.random() * 60);
      this.queue.push({ from, to, start, end });
    }

    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
    this.frame = 0;
    this.update();
    return promise;
  }

  private update(): void {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve?.();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  private randomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
