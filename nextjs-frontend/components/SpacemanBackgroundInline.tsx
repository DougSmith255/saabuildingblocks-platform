'use client';

/**
 * Spaceman Background - Inline SVG
 * Simple animated spaceman floating at the bottom of the page
 */
export default function SpacemanBackgroundInline() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 10,
        overflow: 'hidden',
      }}
      data-component="spaceman-background-inline"
    >
      <div
        className="absolute flex items-end justify-center"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: '85vh',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2000 2000"
          style={{
            width: '90vw',
            maxWidth: '1200px',
            height: '100%',
            opacity: 0.6,
            filter: 'drop-shadow(0 0 30px rgba(234, 179, 8, 0.3))',
          }}
        >
          <defs>
            <style>
              {`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-30px); }
                }
                @keyframes glow {
                  0%, 100% { opacity: 0.4; }
                  50% { opacity: 0.7; }
                }
                .spaceman { animation: float 6s ease-in-out infinite; transform-origin: center; }
                .glow { animation: glow 3s ease-in-out infinite; }
              `}
            </style>
          </defs>
          <g className="spaceman">
            {/* Astronaut body */}
            <ellipse cx="1000" cy="1500" rx="280" ry="420" fill="#e5e5e5" opacity="0.5"/>

            {/* Helmet */}
            <circle cx="1000" cy="1150" r="180" fill="#ffffff" opacity="0.6"/>
            <circle cx="1000" cy="1150" r="150" fill="none" stroke="#ffd700" strokeWidth="3" opacity="0.8"/>

            {/* Visor */}
            <ellipse cx="1000" cy="1150" rx="120" ry="100" fill="#1a1a1a" opacity="0.7"/>
            <ellipse cx="1000" cy="1140" rx="100" ry="80" fill="#2a2a2a" className="glow"/>

            {/* Body suit */}
            <rect x="900" y="1280" width="200" height="350" rx="30" fill="#f0f0f0" opacity="0.5"/>

            {/* Arms */}
            <ellipse cx="820" cy="1400" rx="60" ry="180" fill="#e0e0e0" opacity="0.5" transform="rotate(-20 820 1400)"/>
            <ellipse cx="1180" cy="1400" rx="60" ry="180" fill="#e0e0e0" opacity="0.5" transform="rotate(20 1180 1400)"/>

            {/* Legs */}
            <rect x="920" y="1600" width="80" height="250" rx="20" fill="#d5d5d5" opacity="0.5"/>
            <rect x="1000" y="1600" width="80" height="250" rx="20" fill="#d5d5d5" opacity="0.5"/>

            {/* Backpack */}
            <rect x="1050" y="1320" width="100" height="180" rx="15" fill="#cccccc" opacity="0.5"/>

            {/* Gold accents */}
            <circle cx="1000" cy="1300" r="15" fill="#ffd700" opacity="0.8"/>
            <circle cx="950" cy="1350" r="12" fill="#ffd700" opacity="0.8"/>
            <circle cx="1050" cy="1350" r="12" fill="#ffd700" opacity="0.8"/>

            {/* Rocket emoji fallback */}
            <text x="1000" y="1900" textAnchor="middle" fontSize="80" opacity="0.7">🚀</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
