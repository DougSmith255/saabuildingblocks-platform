'use client';

import { H1, H2, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
import Image from 'next/image';

/**
 * About Doug Smart Page
 * Personal bio and background
 */
export default function AboutDougSmart() {
  const highlights = [
    { label: "Role", value: "Co-Founder, Smart Agent Alliance" },
    { label: "Title", value: "Full-Stack Developer & Management Systems Director" },
    { label: "Ranking", value: "Top 0.1% eXp Team Builders (2025)" },
    { label: "Location", value: "San Jose, California" }
  ];

  const skills = [
    "Website Development",
    "Agent Webpages",
    "Marketing Automations",
    "Digital Infrastructure",
    "Branding & Design",
    "Passive Revenue Systems"
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            DOUG SMART
          </H1>
          <p className="text-amber-400 text-lg mt-2" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both' }}>
            Co-Founder, Smart Agent Alliance
          </p>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            Full-Stack Developer building the digital infrastructure that powers the Wolf Pack
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
                  src="https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Copy-of-Profiles-Me-2.png"
                  alt="Doug Smart"
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
          <H2 className="text-center mb-8">About Doug</H2>

          <div className="space-y-6 text-gray-300">
            <p>
              Doug Smart is co-founder of Smart Agent Alliance, part of the rapidly expanding Wolf Pack sponsor team at eXp Realty.
              He ranks in the <strong className="text-white">top 0.1% of eXp Realty team builders in 2025</strong>.
            </p>

            <p>
              Doug holds a Bachelor's degree in Industrial Design with a Business minor. During college, he gained hands-on
              construction experience building multi-million dollar homes, developing a strong work ethic and attention to detail
              that carries through to his current work.
            </p>

            <p>
              As Full-Stack Developer and Management Systems Director for Smart Agent Alliance, Doug designs and develops the
              organization's entire digital infrastructure - including the website, agent webpages, automations, and more.
              In fact, he built this entire website.
            </p>

            <p>
              His work centers on creating passive revenue systems for agents while helping them elevate their branding, marketing,
              and creative presence to compete effectively in real estate.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">What Doug Builds</H2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <CyberCardHolographic key={index} className="p-4 text-center">
                <p className="text-white font-medium">{skill}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[900px] mx-auto text-center">
          <H2 className="mb-8">Outside of Work</H2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Based in San Jose, California, Doug maintains a disciplined lifestyle. He's a huge fan of basketball
            and regularly hits the gym - essentially the modern-day equivalent to Arnold Schwarzenegger
            (if he never took steroids).
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Connect With Doug</H2>
          <p className="text-gray-400 mb-8">
            Ready to join the Wolf Pack and leverage Doug's digital systems for your real estate business?
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
