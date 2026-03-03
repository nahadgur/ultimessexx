'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Globe, ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { LOCATIONS, SERVICES, FAQS_LOCATION } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SERVICE_IMAGES: Record<string, string> = {
  'single-tooth': 'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?q=80&w=1170&auto=format&fit=crop',
  'multiple-teeth': 'https://images.pexels.com/photos/6502343/pexels-photo-6502343.jpeg',
  'full-arch': 'https://images.pexels.com/photos/4687905/pexels-photo-4687905.jpeg',
  'bone-grafting': 'https://images.pexels.com/photos/6629364/pexels-photo-6629364.jpeg',
  'immediate-implants': 'https://images.pexels.com/photos/5355826/pexels-photo-5355826.jpeg',
  'implant-dentures': 'https://images.pexels.com/photos/3779699/pexels-photo-3779699.jpeg'
};

export default function ServiceCitiesPage({ params }: { params: { service: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const service = SERVICES.find(s => s.id === params.service);
  if (!service) notFound();

  const heroImage = SERVICE_IMAGES[params.service] || SERVICE_IMAGES['single-tooth'];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollPos / height > 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  const allCities = Object.values(LOCATIONS).flat();

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 z-[70] w-12 h-12 bg-slate-100 border border-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* HERO */}
      <div className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 min-h-[640px] sm:min-h-[680px] md:min-h-[720px]">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={service.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm text-white/70 mb-4 backdrop-blur-sm">
              <Link
                href="/services"
                className="hover:text-blue-400 transition-colors"
              >
                All Services
              </Link>
              <span>/</span>
              <span className="text-white">{service.title}</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight px-4 overflow-visible drop-shadow-lg">
              {service.title} in{' '}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400 inline-block pr-2">
                {allCities.length}+ UK Locations
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
              {service.desc} Find implant specialists near you.
            </p>

            <div className="max-w-xl mx-auto relative mt-8 flex items-center">
              <Globe className="absolute left-6 text-white/50 w-6 h-6 z-10" />
              <input
                type="text"
                placeholder="Search your city or town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 pl-16 text-white placeholder:text-white/40 focus:border-blue-400 outline-none transition-all shadow-lg"
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">
                  Ready to Start Your Treatment?
                </h2>
                <p className="text-white/70 max-w-xl font-medium">
                  Connect with elite implant specialists specialising in{' '}
                  {service.title.toLowerCase()}.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-blue-500 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all whitespace-nowrap"
              >
                Get Matched
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cities */}
      <div className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-16">
            {Object.entries(filteredLocations).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 px-2">
                  {region}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {cities.map(city => {
                    const citySlug = city
                      .toLowerCase()
                      .replace(/\s+/g, '-');

                    return (
                      <Link
                        key={city}
                        href={`/services/${params.service}/${citySlug}`}
                        className="text-left px-6 py-5 rounded-2xl border transition-all font-bold text-base sm:text-lg leading-relaxed flex items-center justify-between group bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-300 hover:text-slate-900 hover:bg-white hover:shadow-md"
                      >
                        <span className="leading-snug">{city}</span>
                        <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
