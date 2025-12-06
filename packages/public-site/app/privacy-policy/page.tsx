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
        <div className="max-w-[900px] mx-auto">
          <div className="legal-content blog-content">
            <p><strong>Effective Date:</strong> July 8, 2025<br /><strong>Last Updated:</strong> July 8, 2025</p>

            <h2>1. Who We Are</h2>
            <p>This website, Smart Agent Alliance ("we," "us," "our"), operates at <a href="https://smartagentalliance.com" target="_blank" rel="noopener noreferrer">https://smartagentalliance.com</a>. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our site.</p>

            <h2>2. What We Collect</h2>

            <h3>a) Information You Provide</h3>
            <p>We collect personal data you share directly, including:</p>
            <ul>
              <li><strong>Comments:</strong> Name, email, and optionally a website URL</li>
              <li><strong>User Accounts:</strong> If you register, we collect your name, email, and profile information</li>
              <li><strong>Orders:</strong> For purchases, we collect billing and payment details</li>
            </ul>

            <h3>b) Automatically Collected Data</h3>
            <p>We automatically collect some technical data, including:</p>
            <ul>
              <li><strong>IP address, browser type, and device info</strong> for analytics and spam prevention</li>
              <li><strong>Cookies</strong> for sessions, form autofill, cart activity, and tracking</li>
              <li><strong>Google Analytics data</strong> to understand visitor behavior and improve site performance</li>
            </ul>

            <h3>c) Embedded Third-Party Content</h3>
            <p>Embedded content (e.g., YouTube videos, social media posts) may collect data about you just as if you visited the third-party site directly. These services may use cookies, tracking pixels, or other technologies.</p>

            <h2>3. How We Use Your Data</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>Processing payments and fulfilling orders</li>
              <li>Managing your account and preferences</li>
              <li>Sending email newsletters, offers, and educational content (if subscribed)</li>
              <li>Sending marketing or informational text messages (if you've provided your phone number)</li>
              <li>Preventing spam and improving website security</li>
              <li>Analyzing website performance and user behavior</li>
              <li>Meeting any legal, tax, or regulatory obligations</li>
            </ul>

            <h2>4. Email and SMS Communication</h2>
            <p>If you submit a form on our site, you may receive occasional emails or text messages from Smart Agent Alliance. These messages may include real estate tips, promotional offers, free training, and updates on our services.</p>
            <p>You can unsubscribe from emails at any time using the link in our messages.<br />You may also opt out of text messages by replying <strong>STOP</strong> to any SMS you receive.</p>
            <p>We never sell your contact information or use it for unrelated marketing.</p>

            <h2>5. Cookies &amp; Tracking</h2>
            <p>We use cookies to improve your experience on the site. These may include:</p>
            <ul>
              <li><strong>Comment cookies:</strong> Save your info for future comment submissions (1 year)</li>
              <li><strong>Login cookies:</strong> Store your session details (2 days or 2 weeks with "Remember Me")</li>
              <li><strong>Shopping cart cookies:</strong> Track cart contents during your visit</li>
              <li><strong>Analytics cookies:</strong> Gather anonymous usage data</li>
            </ul>
            <p>You can disable cookies in your browser at any time.</p>

            <h2>6. Who We Share Your Data With</h2>
            <p>We do <strong>not sell or rent</strong> your personal data. However, we may share it with third-party services that help us operate efficiently, including:</p>
            <ul>
              <li><strong>Google Analytics</strong> (for website traffic insights)</li>
              <li><strong>Akismet</strong> (for spam detection)</li>
              <li><strong>WooCommerce and payment processors</strong> like PayPal (to process orders)</li>
              <li><strong>Shipping carriers</strong> (if applicable for product delivery)</li>
            </ul>
            <p>These third parties have their own privacy policies which govern how they handle your data.</p>

            <h2>7. Data Retention</h2>
            <p>We retain information for as long as necessary:</p>
            <ul>
              <li><strong>Comments and user accounts:</strong> Stored indefinitely unless deleted by you</li>
              <li><strong>Order data:</strong> Kept for accounting and compliance (typically 7 years)</li>
              <li><strong>Cookies:</strong> Duration varies (see Section 5)</li>
            </ul>
            <p>If you would like your personal information deleted, you may contact us at any time.</p>

            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Request access to the personal data we store</li>
              <li>Ask us to update, correct, or delete your information</li>
              <li>Withdraw consent to marketing communications</li>
            </ul>
            <p>To make a request, contact us at: <strong><a href="mailto:doug@smartagentalliance.com">doug@smartagentalliance.com</a></strong></p>

            <h2>9. Data Protection &amp; Security</h2>
            <p>We take reasonable steps to safeguard your personal data. However, no website or online service can guarantee 100% security. You are responsible for keeping your login information confidential.</p>

            <h2>10. Policy Updates</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated effective date.</p>

            <h2>11. Contact Us</h2>
            <p>For any questions or concerns about this policy, please contact:<br /><strong><a href="mailto:karrie.hill@exprealty.com">karrie.hill@exprealty.com</a></strong></p>
          </div>
        </div>
      </section>
    </main>
  );
}
