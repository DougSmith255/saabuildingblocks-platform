'use client';

import { GenericCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import Image from 'next/image';

// Cloudflare Images CDN URL
const KARRIE_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public';

/**
 * Karrie Hill Linktree Page
 * Quick links and resources
 */
export default function KarrieLinktree() {
  const socialLinks = [
    {
      title: "Instagram",
      href: "https://instagram.com/karriehill.jd.marinrealtor",
      icon: "📸"
    },
    {
      title: "YouTube",
      href: "https://youtube.com/@karriehill.jd.realtor",
      icon: "🎬"
    },
    {
      title: "LinkedIn",
      href: "https://linkedin.com/in/karrie-hill-j-d",
      icon: "💼"
    }
  ];

  const resourceLinks = [
    {
      title: "Smart Agent Alliance",
      description: "Our team website and resources",
      href: "/",
      highlight: true
    },
    {
      title: "Everything About eXp",
      description: "Learn about eXp Realty",
      href: "/about-exp-realty/",
      highlight: false
    },
    {
      title: "Join My eXp Sponsor Team",
      description: "Partner with the Wolf Pack",
      href: "/join-exp-sponsor-team/",
      highlight: true
    },
    {
      title: "YouTube - For Agents",
      description: "Training and tips for real estate agents",
      href: "https://youtube.com/@SmartAgentAlliance",
      highlight: false
    },
    {
      title: "Marin County Real Estate",
      description: "My local real estate website",
      href: "https://karriehill.exprealty.com",
      highlight: false
    }
  ];

  return (
    <main id="main-content" className="flex flex-col items-center py-12 px-4 min-h-screen">
      {/* Profile Section */}
      <div className="text-center mb-8">
        <ProfileCyberFrame size="md" index={1}>
          <Image
            src={KARRIE_PROFILE_IMAGE}
            alt="Karrie Hill"
            fill
            sizes="144px"
            className="object-cover"
          />
        </ProfileCyberFrame>
        <h1 className="text-h4 text-[#e5e4dd] mb-1">Karrie Hill, JD</h1>
        <p className="text-[#ffd700] mb-2" style={{ fontSize: 'var(--font-size-caption)' }}>Marin County Realtor</p>
        <p className="text-[#dcdbd5]/80 max-w-xs mx-auto" style={{ fontSize: 'var(--font-size-caption)' }}>
          Co-Founder, Smart Agent Alliance @ eXp Realty
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex gap-4 mb-8">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl hover:bg-[#ffd700]/20 transition-colors"
            title={link.title}
          >
            {link.icon}
          </a>
        ))}
      </div>

      {/* Resource Links */}
      <div className="w-full max-w-md space-y-3">
        {resourceLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="block"
          >
            <GenericCard hover padding="sm" centered>
              <p className="text-body text-[#e5e4dd] font-medium">{link.title}</p>
              {link.description && (
                <p className="text-[#dcdbd5]/80 mt-1" style={{ fontSize: 'var(--font-size-caption)' }}>{link.description}</p>
              )}
            </GenericCard>
          </a>
        ))}
      </div>

      {/* Email */}
      <div className="mt-8 text-center">
        <a
          href="mailto:team@smartagentalliance.com"
          className="text-link hover:underline"
        >
          team@smartagentalliance.com
        </a>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-caption text-[#dcdbd5]/40">
          Smart Agent Alliance • eXp Realty
        </p>
      </div>
    </main>
  );
}
