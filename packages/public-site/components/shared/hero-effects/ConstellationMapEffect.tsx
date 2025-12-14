'use client';

import { useContinuousAnimation } from './useContinuousAnimation';

/**
 * Constellation Map Effect
 * Connected stars forming patterns - great for network/connection themes
 */
export function ConstellationMapEffect() {
  const { time, progress } = useContinuousAnimation();

  const stars = [
    { x: 15, y: 20 }, { x: 25, y: 35 }, { x: 40, y: 25 }, { x: 35, y: 45 },
    { x: 55, y: 30 }, { x: 65, y: 15 }, { x: 75, y: 40 }, { x: 85, y: 25 },
    { x: 20, y: 60 }, { x: 45, y: 65 }, { x: 60, y: 55 }, { x: 80, y: 70 },
    { x: 30, y: 80 }, { x: 50, y: 85 }, { x: 70, y: 75 }, { x: 90, y: 60 },
  ];

  const connections = [
    [0, 1], [2, 1], [2, 3], [4, 3], [4, 5], [6, 5], [6, 7],
    [8, 9], [10, 9], [10, 11], [12, 13], [14, 13], [14, 15],
    [1, 8], [3, 9], [4, 10], [6, 11], [9, 13], [10, 14],
  ];

  const getStarColor = (index: number) => {
    const colors = [
      { r: 180, g: 100, b: 255 },
      { r: 100, g: 180, b: 255 },
      { r: 200, g: 120, b: 255 },
      { r: 80, g: 160, b: 255 },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hero-effect-layer">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], i) => {
          const delay = i * 0.01;
          const lineProgress = Math.max(0, Math.min(1, (progress - delay) * 2.5));
          const opacity = lineProgress * 0.5;
          const lineColor = i % 2 === 0 ? `rgba(180,100,255,${opacity})` : `rgba(100,180,255,${opacity})`;
          return (
            <line
              key={i}
              x1={`${stars[from].x}%`}
              y1={`${stars[from].y}%`}
              x2={`${stars[from].x + (stars[to].x - stars[from].x) * lineProgress}%`}
              y2={`${stars[from].y + (stars[to].y - stars[from].y) * lineProgress}%`}
              stroke={lineColor}
              strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 3px ${lineColor})` }}
            />
          );
        })}
      </svg>

      {/* Stars */}
      {stars.map((star, i) => {
        const delay = i * 0.015;
        const starProgress = Math.max(0, (progress - delay) * 2);
        const pulse = Math.sin((time * 3 + i * 0.5) * Math.PI);
        const size = 6 + starProgress * 4 + pulse * 2;
        const color = getStarColor(i);
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: size,
              height: size,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, rgba(255,255,255,${0.9 * Math.min(1, starProgress)}) 0%, rgba(${color.r},${color.g},${color.b},${0.7 * Math.min(1, starProgress)}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${10 + pulse * 5}px rgba(${color.r},${color.g},${color.b},${0.6 * Math.min(1, starProgress)})`,
            }}
          />
        );
      })}

      {/* Gradient overlay for depth - extends 100px below fold */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: 'calc(100% + 100px)',
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
