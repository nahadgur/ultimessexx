'use client';

import React, { useState, useMemo } from 'react';
import { Globe, ArrowUpRight, ChevronUp, CheckCircle, MapPin, Shield, Users } from '@/components/Icons';
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
      const s = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(h > 0 ? s / h > 0.3 : false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filtered.length > 0) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  const allCityCount = Object.values(LOCATIONS).flat().length;

  return (
    <div className="min-h-screen bg-white">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* HERO */}
      <section className="section-padding bg-white border-b border-gray-100">
        <div className="container-width text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold uppercase tracking-widest rounded-full mb-5">
            {allCityCount} UK Locations
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-5">
            Find a Dental Implant Specialist <span className="text-brand-600">Near You</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Our network spans {allCityCount} towns and cities across the UK. Every listed specialist has been independently vetted for GDC registration, implant-specific clinical competency, and patient satisfaction data. Browse by region or search for your town below.
          </p>
          <div className="max-w-xl mx-auto relative flex items-center">
            <Globe className="absolute left-4 text-gray-400 w-5 h-5 z-10" />
            <input type="text" placeholder="Search your city or town..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 pl-12 text-gray-900 focus:border-brand-500 outline-none transition-all shadow-sm" />
          </div>
        </div>
      </section>

      {/* SELECTED CITY CTA */}
      {selectedCity && (
        <section className="py-8 bg-brand-50 border-b border-brand-100">
          <div className="container-width">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white rounded-2xl border border-brand-200 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-1">Selected Location</p>
                <h2 className="text-2xl font-display font-bold text-gray-900">Start your journey in {selectedCity}</h2>
                <p className="text-gray-600 mt-1">Top-rated providers in {selectedCity} are currently accepting new patients.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary text-lg !px-8 !py-4 whitespace-nowrap">
                Book {selectedCity} Consultation
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CITY GRID */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="flex flex-col gap-14">
            {Object.entries(filteredLocations).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0" />{region}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cities.map((city) => {
                    const slug = city.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link key={city} href={`/location/${slug}`} onClick={() => setSelectedCity(city)}
                        className={`text-left px-5 py-4 rounded-xl border transition-all font-semibold text-base flex items-center justify-between group ${selectedCity === city ? 'bg-brand-50 border-brand-400 text-brand-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-brand-200 hover:bg-brand-50 hover:shadow-md'}`}>
                        <span className="leading-snug">{city}</span>
                        <ArrowUpRight className={`w-4 h-4 ${selectedCity === city ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {Object.keys(filteredLocations).length === 0 && (
            <p className="text-center py-16 text-gray-400">No locations found for &ldquo;{searchQuery}&rdquo;. Try a shorter search.</p>
          )}
        </div>
      </section>

      {/* EDITORIAL: WHY LOCAL MATTERS */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6">
                Why Your Choice of Local Implant Specialist Matters More Than You Think
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Dental implants are a long-term investment — most last 20 to 30 years when placed correctly. The single most important variable in your outcome is not the brand of implant used, nor the material of your crown, but the skill and accumulated experience of the clinician placing them. Choosing a local specialist through our verified network eliminates the risk of selecting a general dentist with minimal implant training simply because they happen to appear first on a Google search.
                </p>
                <p>
                  Proximity also matters for aftercare. A typical implant course involves three to five appointments spread across three to six months, plus annual hygiene and monitoring check-ups thereafter. Having a qualified specialist within a practical commuting distance dramatically improves follow-up attendance — and consistent monitoring is exactly what separates long-lasting implants from those that fail prematurely due to peri-implantitis or undetected bone loss around the fixture.
                </p>
                <p>
                  Our directory is deliberately curated rather than exhaustive. We only list providers who carry out a meaningful annual volume of implant work, who operate with modern CBCT scanning equipment, and who can provide structured clinical audit data on request. Any provider who receives repeated patient complaints or allows their GDC registration to lapse is removed from the directory promptly — not after a waiting period.
                </p>
                <p>
                  The NHS does not routinely fund dental implants for cosmetic tooth loss. Private providers in our UK network charge between £1,500 and £3,500 per implant, with full-arch solutions ranging from £8,000 to £25,000 depending on complexity. Many practices offer 0% finance spread over 12 to 60 months — ask about this when you book your initial consultation.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">How We Vet Every Specialist</h3>
              {[
                { icon: <Shield className="w-5 h-5 text-brand-600" />, title: 'GDC Registration Verified', desc: 'Every clinician is cross-referenced against the General Dental Council register before listing, and re-checked every 12 months.' },
                { icon: <CheckCircle className="w-5 h-5 text-brand-600" />, title: 'Minimum Case Volume Required', desc: 'Providers must demonstrate a meaningful annual volume of implant placements. Sporadic practitioners with very low case numbers are not admitted.' },
                { icon: <Users className="w-5 h-5 text-brand-600" />, title: 'Patient Outcome Data Reviewed', desc: 'We request satisfaction scores, documented complication rates, and implant survival data before any provider is admitted to the network.' },
                { icon: <Globe className="w-5 h-5 text-brand-600" />, title: 'Annual Re-Audit Process', desc: 'Our vetting is ongoing. Providers who fall below our quality benchmark following the annual audit are removed — there are no exceptions.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="bg-brand-600 rounded-2xl p-6 text-white mt-2">
                <h4 className="font-display font-bold text-lg mb-2">Not sure which treatment you need?</h4>
                <p className="text-brand-100 text-sm mb-4 leading-relaxed">Our matching form takes under two minutes. Tell us about your situation and we will identify the right specialist and treatment type at no cost to you.</p>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-all text-sm w-full">
                  Get Free Specialist Match
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COST GUIDE SECTION */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">UK Dental Implant Cost Guide 2025</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Prices vary by region, complexity, and the implant system used. The ranges below reflect our network providers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { treatment: 'Single Tooth Implant', low: '£1,500', high: '£3,500', note: 'Implant post, abutment, and ceramic crown included' },
              { treatment: 'Multiple Teeth (per implant)', low: '£1,400', high: '£3,200', note: 'Volume cases often attract a reduced per-unit cost' },
              { treatment: 'Full Arch (All-on-4)', low: '£8,000', high: '£16,000', note: 'Per arch. Includes all four implants and fixed prosthesis' },
              { treatment: 'Implant-Retained Denture', low: '£3,500', high: '£8,000', note: 'Two to four implants with clip-retained overdenture' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <h3 className="font-display font-bold text-gray-900 mb-3 text-base">{item.treatment}</h3>
                <p className="text-2xl font-bold text-brand-600 mb-1">{item.low} – {item.high}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">All prices are indicative. Your specialist will provide a written treatment plan with exact costs before any procedure begins.</p>
        </div>
      </section>

      <FAQSection faqs={FAQS_LOCATION} />
      <Footer />
    </div>
  );
}
