'use client';

import { useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is a sponsor team?',
    answer: 'A sponsor team is the group of agents and leaders who directly support you when you join eXp Realty. Unlike traditional brokerages where you might be on your own, your sponsor team provides training, mentorship, tools, and community. At Smart Agent Alliance, we invest heavily in your success because when you grow, we all grow together.',
  },
  {
    question: 'What makes SAA different from other teams?',
    answer: 'We combine the best of both worlds: the financial advantages of eXp Realty with a team culture that genuinely invests in your success. We provide free tools, training, lead generation support, and a proven system - all at no cost to you. Our retention rate speaks for itself: agents stay because they succeed.',
  },
  {
    question: 'Is there a cost to join the team?',
    answer: "No. Everything we offer is 100% free to our team members. We don't charge team fees, technology fees, or desk fees. You keep more of your commission while getting more support than most paid programs offer.",
  },
  {
    question: 'How does revenue share work?',
    answer: "Revenue share is eXp's way of rewarding you for helping grow the company. When you attract other agents to eXp and they close deals, you earn a percentage of the company's revenue from those transactions. It's not a pyramid - it's real income based on real production, and it can create significant passive income over time.",
  },
  {
    question: 'Can I keep my current team or brokerage relationships?',
    answer: 'Yes, in most cases. If you have agents on your team at another brokerage, many can transition with you to eXp under your sponsorship. We can discuss your specific situation and help you understand the best path forward.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Frequently Asked Questions</H2>
          <p className="text-[#dcdbd5] mt-4 text-lg">
            Get answers to the most common questions about joining our team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#ffd700]/30"
            >
              {/* Question Button */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-[#e5e4dd] font-semibold text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#ffd700] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-5 pb-5 text-[#dcdbd5]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
