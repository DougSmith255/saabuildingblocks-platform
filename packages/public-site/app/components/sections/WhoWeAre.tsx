'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { H2 } from '@saa/shared/components/saa';

const teamMembers = [
  {
    name: 'Doug Smart',
    role: 'Co-Founder & Full-Stack Architect',
    image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Doug-Profile-Picture.png',
    bio: "Top 0.1% eXp team builder. Architect of the infrastructure powering Smart Agent Alliance—this website, the automation systems, the entire value stack for our agents. He transforms complex technology into unfair advantages for agents ready to dominate their market.",
  },
  {
    name: 'Karrie Smart',
    role: 'Co-Founder & Strategic Advisor',
    image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Karrie-Profile-Picture.png',
    bio: "UC Berkeley Law (top 5%), eXp Certified Mentor, and the strategic mind behind agent success. Built a six-figure business in year one—no cold calls, no door knocking. Now she's engineering the same results for agents who refuse to settle.",
  },
];

/**
 * ProfileCyberFrame - Circular version of CyberFrame for profile images
 * Adapted from @saa/shared/components/saa/media/CyberFrame
 */
function ProfileCyberFrame({ children, index }: { children: React.ReactNode; index: number }) {
  // Generate random values for this instance (consistent per mount)
  // Use index as seed for consistent but different values per profile
  const randomValues = useMemo(() => ({
    sheenAngle: 25 + (index * 10), // Slightly different angle per profile
    sheenPosition: 30 + (index * 20),
    hueRotate: index * 120, // Different hue per profile
    holoOpacity: 0.03,
  }), [index]);

  return (
    <div
      className="profile-cyber-frame relative w-36 h-36 md:w-44 md:h-44 mx-auto mb-6"
      style={{
        '--sheen-angle': `${randomValues.sheenAngle}deg`,
        '--sheen-pos': `${randomValues.sheenPosition}%`,
        '--hue-rotate': `${randomValues.hueRotate}deg`,
        '--holo-opacity': randomValues.holoOpacity,
      } as React.CSSProperties}
    >
      {/* 3D Metal Frame - circular version */}
      <div
        className="absolute inset-[-6px] rounded-full"
        style={{
          background: 'linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%)',
          border: '1px solid rgba(150,150,150,0.4)',
          boxShadow: `
            0 4px 20px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 15px rgba(0,255,136,0.1)
          `,
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      />

      {/* Inner container with holographic effects */}
      <div className="profile-cyber-inner absolute inset-0 rounded-full overflow-hidden bg-[#0a0a0a]">
        {children}

        {/* Holographic glass overlay - glossy sheen */}
        <div
          className="profile-sheen absolute inset-[-100%] rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(
              var(--sheen-angle, 25deg),
              transparent 0%,
              transparent 35%,
              rgba(255,255,255,0.08) 42%,
              rgba(255,255,255,0.15) 50%,
              rgba(255,255,255,0.08) 58%,
              transparent 65%,
              transparent 100%
            )`,
            transform: 'translateX(calc(var(--sheen-pos, 40%) - 50%))',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 10,
          }}
        />

        {/* Holographic iridescent overlay */}
        <div
          className="profile-holo absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(
              calc(var(--sheen-angle, 25deg) + 90deg),
              rgba(255, 0, 128, 0.03) 0%,
              rgba(128, 0, 255, 0.03) 20%,
              rgba(0, 128, 255, 0.03) 40%,
              rgba(0, 255, 128, 0.03) 60%,
              rgba(255, 255, 0, 0.03) 80%,
              rgba(255, 128, 0, 0.03) 100%
            )`,
            mixBlendMode: 'overlay',
            filter: 'hue-rotate(var(--hue-rotate, 0deg))',
            opacity: 'var(--holo-opacity, 0.8)',
            transition: 'filter 0.6s ease, opacity 0.4s ease',
            zIndex: 11,
          }}
        />
      </div>

      {/* Green accent glow ring */}
      <div
        className="profile-glow-ring absolute inset-[-2px] rounded-full pointer-events-none"
        style={{
          border: '2px solid rgba(0,255,136,0.3)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />
    </div>
  );
}

export function WhoWeAre() {
  return (
    <>
      {/* CSS for hover effects */}
      <style jsx global>{`
        .profile-cyber-frame:hover > div:first-child {
          box-shadow:
            0 4px 25px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 25px rgba(0,255,136,0.2) !important;
          border-color: rgba(0,255,136,0.3) !important;
        }

        .profile-cyber-frame:hover .profile-sheen {
          transform: translateX(calc(var(--sheen-pos, 40%) + 30%)) !important;
        }

        .profile-cyber-frame:hover .profile-holo {
          filter: hue-rotate(calc(var(--hue-rotate, 0deg) + 30deg)) !important;
          opacity: 1 !important;
        }

        .profile-cyber-frame:hover .profile-glow-ring {
          border-color: rgba(0,255,136,0.6) !important;
          box-shadow: 0 0 12px rgba(0,255,136,0.4) !important;
        }
      `}</style>

      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <H2>Who We Are</H2>
            <p className="text-[#dcdbd5] mt-4 text-lg max-w-3xl mx-auto">
              The architects of your unfair advantage.
            </p>
          </div>

          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffd700]/30 transition-all duration-300"
              >
                {/* Photo with CyberFrame effects (circular) */}
                <ProfileCyberFrame index={index}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                </ProfileCyberFrame>

              {/* Name */}
              <h3 className="text-[#e5e4dd] font-semibold text-xl md:text-2xl text-center mb-1">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-[#ffd700] text-center mb-4">
                {member.role}
              </p>

              {/* Bio */}
              <p className="text-[#dcdbd5]/80 text-center leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
