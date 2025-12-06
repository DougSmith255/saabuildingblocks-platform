/**
 * Privacy Policy Page
 * Legal page with privacy policy content
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
  title: 'Privacy Policy | Smart Agent Alliance',
  description: 'Learn how Smart Agent Alliance collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 flex items-center justify-center"
        style={{ minHeight: '40vh', paddingTop: 'calc(var(--header-height) + 2rem)' }}
      >
        <div className="max-w-[1200px] mx-auto w-full text-center">
          <H1>Privacy Policy</H1>
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
              Smart Agent Alliance (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website
              smartagentalliance.com. This Privacy Policy explains how we collect, use, disclose, and protect
              your personal information when you visit our website and use our services.
            </p>
            <p>
              By accessing or using our website, you agree to the terms of this Privacy Policy. If you do not
              agree with these terms, please do not use our website.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>Information You Provide Directly</h3>
            <p>We may collect information you voluntarily provide, including:</p>
            <ul>
              <li>Name and email address when you subscribe to our newsletter</li>
              <li>Contact information when you submit a form or inquiry</li>
              <li>Phone number if you opt in to receive SMS communications</li>
              <li>Any other information you choose to share with us</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>IP address and approximate geographic location</li>
              <li>Browser type, version, and operating system</li>
              <li>Device information (desktop, mobile, tablet)</li>
              <li>Pages visited, time spent on pages, and navigation patterns</li>
              <li>Referring website or source that led you to our site</li>
            </ul>

            <h3>Information from Third-Party Content</h3>
            <p>
              Our website may contain embedded content from third parties (such as YouTube videos).
              When you interact with this content, those third parties may collect information about
              you according to their own privacy policies.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our website and services</li>
              <li>Send newsletters, educational content, and updates you have requested</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze website usage to improve user experience</li>
              <li>Protect against fraud, abuse, and security threats</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Email and SMS Communications</h2>
            <p>
              If you subscribe to our newsletter or submit a form, you may receive emails containing
              real estate tips, educational content, promotional offers, and service updates.
            </p>
            <p>
              If you provide your phone number and consent to SMS communications, you may receive
              text messages with similar content.
            </p>
            <p><strong>Opting Out:</strong></p>
            <ul>
              <li>You can unsubscribe from emails at any time by clicking the &ldquo;unsubscribe&rdquo; link in any email</li>
              <li>You can opt out of SMS messages by replying STOP to any text message</li>
            </ul>
            <p>We do not sell, rent, or share your contact information with third parties for their marketing purposes.</p>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze traffic and usage patterns through Google Analytics</li>
              <li>Improve website functionality and performance</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Note that disabling cookies may
              affect some website functionality.
            </p>
            <p>
              Google Analytics collects anonymous data about website visitors. You can learn more about
              how Google uses this data at{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google&apos;s Privacy Policy
              </a>.
            </p>

            <h2>6. How We Share Your Information</h2>
            <p>
              We do <strong>not sell or rent</strong> your personal information. We may share your
              information with:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third parties that help us operate our website
                (such as hosting providers, email services, and analytics tools)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or to protect
                our rights and safety
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale
                of assets
              </li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              described in this policy, unless a longer retention period is required by law.
            </p>
            <ul>
              <li>Email subscriber data is retained until you unsubscribe</li>
              <li>Analytics data is retained according to our analytics provider&apos;s policies</li>
              <li>Contact form submissions are retained for a reasonable period to respond to inquiries</li>
            </ul>

            <h2>8. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Withdraw consent to marketing communications</li>
              <li>Object to certain processing of your information</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a>.
            </p>

            <h2>9. California Privacy Rights</h2>
            <p>
              If you are a California resident, you have additional rights under the California
              Consumer Privacy Act (CCPA), including the right to know what personal information
              we collect and how it is used, and the right to request deletion of your information.
            </p>
            <p>
              To make a CCPA request, contact us at{' '}
              <a href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a>.
            </p>

            <h2>10. Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you believe we have collected
              information from a child under 13, please contact us immediately.
            </p>

            <h2>11. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from
              unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2>12. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the privacy practices of these external sites. We encourage you to review the privacy
              policies of any third-party sites you visit.
            </p>

            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make changes, we will
              update the &ldquo;Effective Date&rdquo; at the top of this page. We encourage you to
              review this policy periodically.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices,
              please contact us at:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a>
            </p>
            <p>
              <strong>Website:</strong> smartagentalliance.com
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
