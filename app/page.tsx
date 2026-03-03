'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Sparkles, Shield, Medal, Globe, User, ArrowUpRight, ChevronUp, CheckCircle, Calendar } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { SERVICES, FAQS_SERVICES } from '@/lib/data';
import Link from 'next/link';

const CountUp: React.FC<{ end: number; suffix?: string; decimals?: number }> = ({ end, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={elementRef}>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(height > 0 ? scrollPos / height > 0.3 : false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const icons: Record<string, React.ReactNode> = {
    'single-tooth': <Shield className="w-7 h-7" />,
    'multiple-teeth': <Users className="w-7 h-7" />,
    'full-arch': <Medal className="w-7 h-7" />,
    'bone-grafting': <Globe className="w-7 h-7" />,
    'immediate-implants': <Sparkles className="w-7 h-7" />,
    'implant-dentures': <User className="w-7 h-7" />,
  };
  const servicesWithIcons = SERVICES.map(s => ({ ...s, icon: icons[s.id] || <User className="w-7 h-7" /> }));

  return (
    <div className="min-h-screen bg-white">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/4687905/pexels-photo-4687905.jpeg"
            className="w-full h-full object-cover"
            alt="Dental Implants UK"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/50 to-gray-900/20"></div>
        </div>
        <div className="relative container-width py-24 md:py-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Premium Dental Implant Specialists</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight drop-shadow-sm mb-6">
            The Network For <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400">
              Dental Implants In Essex.
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
            Connecting patients with elite dental implant specialists for natural-looking, long-lasting tooth replacement solutions.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xl !px-10 !py-5">
            Find My Specialist
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <div className="py-10 bg-white border-b border-gray-100">
        <div className="container-width grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: 350, suffix: '+', label: 'Verified Partners' },
            { val: 12, suffix: 'k+', label: 'Matches' },
            { val: 4.95, suffix: '', decimals: 2, label: 'Rating' },
            { special: true, label: 'Service' }
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-display font-bold text-gray-900">
                {s.special ? 'FREE' : <CountUp end={s.val as number} suffix={s.suffix} decimals={s.decimals || 0} />}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section className="section-padding bg-white border-b border-gray-100">
        <div className="container-width text-center">
          <div className="inline-block px-4 py-1.5 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold uppercase tracking-widest rounded-full mb-5">Full Treatment Menu</div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-5">Dental Implant Treatments <span className="text-brand-600">Across the UK</span></h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">Whether you need to replace a single missing tooth or restore an entire arch, our specialist network covers every form of implant dentistry. Each treatment is carried out by independently vetted consultants with a minimum of 100 successful placements per year — not a general dentist moonlighting in implants.</p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesWithIcons.map((service) => (
              <Link key={service.id} href={'/services/' + service.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 flex flex-col">
                <div className="mb-4 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">{service.icon}</div>
                <h2 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">{service.title}</h2>
                <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">{service.desc}</p>
                <div className="flex items-center gap-2 text-brand-600 font-medium text-sm">View locations &amp; pricing <ArrowUpRight className="w-4 h-4" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Implants Section */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5">Why Dental Implants Are the Gold Standard for Tooth Replacement</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>Dental implants have been the clinically preferred solution for missing teeth for over 40 years. Unlike dentures, which sit on the gum and transfer bite forces onto soft tissue, or bridges, which grind down neighbouring healthy teeth for support, implants are titanium posts surgically placed directly into the jawbone. This replicates the root structure of a natural tooth, giving them unmatched stability, bone-preserving properties, and a longevity no other restoration can match.</p>
                <p>UK patients are increasingly choosing implants as awareness of their long-term value grows. A single implant typically costs between 1,500 and 3,500 GBP depending on complexity. With a lifespan of 20 to 30 years when properly maintained, the cost-per-year is frequently lower than repeatedly replacing dentures or repairing bridges. The NHS does not routinely fund implants, but many private practices now offer 0 percent finance plans spread over 12 to 60 months.</p>
                <p>The Essex Dental Implants network sources only consultants working with premium implant systems including Nobel Biocare, Straumann, and Osstem, and who invest in in-house 3D CBCT imaging for precise placement. If a case requires a bone graft or sinus lift, our providers manage the full care pathway in-house.</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-5">Choosing the Right Treatment</h3>
              <div className="space-y-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">What to Expect From the Implant Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">A typical treatment runs across three clinical phases. Understanding each helps you plan time and budget with confidence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "01", t: "Assessment and Planning", b: "Full clinical exam, 3D CBCT scan, medical history review. Bone volume, gum health, and existing restorations assessed. Written itemised treatment plan provided before any procedure begins." },
              { n: "02", t: "Implant Placement", b: "Under local anaesthetic the titanium post is placed into the prepared socket. Most patients describe it as no more uncomfortable than a routine extraction. Osseointegration takes 6 to 16 weeks." },
              { n: "03", t: "Crown and Aftercare", b: "Custom ceramic crown attached and colour-matched to surrounding teeth. Follow-up at 3 and 12 months verifies integration and gum health." }
            ].map((item) => (
              <div key={item.n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <span className="text-5xl font-display font-bold text-gray-100 block mb-4">{item.n}</span>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{item.t}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-900">
        <div className="container-width">
          <div className="grid md:grid-cols-3 gap-10 text-center mb-10">
            <div><p className="text-4xl font-display font-bold text-brand-300 mb-2">350+</p><p className="text-gray-400 text-sm">Verified implant specialists across the UK</p></div>
            <div><p className="text-4xl font-display font-bold text-brand-300 mb-2">12,000+</p><p className="text-gray-400 text-sm">Patients successfully matched since launch</p></div>
            <div><p className="text-4xl font-display font-bold text-brand-300 mb-2">100%</p><p className="text-gray-400 text-sm">Free to use — no fees, no obligations</p></div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed text-sm">Every specialist admitted to our network is GDC-verified, carries professional indemnity, and has documented clinical outcomes. We re-audit providers annually and remove any who fall below our quality threshold.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-lg !px-8 !py-4">Get Matched with a Specialist</button>
          </div>
        </div>
      </section>

      <FAQSection faqs={FAQS_SERVICES} />
      <Footer />
    </div>
  );
}
