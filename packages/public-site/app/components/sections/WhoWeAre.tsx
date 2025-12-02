'use client';

import Image from 'next/image';
import { H2 } from '@saa/shared/components/saa';

const teamMembers = [
  {
    name: 'Doug Smart',
    role: 'Co-Founder & Full-Stack Architect',
    image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Doug-Profile-Picture.png',
    bio: "Top 0.1% eXp team builder. Architect of the infrastructure behind everything you see here—this website, the automation systems, the entire tech stack. He transforms complex technology into unfair advantages for agents ready to dominate their market.",
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
              {/* Photo */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 overflow-hidden border-2 border-[#ffd700]/30">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
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
