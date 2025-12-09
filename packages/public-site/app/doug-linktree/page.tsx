'use client';

import { GenericCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import Image from 'next/image';

// Cloudflare-ready image URL (using same as WhoWeAre section)
const DOUG_PROFILE_IMAGE = 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Doug-Profile-Picture.png';

/**
 * Doug Smart Linktree Page
 * Quick links and resources
 */
export default function DougLinktree() {
  const socialLinks = [
    {
      title: "Instagram",
      href: "https://instagram.com/dougthemediamaker",
      icon: "📸"
    },
    {
      title: "YouTube",
      href: "https://youtube.com/@SmartAgentAlliance",
      icon: "🎬"
    },
    {
      title: "LinkedIn",
      href: "https://linkedin.com/in/doug-smart",
      icon: "💼"
    },
    {
      title: "TikTok",
      href: "https://tiktok.com/@dougthemediamaker",
      icon: "🎵"
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
      title: "Doug's Tool List",
      description: "Tech tools I recommend",
      href: "/sites-and-software/",
      highlight: false
    }
  ];

  return (
    <main className="flex flex-col items-center py-12 px-4 min-h-screen">
      {/* Profile Section */}
      <div className="text-center mb-8">
        <ProfileCyberFrame size="md">
          <Image
            src={DOUG_PROFILE_IMAGE}
            alt="Doug Smart"
            fill
            sizes="144px"
            className="object-cover"
          />
        </ProfileCyberFrame>
        <h1 className="text-2xl font-bold text-[#e5e4dd] mb-1">Doug Smart</h1>
        <p className="text-amber-400 text-sm mb-2">@dougthemediamaker</p>
        <p className="text-[#dcdbd5]/80 text-sm max-w-xs mx-auto">
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
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl hover:bg-amber-400/20 transition-colors"
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
              <p className="text-[#e5e4dd] font-medium">{link.title}</p>
              {link.description && (
                <p className="text-[#dcdbd5]/80 text-sm mt-1">{link.description}</p>
              )}
            </GenericCard>
          </a>
        ))}
      </div>

      {/* Email */}
      <div className="mt-8 text-center">
        <a
          href="mailto:doug@smartagentalliance.com"
          className="text-amber-400 hover:underline"
        >
          doug@smartagentalliance.com
        </a>
        <p className="text-[#dcdbd5]/60 text-sm mt-2">314-320-5606</p>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-[#dcdbd5]/40 text-xs">
          Smart Agent Alliance • eXp Realty
        </p>
      </div>
    </main>
  );
}
