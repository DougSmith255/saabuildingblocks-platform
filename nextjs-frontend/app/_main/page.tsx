import type { Metadata } from 'next';

/**
 * Homepage Metadata
 */
export const metadata: Metadata = {
  title: 'Home - Smart Agent Alliance',
  description:
    'Team-focused support for real estate professionals. Join Smart Agent Alliance for personalized coaching, growth tools, and a supportive community.',
};

/**
 * Homepage Component
 * EXACT WordPress content - copied directly from saabuildingblocks.com
 */
export default function HomePage() {
  return (
    <main className="saa-homepage" suppressHydrationWarning>
      {/* Hero Section - Fixed Height Container for Layout Stability */}
      <section className="hero-section content-section" id="hero">
        <div className="saa-container">
          {/* Fixed Height Hero Title Container - Prevents Layout Shifts */}
          <div className="hero-title-container">
            <h1 className="hero-title text-scramble text-display">
              Scale Smarter With Us
            </h1>
          </div>

          {/* Stable Hero Content Container */}
          <div className="hero-content-container">
            <p className="hero-subtitle">Gain an additional income stream that buys back your time.</p>
            <p className="hero-tagline">
              <span className="tagline-block">Smart Agent Alliance</span>
              {' '}
              <span className="tagline-block">(Part of the Wolf Pack).</span>
              {' '}
              <span className="tagline-block">Free Value. No Upsells.</span>
            </p>

            <div className="cta-buttons">
              <div className="cta-button text-display"><a href="#">WATCH THE WEBINAR</a></div>
              <div className="cta-button get-started-btn text-display"><a href="#">GET STARTED</a></div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
