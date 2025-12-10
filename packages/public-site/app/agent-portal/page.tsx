'use client';

import { useState } from 'react';
import { H1, H2, CTAButton, GenericCard, FAQ } from '@saa/shared/components/saa';

// Section types
type SectionId = 'dashboard' | 'start-here' | 'calls' | 'templates' | 'courses' | 'production' | 'revshare' | 'exp-links' | 'new-agents';

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'start-here', label: 'Start Here', icon: '◈' },
  { id: 'calls', label: 'Team Calls', icon: '◉' },
  { id: 'templates', label: 'Templates', icon: '◫' },
  { id: 'courses', label: 'Elite Courses', icon: '◬' },
  { id: 'production', label: 'Production', icon: '◭' },
  { id: 'revshare', label: 'RevShare', icon: '◮' },
  { id: 'exp-links', label: 'eXp Links', icon: '◯' },
  { id: 'new-agents', label: 'New Agents', icon: '◠' },
];

// Dashboard quick access cards
const dashboardCards = [
  { id: 'start-here' as SectionId, title: 'Start Here', description: 'New to the team? Start here', icon: '🚀' },
  { id: 'calls' as SectionId, title: 'Team Calls & More', description: 'Live and recorded team calls', icon: '📹' },
  { id: 'templates' as SectionId, title: 'Exclusive Templates', description: 'Marketing templates and more', icon: '📢' },
  { id: 'courses' as SectionId, title: 'Elite Courses', description: 'Social Agent Academy, Flipping Houses, etc.', icon: '🎓' },
  { id: 'production' as SectionId, title: 'Quickstart Production', description: 'Landing Pages and Email Drips', icon: '👥' },
  { id: 'revshare' as SectionId, title: 'Quickstart RevShare', description: 'Grow your downline, no experience needed', icon: '💰' },
  { id: 'exp-links' as SectionId, title: 'eXp Links & Questions', description: 'Have an eXp question? Start here', icon: '🔗' },
  { id: 'new-agents' as SectionId, title: 'New Agents', description: 'Information tailored for you', icon: '🏃' },
];

