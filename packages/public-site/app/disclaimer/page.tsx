/**
 * Disclaimer Page
 * Legal page with disclaimer content
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
  title: 'Disclaimer | Smart Agent Alliance',
  description: 'Important disclaimers about the information provided on Smart Agent Alliance website.',
};

export default function DisclaimerPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 flex items-center justify-center"
        style={{ minHeight: '40vh', paddingTop: 'calc(var(--header-height) + 2rem)' }}
      >
        <div className="max-w-[1200px] mx-auto w-full text-center">
          <H1>Disclaimer</H1>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="legal-content blog-content">
            <p className="legal-meta">
              <strong>Effective Date:</strong> December 6, 2025
            </p>

            <h2>1. General Information</h2>
            <p>
              The content on Smart Agent Alliance (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo;
              or &ldquo;website&rdquo;) at smartagentalliance.com and our social media platforms is
              provided for <strong>informational, educational, and entertainment purposes only</strong>.
            </p>
            <p>
              None of the information on this website should be considered professional, legal, financial,
              tax, medical, or any other form of advice. The content creators are not licensed attorneys,
              CPAs, financial advisors, or certified professionals in these fields.
            </p>
            <p>
              <strong>Before making any decisions</strong> based on the information provided, you should
              consult with a qualified professional in the relevant field.
            </p>

            <h2>2. Real Estate Information</h2>
            <p>
              While we provide information about real estate careers, brokerages, and industry practices,
              this information:
            </p>
            <ul>
              <li>Is for general educational purposes only</li>
              <li>May not reflect current laws, regulations, or market conditions in your area</li>
              <li>Should not replace advice from licensed real estate professionals in your jurisdiction</li>
              <li>May vary significantly based on state and local regulations</li>
            </ul>
            <p>
              Real estate licensing requirements, brokerage structures, and commission models vary by
              state and are subject to change. Always verify information with your state&apos;s real
              estate commission or a licensed professional.
            </p>

            <h2>3. No Guarantees</h2>
            <p>
              We make reasonable efforts to ensure that the information presented is accurate and up
              to date. However, we make no warranties regarding:
            </p>
            <ul>
              <li>The accuracy, completeness, or reliability of the information</li>
              <li>The results you may achieve by using the information</li>
              <li>The timeliness of updates, as information can change rapidly</li>
              <li>The applicability of information to your specific situation</li>
            </ul>
            <p>
              By using this website, you acknowledge and accept that any reliance on the content is
              at your own risk. Your success or failure depends on your personal efforts, circumstances,
              and external factors beyond our control.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>We are not liable for any loss, damage, or harm arising from:</p>
            <ul>
              <li>Your use of or reliance on information provided on this site</li>
              <li>Any errors, omissions, or inaccuracies in the content</li>
              <li>Any decisions made based on the content</li>
              <li>Any technical issues, disruptions, or failures affecting website access</li>
              <li>Actions taken or not taken based on information from this website</li>
            </ul>

            <h2>5. Third-Party Links and Advertisements</h2>
            <p>Our website may contain:</p>
            <ul>
              <li>External links to third-party websites</li>
              <li>Advertisements promoting products or services</li>
              <li>Embedded content from other platforms (such as YouTube)</li>
            </ul>
            <p>
              We do not control, verify, or endorse third-party content, and we are not responsible
              for its accuracy, reliability, or availability. Clicking on external links or engaging
              with third-party content is at your own risk.
            </p>

            <h2>6. eXp Realty Affiliation</h2>
            <p>
              Smart Agent Alliance is operated by Karrie Hill and Doug Smart, independent real estate
              agents (Realtors) affiliated with eXp Realty. As independent contractors, we are not
              employees of eXp Realty.
            </p>
            <p>
              Content about eXp Realty reflects our personal experiences and opinions as eXp agents.
              We may receive compensation through eXp Realty&apos;s sponsorship and revenue share
              programs when agents join eXp Realty through our team. This relationship is disclosed
              in accordance with applicable regulations.
            </p>
            <p>
              eXp Realty operates globally, including in the United States, Canada, Mexico, the United
              Kingdom, and many other countries. Our content may reference eXp&apos;s global presence,
              but specific programs, commission structures, and regulations vary by location.
            </p>
            <p>
              Our content about other brokerages is based on publicly available information and our
              research. We encourage you to conduct your own due diligence when evaluating any brokerage.
            </p>

            <h2>7. Testimonials and User Experiences</h2>
            <p>
              Testimonials on our website are from real users of our products and services. While these
              testimonials reflect individual experiences, they do not guarantee that you will achieve
              the same results.
            </p>
            <p>Individual results vary based on:</p>
            <ul>
              <li>Personal effort and dedication</li>
              <li>Market conditions in your area</li>
              <li>Prior experience and skills</li>
              <li>Other factors unique to your situation</li>
            </ul>

            <h2>8. Changes to This Disclaimer</h2>
            <p>
              We may update this Disclaimer from time to time. Changes will be posted on this page
              with an updated effective date. Your continued use of the website after changes are
              posted constitutes acceptance of the revised Disclaimer.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Disclaimer, please contact us at:
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
