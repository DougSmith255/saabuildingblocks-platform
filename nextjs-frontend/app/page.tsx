import type { Metadata } from 'next';
import { CTAButton } from '@/components/saa';

export const metadata: Metadata = {
  title: 'Smart Agent Alliance | For Agents Who Want More',
  description: 'Gain an additional income stream that buys back your time. Join the Smart Agent Alliance - Free Value. No Upsells.',
  openGraph: {
    title: 'Smart Agent Alliance',
    description: 'For Agents Who Want More',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Agent Alliance',
    description: 'For Agents Who Want More',
  },
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="
          relative
          min-h-screen
          flex items-center justify-center
          overflow-hidden
          px-4 sm:px-8 md:px-12
          py-16 sm:py-20 md:py-24
        "
        aria-labelledby="hero-heading"
      >
        {/* Container */}
        <div
          className="
            relative z-10
            w-[clamp(95%,calc(95%+(80%-95%)*((100vw-300px)/1750)),80%)]
            mx-auto
            space-y-8
          "
        >
          {/* Headline Group */}
          <div className="space-y-4 text-center">
            {/* H1: Individual letter glitch effect */}
            <h1
              id="hero-heading"
              className="
                text-h1
                text-display
                tracking-tight
              "
            >
              {'SMART AGENT ALLIANCE'.split('').map((char, index) => (
                <span
                  key={index}
                  className="neon-char"
                  data-char={char}
                  style={{
                    animation: `neonFlicker${(index % 10) + 1} ${6.5 + (index * 0.1)}s linear infinite`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
            <p
              className="
                text-xl
                text-gold-primary
                font-amulya
              "
            >
              For Agents Who Want More
            </p>
          </div>

          {/* Value Proposition - No Container */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <p
              className="
                font-amulya
                text-lg
                leading-relaxed
                text-white/90
              "
            >
              Gain an additional income stream that buys back your time.
            </p>
            <p
              className="
                font-amulya
                text-sm
                leading-relaxed
                text-white/70
              "
            >
              Smart Agent Alliance (Part of the Wolf Pack). Free Value. No Upsells.
            </p>
          </div>

          {/* CTA Button Group */}
          <div
            className="
              flex flex-col sm:flex-row
              gap-4 sm:gap-6
              justify-center
            "
          >
            <CTAButton href="/sign-up">
              JOIN THE ALLIANCE
            </CTAButton>
            <CTAButton href="/about">
              LEARN MORE
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
