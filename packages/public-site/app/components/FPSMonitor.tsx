'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * FPS Monitor Component
 *
 * Real-time FPS monitoring tool for development
 * - Only renders when NODE_ENV !== 'production'
 * - Shows current and average FPS
 * - Warns when FPS drops below 30
 * - Positioned in top-left corner
 *
 * Usage:
 *   import { FPSMonitor } from '@/components/FPSMonitor';
 *
 *   export default function Layout({ children }) {
 *     return (
 *       <>
 *         <FPSMonitor />
 *         {children}
 *       </>
 *     );
 *   }
 */
export function FPSMonitor() {
  const [currentFPS, setCurrentFPS] = useState<number>(0);
  const [averageFPS, setAverageFPS] = useState<number>(0);
  const [isLowFPS, setIsLowFPS] = useState<boolean>(false);

  const frameTimestampsRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const fpsHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    let running = true;

    const calculateFPS = (timestamp: number) => {
      if (!running) return;

      // Calculate time delta
      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      if (delta > 0) {
        // Calculate current FPS
        const fps = Math.round(1000 / delta);

        // Store frame timestamp
        frameTimestampsRef.current.push(timestamp);

        // Keep only last 60 frames (approximately 1 second at 60fps)
        if (frameTimestampsRef.current.length > 60) {
          frameTimestampsRef.current.shift();
        }

        // Calculate average FPS from recent frames
        if (frameTimestampsRef.current.length >= 2) {
          const firstTimestamp = frameTimestampsRef.current[0];
          const lastTimestamp = frameTimestampsRef.current[frameTimestampsRef.current.length - 1];
          const timeDiff = lastTimestamp - firstTimestamp;
          const frameCount = frameTimestampsRef.current.length - 1;

          const avgFPS = Math.round((frameCount / timeDiff) * 1000);

          setCurrentFPS(fps);
          setAverageFPS(avgFPS);

          // Track FPS history for better average calculation
          fpsHistoryRef.current.push(avgFPS);
          if (fpsHistoryRef.current.length > 30) {
            fpsHistoryRef.current.shift();
          }

          // Check if FPS is low
          setIsLowFPS(avgFPS < 30);
        }
      }

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(calculateFPS);
    };

    // Start monitoring
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(calculateFPS);

    // Cleanup
    return () => {
      running = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        backgroundColor: isLowFPS ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        color: isLowFPS ? '#fff' : '#00ff88',
        padding: '8px 12px',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: '1.4',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        border: isLowFPS ? '2px solid #dc2626' : '1px solid rgba(0, 255, 136, 0.3)',
        backdropFilter: 'blur(4px)',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '10px', opacity: 0.7 }}>
          FPS MONITOR {isLowFPS && '⚠'}
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Current:</span>{' '}
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentFPS}</span>
          <span style={{ opacity: 0.5, fontSize: '10px' }}> fps</span>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Average:</span>{' '}
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{averageFPS}</span>
          <span style={{ opacity: 0.5, fontSize: '10px' }}> fps</span>
        </div>
        {isLowFPS && (
          <div
            style={{
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            ⚠ LOW FPS WARNING
          </div>
        )}
      </div>
    </div>
  );
}

export default FPSMonitor;
