'use client';

import { CyberCardHolographic } from '@saa/shared/components/saa';
import Image from 'next/image';

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
    <main className="min-h-screen bg-black flex flex-col items-center py-12 px-4">
      {/* Profile Section */}
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-400/30">
          <Image
            src="https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Copy-of-Profiles-Momma.png"
            alt="Karrie Hill"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Karrie Hill, JD</h1>
        <p className="text-amber-400 text-sm mb-2">Marin County Realtor</p>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
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
            {link.highlight ? (
              <CyberCardHolographic className="p-4 text-center hover:scale-[1.02] transition-transform">
                <p className="text-white font-medium">{link.title}</p>
                {link.description && (
                  <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                )}
              </CyberCardHolographic>
            ) : (
              <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/15 transition-colors border border-white/10">
                <p className="text-white font-medium">{link.title}</p>
                {link.description && (
                  <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                )}
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Email */}
      <div className="mt-8 text-center">
        <a
          href="mailto:karrie.hill@exprealty.com"
          className="text-amber-400 hover:underline"
        >
          karrie.hill@exprealty.com
        </a>
        <p className="text-gray-500 text-sm mt-2">415-435-7777 (no text)</p>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-xs">
          Smart Agent Alliance • eXp Realty
        </p>
      </div>
    </main>
  );
}
