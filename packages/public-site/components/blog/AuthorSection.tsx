'use client';

import React from 'react';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media/ProfileCyberFrame';
import { Icon3D } from '@saa/shared/components/saa';

/**
 * Author data mapping - maps WordPress author names to full author info
 * Used to display rich author sections at the bottom of blog posts
 */
const AUTHORS: Record<string, {
  name: string;
  role: string;
  bio: string;
  image: string;
  profileUrl: string;
}> = {
  'Doug Smart': {
    name: 'Doug Smart',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'Top 1% eXp team builder. Designed and built this website, the agent portal, and the systems and automations powering production workflows and attraction tools across the organization.',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public',
    profileUrl: '/about-doug-smart/',
  },
  'Karrie Hill': {
    name: 'Karrie Hill',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'UC Berkeley Law (top 5%). Built a six-figure real estate business in her first full year without cold calling or door knocking, now helping agents do the same.',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public',
    profileUrl: '/about-karrie-hill/',
  },
};

export interface AuthorSectionProps {
  /** Author name from WordPress (e.g., "Doug Smart", "Karrie Hill") */
  authorName: string;
  /** Optional index for ProfileCyberFrame randomization */
  index?: number;
}

/**
 * AuthorSection - Blog post author bio section
 *
 * Design 3: Compact 3D Metal Plate style
 * - Tagline styling on names (H2-style glow)
 * - Body font styling on bio
 * - ProfileCyberFrame for photo (size="md" = 144px)
 * - 3D Icon effect on arrow button
 * - Full-width metal plate background
 *
 * Automatically maps WordPress author name to rich author data
 */
export function AuthorSection({ authorName, index = 0 }: AuthorSectionProps) {
  // Look up author data by name
  const author = AUTHORS[authorName];

  // If author not found in our mapping, don't render
  if (!author) {
    console.warn(`AuthorSection: Unknown author "${authorName}"`);
    return null;
  }

  // Tagline text styling - matches H2 glow approach (text-shadow only, no filter)
  const taglineTextShadow = `
    0 0 1px #fff,
    0 0 2px #fff,
    0 0 8px rgba(255,255,255,0.4),
    0 0 16px rgba(255,255,255,0.2),
    0 0 28px rgba(255,255,255,0.1),
    0 0 40px rgba(255,255,255,0.05)
  `;

  return (
    <div
      className="relative w-full rounded-xl p-6 sm:p-8"
      style={{
        background: 'linear-gradient(180deg, #252525 0%, #1a1a1a 50%, #151515 100%)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Photo with ProfileCyberFrame (size="md" = 144px) */}
        <div className="relative flex-shrink-0">
          <ProfileCyberFrame size="md" index={index}>
            <img
              src={author.image}
              alt={author.name}
              className="object-cover w-full h-full"
            />
          </ProfileCyberFrame>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          {/* Name with Tagline styling and H2-style glow */}
          <h3
            style={{
              fontFamily: 'var(--font-taskor, sans-serif)',
              fontSize: 'clamp(21px, calc(17.45px + 1.42vw), 60px)',
              lineHeight: 1.4,
              fontWeight: 400,
              fontFeatureSettings: '"ss01" 1',
              color: '#bfbdb0',
              textShadow: taglineTextShadow,
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
            }}
          >
            {author.name}
          </h3>

          {/* Role */}
          <p
            className="mb-3"
            style={{
              fontFamily: 'var(--font-synonym, sans-serif)',
              fontSize: 'clamp(14px, calc(12px + 0.3vw), 18px)',
              color: 'rgba(191,189,176,0.7)',
            }}
          >
            {author.role}
          </p>

          {/* Bio with Body font styling and sizing */}
          <p
            style={{
              fontFamily: 'var(--font-synonym, sans-serif)',
              fontSize: 'clamp(16px, calc(14.91px + 0.44vw), 28px)',
              lineHeight: 1.6,
              color: '#bfbdb0',
            }}
          >
            {author.bio}
          </p>
        </div>

        {/* Arrow link with 3D Icon effect */}
        <a
          href={author.profileUrl}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center hover:bg-[#ffd700]/20 hover:border-[#ffd700]/40 transition-all"
          title={`More about ${author.name}`}
        >
          <Icon3D color="#ffd700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Icon3D>
        </a>
      </div>
    </div>
  );
}

export default AuthorSection;
