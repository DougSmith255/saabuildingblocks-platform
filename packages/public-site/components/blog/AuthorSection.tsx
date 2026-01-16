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
  socialLinks: {
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
}> = {
  'Doug Smart': {
    name: 'Doug Smart',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'Top 1% eXp team builder. Designed and built this website, the agent portal, and the systems and automations powering production workflows and attraction tools across the organization.',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public',
    profileUrl: '/about-doug-smart/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/doug-smart-718425274/',
      youtube: 'https://www.youtube.com/@SmartAgentAlliance',
      website: '/about-doug-smart/',
    },
  },
  'Karrie Hill': {
    name: 'Karrie Hill',
    role: 'Co-Founder, Smart Agent Alliance',
    bio: 'UC Berkeley Law (top 5%). Built a six-figure real estate business in her first full year without cold calling or door knocking, now helping agents do the same.',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public',
    profileUrl: '/about-karrie-hill/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/karrie-hill-j-d/',
      youtube: 'https://www.youtube.com/@SmartAgentAlliance',
      website: '/about-karrie-hill/',
    },
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
 * - Tagline styling on names (H2-style glow) - fixed color for light/dark mode
 * - Body font styling on bio
 * - ProfileCyberFrame for photo (size="md" = 144px)
 * - Social links under profile image
 * - 3D Icon effect on arrow button with label
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

  // Social icon color - gold to match theme
  const socialIconColor = '#ffd700';

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
        {/* Photo with ProfileCyberFrame (size="md" = 144px) and Social Links */}
        <div className="relative flex-shrink-0 flex flex-col items-center gap-3">
          <ProfileCyberFrame size="md" index={index}>
            <img
              src={author.image}
              alt={author.name}
              className="object-cover w-full h-full"
            />
          </ProfileCyberFrame>

          {/* Social Links Row */}
          <div className="flex gap-2">
            {author.socialLinks.linkedin && (
              <a
                href={author.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: `${socialIconColor}40`, border: `1px solid ${socialIconColor}60` }}
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill={socialIconColor} viewBox="0 0 24 24">
                  <path d="M20.45,20.45H16.89V14.88c0-1.33,0-3.04-1.85-3.04s-2.14,1.45-2.14,2.94v5.66H9.34V9h3.41v1.56h.05a3.74,3.74,0,0,1,3.37-1.85c3.6,0,4.27,2.37,4.27,5.46v6.28ZM5.34,7.43A2.07,2.07,0,1,1,7.41,5.36,2.07,2.07,0,0,1,5.34,7.43Zm1.78,13H3.56V9H7.12ZM22.22,0H1.77A1.75,1.75,0,0,0,0,1.73V22.27A1.75,1.75,0,0,0,1.77,24H22.22A1.76,1.76,0,0,0,24,22.27V1.73A1.76,1.76,0,0,0,22.22,0Z"/>
                </svg>
              </a>
            )}
            {author.socialLinks.youtube && (
              <a
                href={author.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: `${socialIconColor}40`, border: `1px solid ${socialIconColor}60` }}
                title="YouTube"
              >
                <svg className="w-4 h-4" fill={socialIconColor} viewBox="0 0 24 24">
                  <path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.14C19.53,3.5,12,3.5,12,3.5s-7.53,0-9.38.55A3.02,3.02,0,0,0,.5,6.19,31.62,31.62,0,0,0,0,12a31.62,31.62,0,0,0,.5,5.81,3.02,3.02,0,0,0,2.12,2.14c1.85.55,9.38.55,9.38.55s7.53,0,9.38-.55a3.02,3.02,0,0,0,2.12-2.14A31.62,31.62,0,0,0,24,12,31.62,31.62,0,0,0,23.5,6.19ZM9.55,15.5V8.5L15.82,12Z"/>
                </svg>
              </a>
            )}
            {author.socialLinks.website && (
              <a
                href={author.socialLinks.website}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: `${socialIconColor}40`, border: `1px solid ${socialIconColor}60` }}
                title="Website"
              >
                <svg className="w-4 h-4" fill="none" stroke={socialIconColor} strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9Z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          {/* Name with Tagline styling and H2-style glow - color forced for light/dark mode consistency */}
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
            className="!text-[#bfbdb0]"
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

        {/* Arrow link with 3D Icon effect and label */}
        <a
          href={author.profileUrl}
          className="flex-shrink-0 flex flex-col items-center gap-2 group"
          title={`Read more about ${author.name}`}
        >
          <div className="w-12 h-12 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center group-hover:bg-[#ffd700]/20 group-hover:border-[#ffd700]/40 transition-all">
            <Icon3D color="#ffd700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Icon3D>
          </div>
          <span
            className="text-xs text-[#ffd700]/70 group-hover:text-[#ffd700] transition-colors whitespace-nowrap"
            style={{ fontFamily: 'var(--font-synonym, sans-serif)' }}
          >
            Full Bio
          </span>
        </a>
      </div>
    </div>
  );
}

export default AuthorSection;
