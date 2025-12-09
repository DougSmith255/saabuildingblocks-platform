'use client';

/**
 * SectionSkeleton - Loading placeholder for lazy-loaded sections
 *
 * Features:
 * - Configurable height to match section being loaded
 * - Shimmer animation effect
 * - Matches site dark theme
 * - Smooth transition when content loads
 */

interface SectionSkeletonProps {
  /** Height in pixels - should match the approximate height of the section */
  height: number;
  /** Optional className for additional styling */
  className?: string;
}

export function SectionSkeleton({ height, className = '' }: SectionSkeletonProps) {
  return (
    <div
      className={`section-skeleton ${className}`}
      style={{ height: `${height}px` }}
      aria-label="Loading section..."
      role="status"
    >
      {/* Shimmer effect container */}
      <div className="skeleton-shimmer" />

      {/* Subtle content placeholders */}
      <div className="skeleton-content">
        {/* Title placeholder */}
        <div className="skeleton-title" />
        {/* Content placeholders */}
        <div className="skeleton-cards">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>

      <style jsx>{`
        .section-skeleton {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg,
            rgba(15, 15, 15, 0) 0%,
            rgba(20, 20, 20, 0.5) 10%,
            rgba(20, 20, 20, 0.5) 90%,
            rgba(15, 15, 15, 0) 100%
          );
        }

        .skeleton-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.02) 20%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.02) 80%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .skeleton-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
        }

        .skeleton-title {
          width: min(400px, 60%);
          height: 40px;
          background: rgba(229, 228, 221, 0.05);
          border-radius: 8px;
        }

        .skeleton-cards {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
          max-width: 1200px;
        }

        .skeleton-card {
          width: 300px;
          height: 200px;
          background: rgba(229, 228, 221, 0.03);
          border: 1px solid rgba(229, 228, 221, 0.05);
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .skeleton-cards {
            flex-direction: column;
            align-items: center;
          }

          .skeleton-card {
            width: 100%;
            max-width: 300px;
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
}

export default SectionSkeleton;
