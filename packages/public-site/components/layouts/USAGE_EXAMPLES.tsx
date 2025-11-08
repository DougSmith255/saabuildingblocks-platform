/**
 * FullWidthLayout Usage Examples
 *
 * This file demonstrates various use cases for the FullWidthLayout component.
 * Copy these examples into your pages as needed.
 */

import { FullWidthLayout } from './index';
import { H1, Tagline, CTAButton } from '@saa/shared/components/saa';

// ============================================
// EXAMPLE 1: Hero Section (Full-Width)
// ============================================
export function HeroSectionExample() {
  return (
    <FullWidthLayout
      verticalPadding="xl"
      horizontalPadding="responsive"
      ariaLabel="Hero section"
      className="min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="text-center space-y-6">
        <H1>Your Amazing Title</H1>
        <Tagline>Compelling tagline that draws users in</Tagline>
        <div className="flex gap-4 justify-center">
          <CTAButton href="/get-started">Get Started</CTAButton>
          <CTAButton href="/learn-more">Learn More</CTAButton>
        </div>
      </div>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 2: Centered Content Section
// ============================================
export function CenteredContentExample() {
  return (
    <FullWidthLayout
      centered
      maxWidth="1200px"
      verticalPadding="lg"
      horizontalPadding="responsive"
      ariaLabel="Main content"
    >
      <article className="prose prose-invert max-w-none">
        <h2>Section Title</h2>
        <p>
          Your centered content goes here. This layout ensures proper max-width
          for readability while maintaining full-width background.
        </p>
      </article>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 3: Edge-to-Edge Background Image
// ============================================
export function BackgroundImageExample() {
  return (
    <FullWidthLayout
      horizontalPadding="none"
      verticalPadding="xl"
      className="bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(/images/hero-background.jpg)',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content with responsive padding */}
      <div className="relative z-10 px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <H1>Overlay Content</H1>
          <Tagline>Content appears over the background image</Tagline>
        </div>
      </div>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 4: Grid Layout (Full-Width)
// ============================================
export function GridLayoutExample() {
  return (
    <FullWidthLayout
      verticalPadding="lg"
      horizontalPadding="responsive"
      ariaLabel="Features grid"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="p-6 border border-[#e5e4dd]/20 rounded-lg bg-[#191818]/50"
          >
            <h3 className="text-xl font-semibold text-[#e5e4dd] mb-3">
              Feature {item}
            </h3>
            <p className="text-[#dcdbd5]">
              Description of this amazing feature.
            </p>
          </div>
        ))}
      </div>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 5: Custom Spacing with clamp()
// ============================================
export function CustomSpacingExample() {
  return (
    <FullWidthLayout
      verticalPadding="custom"
      customVerticalPadding="clamp(3rem, 10vh, 10rem)"
      horizontalPadding="custom"
      customHorizontalPadding="clamp(1rem, 5vw, 5rem)"
      ariaLabel="Custom spacing section"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#e5e4dd] mb-4">
          Fluid Spacing
        </h2>
        <p className="text-[#dcdbd5] max-w-2xl mx-auto">
          This section uses CSS clamp() for fluid, responsive spacing that
          adapts smoothly across all screen sizes.
        </p>
      </div>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 6: No Padding (True Edge-to-Edge)
// ============================================
export function EdgeToEdgeExample() {
  return (
    <FullWidthLayout
      verticalPadding="none"
      horizontalPadding="none"
      className="bg-gradient-to-r from-purple-900 to-blue-900"
    >
      {/* Content controls its own spacing */}
      <div className="py-20 px-8">
        <div className="max-w-6xl mx-auto text-white">
          <h2 className="text-4xl font-bold mb-4">True Full-Width</h2>
          <p>
            This layout has no built-in padding. Background extends to edges,
            and content controls its own spacing.
          </p>
        </div>
      </div>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 7: Article/Main Element
// ============================================
export function ArticleLayoutExample() {
  return (
    <FullWidthLayout
      as="article"
      centered
      maxWidth="800px"
      verticalPadding="lg"
      horizontalPadding="responsive"
      ariaLabel="Blog post content"
      className="blog-content"
    >
      <header className="mb-8">
        <H1>Article Title</H1>
        <p className="text-[#808080] mt-4">Published on January 1, 2024</p>
      </header>

      <div className="prose prose-invert max-w-none">
        <p>Your article content goes here...</p>
      </div>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 8: Multiple Sections on One Page
// ============================================
export function MultiSectionPageExample() {
  return (
    <>
      {/* Hero Section - Full-width with background */}
      <FullWidthLayout
        verticalPadding="xl"
        horizontalPadding="responsive"
        className="min-h-screen flex items-center bg-gradient-to-b from-[#2d2d2d] to-[#0c0c0c]"
      >
        <div className="text-center w-full">
          <H1>Welcome</H1>
          <Tagline>Your journey starts here</Tagline>
        </div>
      </FullWidthLayout>

      {/* Features Section - Centered content */}
      <FullWidthLayout
        centered
        maxWidth="1200px"
        verticalPadding="lg"
        horizontalPadding="responsive"
        id="features"
        ariaLabel="Features section"
      >
        <h2 className="text-3xl font-bold text-[#e5e4dd] mb-8 text-center">
          Features
        </h2>
        <GridLayoutExample />
      </FullWidthLayout>

      {/* CTA Section - Full-width with background */}
      <FullWidthLayout
        verticalPadding="xl"
        horizontalPadding="responsive"
        className="bg-[#ffd700]/10"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-[#ffd700] mb-6">
            Ready to Get Started?
          </h2>
          <CTAButton href="/sign-up">Join Now</CTAButton>
        </div>
      </FullWidthLayout>
    </>
  );
}

// ============================================
// EXAMPLE 9: Responsive Padding Patterns
// ============================================
export function ResponsivePaddingExample() {
  return (
    <FullWidthLayout
      verticalPadding="lg"
      horizontalPadding="responsive"
      ariaLabel="Responsive section"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#e5e4dd] mb-4">
          Smart Responsive Padding
        </h2>
        <p className="text-[#dcdbd5] max-w-2xl mx-auto">
          This section uses responsive horizontal padding:
          <br />
          Mobile: 24px (px-6) → Tablet: 48px (px-12) → Desktop: 80px (px-20)
        </p>
      </div>
    </FullWidthLayout>
  );
}

// ============================================
// EXAMPLE 10: With Background Color
// ============================================
export function BackgroundColorExample() {
  return (
    <>
      {/* Dark background section */}
      <FullWidthLayout
        backgroundColor="rgb(25, 24, 24)"
        verticalPadding="lg"
        horizontalPadding="responsive"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#e5e4dd] mb-4">
            Dark Section
          </h2>
          <p className="text-[#dcdbd5]">Content on dark background</p>
        </div>
      </FullWidthLayout>

      {/* Gold accent section */}
      <FullWidthLayout
        backgroundColor="rgba(255, 215, 0, 0.05)"
        verticalPadding="lg"
        horizontalPadding="responsive"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#ffd700] mb-4">
            Gold Accent Section
          </h2>
          <p className="text-[#dcdbd5]">Subtle gold background</p>
        </div>
      </FullWidthLayout>
    </>
  );
}
