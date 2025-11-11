'use client';

import React, { useEffect, useState } from 'react';

/**
 * Props interface for GlossyCategoryCard component
 */
export interface GlossyCategoryCardProps {
  /** Icon element to display (placeholder for now) */
  icon: React.ReactNode;
  /** Category title */
  title: string;
  /** Category description */
  description: string;
  /** Number of posts in category */
  count: number;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Animated glossy category filter card with space futuristic aesthetic
 *
 * Features:
 * - Glossy shimmer animation with randomized start points
 * - Glass morphism effect with backdrop blur
 * - Smooth hover interactions with scale and glow effects
 * - Space-themed color palette with neon accents
 * - Fully accessible with keyboard navigation
 *
 * @example
 * ```tsx
 * <GlossyCategoryCard
 *   icon={<svg>...</svg>}
 *   title="About eXp Realty"
 *   description="Learn about the cloud-based brokerage"
 *   count={58}
 *   onClick={() => handleFilter('about-exp')}
 * />
 * ```
 */
export const GlossyCategoryCard: React.FC<GlossyCategoryCardProps> = ({
  icon,
  title,
  description,
  count,
  onClick,
  className = '',
}) => {
  const [animationDelay, setAnimationDelay] = useState<number>(0);

  // Set random animation delay on mount to stagger shimmer animations
  useEffect(() => {
    // Random delay between 0s and -3s (negative starts animation mid-cycle)
    const randomDelay = -(Math.random() * 3);
    setAnimationDelay(randomDelay);
  }, []);

  return (
    <div
      className={`glossy-category-card ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${title} category with ${count} posts`}
      style={{
        // Apply random animation delay as inline style
        ['--shimmer-delay' as string]: `${animationDelay}s`,
      }}
    >
      {/* Glass morphism background layer */}
      <div className="card-background" />

      {/* Shimmer overlay */}
      <div className="shimmer-overlay" />

      {/* Border glow effect */}
      <div className="border-glow" />

      {/* Card content */}
      <div className="card-content">
        {/* Icon container */}
        <div className="icon-container">
          {icon}
        </div>

        {/* Text content */}
        <div className="text-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>

        {/* Count badge */}
        <div className="count-badge">
          <span className="count-number">{count}</span>
          <span className="count-label">posts</span>
        </div>
      </div>

      <style jsx>{`
        .glossy-category-card {
          position: relative;
          width: 100%;
          min-height: 180px;
          border-radius: 16px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          isolation: isolate;
        }

        .glossy-category-card:hover {
          transform: scale(1.03);
        }

        .glossy-category-card:focus-visible {
          transform: scale(1.03);
          outline: 2px solid #00ff88;
          outline-offset: 4px;
        }

        /* Glass morphism background */
        .card-background {
          position: absolute;
          inset: 0;
          background: rgba(25, 24, 24, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1;
        }

        /* Shimmer animation overlay */
        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(0, 255, 136, 0.2) 55%,
            transparent 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2.5s ease-in-out infinite;
          animation-delay: var(--shimmer-delay, 0s);
          z-index: 2;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Border glow effect */
        .border-glow {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(128, 128, 128, 0.3),
            rgba(128, 128, 128, 0.5),
            rgba(128, 128, 128, 0.3)
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: all 0.3s ease;
          z-index: 3;
        }

        .glossy-category-card:hover .border-glow {
          background: linear-gradient(
            135deg,
            rgba(0, 255, 136, 0.6),
            rgba(0, 255, 136, 0.9),
            rgba(0, 255, 136, 0.6)
          );
          filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.5));
        }

        /* Card content */
        .card-content {
          position: relative;
          z-index: 4;
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Icon container */
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            rgba(0, 255, 136, 0.15),
            rgba(0, 255, 136, 0.05)
          );
          border: 1px solid rgba(0, 255, 136, 0.3);
          transition: all 0.3s ease;
        }

        .glossy-category-card:hover .icon-container {
          background: linear-gradient(
            135deg,
            rgba(0, 255, 136, 0.25),
            rgba(0, 255, 136, 0.15)
          );
          border-color: rgba(0, 255, 136, 0.6);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }

        /* Text content */
        .text-content {
          flex: 1;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #e5e4dd;
          margin: 0 0 8px 0;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .glossy-category-card:hover .card-title {
          color: #00ff88;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
        }

        .card-description {
          font-size: 14px;
          color: #dcdbd5;
          margin: 0;
          line-height: 1.5;
          opacity: 0.9;
        }

        /* Count badge */
        .count-badge {
          display: flex;
          align-items: baseline;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          background: linear-gradient(
            135deg,
            rgba(255, 215, 0, 0.1),
            rgba(255, 215, 0, 0.05)
          );
          border: 1px solid rgba(255, 215, 0, 0.3);
          align-self: flex-start;
          transition: all 0.3s ease;
        }

        .glossy-category-card:hover .count-badge {
          background: linear-gradient(
            135deg,
            rgba(255, 215, 0, 0.2),
            rgba(255, 215, 0, 0.1)
          );
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .count-number {
          font-size: 24px;
          font-weight: 700;
          color: #ffd700;
          line-height: 1;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .count-label {
          font-size: 12px;
          color: #dcdbd5;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .glossy-category-card {
            min-height: 160px;
          }

          .card-content {
            padding: 20px;
            gap: 12px;
          }

          .icon-container {
            width: 40px;
            height: 40px;
          }

          .card-title {
            font-size: 18px;
          }

          .card-description {
            font-size: 13px;
          }

          .count-number {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .card-content {
            padding: 16px;
          }

          .card-title {
            font-size: 16px;
          }

          .card-description {
            font-size: 12px;
          }
        }

        /* Accessibility - reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .glossy-category-card,
          .border-glow,
          .icon-container,
          .card-title,
          .count-badge {
            transition: none;
          }

          .shimmer-overlay {
            animation: none;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

// Default placeholder icon component
export const PlaceholderIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke="#00ff88"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default GlossyCategoryCard;
