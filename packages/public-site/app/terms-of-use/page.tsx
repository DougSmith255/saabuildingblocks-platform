/**
 * Terms of Use Page
 * Legal page with terms of use content
 *
 * Design System:
 * - Uses Master Controller H1 component for page title
 * - Content styled with blog-content class for consistent typography
 * - Background: inherits star background from layout
 * - Max width container for readability
 */

import { H1 } from '@saa/shared/components/saa';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | Smart Agent Alliance',
  description: 'Read the terms and conditions governing the use of Smart Agent Alliance website and services.',
};

export default function TermsOfUsePage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 flex items-center justify-center"
        style={{ minHeight: '40vh', paddingTop: 'calc(var(--header-height) + 2rem)' }}
      >
        <div className="max-w-[1200px] mx-auto w-full text-center">
          <H1>Terms of Use</H1>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="legal-content blog-content">
            <p className="legal-meta">
              <strong>Effective Date:</strong> December 6, 2025
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing Smart Agent Alliance (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo;
              or &ldquo;website&rdquo;) at smartagentalliance.com, you agree to be bound by these
              Terms of Use. Your continued use of the website confirms that you have read, understood,
              and accepted:
            </p>
            <ul>
              <li>These Terms of Use</li>
              <li>Our <Link href="/privacy-policy">Privacy Policy</Link></li>
              <li>Our <Link href="/disclaimer">Disclaimer</Link></li>
            </ul>
            <p>
              If you do not agree with any part of these Terms, please do not use this website.
            </p>

            <h2>2. Eligibility</h2>
            <p>This website is intended for users 18 years of age or older.</p>
            <ul>
              <li>Persons under 13 years of age are strictly prohibited from using or registering for this site.</li>
              <li>By using this website, you represent that you meet this age requirement.</li>
            </ul>

            <h2>3. Modifications to Terms</h2>
            <p>We reserve the right to update or modify these Terms at any time.</p>
            <ul>
              <li>Changes take effect immediately when published on this website.</li>
              <li>The &ldquo;Effective Date&rdquo; at the top of this page indicates when these Terms were last updated.</li>
              <li>Your continued use of the website after any changes constitutes acceptance of the revised Terms.</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              All content on this website is our exclusive intellectual property or used with permission,
              including but not limited to:
            </p>
            <ul>
              <li>Source code, databases, and website functionality</li>
              <li>Website designs, software, audio, video, text, graphics, and images</li>
              <li>Logos, trademarks, service marks, and blog content</li>
            </ul>

            <h3>Prohibited Activities</h3>
            <p>You may NOT:</p>
            <ul>
              <li>Copy, reproduce, distribute, or exploit our content without written permission</li>
              <li>Sell, transfer, or share any free materials we provide</li>
              <li>Attempt to hack, modify, or interfere with the website&apos;s functionality</li>
              <li>Impersonate another user or misrepresent your identity</li>
              <li>Use this website for unlawful, fraudulent, or harmful activities</li>
              <li>Use automated systems (bots, scrapers) to access the website without permission</li>
            </ul>
            <p>
              We do not grant you any ownership rights or proprietary licenses to our content
              unless explicitly stated in writing.
            </p>

            <h2>5. User-Generated Content</h2>
            <p>
              If you submit any content to our website (such as form submissions or feedback), you grant
              us a non-exclusive, royalty-free, perpetual license to use, modify, and display that content
              in connection with our services.
            </p>
            <p>
              You represent that any content you submit does not violate the rights of any third party
              and does not contain unlawful, defamatory, or harmful material.
            </p>

            <h2>6. Website Availability</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Modify, update, or remove website content at any time without notice</li>
              <li>Adjust prices, discontinue services, or temporarily/permanently suspend the website</li>
              <li>Restrict access to certain features or the entire website</li>
            </ul>
            <p>
              We do not guarantee uninterrupted access to the website. You are solely responsible for
              how you use the information on this website.
            </p>
            <p>We are not liable for:</p>
            <ul>
              <li>Any losses, damages, or inconveniences caused by website unavailability</li>
              <li>Your reliance on the information provided on the website</li>
              <li>Technical issues, errors, or security breaches beyond our reasonable control</li>
            </ul>

            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. These links are provided for your
              convenience only. We do not control, endorse, or assume responsibility for the content,
              privacy policies, or practices of any third-party websites.
            </p>

            <h2>8. Disclaimer of Warranties</h2>
            <p>
              This website and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
              without any warranties of any kind, either express or implied, including but not limited to:
            </p>
            <ul>
              <li>Warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or completeness of content</li>
            </ul>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Smart Agent Alliance and its owners, employees,
              and affiliates shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising from:
            </p>
            <ul>
              <li>Your use of or inability to use the website</li>
              <li>Any errors or omissions in the content</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Any third-party conduct on the website</li>
            </ul>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Smart Agent Alliance and its owners,
              employees, and affiliates from any claims, damages, losses, or expenses (including
              reasonable attorney&apos;s fees) arising from:
            </p>
            <ul>
              <li>Your use of the website</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of a third party</li>
            </ul>

            <h2>11. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of
              California, United States, without regard to its conflict of law principles. While our
              website serves a global audience and eXp Realty operates in multiple countries, any legal
              matters will be governed by California law.
            </p>

            <h2>12. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or your use of the website shall be resolved through
              binding arbitration in the State of California. By agreeing to these Terms, you waive any
              right to participate in a class action lawsuit or class-wide arbitration.
            </p>
            <p>
              For users outside the United States, you agree that any disputes will still be subject
              to California jurisdiction and arbitration procedures.
            </p>

            <h2>13. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision
              shall be limited or eliminated to the minimum extent necessary, and the remaining provisions
              shall remain in full force and effect.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Use, please contact us at:
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
