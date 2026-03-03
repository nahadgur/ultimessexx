'use client';

import React, { useState } from 'react';
import { Users, Sparkles, Shield, Medal, Globe, User, ArrowUpRight, ChevronUp, MapPin, CheckCircle, Clock, Award } from '@/components/Icons';
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
  const cityName = allCities.find(city => city.toLowerCase().replace(/\s+/g, '-') === params.city);
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

  const servicesWithIcons = SERVICES.map(service => ({
    ...service,
    icon: service.id === 'single-tooth' ? <Shield className="w-7 h-7" /> :
          service.id === 'multiple-teeth' ? <Users className="w-7 h-7" /> :
          service.id === 'full-arch' ? <Medal className="w-7 h-7" /> :
          service.id === 'bone-grafting' ? <Globe className="w-7 h-7" /> :
          service.id === 'immediate-implants' ? <Sparkles className="w-7 h-7" /> :
          <User className="w-7 h-7" />
  }));

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
        <div className="container-width">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-500 mb-6">
            <Link href="/location" className="hover:text-brand-600 transition-colors">All Locations</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{cityName}</span>
          </div>
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
                <MapPin className="w-3.5 h-3.5" /> Verified Specialists in {cityName}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">
                Dental Implants in <span className="text-brand-600">{cityName}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-xl">
                Find independently vetted dental implant specialists in {cityName}. Our network covers every implant treatment type — from single tooth replacements to full arch restorations — with transparent pricing, 0% finance options, and same-week consultation availability across {cityName} and the surrounding area.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {['Free Consultation', 'No Obligation', '2hr Callback', '0% Finance Available'].map((label) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                    <span className="w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[9px] font-bold">✓</span>
                    </span>
                    {label}
                  </div>
                ))}
              </div>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary text-lg !px-8 !py-4">
                Book Free {cityName} Consultation
              </button>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7 shadow-sm">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-5">Why patients choose our {cityName} network</h3>
              <div className="space-y-4">
                {[
                  { icon: <Shield className="w-5 h-5 text-brand-600" />, title: 'GDC-Verified Clinicians', desc: 'Every {cityName} specialist holds active GDC registration and full professional indemnity cover.' },
                  { icon: <Clock className="w-5 h-5 text-brand-600" />, title: 'Fast Appointments', desc: 'Most providers offer initial consultations within 3–5 working days of your enquiry.' },
                  { icon: <Award className="w-5 h-5 text-brand-600" />, title: 'Finance Available', desc: 'Spread treatment costs over 12–60 months with 0% interest at selected practices.' },
                  { icon: <CheckCircle className="w-5 h-5 text-brand-600" />, title: 'Free Matching Service', desc: 'We match you to the right specialist at no cost. No hidden fees, ever.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TREATMENTS */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
              Available Treatments in {cityName}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All six implant treatment types are available through our {cityName} network. Select a treatment to see local availability, what the procedure involves, and indicative pricing specific to {cityName} clinics.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesWithIcons.map((service) => (
              <Link key={service.id} href={`/services/${service.id}/${params.city}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all p-7 flex flex-col">
                <div className="mb-4 w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                  {service.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {service.title} in {cityName}
                </h3>
                <p className="text-gray-500 text-sm mb-5 flex-1 leading-relaxed">{service.desc}</p>
                <div className="flex items-center gap-1.5 text-brand-600 font-semibold text-sm">
                  View {cityName} specialists <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5">
                What to Expect from Dental Implant Treatment in {cityName}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  Dental implant treatment in {cityName} follows the same evidence-based protocol used by leading specialists worldwide, but your outcome depends heavily on the diagnostic technology available at the practice and the volume of cases the clinician handles each year. Every provider in our {cityName} network operates with in-house CBCT 3D scanning — a non-negotiable requirement in our vetting process, since accurate pre-surgical imaging directly reduces complications and improves long-term implant success rates.
                </p>
                <p>
                  A standard single implant course in {cityName} typically spans three to six months from your first consultation through to final crown fitting. This timeline can be shorter if no preparatory treatment is needed, or longer if bone grafting is required before the implant post can be placed. Patients who qualify for immediate load protocols — sometimes called teeth-in-a-day — can leave their surgical appointment with a temporary restoration already in place.
                </p>
                <p>
                  Costs in {cityName} are broadly in line with the national average for private implant dentistry. Single tooth implants typically range from £1,800 to £3,200 inclusive of the post, abutment, and ceramic crown. Full arch restorations using the All-on-4 or All-on-6 technique are generally priced between £9,000 and £18,000 per arch. Every practice in our {cityName} network provides a written, itemised treatment plan before any procedure begins — you will never face an unexpected invoice.
                </p>
                <p>
                  Long-term success figures for implants placed by experienced clinicians are consistently strong. Studies show survival rates above 97% at ten years when patients maintain good oral hygiene and attend annual monitoring appointments. Our {cityName} specialists include a structured aftercare schedule — covering a 3-month integration review, a 12-month check, and annual hygiene visits — as standard in every treatment plan.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-5">Indicative Costs in {cityName}</h3>
                <div className="space-y-4">
                  {[
                    { treatment: 'Single Tooth Implant', range: '£1,800 – £3,200', note: 'Includes post, abutment and ceramic crown.' },
                    { treatment: 'Multiple Teeth (per implant)', range: '£1,600 – £2,800', note: 'Bridge options may reduce total cost.' },
                    { treatment: 'Full Arch (All-on-4)', range: '£9,000 – £15,000', note: 'Per arch. Provisional teeth same day.' },
                    { treatment: 'Implant-Retained Denture', range: '£3,500 – £7,000', note: '2–4 implants per arch.' },
                    { treatment: 'Bone Graft (if required)', range: '£500 – £2,500', note: 'Varies by volume and graft type.' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.treatment}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{item.note}</p>
                      </div>
                      <p className="text-brand-600 font-bold text-sm whitespace-nowrap">{item.range}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-4 leading-relaxed">All prices indicative. Your specialist will provide an exact written quote before treatment begins.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full text-center !py-4">
                Get Your Free {cityName} Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">How the Matching Process Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">From your first enquiry to your consultation in {cityName} — here is exactly what happens next.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { n: '01', title: 'Submit Your Details', desc: 'Complete our 90-second form. Tell us your location, treatment interest, and best contact time.' },
              { n: '02', title: 'Case Review', desc: 'Our team identifies the best-matched {cityName} specialists for your specific situation.' },
              { n: '03', title: 'Receive Quotes', desc: 'Up to three itemised quotes from verified {cityName} providers arrive within 2 hours.' },
              { n: '04', title: 'Book Consultation', desc: 'Choose your preferred specialist and book a free, no-obligation initial appointment.' },
              { n: '05', title: 'Begin Treatment', desc: 'Your specialist builds a personalised plan. You proceed entirely at your own pace.' },
            ].map((item) => (
              <div key={item.n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <span className="text-3xl font-display font-bold text-gray-100 block mb-3">{item.n}</span>
                <h3 className="font-display font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary !px-10 !py-4">
              Start Now — Takes 90 Seconds
            </button>
          </div>
        </div>
      </section>

      <FAQSection faqs={FAQS_SERVICES} />
      <Footer />
    </div>
  );
}
