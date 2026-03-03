'use client';

import React, { useState } from 'react';
import { Users, Sparkles, Shield, Medal, Globe, User, ArrowUpRight, ChevronUp, MapPin } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { SERVICES, LOCATIONS, FAQS_SERVICES } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function CityServicesPage({ params }: { params: { city: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const allCities = Object.values(LOCATIONS).flat();
  const cityName = allCities.find(city => 
    city.toLowerCase().replace(/\s+/g, '-') === params.city
  );

  if (!cityName) notFound();

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

  const servicesWithIcons = SERVICES.map(service => ({
    ...service,
    icon: service.id === 'crowded' ? <Users className="w-8 h-8" /> :
          service.id === 'gaps' ? <Sparkles className="w-8 h-8" /> :
          service.id === 'overbite' ? <Shield className="w-8 h-8" /> :
          service.id === 'underbite' ? <Medal className="w-8 h-8" /> :
          service.id === 'crossbite' ? <Globe className="w-8 h-8" /> :
          <User className="w-8 h-8" />
  }));

  return (
    <div className="min-h-screen bg-white">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />
      
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="section-padding bg-white">
        <div className="container-width space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 text-sm text-gray-600 mb-4">
              <Link href="/location" className="hover:text-brand-600 transition-colors">All Locations</Link>
              <span>/</span>
              <span className="text-gray-900">{cityName}</span>
            </div>

            <h1 className="font-display text-4xl md:text-7xl font-display font-bold text-gray-900 leading-tight">
              Dental Implants in <span className="text-brand-600 italic">{cityName}</span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <p className="text-xl font-medium">
                Elite Implant Specialists Available
              </p>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Access {cityName}'s most experienced Dental Implants specialists. Choose from our comprehensive treatment options below.
            </p>
          </div>

          <div className="bg-brand-50/50 p-8 md:p-12 rounded-2xl border border-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Start Your Journey in {cityName}</h2>
                <p className="text-gray-600 max-w-xl font-medium">
                  Top-tier providers in {cityName} are currently accepting new patients for consultations.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="px-10 py-5 bg-brand-500 text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-all whitespace-nowrap"
              >
                Book {cityName} Consultation
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 text-center">
              Available Treatments in {cityName}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesWithIcons.map((service) => {
                const citySlug = params.city;
                return (
                  <Link 
                    key={service.id}
                    href={`/services/${service.id}/${citySlug}`}
                    className="group bg-white p-10 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg transition-all flex flex-col shadow-sm"
                  >
                    <div className={`mb-6 p-4 rounded-2xl bg-brand-50 text-brand-600 inline-flex self-start`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 group-hover:text-brand-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-8 flex-1">{service.desc}</p>
                    <div className="flex items-center gap-2 text-brand-600 font-medium text-sm">
                      View Details <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        <FAQSection faqs={FAQS_SERVICES} />
      </div>

      <Footer />
    </div>
  );
}
