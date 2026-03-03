'use client';

import React, { useState } from 'react';
import { CheckCircle, Clock, Shield, Award, MapPin, ChevronUp, Users } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { SERVICES, LOCATIONS, FAQS_SERVICES } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SERVICE_IMAGES: Record<string, string> = {
  'single-tooth': 'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?q=80&w=1170&auto=format&fit=crop',
  'multiple-teeth': 'https://images.pexels.com/photos/6502343/pexels-photo-6502343.jpeg',
  'full-arch': 'https://images.pexels.com/photos/4687905/pexels-photo-4687905.jpeg',
  'bone-grafting': 'https://images.pexels.com/photos/6629364/pexels-photo-6629364.jpeg',
  'immediate-implants': 'https://images.pexels.com/photos/5355826/pexels-photo-5355826.jpeg',
  'implant-dentures': 'https://images.pexels.com/photos/3779699/pexels-photo-3779699.jpeg',
};

function HeroLeadForm({ cityName }: { cityName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
      const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      const treatment = (form.elements.namedItem('treatment') as HTMLSelectElement).value;

      const payload = {
        fullName,
        phone,
        email,
        treatment,
        location: cityName,
        page: typeof window !== 'undefined' ? window.location.href : '',
        source: 'Essex Dental Implants - Hero Form',
      };

      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbz-B9H0JTI7a9Cgyn9z-pZXKnuiNm6acAn8Zb13N21qGRcpxy7EtVvlPAjpl6f7Hj3-RQ/exec',
        { method: 'POST', body: JSON.stringify(payload) }
      );

      const text = await res.text();
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(text); } catch {}
      if (data && data.ok === false) throw new Error((data.error as string) || 'Submission failed');

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full rounded-[2rem] bg-white shadow-[0_32px_80px_-8px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden">
      <div className="p-8 md:p-10">
        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-10 space-y-5">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10">
              <CheckCircle className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Request Received!</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                We&apos;ve matched you with a Platinum Partner in {cityName}. Check your email for next steps.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                Free Matching Service
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                Get Matched in {cityName}
              </h3>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Top local clinics will contact you within 2 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                name="fullName"
                type="text"
                placeholder="Full Name *"
                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10 outline-none transition-all placeholder:text-slate-300"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="Phone Number *"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10 outline-none transition-all placeholder:text-slate-300"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <select
                required
                name="treatment"
                defaultValue=""
                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Treatment *</option>
                {SERVICES.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
                <option value="Not Sure Yet">Not Sure Yet</option>
              </select>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black text-base rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group/btn mt-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                {isSubmitting ? (
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Get 3 Free Quotes
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 pt-1">
                {['100% Free', 'No Spam', '2hr Response'].map((label) => (
                  <span key={label} className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    {label}
                  </span>
                ))}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ServiceCityPage({ params }: { params: { service: string; city: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const service = SERVICES.find(s => s.id === params.service);
  const allCities = Object.values(LOCATIONS).flat();
  const cityName = allCities.find(city =>
    city.toLowerCase().replace(/\s+/g, '-') === params.city
  );

  if (!service || !cityName) notFound();

  const heroImage = SERVICE_IMAGES[params.service] || SERVICE_IMAGES['single-tooth'];

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

  const benefits = [
    { icon: <Shield className="w-6 h-6" />, title: 'GDC-Verified Specialists Only', desc: 'Every clinician holds current GDC registration and a significant implant caseload — we do not list occasional practitioners.' },
    { icon: <Clock className="w-6 h-6" />, title: '2-Hour Response Guarantee', desc: 'After submitting your details we identify and contact your matched specialists within 2 working hours — no waiting days for a callback.' },
    { icon: <Award className="w-6 h-6" />, title: 'Always Free to Use', desc: 'Our matching and comparison service costs nothing to patients. We are paid a referral fee by practices, never by you.' },
    { icon: <Users className="w-6 h-6" />, title: 'Up to 3 Competing Quotes', desc: 'Compare personalised treatment plans and transparent pricing from multiple verified local specialists before committing to anything.' },
  ];

  const treatmentSteps = [
    'Complete the short matching form above with your name, contact details, and treatment interest. It takes under two minutes.',
    'Our team reviews your case and identifies the best-matched specialists for your specific treatment in '+cityName+'.',
    'Within 2 working hours you receive personalised quotes and treatment outlines from up to 3 verified local providers.',
    'Review options at your own pace. Ask questions directly before deciding who to proceed with.',
    'Book your free initial consultation at your chosen '+cityName+' practice. Confirm the plan and costs in writing before any commitment.',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
          <img src={heroImage} alt={service.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm text-white/70 backdrop-blur-sm">
            <Link href="/services" className="hover:text-blue-400 transition-colors">All Services</Link>
            <span>/</span>
            <Link href={`/services/${params.service}`} className="hover:text-blue-400 transition-colors">{service.title}</Link>
            <span>/</span>
            <span className="text-white">{cityName}</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
            <div className="space-y-6 pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 text-sm text-blue-300 backdrop-blur-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Elite Platinum Providers Available</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg">
                {service.title}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400 italic mt-1">
                  in {cityName}
                </span>
              </h1>

              <p className="text-lg text-white/80 leading-relaxed font-medium max-w-lg">
                Find GDC-registered {service.title.toLowerCase()} specialists in {cityName} who place implants as their primary clinical focus — not as an occasional add-on. Our matching service is free, takes under two minutes, and gets you up to three itemised quotes within 2 hours.
              </p>

              <div className="flex flex-wrap gap-5 pt-1">
                {['Free Consultation', 'No Obligation', 'Same-week Appointments', '0% Finance Available'].map((label) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-white/80 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <HeroLeadForm cityName={cityName} />
            </div>
          </div>
        </div>
      </div>

      {/* REST OF PAGE */}
      <div className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="mb-4 p-3 rounded-xl bg-blue-50 text-blue-500 inline-flex">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-500">{benefit.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8 text-center">
              Your {service.title} Journey in {cityName}: Step by Step
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {treatmentSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-slate-600 font-medium pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
                Why Our {cityName} Specialists Outperform Standard Practices
              </h3>
              <div className="space-y-4">
                {[
                  'GDC-registered clinicians who place implants as their primary clinical focus — not as an occasional side offering from a general practice.',
                  'In-house 3D CBCT scanning and digital treatment planning at every listed practice — never outsourced to a referral centre.',
                  `Convenient ${cityName} locations with flexible appointment times`,
                  'Structured aftercare protocols and written guarantees on materials and workmanship included with every treatment.',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <p className="text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/50 p-10 rounded-[2.5rem] border border-blue-200">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Ready to Start Your Treatment in {cityName}?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Every practice in our {cityName} network undergoes independent clinical vetting before listing and annual re-auditing thereafter. Your treatment plan is confirmed in writing with itemised costs before any commitment is made.
              </p>
              <ul className="space-y-3 mb-8">
                {['Free initial consultation', 'No obligation assessment', 'Transparent pricing from the start'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-8 py-5 bg-blue-500 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all"
              >
                Book Your {cityName} Consultation
              </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Other Treatments in {cityName}</h3>
                <div className="space-y-2">
                  {SERVICES.filter(s => s.id !== params.service).slice(0, 5).map(s => (
                    <Link
                      key={s.id}
                      href={`/services/${s.id}/${params.city}`}
                      className="block px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-slate-900 transition-all text-sm font-medium"
                    >
                      {s.title} in {cityName}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{service.title} in Other Cities</h3>
                <div className="space-y-2">
                  {allCities.filter(c => c !== cityName).slice(0, 5).map(city => {
                    const slug = city.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link
                        key={city}
                        href={`/services/${params.service}/${slug}`}
                        className="block px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-slate-900 transition-all text-sm font-medium"
                      >
                        {service.title} in {city}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDITORIAL CARDS */}
        <div className="px-4 sm:px-0">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">{service.title} in {cityName}: What Patients Need to Know</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">Clinical facts and what separates good treatment from great treatment in {cityName}.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7"><div className="text-3xl mb-3">🦷</div><h3 className="font-display font-bold text-gray-900 mb-3 text-lg">Why implants outperform every alternative</h3><p className="text-gray-600 text-sm leading-relaxed">Dental implants are the only replacement that prevents bone loss. When a tooth is extracted, the jawbone resorbs within weeks — losing width then height. Bridges and dentures replace what is visible but do nothing beneath. An implant post transmits chewing forces into the bone, preserving its density and protecting your facial structure. Choosing {service.title.toLowerCase()} in {cityName} now stops bone deterioration that makes future treatment progressively harder and costlier.</p></div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7"><div className="text-3xl mb-3">🔬</div><h3 className="font-display font-bold text-gray-900 mb-3 text-lg">Why specialist experience matters in {cityName}</h3><p className="text-gray-600 text-sm leading-relaxed">The quality of {service.title.toLowerCase()} in {cityName} varies widely between providers. General practices placing implants occasionally lack the case volume and equipment of dedicated specialists. Every practice in our {cityName} network uses in-house CBCT 3D scanning — mapping bone density, nerve canals, and sinus anatomy to sub-millimetre accuracy before surgery. This precision is the foundation of predictable, complication-free outcomes.</p></div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7"><div className="text-3xl mb-3">📊</div><h3 className="font-display font-bold text-gray-900 mb-3 text-lg">97% survival — but only with the right protocol</h3><p className="text-gray-600 text-sm leading-relaxed">Ten-year implant survival rates exceed 97% when placed by experienced clinicians with structured aftercare. The two most common failure modes — peri-implantitis and early loading failure — are substantially reduced by rigorous patient selection and monitoring. Every plan from our {cityName} specialists includes a 12-week integration review, bite check at crown fitting, and annual hygiene visits as standard. Success is a protocol, not a passive outcome.</p></div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7"><div className="text-3xl mb-3">💬</div><h3 className="font-display font-bold text-gray-900 mb-3 text-lg">Been told you are not suitable? Get a second opinion</h3><p className="text-gray-600 text-sm leading-relaxed">Many patients told they cannot have implants — due to bone loss, age, or health conditions — are reassessed by our {cityName} specialists and found to be viable with the right preparatory treatment. Bone grafting and sinus lifts open the door for most initially declined patients. Our matching service arranges a free written assessment with a verified {cityName} clinician. No cost, no obligation.</p></div>
          </div>
        </div>
        <FAQSection faqs={FAQS_SERVICES} />
      </div>

      <Footer />
    </div>
  );
}
