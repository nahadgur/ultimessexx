'use client';

import React from 'react';

interface BlogCtaBannerProps {
  onOpenModal: () => void;
}

const BlogCtaBanner: React.FC<BlogCtaBannerProps> = ({ onOpenModal }) => {
  return (
    <div className="my-10 rounded-2xl border border-brand-100 bg-brand-50 shadow-sm overflow-hidden">
      <div className="px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center gap-8">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white border border-brand-200 flex items-center justify-center text-3xl">
          🦷
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-2">
            Free Consultation
          </p>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 leading-tight mb-2">
            Ready to Transform Your Smile?
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Book your free consultation with our Essex dental experts today. No obligation — just honest advice tailored to you.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 btn-primary whitespace-nowrap"
          >
            Book Free Consultation
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCtaBanner;
