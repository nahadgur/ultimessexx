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
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 font-medium">
            Clear answers for your dental implant journey.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeIdx === idx;
            const question = 'q' in faq ? faq.q : faq.question;
            const answer   = 'a' in faq ? faq.a : faq.answer;

            return (
              <div
                key={idx}
                className={`rounded-3xl border transition-colors duration-300 ${
                  isOpen
                    ? 'bg-blue-50/50 border-blue-200'
                    : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-lg font-bold transition-colors duration-300 ${
                      isOpen ? 'text-blue-600' : 'text-slate-900'
                    }`}
                  >
                    {question}
                  </span>

                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-blue-500 text-white rotate-180 shadow-lg shadow-blue-500/20'
                        : 'bg-blue-50 text-blue-500 rotate-0'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p className="px-6 pb-6 text-slate-500 font-medium leading-relaxed">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
