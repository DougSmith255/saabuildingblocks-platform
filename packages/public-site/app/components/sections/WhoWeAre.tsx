'use client';

import { H2 } from '@saa/shared/components/saa';

const teamMembers = [
  {
    name: 'Doug Damon',
    role: 'Team Leader',
    bio: 'Doug brings decades of real estate experience and a passion for helping agents build sustainable businesses. His leadership has helped grow the Smart Agent Alliance into one of the fastest-growing teams at eXp Realty.',
  },
  {
    name: 'Karrie Damon',
    role: 'Team Leader',
    bio: 'Karrie specializes in agent development and training, ensuring every team member has the tools and support they need to thrive. Her dedication to agent success is the foundation of our team culture.',
  },
];

export function WhoWeAre() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Who We Are</H2>
          <p className="text-[#dcdbd5] mt-4 text-lg max-w-3xl mx-auto">
            Meet the leaders behind the Smart Agent Alliance.
          </p>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffd700]/30 transition-all duration-300"
            >
              {/* Photo placeholder - will add images later */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#ffd700]/10 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl md:text-4xl text-[#ffd700] font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
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
              <p className="text-[#dcdbd5]/80 text-center">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
