import Image from 'next/image';

/**
 * Testing Page - LCP Baseline Test
 *
 * Simple hero section with just the Agent Success Hub image
 * to establish baseline LCP performance
 */
export default function TestingPage() {
  return (
    <main id="main-content">
      {/* Hero Section - Minimal setup */}
      <section
        className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24"
        aria-labelledby="hero-heading"
      >
        {/* Hero Image - Agent Success Hub */}
        <div className="relative w-full max-w-[1200px]">
          <Image
            src="/images/hero/agent-success-hub-hero-image.webp"
            alt="Agent Success Hub - Your Path to Real Estate Excellence"
            width={1200}
            height={675}
            priority
            fetchPriority="high"
            quality={90}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="w-full h-auto"
          />
        </div>

        {/* Simple heading */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <h1
            id="hero-heading"
            className="text-h1"
          >
            LCP Test Page
          </h1>
        </div>
      </section>
    </main>
  );
}
