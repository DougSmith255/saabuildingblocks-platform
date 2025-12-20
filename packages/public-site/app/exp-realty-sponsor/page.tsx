'use client';

import { useEffect, useRef, useState } from 'react';
import { H1, H2, Tagline, CTAButton, SecondaryButton, GenericCard, CyberCardGold, FAQ } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { CheckCircle, Users, Zap, BookOpen, Video, Target, MessageCircle, DollarSign, Globe, Award, Sparkles, ChevronLeft, ChevronRight, Layout, Megaphone, TrendingUp, Brain, Building, ClipboardCheck } from 'lucide-react';

/**
 * Smart Agent Alliance - eXp Realty Sponsor Page
 * Rebuilt with V2 styling patterns
 */

// ============================================================================
// SCROLL REVEAL HOOK
// ============================================================================

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ============================================================================
// ANIMATION COMPONENTS
// ============================================================================

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function RevealCard({ children, direction = 'left', delay = 0 }: { children: React.ReactNode; direction?: 'left' | 'right'; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  const translateX = direction === 'left' ? '-40px' : '40px';
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : `translateX(${translateX})`,
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Accordion group for How Sponsorship Works section
function AccordionCard({
  icon,
  iconBgColor,
  borderColor,
  title,
  highlight,
  highlightColor,
  children,
  isOpen,
  onToggle
}: {
  icon: React.ReactNode;
  iconBgColor: string;
  borderColor: string;
  title: string;
  highlight: string;
  highlightColor: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-l-4 ${borderColor} cursor-pointer transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/[0.07]`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-h5 mb-1">{title}</h4>
            <svg
              className={`w-5 h-5 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <p className={`${highlightColor} font-semibold text-lg`}>{highlight}</p>
          <div
            className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-body text-sm opacity-70">{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Accordion group wrapper
function SponsorshipAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const cards = [
    {
      icon: <svg className="w-6 h-6 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBgColor: "bg-[#ffd700]/10",
      borderColor: "border-l-[#ffd700]",
      title: "How eXp Sponsorship Works",
      highlight: "You choose your sponsor when you join.",
      highlightColor: "text-[#ffd700]",
      content: "At eXp Realty, agents join the brokerage directly and name an individual sponsor on their application. That sponsor is part of a broader upline structure, which includes up to seven levels of agents."
    },
    {
      icon: <svg className="w-6 h-6 text-[#ff6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      iconBgColor: "bg-[#ff6b6b]/10",
      borderColor: "border-l-[#ff6b6b]",
      title: "The Problem",
      highlight: "Many sponsors provide little or no ongoing value.",
      highlightColor: "text-[#ff6b6b]",
      content: "What that support looks like varies widely. Some sponsors collect revenue share without offering any systems, training, or community in return."
    },
    {
      icon: <svg className="w-6 h-6 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      iconBgColor: "bg-[#00ff88]/10",
      borderColor: "border-l-[#00ff88]",
      title: "Smart Agent Alliance Is Different",
      highlight: "Organized support, not a production team.",
      highlightColor: "text-[#00ff88]",
      content: "Agents remain fully independent, keep their clients and brand, and are never required to give up a percentage of their commission to participate. To access SAA, name a Smart Agent Alliance-aligned sponsor when you join eXp."
    },
    {
      icon: <DollarSign className="w-6 h-6 text-[#ffd700]" />,
      iconBgColor: "bg-[#ffd700]/10",
      borderColor: "border-l-[#ffd700]",
      title: "Zero Cost To You",
      highlight: "Agents pay nothing. Ever.",
      highlightColor: "text-[#ffd700]",
      content: "We are compensated by eXp only when agents close transactions, and only from eXp's portion of the commission, not the agent's. This structure aligns our incentives with your success."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {cards.map((card, index) => (
        <Reveal key={index} delay={0.1 + index * 0.05}>
          <AccordionCard
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            borderColor={card.borderColor}
            title={card.title}
            highlight={card.highlight}
            highlightColor={card.highlightColor}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          >
            {card.content}
          </AccordionCard>
        </Reveal>
      ))}
    </div>
  );
}

// Tabbed interface for Connected Leadership section
function LeadershipTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'mastermind',
      label: 'Live Mastermind',
      icon: <Video className="w-5 h-5" />,
      title: 'Live Mastermind Access',
      content: (
        <>
          <ul className="text-body opacity-80 space-y-2 mb-4">
            <li>• 5× weekly live sessions led by Wolf Pack leaders</li>
            <li>• Each session follows a clear agenda focused on one or two actionable ideas</li>
            <li>• Meetings open with agents sharing recent wins and strategies they are actively using</li>
            <li>• You choose what to implement, when to implement it, and how it fits your business</li>
          </ul>
          <p className="text-body text-sm opacity-60">These sessions are designed to provide clarity, momentum, and perspective without obligation or pressure.</p>
        </>
      )
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      icon: <Globe className="w-5 h-5" />,
      title: 'Collaboration at Scale',
      content: (
        <ul className="text-body opacity-80 space-y-2">
          <li>• Access to a 3,700+ agent network spanning multiple markets</li>
          <li>• Learn what's converting now, not last year</li>
          <li>• Share ideas, ask questions, and learn from real patterns across markets</li>
        </ul>
      )
    },
    {
      id: 'opportunity',
      label: 'Opportunity',
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Opportunity You Won\'t Find Elsewhere',
      content: (
        <ul className="text-body opacity-80 space-y-2">
          <li>• Private WhatsApp collaboration and referral groups</li>
          <li>• Private meetups at eXp events that strengthen relationships beyond the screen</li>
        </ul>
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tab buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === index
                ? 'bg-[#ffd700] text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 transition-all duration-300">
        <h4 className="text-h4 mb-4 text-[#ffd700]">{tabs[activeTab].title}</h4>
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

function StaggerCard({ children, index }: { children: React.ReactNode; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.05);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// HORIZONTAL SCROLL CARDS - Done-For-You Production Systems
// ============================================================================

interface ProductionCard {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

function ProductionSystemsCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cards: ProductionCard[] = [
    {
      icon: <Layout className="w-6 h-6 text-[#ffd700]" />,
      title: "Systems & Access",
      items: [
        "SAA Members-only portal with instant access to all Smart Agent Alliance assets",
        "Personal Agent Link Page, your central hub for branding, recruiting, and attraction",
        "Ongoing updates as systems evolve, no chasing files or outdated links"
      ]
    },
    {
      icon: <Target className="w-6 h-6 text-[#ffd700]" />,
      title: "Lead Generation & Follow-Up",
      items: [
        "BoldTrail Lead Magnet System",
        "8 professionally built landing pages",
        "Integrated automated follow-up email campaigns"
      ]
    },
    {
      icon: <Megaphone className="w-6 h-6 text-[#ffd700]" />,
      title: "Marketing Materials",
      items: [
        "Ready-to-edit Canva social packs with pre-filled copy blocks",
        "Open house sheets",
        "This-or-That engagement posts",
        "Testimonial social posts",
        "Inspirational and authority-building posts"
      ]
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#ffd700]" />,
      title: "Ongoing Enhancements",
      items: [
        "Bonus tools, systems, and assets added periodically",
        "No upsells"
      ]
    }
  ];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        ref.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  return (
    <div className="relative">
      {/* Navigation Arrows - Desktop */}
      <button
        onClick={() => scroll('left')}
        className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/30 items-center justify-center transition-all duration-300 ${
          canScrollLeft ? 'opacity-100 hover:bg-[#ffd700]/30' : 'opacity-30 cursor-not-allowed'
        }`}
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="w-5 h-5 text-[#ffd700]" />
      </button>
      <button
        onClick={() => scroll('right')}
        className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/30 items-center justify-center transition-all duration-300 ${
          canScrollRight ? 'opacity-100 hover:bg-[#ffd700]/30' : 'opacity-30 cursor-not-allowed'
        }`}
        disabled={!canScrollRight}
      >
        <ChevronRight className="w-5 h-5 text-[#ffd700]" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
          >
            <div className="h-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-[#ffd700]/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#ffd700]/10 flex items-center justify-center flex-shrink-0">
                  {card.icon}
                </div>
                <h4 className="text-h5 text-[#ffd700]">{card.title}</h4>
              </div>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <li key={i} className="text-body text-sm opacity-80 flex items-start gap-2">
                    <span className="text-[#ffd700] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Indicator - Mobile */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {cards.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-white/20"
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// FLIP CARDS - Elite Training
// ============================================================================

interface TrainingCard {
  icon: React.ReactNode;
  title: string;
  frontText: string;
  backText: string;
}

function TrainingFlipCards() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const cards: TrainingCard[] = [
    {
      icon: <Users className="w-8 h-8 text-[#ffd700]" />,
      title: "Social Agent Academy Pro",
      frontText: "Clear systems designed to create momentum and measurable results",
      backText: "Master social media marketing with proven frameworks. Build your brand, attract leads, and convert followers into clients with step-by-step training."
    },
    {
      icon: <Brain className="w-8 h-8 text-[#ffd700]" />,
      title: "AI Agent Accelerator",
      frontText: "Practical AI systems that save time and increase output",
      backText: "Leverage AI tools to automate repetitive tasks, generate content, and scale your business. Stay ahead of the curve with cutting-edge technology training."
    },
    {
      icon: <Building className="w-8 h-8 text-[#ffd700]" />,
      title: "Investor Agent Training",
      frontText: "Learn how to attract and work with investor clients confidently",
      backText: "Understand investment strategies, speak the language of investors, and position yourself as the go-to agent for real estate investors in your market."
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-[#ffd700]" />,
      title: "Brand New Agent Playbooks",
      frontText: "Step-by-step clarity when it matters most",
      backText: "Production playbooks and checklists designed specifically for new agents. Know exactly what to do, when to do it, and how to build momentum from day one."
    }
  ];

  const handleFlip = (index: number) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="perspective-1000 h-[280px] cursor-pointer"
          onClick={() => handleFlip(index)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              flippedIndex === index ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: flippedIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex flex-col items-center justify-center text-center hover:border-[#ffd700]/30 transition-colors duration-300"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h4 className="text-h5 mb-3 text-[#ffd700]">{card.title}</h4>
              <p className="text-body text-sm opacity-80">{card.frontText}</p>
              <p className="text-xs text-white/40 mt-4">Click to learn more</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 backdrop-blur-sm border border-[#ffd700]/30 p-6 flex flex-col items-center justify-center text-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <h4 className="text-h5 mb-4 text-[#ffd700]">{card.title}</h4>
              <p className="text-body text-sm opacity-90">{card.backText}</p>
              <p className="text-xs text-white/40 mt-4">Click to flip back</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// FAQ DATA
// ============================================================================

const faqItems = [
  {
    question: "Do I have to give up any commission or join a production team?",
    answer: "No. Smart Agent Alliance is not a production team and there are no commission splits. You keep your clients, your brand, and your full eXp compensation structure. You also may join an eXp production team after you join eXp through Smart Agent Alliance if you want that level of accountability."
  },
  {
    question: "Do I have to recruit or attend meetings to be part of Smart Agent Alliance?",
    answer: "No. There is no requirement to recruit, attend meetings, or implement any system. All tools, training, and sessions are optional. You choose what to use, when to use it, and how it fits your business. Agents who engage consistently tend to benefit more, but participation is always optional."
  },
  {
    question: "Can I access Smart Agent Alliance if I already joined eXp through another sponsor?",
    answer: "Smart Agent Alliance resources are available only to agents who are sponsored through a Smart Agent Alliance-aligned sponsor at eXp. If you have not yet joined eXp, naming a Smart Agent Alliance-aligned sponsor on your application ensures full access to systems, training, and community. If you've already joined eXp through a different sponsor, access to Smart Agent Alliance is not available."
  },
  {
    question: "How is Smart Agent Alliance compensated?",
    answer: "Agents pay Smart Agent Alliance nothing. Smart Agent Alliance is compensated by eXp only when agents close transactions, and only from eXp's portion of the commission, not the agent's. This structure aligns incentives around agent success, without requiring agents to pay fees (although some sponsors do charge fees) or give up control."
  }
];

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ExpRealtySponsor() {
  return (
    <main id="main-content">
      <style jsx global>{`
        /* Scroll Reveal Animations */
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3), 0 0 40px rgba(255,215,0,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        .glow-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 30px rgba(255,215,0,0.3), 0 0 60px rgba(255,215,0,0.15);
        }

        .float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .float-medium { animation: floatMedium 6s ease-in-out infinite; }

        .gradient-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffd700, transparent);
        }

        .value-badge {
          background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%);
          border: 1px solid rgba(255,215,0,0.3);
        }
      `}</style>

      {/* Subtle Floating Background Orbs - Gold only, very subtle */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-slow absolute top-[20%] left-[5%] w-48 h-48 rounded-full bg-[#ffd700]/5 blur-[80px]" />
        <div className="float-medium absolute top-[50%] right-[10%] w-64 h-64 rounded-full bg-[#ffd700]/4 blur-[100px]" style={{ animationDelay: '2s' }} />
        <div className="float-slow absolute top-[75%] left-[30%] w-40 h-40 rounded-full bg-[#ffd700]/5 blur-[70px]" style={{ animationDelay: '4s' }} />
      </div>

      {/* ================================================================== */}
      {/* HERO SECTION - KEPT AS-IS */}
      {/* ================================================================== */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <QuantumGridEffect />

          {/* Wolf Pack Background Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop"
                srcSet="
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
                "
                sizes="100vw"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: 'center 55%',
                  maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                }}
              />
            </div>
          </div>

          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>Smart Agent Alliance</H1>
            <Tagline className="mt-4">
              3,700+ agents. We succeed only when you do.
            </Tagline>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* ================================================================== */}
      {/* INTRO SECTION */}
      {/* ================================================================== */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto text-center">
          <Reveal>
            <p className="text-body text-xl max-w-3xl mx-auto">
              We work with broker-owners, teams, top producers, growing agents, and brand-new licensees across the U.S., Canada, Mexico, Australia, and beyond.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <CTAButton href="/join-exp-sponsor-team/">Book a Call</CTAButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-line w-full max-w-md mx-auto" />

      {/* ================================================================== */}
      {/* TESTIMONIAL RIBBON - Placeholder */}
      {/* ================================================================== */}
      <LazySection height={200}>
        <section className="relative py-12 md:py-16 px-4 overflow-hidden">
          <div className="max-w-[1900px] mx-auto">
            <Reveal>
              <div className="text-center py-12 border border-white/10 rounded-xl bg-white/5">
                <p className="text-body opacity-60">Testimonial Ribbon Coming Soon</p>
                <p className="text-sm opacity-40 mt-2">Agent quotes and success stories</p>
              </div>
            </Reveal>
          </div>
        </section>
      </LazySection>

      {/* ================================================================== */}
      {/* HOW SPONSORSHIP WORKS - Redesigned with hierarchy */}
      {/* ================================================================== */}
      <LazySection height={700}>
        <section className="relative py-20 md:py-32 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <Reveal className="text-center mb-16">
              <H2>How Sponsorship Works at eXp Realty</H2>
              <p className="text-body mt-4 max-w-3xl mx-auto opacity-80">(and Why It Matters)</p>
            </Reveal>

            <SponsorshipAccordion />
          </div>
        </section>
      </LazySection>

      {/* Gradient Divider */}
      <div className="gradient-line w-full max-w-lg mx-auto" />

      {/* ================================================================== */}
      {/* WHAT YOU GET - HEADER */}
      {/* ================================================================== */}
      <section className="relative py-16 md:py-20 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto text-center">
          <Reveal>
            <H2>What You Get Inside Smart Agent Alliance</H2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-body mt-4 opacity-80">Included at no cost when you join eXp through Smart Agent Alliance</p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================== */}
      {/* VALUE PILLAR 1: CONNECTED LEADERSHIP & COMMUNITY */}
      {/* ================================================================== */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            {/* Header */}
            <Reveal className="text-center mb-10">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                  <Users className="w-7 h-7 text-[#ffd700]" />
                </div>
                <div className="text-left">
                  <h3 className="text-h3">Connected Leadership & Community</h3>
                  <p className="text-[#ffd700] font-bold">Value: Priceless</p>
                </div>
              </div>
              <p className="text-body text-lg opacity-90 max-w-2xl mx-auto">
                <strong>Big enough to back you. Small enough to know you.</strong> This is not a Facebook group. It's an active learning environment where agents stay informed, inspired, and connected.
              </p>
            </Reveal>

            {/* Tabs */}
            <Reveal delay={0.2}>
              <LeadershipTabs />
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.3} className="text-center mt-8">
              <p className="text-sm text-white/50 mb-4">Availability: Not available for individual purchase</p>
              <SecondaryButton href="/join-exp-sponsor-team/">I want it</SecondaryButton>
            </Reveal>
          </div>
        </section>
      </LazySection>

      {/* Gradient Divider */}
      <div className="gradient-line w-full max-w-md mx-auto" />

      {/* ================================================================== */}
      {/* VALUE PILLAR 2: PASSIVE INCOME & AGENT ATTRACTION */}
      {/* ================================================================== */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Feature Card */}
              <StaggerCard index={0}>
                <GenericCard padding="lg" hover className="glow-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-[#ffd700]" />
                    </div>
                    <div>
                      <h4 className="text-h5 mb-2">Agent Attraction & Revenue Share Support</h4>
                      <ul className="text-body text-sm opacity-80 space-y-1">
                        <li>• Your branded agent attraction webpage</li>
                        <li>• Live webinars hosted for your recruits</li>
                        <li>• 1:1 leadership calls available for your recruits</li>
                        <li>• Value-drip nurture campaigns that keep you top of mind</li>
                      </ul>
                      <p className="text-body text-sm opacity-60 mt-4">
                        For some agents, this income grows large enough to reduce or even replace production over time.
                      </p>
                    </div>
                  </div>
                </GenericCard>
              </StaggerCard>

              {/* Right: Description */}
              <Reveal>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                    <Target className="w-8 h-8 text-[#ffd700]" />
                  </div>
                  <div>
                    <h3 className="text-h3">Passive Income & Agent Attraction Infrastructure</h3>
                    <p className="text-[#ffd700] font-bold text-lg">Value: Included</p>
                  </div>
                </div>
                <p className="text-body text-lg opacity-90 mb-4">
                  <strong>Built for agents who want more than transactions.</strong>
                </p>
                <p className="text-body opacity-80 mb-8">
                  This is where Smart Agent Alliance does the heavy lifting. We provide the systems, structure, and support that allow agents to build their own downline and long-term income without guessing, cold recruiting, or starting from scratch.
                </p>
                <p className="text-sm text-white/50 mb-6">Availability: Not available for individual purchase</p>
                <SecondaryButton href="/join-exp-sponsor-team/">I want it</SecondaryButton>
              </Reveal>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Gradient Divider */}
      <div className="gradient-line w-full max-w-md mx-auto" />

      {/* ================================================================== */}
      {/* VALUE PILLAR 3: DONE-FOR-YOU PRODUCTION SYSTEMS */}
      {/* ================================================================== */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            {/* Header */}
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-[#ffd700]" />
                </div>
                <div className="text-left">
                  <h3 className="text-h3">Done-For-You Production Systems</h3>
                  <p className="text-[#ffd700] font-bold text-lg">Estimated Value: Up to $12,000/yr</p>
                </div>
              </div>
              <p className="text-body text-lg opacity-90 max-w-3xl mx-auto mt-4">
                <strong>So you don't waste time learning systems just to implement them.</strong> Everything here is designed to help you produce more efficiently while reducing complexity, cost, and frustration.
              </p>
            </Reveal>

            {/* Horizontal Scrolling Cards */}
            <Reveal delay={0.2}>
              <ProductionSystemsCards />
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.3} className="text-center mt-10">
              <p className="text-sm text-white/50 mb-4">Availability: Not available for individual purchase</p>
              <SecondaryButton href="/join-exp-sponsor-team/">I want it</SecondaryButton>
            </Reveal>
          </div>
        </section>
      </LazySection>

      {/* Gradient Divider */}
      <div className="gradient-line w-full max-w-md mx-auto" />

      {/* ================================================================== */}
      {/* VALUE PILLAR 4: ELITE ON-DEMAND TRAINING */}
      {/* ================================================================== */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-[#ffd700]" />
                </div>
                <div className="text-left">
                  <h3 className="text-h3">Elite On-Demand Training</h3>
                  <p className="text-[#ffd700] font-bold text-lg">Value: $2,500 upfront, then $997/yr</p>
                </div>
              </div>
              <p className="text-body text-lg opacity-80 max-w-3xl mx-auto mt-4">
                Structured training for agents who want results faster, without guessing. These training libraries are available for purchase independently. Agents who join eXp through Smart Agent Alliance receive full access at no additional cost.
              </p>
              <p className="text-sm text-white/40 mt-4">Click any card to learn more</p>
            </Reveal>

            {/* Flip Cards */}
            <Reveal delay={0.2}>
              <TrainingFlipCards />
            </Reveal>

            <Reveal delay={0.3} className="mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/social-agent-academy/">Buy Now</CTAButton>
                <SecondaryButton href="/join-exp-sponsor-team/">I want it for FREE</SecondaryButton>
              </div>
            </Reveal>
          </div>
        </section>
      </LazySection>

      {/* Gradient Divider */}
      <div className="gradient-line w-full max-w-lg mx-auto" />

      {/* ================================================================== */}
      {/* YOUR DUAL ADVANTAGE */}
      {/* ================================================================== */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <Reveal className="text-center mb-12">
              <H2>Your Dual Advantage</H2>
              <p className="text-body text-xl mt-4 text-[#ffd700]">Smart Agent Alliance + Wolf Pack</p>
            </Reveal>

            <div className="max-w-4xl mx-auto mb-12">
              <Reveal delay={0.1}>
                <p className="text-body text-lg text-center mb-8 opacity-90">
                  When you join Smart Agent Alliance, you don't just join one support system. You gain access to two of eXp's most established agent support organizations working together.
                </p>
              </Reveal>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <RevealCard direction="left" delay={0.2}>
                  <GenericCard padding="lg" className="h-full border-l-4 border-l-[#ffd700]">
                    <h4 className="text-h4 mb-4">Why This Matters</h4>
                    <p className="text-body opacity-80 mb-4">
                      Smart Agent Alliance is directly aligned with the Wolf Pack, one of eXp's largest and most experienced leadership networks.
                    </p>
                    <ul className="text-body text-sm opacity-80 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#ffd700] mt-1 flex-shrink-0" />
                        <span>The systems you see here are battle-tested at scale</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#ffd700] mt-1 flex-shrink-0" />
                        <span>Training, tools, and support continuously refined across thousands of agents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#ffd700] mt-1 flex-shrink-0" />
                        <span>You benefit from both sponsor organizations working in alignment</span>
                      </li>
                    </ul>
                  </GenericCard>
                </RevealCard>

                <RevealCard direction="right" delay={0.3}>
                  <GenericCard padding="lg" className="h-full border-r-4 border-r-[#ffd700]">
                    <h4 className="text-h4 mb-4">What You Get</h4>
                    <ul className="text-body opacity-80 space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#ffd700] mt-1 flex-shrink-0" />
                        <span>Full Smart Agent Alliance systems and resources</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#ffd700] mt-1 flex-shrink-0" />
                        <span>Full Wolf Pack value, training access, and leadership support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#ffd700] mt-1 flex-shrink-0" />
                        <span>One streamlined experience, built for clarity and efficiency</span>
                      </li>
                    </ul>
                    <p className="text-body text-sm opacity-60 mt-4">
                      This dual-layer support is not something you can buy separately. It only exists because of how Smart Agent Alliance is ideally positioned in the eXp organization.
                    </p>
                  </GenericCard>
                </RevealCard>
              </div>
            </div>

            {/* ExpCon Video Placeholder */}
            <Reveal delay={0.4}>
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <p className="text-body opacity-60">ExpCon Video Placeholder</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </LazySection>

      {/* ================================================================== */}
      {/* FAQ SECTION */}
      {/* ================================================================== */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <Reveal className="text-center mb-12">
              <H2>Frequently Asked Questions</H2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="max-w-3xl mx-auto">
                <FAQ items={faqItems} />
              </div>
            </Reveal>
          </div>
        </section>
      </LazySection>

      {/* ================================================================== */}
      {/* FINAL CTA */}
      {/* ================================================================== */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <Reveal>
              <CyberCardGold padding="xl" className="max-w-4xl mx-auto text-center">
                <p className="text-body text-lg mb-2 opacity-80">If you're evaluating eXp sponsors, structure matters.</p>
                <h2 className="text-h2 mb-4 text-[#ffd700]">Smart Agent Alliance is built for agents who want support without giving up independence.</h2>
                <p className="text-body opacity-80 mb-8 max-w-2xl mx-auto">
                  Systems, training, and community designed to support agent growth without commission splits, control, or loss of independence. With thousands of agents across multiple countries and consistent live collaboration, this is structure built for long-term success, not short-term hype.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CTAButton href="/join-exp-sponsor-team/">Join The Alliance</CTAButton>
                  <SecondaryButton href="/join-exp-sponsor-team/">Book a Call</SecondaryButton>
                  <SecondaryButton href="/about-exp-realty/">Learn about eXp</SecondaryButton>
                </div>
              </CyberCardGold>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-sm text-center mt-10 opacity-50 max-w-2xl mx-auto">
                Smart Agent Alliance is a sponsor team and agent community within eXp Realty. eXp Realty is a licensed real estate brokerage, publicly traded under the symbol "EXPI".
              </p>
            </Reveal>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
