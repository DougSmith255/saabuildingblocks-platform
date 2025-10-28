'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * SAA Cyber Card - Stacked Animation Component
 *
 * Handles scroll-based stacking animations for 5+ cards with advanced interactions.
 * Features corner light activation and smooth scaling based on scroll position.
 *
 * @component
 * @example
 * ```tsx
 * <CyberCardStackedAnimation
 *   cards={[
 *     { title: 'Revenue Share', description: '...', image: '/path.jpg' },
 *     { title: 'Stock Awards', description: '...', image: '/path.jpg' }
 *   ]}
 *   className="my-custom-class"
 * />
 * ```
 */

export interface StackedCard {
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  image?: string;
  placeholder?: string;
}

export interface CyberCardStackedAnimationProps {
  /** Array of card data (5-10 cards recommended) */
  cards: StackedCard[];
  /** Optional CSS class name */
  className?: string;
  /** Card offset multiplier for stacking */
  topOffset?: string;
}

export const CyberCardStackedAnimation: React.FC<CyberCardStackedAnimationProps> = ({
  cards,
  className = '',
  topOffset = '40px'
}) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || cards.length === 0) return;

    const container = containerRef.current;
    const cardElements = container.querySelectorAll('.saa-stacked-animation-card');
    const numCards = cardElements.length;

    // Set CSS custom properties
    container.style.setProperty('--saa-numcards', String(numCards));
    container.style.setProperty('--saa-card-top-offset', topOffset);
    container.classList.add(`saa-cards-${numCards}`);

    // Setup scroll-triggered animations
    const setupCardAnimations = () => {
      cardElements.forEach((card, index) => {
        const cardEl = card as HTMLElement;
        const reverseIndex = numCards - index - 1;

        // Set padding for stacking
        cardEl.style.paddingTop = `calc(${index + 1} * var(--saa-card-top-offset))`;
        cardEl.style.position = 'sticky';
        cardEl.style.top = '18vh';
        cardEl.style.transform = 'translateY(-50%)';

        // Setup scroll animation
        const handleScroll = () => {
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Calculate scroll progress
          const startPoint = rect.top - windowHeight * 0.5;
          const endPoint = rect.bottom - windowHeight * 0.8;
          let progress = (startPoint) / (startPoint - endPoint);
          progress = Math.max(0, Math.min(1, progress));

          // Apply scale based on card position
          const startScale = 1;
          const endScale = 1 - (0.1 * reverseIndex);
          const currentScale = startScale + (endScale - startScale) * progress;

          cardEl.style.transform = `translateY(-50%) scale(${currentScale})`;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial setup

        // Setup corner lights
        setupCornerLights(cardEl, index + 1);

        return () => window.removeEventListener('scroll', handleScroll);
      });
    };

    setupCardAnimations();
    setIsLoaded(true);

    return () => {
      // Cleanup
      cardElements.forEach(card => {
        const cardEl = card as HTMLElement;
        cardEl.style.transform = '';
      });
    };
  }, [cards, topOffset]);

  const setupCornerLights = (card: HTMLElement, cardIndex: number) => {
    const topLeftCorner = card.querySelector('.saa-cyber-prismatic-corners span:first-child') as HTMLElement;
    const topRightCorner = card.querySelector('.saa-cyber-prismatic-corners span:nth-child(2)') as HTMLElement;

    if (!topLeftCorner || !topRightCorner) return;

    let lightsActivated = false;
    const screenCenter = window.innerHeight * 0.5;
    let previousCardTop = card.getBoundingClientRect().top;

    const scrollHandler = () => {
      const cardRect = card.getBoundingClientRect();
      const cardVisualTop = cardRect.top;
      const movingUp = cardVisualTop < previousCardTop;

      // Trigger when card crosses center moving up
      if (cardVisualTop <= screenCenter && movingUp && !lightsActivated) {
        lightsActivated = true;
        activateCornerLights(topLeftCorner, topRightCorner);
      }

      // Reset when card moves below center
      if (cardVisualTop > screenCenter + 100 && lightsActivated) {
        lightsActivated = false;
      }

      previousCardTop = cardVisualTop;
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
  };

  const activateCornerLights = (topLeft: HTMLElement, topRight: HTMLElement) => {
    // Add active class
    topLeft.classList.add('saa-corner-light-active');
    topRight.classList.add('saa-corner-light-active');

    // Remove after 3 seconds
    setTimeout(() => {
      topLeft.classList.remove('saa-corner-light-active');
      topRight.classList.remove('saa-corner-light-active');
    }, 3000);
  };

  return (
    <div className={`saa-stacked-animation-wrapper ${className}`}>
      <ul
        ref={containerRef}
        className={`saa-stacked-animation-cards ${isLoaded ? 'saa-cards-loaded' : ''}`}
        style={{
          '--saa-card-top-offset': topOffset
        } as React.CSSProperties}
      >
        {cards.map((card, index) => (
          <li key={index} className="saa-stacked-animation-card">
            <div className="saa-stacked-card-content">
              <div className="saa-stacked-card-text">
                <h3 className="saa-stacked-card-title">{card.title}</h3>
                <p className="saa-stacked-card-description">{card.description}</p>
                {card.buttonText && (
                  <a href={card.buttonHref || '#'} className="saa-stacked-card-btn">
                    {card.buttonText}
                  </a>
                )}
              </div>
              <figure className="saa-stacked-card-figure">
                {card.image ? (
                  <img src={card.image} alt={card.title} className="saa-stacked-card-image" />
                ) : (
                  <div className="saa-stacked-card-placeholder">{card.placeholder || 'Icon'}</div>
                )}
              </figure>
            </div>

            {/* Corner lights for scroll-triggered effect */}
            <div className="saa-cyber-prismatic-corners">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .saa-stacked-animation-wrapper {
          position: relative;
          width: 100%;
          min-height: calc(100vh * var(--saa-numcards, 5));
        }

        .saa-stacked-animation-cards {
          position: relative;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .saa-stacked-animation-card {
          position: relative;
          background: rgba(10, 10, 10, 0.95);
          border-radius: var(--radius-lg, 16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          overflow: hidden;
          transition: transform 0.3s ease, filter 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }

        .saa-stacked-card-content {
          display: flex;
          gap: var(--space-6, 24px);
          padding: var(--space-6, 24px);
          align-items: center;
        }

        .saa-stacked-card-text {
          flex: 1;
        }

        .saa-stacked-card-title {
          font-family: 'Amulya', sans-serif;
          font-weight: 700;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: var(--color-brand-primary, #FFD700);
          margin-bottom: var(--space-4, 16px);
        }

        .saa-stacked-card-description {
          font-family: 'Synonym', sans-serif;
          color: var(--color-text-secondary, rgba(255, 255, 255, 0.8));
          line-height: 1.6;
          margin-bottom: var(--space-4, 16px);
        }

        .saa-stacked-card-btn {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, var(--color-brand-primary, #FFD700), var(--color-brand-secondary, #FFA500));
          color: #000;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .saa-stacked-card-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
        }

        .saa-stacked-card-figure {
          flex-shrink: 0;
          width: clamp(120px, 20vw, 200px);
          height: clamp(120px, 20vw, 200px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .saa-stacked-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .saa-stacked-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 215, 0, 0.1);
          border: 2px dashed rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          color: var(--color-brand-primary, #FFD700);
          font-weight: 600;
        }

        /* Corner lights */
        .saa-cyber-prismatic-corners {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .saa-cyber-prismatic-corners span {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 215, 0, 0.4);
          transition: all 0.4s ease;
        }

        .saa-cyber-prismatic-corners span:nth-child(1) {
          top: 12px;
          left: 12px;
          border-right: 0;
          border-bottom: 0;
          border-radius: var(--radius-lg, 16px) 0 0 0;
        }

        .saa-cyber-prismatic-corners span:nth-child(2) {
          top: 12px;
          right: 12px;
          border-left: 0;
          border-bottom: 0;
          border-radius: 0 var(--radius-lg, 16px) 0 0;
        }

        .saa-cyber-prismatic-corners span:nth-child(3) {
          bottom: 12px;
          left: 12px;
          border-right: 0;
          border-top: 0;
          border-radius: 0 0 0 var(--radius-lg, 16px);
        }

        .saa-cyber-prismatic-corners span:nth-child(4) {
          bottom: 12px;
          right: 12px;
          border-left: 0;
          border-top: 0;
          border-radius: 0 0 var(--radius-lg, 16px) 0;
        }

        .saa-cyber-prismatic-corners span.saa-corner-light-active {
          border-color: rgba(255, 215, 0, 0.9);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.2);
        }

        @media (max-width: 768px) {
          .saa-stacked-card-content {
            flex-direction: column;
          }

          .saa-stacked-card-figure {
            width: 100%;
            max-width: 100%;
            height: clamp(150px, 30vw, 250px);
          }
        }
      `}</style>
    </div>
  );
};

export default CyberCardStackedAnimation;
