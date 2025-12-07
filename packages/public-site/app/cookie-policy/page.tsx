/**
 * Cookie Policy Page
 * Legal page with cookie policy content
 *
 * Design System:
 * - Uses Master Controller H1 component for page title
 * - Content styled with blog-content class for consistent typography
 * - Background: inherits star background from layout
 * - Max width container for readability
 */

import { H1 } from '@saa/shared/components/saa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Smart Agent Alliance',
  description: 'Learn about how Smart Agent Alliance uses cookies and similar tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 flex items-center justify-center"
        style={{ minHeight: '40vh', paddingTop: 'calc(var(--header-height) + 2rem)' }}
      >
        <div className="max-w-[1200px] mx-auto w-full text-center">
          <H1>Cookie Policy</H1>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="legal-content blog-content">
            <p className="legal-meta">
              <strong>Effective Date:</strong> December 6, 2025
            </p>

            <h2>1. Introduction</h2>
            <p>
              At Smart Agent Alliance, accessible at smartagentalliance.com, we use cookies and similar
              tracking technologies to improve your browsing experience, analyze website traffic, and
              understand where our visitors come from.
            </p>
            <p>
              This Cookie Policy explains what cookies are, how we use them, and your choices regarding
              their use. By continuing to use our website, you consent to the use of cookies as described
              in this policy.
            </p>

            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile
              phone) when you visit a website. They allow the website to recognize your device and
              remember certain information about your visit, such as your preferences and actions.
            </p>
            <p>
              Cookies are widely used to make websites work more efficiently and to provide information
              to website owners about how their site is being used.
            </p>

            <h2>3. Types of Cookies We Use</h2>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic
              functions like page navigation and access to secure areas of the website. The website
              cannot function properly without these cookies.
            </p>
            <ul>
              <li>Session management</li>
              <li>Security features</li>
              <li>Basic functionality</li>
            </ul>

            <h3>Analytics Cookies</h3>
            <p>
              We use Plausible Analytics, a privacy-focused analytics tool, to understand how visitors
              interact with our website. Unlike traditional analytics, Plausible:
            </p>
            <ul>
              <li>Does not use cookies for tracking</li>
              <li>Does not collect personal data</li>
              <li>Does not track users across websites</li>
              <li>Is fully compliant with GDPR, CCPA, and PECR</li>
            </ul>
            <p>
              Plausible collects anonymous, aggregate data including page views, referral sources,
              and general device/browser information. No individual user tracking occurs.
            </p>

            <h3>Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as:
            </p>
            <ul>
              <li>Remembering your preferences and settings</li>
              <li>Enabling embedded content (such as YouTube videos)</li>
              <li>Providing social media sharing features</li>
            </ul>

            <h3>Third-Party Cookies</h3>
            <p>
              Some cookies may be placed by third-party services that appear on our pages. These may include:
            </p>
            <ul>
              <li><strong>YouTube:</strong> Embedded video content (we use privacy-enhanced embedding when possible)</li>
              <li><strong>Social media platforms:</strong> Share buttons and embedded content</li>
            </ul>
            <p>
              These third parties have their own privacy policies governing how they use cookies.
              We encourage you to review their policies for more information.
            </p>
            <p>
              Note: We use Plausible Analytics which does not set any cookies, making our analytics
              fully privacy-respecting.
            </p>

            <h2>4. How Long Do Cookies Last?</h2>
            <p>Cookies can be either &ldquo;session&rdquo; or &ldquo;persistent&rdquo; cookies:</p>
            <ul>
              <li>
                <strong>Session cookies:</strong> These are temporary cookies that expire when you close
                your browser. They are used to remember you during a single browsing session.
              </li>
              <li>
                <strong>Persistent cookies:</strong> These remain on your device for a set period or
                until you delete them. They are used to remember your preferences across multiple visits.
              </li>
            </ul>

            <h2>5. Managing Your Cookie Preferences</h2>
            <p>
              You have several options for managing cookies:
            </p>

            <h3>Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul>
              <li>View what cookies are stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block cookies from all websites or specific sites</li>
              <li>Set preferences for first-party vs. third-party cookies</li>
            </ul>
            <p>
              Please note that blocking or deleting cookies may affect your experience on our website
              and limit certain functionality.
            </p>

            <h3>Browser-Specific Instructions</h3>
            <p>
              For information on how to manage cookies in your browser, visit:
            </p>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h3>Our Analytics Approach</h3>
            <p>
              We use Plausible Analytics, which is privacy-focused and does not require cookies.
              This means there is no need to opt out of analytics tracking on our site - your
              privacy is protected by default.
            </p>

            <h2>6. Do Not Track Signals</h2>
            <p>
              Some browsers have a &ldquo;Do Not Track&rdquo; feature that signals to websites that you
              do not want your online activity tracked. Currently, there is no uniform standard for
              responding to these signals, and our website does not currently respond to Do Not Track
              signals.
            </p>

            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for other operational, legal, or regulatory reasons. When we make changes, we will
              update the &ldquo;Effective Date&rdquo; at the top of this page.
            </p>
            <p>
              We encourage you to review this policy periodically to stay informed about our use of
              cookies.
            </p>

            <h2>8. More Information</h2>
            <p>
              For more information about cookies and how they work, you can visit:
            </p>
            <ul>
              <li>
                <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">
                  All About Cookies
                </a>
              </li>
              <li>
                <a href="https://www.cookiesandyou.com/" target="_blank" rel="noopener noreferrer">
                  Cookies and You
                </a>
              </li>
            </ul>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
