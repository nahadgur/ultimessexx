'use client';

import React, { useState } from 'react';

type FAQ = { question: string; answer: string } | { q: string; a: string };

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggle = (idx: number) =>
    setActiveIdx(prev => (prev === idx ? null : idx));

  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Clear answers for your dental implant journey.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeIdx === idx;
            const question = 'q' in faq ? faq.q : faq.question;
            const answer   = 'a' in faq ? faq.a : faq.answer;

            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{question}</span>
                  <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
