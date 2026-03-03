'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Shield, Sparkles, ChevronUp, CheckCircle, Globe, Users, Medal } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { FAQS_HOME } from '@/lib/data';

// Marquee images for Results section  
const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?q=80&w=1170&auto=format&fit=crop',
  'https://images.pexels.com/photos/6502343/pexels-photo-6502343.jpeg',
  'https://images.pexels.com/photos/4687905/pexels-photo-4687905.jpeg',
  'https://images.pexels.com/photos/6629364/pexels-photo-6629364.jpeg',
  'https://images.pexels.com/photos/5355826/pexels-photo-5355826.jpeg',
  'https://images.pexels.com/photos/3779699/pexels-photo-3779699.jpeg',
];


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
      setShowScrollTop(scrollPos / height > 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4687905/pexels-photo-4687905.jpeg" 
            className="w-full h-full object-cover animate-slow-zoom" 
            alt="Dental Implants UK" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/50 to-gray-900/20"></div>
        </div>
        <div className="relative container-width py-24 md:py-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Premium Dental Implant Specialists</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight drop-shadow-sm">
            The Network For <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 animate-gradient">
              Dental Implants In Essex.
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Connecting patients with elite dental implant specialists for natural-looking, long-lasting tooth replacement solutions.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary text-xl !px-10 !py-5"
          >
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
            { val: 0, suffix: 'Free', label: 'Service', special: true }
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-display font-bold text-gray-900">
                {s.special ? 'FREE' : <CountUp end={s.val} suffix={s.suffix} decimals={s.decimals || 0} />}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Dental Implants Section */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Why Choose Dental Implants?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The gold standard for tooth replacement. Permanent, natural-looking, and designed to last a lifetime.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'Natural Appearance',
                desc: 'Custom-crafted implant crowns match your natural teeth perfectly. Indistinguishable from real teeth in both look and feel.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Permanent Solution',
                desc: 'Unlike dentures or bridges, implants are permanently fused to your jawbone. No adhesives, no removal, no slipping.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Preserve Bone Health',
                desc: 'Titanium implants stimulate jawbone growth, preventing bone loss that occurs with missing teeth. Maintains facial structure.'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Eat Anything',
                desc: 'Bite force comparable to natural teeth. Enjoy steak, apples, and all your favourite foods without restrictions or worry.'
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: 'Lifetime Durability',
                desc: 'With proper care, dental implants can last 25+ years or a lifetime. The most cost-effective long-term tooth replacement option.'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Confidence Restored',
                desc: 'Smile, laugh, and speak without worrying about gaps, loose dentures, or damaged teeth. Feel truly confident again.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to your perfect smile. We make finding the right specialist effortless.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Assessment',
                desc: 'Share your needs through our quick form. Tell us about your dental situation and location preferences.',
                icon: <Calendar className="w-8 h-8" />,
                color: 'text-blue-500'
              },
              {
                num: '02',
                title: 'Match',
                desc: 'Our system identifies the best-qualified specialists in your area based on your specific requirements.',
                icon: <Shield className="w-8 h-8" />,
                color: 'text-blue-500'
              },
              {
                num: '03',
                title: 'Referral',
                desc: 'Receive a direct referral for a free consultation and comprehensive treatment plan.',
                icon: <Sparkles className="w-8 h-8" />,
                color: 'text-blue-500'
              }
            ].map((s, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center ${s.color}`}>
                    {s.icon}
                  </div>
                  <span className="text-5xl font-display font-bold text-gray-100">{s.num}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-4">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Treat Section */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">When You Need Dental Implants</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From single tooth replacement to full arch restoration, our specialists handle every case with precision and care.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Single Tooth',
                desc: 'Replace one missing tooth without affecting adjacent healthy teeth. Most common implant procedure.'
              },
              {
                title: 'Multiple Teeth',
                desc: 'Restore several missing teeth with individual implants or implant-supported bridges for stability.'
              },
              {
                title: 'Full Arch',
                desc: 'Replace an entire upper or lower arch with All-on-4 or All-on-6 implant-supported dentures.'
              },
              {
                title: 'Failed Teeth',
                desc: 'Extract severely damaged or decayed teeth and immediately replace with permanent implant solutions.'
              },
              {
                title: 'Denture Upgrade',
                desc: 'Convert removable dentures to implant-retained for superior stability, comfort, and confidence.'
              },
              {
                title: 'Bone Loss',
                desc: 'Advanced procedures including bone grafting and sinus lifts to enable implant placement despite bone loss.'
              },
              {
                title: 'Accident Trauma',
                desc: 'Restore teeth lost to injury or trauma with natural-looking, fully functional implant replacements.'
              },
              {
                title: 'Congenital Missing',
                desc: 'Replace teeth that never developed with permanent implant solutions for complete smile restoration.'
              }
            ].map((condition, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <h3 className="font-display font-bold text-gray-900 mb-2">{condition.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{condition.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Specialist Difference Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold uppercase tracking-widest rounded-full">
                Elite Specialist Network
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                The <span className="text-brand-600">Specialist</span> Difference
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Not all dentists place implants. Our network consists exclusively of verified specialists with advanced training and extensive experience.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  'Minimum 100+ successful implant placements annually',
                  'Advanced surgical training in implantology and bone grafting',
                  'State-of-the-art 3D imaging and guided surgery technology',
                  'Proven track record with verifiable patient outcomes',
                  'Continuous education on latest implant systems and techniques'
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600">{point}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary text-lg !px-8 !py-4"
              >
                Find Your Specialist
              </button>
            </div>
            <div className="relative">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop"
                  alt="Dental Implant Specialist"
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 p-6 rounded-2xl border border-blue-200 bg-white shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Medal className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-xl font-display font-bold text-gray-900">350+</p>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Vetted Specialists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={FAQS_HOME} />

      {/* Final CTA Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="container-width text-center relative z-10">
          <h2 className="text-4xl font-display font-bold text-white">
            Ready for Your Permanent Smile?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with a verified dental implant specialist in your area. Free consultation, expert care, and results that last a lifetime.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="pulse-glow px-12 py-6 bg-blue-500 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all"
          >
            Get Matched with a Specialist
          </button>
          <p className="text-sm text-gray-400">
            No cost to use our service • Verified specialists only • Free consultation matching
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
