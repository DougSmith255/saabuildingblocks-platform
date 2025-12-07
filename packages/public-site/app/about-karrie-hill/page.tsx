'use client';

import { H1, H2, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
import Image from 'next/image';

/**
 * About Karrie Hill Page
 * Personal bio and background
 */
export default function AboutKarrieHill() {
  const highlights = [
    { label: "Role", value: "Co-Founder, Smart Agent Alliance" },
    { label: "Title", value: "Team Leader & eXp Certified Mentor" },
    { label: "Education", value: "JD, UC Berkeley Law (Top 4%)" },
    { label: "Location", value: "Tiburon, Marin County, CA" }
  ];

  const expertise = [
    "Sponsorship Strategy",
    "Team Building",
    "Career Development",
    "YouTube Marketing",
    "Negotiation",
    "Financial Analysis"
  ];

  const achievements = [
    "Six-figure income in first full year through YouTube marketing",
    "#1 Agent YouTube channel in Marin County, California",
    "Featured on HGTV and in national magazines for interior design",
    "Frequent guest on KDOW \"The Real Estate Report\"",
    "30+ year Marin County resident"
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            KARRIE HILL, JD
          </H1>
          <p className="text-amber-400 text-lg mt-2" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both' }}>
            Co-Founder, Smart Agent Alliance
          </p>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            Team Leader, eXp Certified Mentor, and UC Berkeley Law Graduate
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Photo */}
            <div className="lg:w-1/3">
              <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-amber-400/30">
                <Image
                  src="https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Copy-of-Profiles-Momma.png"
                  alt="Karrie Hill"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-900">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">About Karrie</H2>

          <div className="space-y-6 text-gray-300">
            <p>
              Karrie Hill is co-founder of Smart Agent Alliance and serves as a Team Leader, eXp Certified Mentor,
              and part of the Wolf Pack at eXp Realty. She transitioned from practicing law and professional stock
              trading to become a real estate agent, achieving <strong className="text-white">six-figure income in her
              first full year</strong> through YouTube-based marketing.
            </p>

            <p>
              She graduated in the <strong className="text-white">top 4% of her class at UC Berkeley Law</strong> and
              holds degrees in Economics and Jurisprudence. Before becoming a realtor, Karrie practiced law, bought
              and sold homes, and spent over a decade as a professional stock trader.
            </p>

            <p>
              Karrie loves providing clients and agents with unmatched value. She has the <strong className="text-white">
              #1 agent YouTube channel in Marin County, California</strong>. She is certified in Real Estate Negotiation,
              Home Marketing, Relocations and Express Offers (cash offers).
            </p>

            <p>
              As Smart Agent Alliance's agent information expert, she authors blog content covering sponsorship insights,
              mentorship guidance, and success strategies for real estate professionals seeking to build sustainable
              careers at eXp.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">Achievements</H2>

          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-amber-400 text-xl">✓</div>
                <p className="text-gray-300">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">Areas of Expertise</H2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {expertise.map((skill, index) => (
              <CyberCardHolographic key={index} className="p-4 text-center">
                <p className="text-white font-medium">{skill}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[900px] mx-auto text-center">
          <H2 className="mb-8">Outside of Work</H2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A 30+ year Marin County resident living in Tiburon with her husband and two dogs - Baxter and Lily.
            Karrie is a mother of three and grandmother. Her creative talents have been featured on HGTV and in
            national magazines for interior design work. She loves helping agents achieve their wildest hopes
            and dreams in the real estate business.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Connect With Karrie</H2>
          <p className="text-gray-400 mb-8">
            Ready to get mentorship from Karrie and join the Wolf Pack?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Join Our Team
            </CTAButton>
            <CTAButton href="/our-exp-team/">
              Meet The Team
            </CTAButton>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp2025 {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </main>
  );
}
