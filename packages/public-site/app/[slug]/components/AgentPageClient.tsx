'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface AgentPage {
  id: string;
  user_id: string;
  slug: string;
  display_first_name: string;
  display_last_name: string;
  profile_image_url: string | null;
  phone: string | null;
  show_phone: boolean;
  phone_text_only: boolean;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AgentPageClientProps {
  slug: string;
}

/**
 * Agent Page Client Component
 *
 * Fetches agent data from Supabase via the admin dashboard API
 * and displays their public profile page.
 */
export default function AgentPageClient({ slug }: AgentPageClientProps) {
  const [agent, setAgent] = useState<AgentPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgent() {
      try {
        // Fetch from admin dashboard API (handles CORS)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://saabuildingblocks.com'}/api/agent-pages/by-slug/${slug}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError('not_found');
          } else {
            setError('fetch_error');
          }
          return;
        }

        const data = await response.json();

        if (!data.page || !data.page.is_active) {
          setError('not_found');
          return;
        }

        setAgent(data.page);
      } catch (err) {
        console.error('Failed to fetch agent:', err);
        setError('fetch_error');
      } finally {
        setLoading(false);
      }
    }

    fetchAgent();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(15,15,15)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (error === 'not_found') {
    notFound();
  }

  // Error state
  if (error || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(15,15,15)]">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-white/60 mb-6">Unable to load this page. Please try again later.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#ffd700] text-black font-semibold rounded-lg hover:bg-[#ffed4a] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${agent.display_first_name} ${agent.display_last_name}`;
  const hasPhone = agent.phone && agent.show_phone;
  const hasSocialLinks = agent.facebook_url || agent.instagram_url || agent.twitter_url ||
                         agent.youtube_url || agent.tiktok_url || agent.linkedin_url;

  return (
    <div className="min-h-screen bg-[rgb(15,15,15)] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-[rgb(25,25,25)] rounded-2xl p-8 shadow-xl border border-white/10">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            {agent.profile_image_url ? (
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#ffd700]">
                <Image
                  src={agent.profile_image_url}
                  alt={fullName}
                  fill
                  className="object-cover"
                  sizes="160px"
                  priority
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-[rgb(45,45,45)] border-4 border-[#ffd700] flex items-center justify-center">
                <span className="text-4xl text-white/40">
                  {agent.display_first_name[0]}{agent.display_last_name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            {fullName}
          </h1>

          {/* Title */}
          <p className="text-[#ffd700] text-center mb-6">
            Real Estate Professional
          </p>

          {/* Contact Info */}
          {hasPhone && (
            <div className="text-center mb-6">
              {agent.phone_text_only ? (
                <p className="text-white/80">
                  <span className="text-white/50">Text: </span>
                  {agent.phone}
                </p>
              ) : (
                <a
                  href={`tel:${agent.phone}`}
                  className="text-white/80 hover:text-[#ffd700] transition-colors"
                >
                  {agent.phone}
                </a>
              )}
            </div>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="flex justify-center gap-4 mb-8">
              {agent.facebook_url && (
                <SocialLink href={agent.facebook_url} label="Facebook">
                  <FacebookIcon />
                </SocialLink>
              )}
              {agent.instagram_url && (
                <SocialLink href={agent.instagram_url} label="Instagram">
                  <InstagramIcon />
                </SocialLink>
              )}
              {agent.twitter_url && (
                <SocialLink href={agent.twitter_url} label="Twitter">
                  <TwitterIcon />
                </SocialLink>
              )}
              {agent.youtube_url && (
                <SocialLink href={agent.youtube_url} label="YouTube">
                  <YouTubeIcon />
                </SocialLink>
              )}
              {agent.tiktok_url && (
                <SocialLink href={agent.tiktok_url} label="TikTok">
                  <TikTokIcon />
                </SocialLink>
              )}
              {agent.linkedin_url && (
                <SocialLink href={agent.linkedin_url} label="LinkedIn">
                  <LinkedInIcon />
                </SocialLink>
              )}
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/join-exp-sponsor-team/"
              className="inline-block px-8 py-4 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-[#ffed4a] transition-all hover:scale-105"
            >
              Join Our Team
            </Link>
          </div>
        </div>

        {/* SAA Branding */}
        <div className="text-center mt-8">
          <Link href="/" className="text-white/40 hover:text-white/60 transition-colors text-sm">
            Smart Agent Alliance
          </Link>
        </div>
      </div>
    </div>
  );
}

// Social Link Component
function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-[rgb(45,45,45)] flex items-center justify-center text-white/60 hover:text-[#ffd700] hover:bg-[rgb(55,55,55)] transition-all"
    >
      {children}
    </a>
  );
}

// Social Icons (simple SVG icons)
function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
