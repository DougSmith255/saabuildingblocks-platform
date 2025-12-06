'use client';

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

export function WhoWeAre() {
  return (
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
              {/* Photo with Metal Backing Plate */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto mb-6">
                {/* Metal backing plate - brushed gunmetal effect */}
                <div
                  className="absolute inset-[-6px] rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, #3d3d3d 0%, #2f2f2f 40%, #252525 100%)',
                    borderTop: '2px solid rgba(180,180,180,0.45)',
                    borderLeft: '1px solid rgba(130,130,130,0.35)',
                    borderRight: '1px solid rgba(60,60,60,0.6)',
                    borderBottom: '2px solid rgba(0,0,0,0.7)',
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,0.12),
                      inset 0 -1px 2px rgba(0,0,0,0.25),
                      0 4px 12px rgba(0,0,0,0.5),
                      0 2px 6px rgba(0,0,0,0.3)
                    `,
                  }}
                />
                {/* Glossy highlight overlay */}
                <div
                  className="absolute inset-[-6px] rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)',
                  }}
                />
                {/* Image container with gold border */}
                <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-[#ffd700]/40">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                  {/* Image overlay - subtle vignette for depth */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.3) 100%)',
                    }}
                  />
                </div>
              </div>

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
