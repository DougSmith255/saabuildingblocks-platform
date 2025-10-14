/**
 * CTA Button Usage Examples
 *
 * This file demonstrates the various ways to use the CTAButton component.
 * DO NOT import this in production code - it's for reference only.
 */

import { CTAButton } from './cta-button';

export function CTAButtonExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-4">CTA Button Examples</h2>

      {/* Example 1: Basic button with href */}
      <div>
        <h3 className="text-lg font-semibold mb-2">1. Link Button (with href)</h3>
        <CTAButton href="/signup">
          Get Started
        </CTAButton>
      </div>

      {/* Example 2: Button with onClick handler */}
      <div>
        <h3 className="text-lg font-semibold mb-2">2. Action Button (with onClick)</h3>
        <CTAButton onClick={() => alert('Button clicked!')}>
          Learn More
        </CTAButton>
      </div>

      {/* Example 3: Button with custom className */}
      <div>
        <h3 className="text-lg font-semibold mb-2">3. Custom Styled Button</h3>
        <CTAButton
          href="/contact"
          className="mx-auto"
        >
          Contact Us
        </CTAButton>
      </div>

      {/* Example 4: Button with aria-label for accessibility */}
      <div>
        <h3 className="text-lg font-semibold mb-2">4. Accessible Button (with aria-label)</h3>
        <CTAButton
          href="/signup"
          ariaLabel="Sign up for free account"
        >
          Sign Up
        </CTAButton>
      </div>

      {/* Example 5: Multiple buttons in a group */}
      <div>
        <h3 className="text-lg font-semibold mb-2">5. Button Group</h3>
        <div className="flex gap-4 justify-center flex-wrap">
          <CTAButton href="/pricing">
            View Pricing
          </CTAButton>
          <CTAButton onClick={() => console.log('Demo started')}>
            Try Demo
          </CTAButton>
        </div>
      </div>

      {/* Example 6: Button states demo */}
      <div>
        <h3 className="text-lg font-semibold mb-2">6. Interactive States</h3>
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">
            Default: Gold glow on top/bottom
          </p>
          <p className="text-sm text-neutral-600">
            Hover: Glow lines expand to 80% width
          </p>
          <p className="text-sm text-neutral-600">
            Click: Glow turns green and persists
          </p>
          <p className="text-sm text-neutral-600">
            Keyboard (Enter/Space): Same as click
          </p>
          <CTAButton onClick={() => console.log('State demo')}>
            Test States
          </CTAButton>
        </div>
      </div>

      {/* Example 7: Responsive usage */}
      <div>
        <h3 className="text-lg font-semibold mb-2">7. Responsive Center</h3>
        <div className="flex justify-center">
          <CTAButton href="/mobile">
            Mobile Friendly
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Import Examples:
 *
 * // Named import
 * import { CTAButton } from '@/components/ui/buttons';
 *
 * // Direct import
 * import { CTAButton } from '@/components/ui/buttons/cta-button';
 *
 * // Default import
 * import CTAButton from '@/components/ui/buttons/cta-button';
 */

/**
 * Props Reference:
 *
 * interface CTAButtonProps {
 *   children: React.ReactNode;  // Button text or content
 *   href?: string;               // Optional link URL (makes button a Next.js Link)
 *   onClick?: () => void;        // Optional click handler (for non-link buttons)
 *   className?: string;          // Optional custom classes
 *   ariaLabel?: string;          // Optional accessibility label (defaults to children text)
 * }
 */
