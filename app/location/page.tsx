'use client';

import React, { useState, useMemo } from 'react';
import { Globe, ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { LOCATIONS, FAQS_LOCATION } from '@/lib/data';
import Link from 'next/link';

export default function LocationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollPos / height > 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="section-padding bg-white">
        <div className="container-width space-y-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Find Your Local{' '}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
                Implant Specialist
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {selectedCity
                ? `Elite Dental Implants Specialists in ${selectedCity} are ready to transform your smile.`
                : "Access the UK's most exclusive network of dental implant experts. Vetted for quality, verified for results."}
            </p>

            <div className="max-w-xl mx-auto relative mt-8 flex items-center">
              <Globe className="absolute left-6 text-gray-400 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Search your city or town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 pl-14 text-gray-900 focus:border-brand-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {selectedCity && (
            <div className="bg-brand-50 p-8 md:p-10 rounded-2xl border border-brand-200 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Start your journey in {selectedCity}
                </h2>
                <p className="text-gray-600 max-w-xl">
                  Top-tier providers in the area are currently accepting new patients for consultations.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary text-lg !px-8 !py-4"
              >
                Book {selectedCity} Consultation
              </button>
            </div>
          )}

          <div className="flex flex-col gap-16 pt-8">
            {Object.entries(filteredLocations).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  {region}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {cities.map((city) => {
                    const citySlug = city.toLowerCase().replace(/\s+/g, '-');

                    return (
                      <Link
  key={city}
  href={`/location/${citySlug}`}
  className={`text-left px-5 py-4 rounded-xl border transition-all font-semibold text-base leading-relaxed flex items-center justify-between group ${
    selectedCity === city
      ? 'bg-brand-50 border-brand-400 text-brand-700 shadow-sm'
      : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-brand-200 hover:bg-brand-50 hover:shadow-md'
  }`}
  onClick={(e) => {
    if (selectedCity === city) {
      e.preventDefault();
      handleCityClick(city);
    }
  }}
>
  <span className="leading-snug">{city}</span>
  <ArrowUpRight
    className={`w-5 h-5 transition-all ${
      selectedCity === city
        ? 'opacity-100'
        : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
    }`}
  />
</Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <FAQSection faqs={FAQS_LOCATION} />
      </div>

      <Footer />
    </div>
  );
}
