'use client';

import React, { useState } from 'react';
import { Users, Sparkles, Shield, Medal, Globe, User, ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { SERVICES, FAQS_SERVICES } from '@/lib/data';
import Link from 'next/link';

export default function ServicesPage() {
const [isModalOpen, setIsModalOpen] = useState(false);
const [showScrollTop, setShowScrollTop] = useState(false);

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
className={`fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
>
<ChevronUp className="w-6 h-6" />
</button>

<div className="section-padding bg-white">
<div className="container-width space-y-16">
<div className="text-center mb-14">
<h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
Elite Dental Implants <span className="text-blue-500 italic">Treatments</span>
</h1>
<p className="text-lg text-gray-600 max-w-2xl mx-auto">
Customised dental implant solutions for every clinical challenge, from complex bite issues to lifestyle-focused adult treatment.
</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
{servicesWithIcons.map((service) => (
<Link
key={service.id}
href={`/services/${service.id}`}
className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 flex flex-col"
>
<div className={`mb-4 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600`}>
{service.icon}
</div>
<h2 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
{service.title}
</h2>
<p className="text-gray-600 text-sm mb-6 flex-1">{service.desc}</p>
<div className="flex items-center gap-2 text-brand-600 font-medium text-sm">
Learn more <ArrowUpRight className="w-4 h-4" />
</div>
</Link>
))}
</div>
</div>

<FAQSection faqs={FAQS_SERVICES} />
</div>

<Footer />
</div>
);
}
