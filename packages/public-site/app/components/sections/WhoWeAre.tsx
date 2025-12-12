'use client';

import React from 'react';
import Image from 'next/image';
import { H2, ProfileCyberFrame, GenericCard, SecondaryButton } from '@saa/shared/components/saa';

const teamMembers = [
  {
    name: 'Doug Smart',
    role: 'Co-Founder & Full-Stack Architect',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public',
    bio: "Top 0.1% eXp team builder. Architect of the infrastructure powering Smart Agent Alliance—this website, the automation systems, the entire value stack for our agents. He transforms complex technology into unfair advantages for agents ready to dominate their market.",
    href: '/about-doug-smart',
  },
  {
    name: 'Karrie Smart',
    role: 'Co-Founder & Strategic Advisor',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public',
    bio: "UC Berkeley Law (top 5%), eXp Certified Mentor, and the strategic mind behind agent success. Built a six-figure business in year one—no cold calls, no door knocking. Now she's engineering the same results for agents who refuse to settle.",
    href: '/about-karrie-hill',
  },
];

export function WhoWeAre() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <H2>Who We Are</H2>
            <p className="text-body mt-4 max-w-3xl mx-auto">
              The architects of your unfair advantage.
            </p>
          </div>

          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {teamMembers.map((member, index) => (
              <GenericCard
                key={index}
                hover
                padding="lg"
                href={member.href}
                className="h-full flex flex-col"
              >
                {/* Photo with CyberFrame effects (circular) */}
                <ProfileCyberFrame index={index} size="md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 144px, 176px"
                    className="object-cover"
                  />
                </ProfileCyberFrame>

              {/* Name */}
              <h3 className="text-h3 text-center mb-1">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-body text-[#ffd700] text-center mb-4">
                {member.role}
              </p>

              {/* Bio */}
              <p className="text-body opacity-80 text-center leading-relaxed flex-grow">
                {member.bio}
              </p>
            </GenericCard>
          ))}
        </div>

          {/* View Full Team Button */}
          <div className="flex justify-center mt-12">
            <SecondaryButton href="/our-exp-team">
              View The Full Team
            </SecondaryButton>
          </div>
      </div>
    </section>
  );
}