export default function AgentPortal() {
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <section
        className="relative px-4 sm:px-8 md:px-12 pt-32 pb-12 flex items-center justify-center"
      >
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.3s">AGENT PORTAL</H1>
        </div>

        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </section>

      {/* Main Dashboard Layout */}
      <div className="max-w-[2500px] mx-auto px-4 sm:px-8 md:px-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-lg border border-[#ffd700]/30 bg-black/30 backdrop-blur-sm text-body mb-4"
          >
            <span className="text-[#ffd700]">☰</span>
            <span>Menu</span>
          </button>

          {/* Sidebar Navigation */}
          <aside
            className={`
              ${sidebarOpen ? 'block' : 'hidden'} lg:block
              w-full lg:w-64 flex-shrink-0
            `}
          >
            <nav
              className="sticky top-24 rounded-xl p-4 space-y-2 bg-black/30 backdrop-blur-sm border border-[#ffd700]/15"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300
                    ${activeSection === item.id
                      ? 'bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/30'
                      : 'text-body hover:text-[#e5e4dd] hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Dashboard View */}
            {activeSection === 'dashboard' && (
              <DashboardView onNavigate={setActiveSection} />
            )}

            {/* Start Here */}
            {activeSection === 'start-here' && <StartHereSection />}

            {/* Team Calls */}
            {activeSection === 'calls' && <TeamCallsSection />}

            {/* Templates */}
            {activeSection === 'templates' && <TemplatesSection />}

            {/* Elite Courses */}
            {activeSection === 'courses' && <CoursesSection />}

            {/* Production */}
            {activeSection === 'production' && <ProductionSection />}

            {/* RevShare */}
            {activeSection === 'revshare' && <RevShareSection />}

            {/* eXp Links */}
            {activeSection === 'exp-links' && <ExpLinksSection />}

            {/* New Agents */}
            {activeSection === 'new-agents' && <NewAgentsSection />}
          </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================================
// Dashboard View - Quick Access Cards
// ============================================================================
function DashboardView({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="text-left group"
          >
            <GenericCard className="h-full" hover padding="md">
              <div className="space-y-3">
                <span className="text-4xl">{card.icon}</span>
                <h3 className="text-h5 group-hover:text-[#ffd700] transition-colors">
                  {card.title}
                </h3>
                <p className="text-caption">
                  {card.description}
                </p>
              </div>
            </GenericCard>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Start Here Section
// ============================================================================
function StartHereSection() {
  const faqItems = [
    {
      question: '1. How to Use Our Tools',
      answer: `SAA assets are fully customizable to speed up your workflow. You'll mostly see Karrie Hill's actual assets, which you can customize to make it your own in Canva.

If you haven't yet decided how you want to brand yourself, it's a good idea to do that before you begin customizing SAA assets. Navigate to the Social Agent Academy Pro and review personal branding.

We continually add new assets and improve what's already available. If you have questions, concerns, or ideas for assets you'd like to see, please contact us.`
    },
    {
      question: '2. Where to Get Your Questions Answered',
      answer: `It's normal to have lots of questions when you're new to eXp. There's a lot to learn but you don't need to learn it all today!

As questions come to your mind, here's your path for who to ask first:

1. eXp World Welcome – Hit "Chat", then click on the little robot icon at the bottom and ask your question
2. eXp World – If it's a question about production, go to Your State Broker's room
3. eXp World – If it's not a question about production, go to Expert Care
4. Your SAA sponsor
5. Your next closest Upline sponsor`
    },
    {
      question: '3. Commonly Needed Resources & Tools',
      answer: `eXp provides more than one way to get to the SAME tools, so try not to feel overwhelmed. Access everything eXp United States through us.exprealty.com.

Key tools to familiarize yourself with:
• Comparative Market Analysis (CMA) – Use RPR (free with NAR membership)
• eXp World – For onboarding problems, state broker questions, tech support
• BoldTrail (kvCore) – Website and CRM management
• Skyslope – Electronic document signing and deal management
• Workplace – Referral groups and eXp communication
• eXp Agent Healthcare – Health insurance options
• Regus Office Centers – When you need office space
• eXp Exclusives – Search for off-market properties via Zenlist`
    },
    {
      question: '4. Task Management with Asana',
      answer: `If you don't already use the free platform Asana for day-to-day task management, we highly recommend it. It helps you stay organized and on top of your daily tasks and long-term goals.`
    },
    {
      question: '5. Lead with Value',
      answer: `Here's the number 1 tip from successful agents: Give to get. Plan to provide upfront value to people. They will appreciate your efforts and remember you when it comes time to buy or sell.

Simply offering an MLS automatic search isn't enough these days. Instead, focus on delivering unique value that only realtors can easily access:

• Newsletter Sign Up – Create interesting market reports with charts and statistics
• Instant Home Valuation Sign Up – Make it easy for people to get a home valuation
• Coming Soon Homes Sign Up – Share "Coming Soon" status homes before they hit the market`
    }
  ];

  return (
    <SectionWrapper title="Start Here">
      <FAQ items={faqItems} allowMultiple defaultOpenIndex={0} />
    </SectionWrapper>
  );
}

// ============================================================================
// Team Calls Section
// ============================================================================
function TeamCallsSection() {
  return (
    <SectionWrapper title="Team Calls & More">
      <div className="space-y-8">
        <h3 className="text-h3 text-center mb-6">Mastermind Calls</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GenericCard padding="md">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📹</span>
                <h4 className="text-h5 text-[#ffd700]">Connor Steinbrook Mastermind</h4>
              </div>
              <p className="text-body">Mindset-based discussions and teachings</p>
              <p className="text-body"><strong>Mondays</strong> at 8:00 am (PST)</p>
              <a
                href="https://zoom.us/j/4919666038?pwd=487789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
              >
                Join Zoom Call
              </a>
              <p className="text-caption">Password: 487789</p>
            </div>
          </GenericCard>

          <GenericCard padding="md">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📹</span>
                <h4 className="text-h5 text-[#8300E9]">Mike Sherrard Mastermind</h4>
              </div>
              <p className="text-body">Production-based discussions and teachings</p>
              <p className="text-body"><strong>Tuesdays</strong> at 2:00 pm (PST)</p>
              <a
                href="https://us02web.zoom.us/j/88399766561"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#8300E9]/10 border border-[#8300E9]/30 rounded-lg text-[#8300E9] hover:bg-[#8300E9]/20 transition-colors"
              >
                Join Zoom Call
              </a>
            </div>
          </GenericCard>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Templates Section
// ============================================================================
function TemplatesSection() {
  return (
    <SectionWrapper title="Customizable Canva Assets">
      <div className="space-y-8">
        <GenericCard padding="lg">
          <div className="space-y-6">
            <h3 className="text-h3 text-[#ffd700]">Using SAA Canva Templates</h3>
            <p className="text-body">Use your eXp account credentials to login to Canva</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h4 className="text-h5 mb-4">Templates Available For:</h4>
                <ul className="space-y-2 text-body">
                  <li>• Frames</li>
                  <li>• Buyer / Seller Presentations</li>
                  <li>• Self Promo / Testimonials / Marketing</li>
                  <li>• New Listing / For Sale</li>
                  <li>• Just Sold / Under Contract</li>
                  <li>• Buyer/Seller Tips</li>
                  <li>• Open House</li>
                  <li>• Thinking About Selling?</li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center p-6 rounded-xl border border-[#ffd700]/20">
                  <span className="text-5xl mb-4 block">🎨</span>
                  <p className="text-body">Access templates through your eXp Canva account</p>
                </div>
              </div>
            </div>
          </div>
        </GenericCard>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Elite Courses Section
// ============================================================================
function CoursesSection() {
  return (
    <SectionWrapper title="Elite Courses">
      <p className="text-center text-body mb-8">Refer to Wolf Pack emails to find login details</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GenericCard padding="md" centered>
          <div className="text-center space-y-4">
            <span className="text-5xl">🐺</span>
            <h3 className="text-h5 text-[#ffd700]">Wolf Pack Skool Portal & HUB</h3>
            <p className="text-body">Access the Wolfpack HUB in courses</p>
          </div>
        </GenericCard>

        <GenericCard padding="md" centered>
          <div className="text-center space-y-4">
            <span className="text-5xl">📱</span>
            <h3 className="text-h5 text-[#ffd700]">Social Agent Academy</h3>
            <p className="text-body">Learn how to dominate online</p>
          </div>
        </GenericCard>

        <GenericCard padding="md" centered>
          <div className="text-center space-y-4">
            <span className="text-5xl">🏠</span>
            <h3 className="text-h5 text-[#ffd700]">Investor Army</h3>
            <p className="text-body">Learn to flip houses</p>
          </div>
        </GenericCard>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Production Section
// ============================================================================
function ProductionSection() {
  const certificationFaq = [
    {
      question: 'Get Your Certifications',
      answer: `Yes, you should get certified so that leads drop into your lap! eXp Realty is the ONLY brokerage with a full-time staff dedicated to finding opportunities for agents to get high-quality leads. Don't miss out. Get certified!

• Express Offers Certification – Get easy seller leads by advertising that you provide up to multiple cash offers.
• Making it Rain Certification – A great way to start paid advertising fast to get leads rolling in while you're doing other things.
• All other Revenos Certifications – Agents should get all certifications so you can start collecting easy, high-quality leads.`
    },
    {
      question: 'Easy eXp Referrals in Workplace',
      answer: `Leads come to you when you introduce yourself in the many referral threads in Workplace. Workplace is like Facebook for eXp agents. There's a "group" for nearly every special interest, including referral groups.

Simply join the groups for cities/metro areas to which you have a personal connection and when people are looking for an agent there, reach out. We recommend setting up daily or weekly digest emails from Workplace so you can quickly see when someone has posted in a group.`
    },
    {
      question: 'Gain 6 – 20 More Deals Per Year',
      answer: `By signing up with referral networks, you can gain buyer and seller leads in your area. These are often a 25%-35% referral fee, but that beats no deal at all!

Referral Networks to consider:
• HomeLight
• Realtor.com Connections Plus
• Agent Pronto
• OJO
• Clever
• Redfin Partner Agents
• UpNest
• Home Openly
• Sold.com`
    }
  ];

  return (
    <SectionWrapper title="Quickstart Production">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GenericCard padding="md">
            <div className="space-y-4">
              <span className="text-4xl">🏗️</span>
              <h3 className="text-h5 text-[#ffd700]">Build Landing Pages (Bold Trail)</h3>
              <p className="text-body">How to build them</p>
            </div>
          </GenericCard>

          <GenericCard padding="md">
            <div className="space-y-4">
              <span className="text-4xl">#️⃣</span>
              <h3 className="text-h5 text-[#ffd700]">Landing Page Hashtags & Links</h3>
              <p className="text-body">Be sure to watch the how-to video first</p>
            </div>
          </GenericCard>
        </div>

        <GenericCard padding="md">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✉️</span>
              <h3 className="text-h5 text-[#ffd700]">Email Campaigns for Lead Magnets</h3>
            </div>
            <p className="text-body">Automate your nurturing of leads</p>
          </div>
        </GenericCard>

        <FAQ items={certificationFaq} allowMultiple />
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// RevShare Section
// ============================================================================
function RevShareSection() {
  const revShareFaq = [
    {
      question: 'How RevShare Works',
      answer: `eXp Realty's revenue share program allows you to earn passive income by attracting other agents to eXp. When agents you sponsor close transactions, you earn a percentage of the company's revenue from those transactions.

This is NOT a referral fee - it's a true revenue share that continues as long as those agents remain with eXp and are producing.`
    },
    {
      question: 'Getting Started with RevShare',
      answer: `The key to building a successful revenue share organization is to focus on attracting quality agents who are committed to production.

Tips for getting started:
• Share your genuine experience with eXp
• Focus on the value proposition for the agent, not just RevShare
• Use SAA resources to help your attracted agents succeed
• Participate in team calls and trainings`
    }
  ];

  return (
    <SectionWrapper title="Quickstart RevShare">
      <div className="space-y-6">
        <GenericCard padding="lg" centered>
          <div className="text-center space-y-4 py-4">
            <span className="text-6xl">💰</span>
            <h3 className="text-h3 text-[#ffd700]">Grow Your Downline</h3>
            <p className="text-body">No experience needed</p>
            <p className="text-body">Learn how to build passive income through eXp's revenue share program</p>
          </div>
        </GenericCard>

        <FAQ items={revShareFaq} allowMultiple />
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// eXp Links Section
// ============================================================================
function ExpLinksSection() {
  return (
    <SectionWrapper title="eXp Links & Questions">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GenericCard padding="md">
            <div className="space-y-4">
              <h3 className="text-h5 text-[#ffd700]">For Production Questions:</h3>
              <p className="text-body">Go to eXp World and visit your State Broker's room</p>
              <a
                href="https://exp.world/welcome"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
              >
                Go to eXp World
              </a>
            </div>
          </GenericCard>

          <GenericCard padding="md">
            <div className="space-y-4">
              <h3 className="text-h5 text-[#ffd700]">For Other Questions:</h3>
              <p className="text-body">Visit Expert Care in eXp World</p>
              <a
                href="https://exp.world/expertcare"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
              >
                Go to Expert Care
              </a>
            </div>
          </GenericCard>
        </div>

        <GenericCard padding="md">
          <div className="space-y-4">
            <h3 className="text-h5 text-[#ffd700]">Still can't find the answer?</h3>
            <p className="text-body">Contact us directly:</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:doug@smartagentalliance.com"
                className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#e5e4dd] hover:bg-white/10 transition-colors"
              >
                doug@smartagentalliance.com
              </a>
              <a
                href="mailto:karrie.hill@exprealty.com"
                className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#e5e4dd] hover:bg-white/10 transition-colors"
              >
                karrie.hill@exprealty.com
              </a>
            </div>
          </div>
        </GenericCard>

        <div>
          <h3 className="text-h5 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'eXp Realty US', url: 'https://us.exprealty.com/' },
              { label: 'BoldTrail (kvCore)', url: 'https://app.boldtrail.com/' },
              { label: 'Skyslope', url: 'https://app.skyslope.com/LoginIntegrated.aspx' },
              { label: 'Workplace', url: 'https://exprealty.workplace.com/' },
              { label: 'RPR (CMA)', url: 'https://auth.narrpr.com/' },
              { label: 'eXp Agent Healthcare', url: 'https://solutions.exprealty.com/professional-solutions/clearwater-benefits/' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#e5e4dd] hover:bg-[#ffd700]/10 hover:border-[#ffd700]/30 hover:text-[#ffd700] transition-all"
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// New Agents Section
// ============================================================================
function NewAgentsSection() {
  return (
    <SectionWrapper title="New Agents">
      <div className="space-y-6">
        <GenericCard padding="lg">
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-h3 text-[#ffd700]">Welcome to Smart Agent Alliance!</h3>
              <p className="text-body mt-2">Information tailored specifically for new agents</p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-h5 mb-4">Your First Steps:</h4>
              <ol className="space-y-3 text-body">
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">1.</span>
                  <span>Complete the "Start Here" section to understand how to use SAA tools</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">2.</span>
                  <span>Join the weekly Mastermind calls for training and community</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">3.</span>
                  <span>Get your certifications to start receiving leads</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">4.</span>
                  <span>Explore the Canva templates to build your marketing materials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700] font-bold">5.</span>
                  <span>Connect with your sponsor and the SAA community</span>
                </li>
              </ol>
            </div>
          </div>
        </GenericCard>

        <div className="text-center">
          <p className="text-body mb-4">Questions? Reach out to your sponsor or contact us:</p>
          <a
            href="mailto:doug@smartagentalliance.com"
            className="inline-block px-6 py-3 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/20 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// Section Wrapper Component
// ============================================================================
function SectionWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 sm:p-8 bg-black/30 backdrop-blur-sm border border-[#ffd700]/10">
      <H2 className="mb-8">{title}</H2>
      {children}
    </div>
  );
}
