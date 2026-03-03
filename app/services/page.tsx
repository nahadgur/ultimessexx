'use client';
import React,{useState} from 'react';
import {Users,Sparkles,Shield,Medal,Globe,User,ArrowUpRight,ChevronUp,CheckCircle} from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import {SERVICES,FAQS_SERVICES} from '@/lib/data';
import Link from 'next/link';

export default function ServicesPage(){
const [isModalOpen,setIsModalOpen]=useState(false);
const [showScrollTop,setShowScrollTop]=useState(false);
React.useEffect(()=>{
const h=()=>{const s=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight;setShowScrollTop(s/t>0.3);};
window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h);
},[]);
const icons:Record<string,React.ReactNode>={'single-tooth':<Shield className='w-7 h-7'/>,'multiple-teeth':<Users className='w-7 h-7'/>,'full-arch':<Medal className='w-7 h-7'/>,'bone-grafting':<Globe className='w-7 h-7'/>,'immediate-implants':<Sparkles className='w-7 h-7'/>,'implant-dentures':<User className='w-7 h-7'/>};
const servicesWithIcons=SERVICES.map(s=>({...s,icon:icons[s.id]||<User className='w-7 h-7'/>}));
return(
<div className='min-h-screen bg-white'>
<LeadFormModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}/>
<Navigation onOpenModal={()=>setIsModalOpen(true)}/>
{showScrollTop&&<button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className='fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50'><ChevronUp className='w-5 h-5'/></button>}

{/* HERO */}
<section className="relative bg-gray-900 text-white overflow-hidden min-h-[420px] flex items-end pb-16 pt-32">
  <div className="absolute inset-0 z-0">
    <img src="https://images.pexels.com/photos/4687905/pexels-photo-4687905.jpeg" className="w-full h-full object-cover" alt="Dental Implant Services" />
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/30"></div>
  </div>
  <div className="relative z-10 container-width w-full">
    <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest rounded-full mb-5 backdrop-blur-sm">Full Treatment Menu</div>
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">Dental Implant Treatments <span className="text-blue-400">Across the UK</span></h1>
    <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-6">Every form of implant dentistry, delivered by independently vetted consultants with a minimum of 100 successful placements per year.</p>
    <button onClick={()=>setIsModalOpen(true)} className="btn-primary text-lg !px-8 !py-4">Find My Specialist</button>
  </div>
</section>

{/* SERVICES GRID */}
<section className="section-padding bg-gray-50">
<div className="container-width">
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
{servicesWithIcons.map((service)=>(
<Link key={service.id} href={'/services/'+service.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 flex flex-col">
<div className="mb-4 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">{service.icon}</div>
<h2 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">{service.title}</h2>
<p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">{service.desc}</p>
<div className="flex items-center gap-2 text-brand-600 font-medium text-sm">View locations &amp; pricing <ArrowUpRight className="w-4 h-4"/></div>
</Link>
))}
</div>
</div>
</section>

{/* WHY IMPLANTS + COMPARISON TABLE */}
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
<div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-gray-50 border-b border-gray-100">
        <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Factor</th>
        <th className="text-center px-4 py-3 text-brand-600 font-bold text-xs uppercase tracking-wider">Implants</th>
        <th className="text-center px-4 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Dentures</th>
        <th className="text-center px-4 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wider">Bridges</th>
      </tr>
    </thead>
    <tbody>
      {[
        {factor:'Longevity', implant:'20–30+ yrs', denture:'5–8 yrs', bridge:'10–15 yrs'},
        {factor:'Bone preservation', implant:'✓ Yes', denture:'✗ No', bridge:'✗ No'},
        {factor:'Adjacent teeth affected', implant:'✓ None', denture:'✓ None', bridge:'✗ Drilled'},
        {factor:'Removable', implant:'✓ Fixed', denture:'✗ Removable', bridge:'✓ Fixed'},
        {factor:'Eating restriction', implant:'✓ None', denture:'✗ Many', bridge:'Minimal'},
        {factor:'Looks natural', implant:'✓ Yes', denture:'Partial', bridge:'✓ Yes'},
        {factor:'Cost (per tooth/yr)', implant:'Lowest', denture:'Medium', bridge:'Medium'},
      ].map((row,i)=>(
        <tr key={i} className={i%2===0?'bg-white':'bg-gray-50/50'}>
          <td className="px-5 py-3 text-gray-700 font-medium">{row.factor}</td>
          <td className="px-4 py-3 text-center text-brand-600 font-semibold">{row.implant}</td>
          <td className="px-4 py-3 text-center text-gray-500">{row.denture}</td>
          <td className="px-4 py-3 text-center text-gray-500">{row.bridge}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<button onClick={()=>setIsModalOpen(true)} className="btn-primary w-full !py-3 mt-5">Get Matched with a Specialist</button>
</div>
</div>
</div>
</section>

{/* PROCESS */}
<section className="section-padding bg-gray-50">
<div className="container-width">
<div className="text-center mb-10">
<h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">What to Expect From the Implant Process</h2>
<p className="text-gray-600 max-w-2xl mx-auto text-sm">A typical treatment runs across three clinical phases. Understanding each helps you plan time and budget with confidence.</p>
</div>
<div className="grid md:grid-cols-3 gap-8">
{[{n:"01",t:"Assessment and Planning",b:"Full clinical exam, 3D CBCT scan, medical history review. Bone volume, gum health, and existing restorations assessed. Written itemised treatment plan provided before any procedure begins."},
{n:"02",t:"Implant Placement",b:"Under local anaesthetic the titanium post is placed into the prepared socket. Most patients describe it as no more uncomfortable than a routine extraction. Osseointegration takes 6 to 16 weeks."},
{n:"03",t:"Crown and Aftercare",b:"Custom ceramic crown attached and colour-matched to surrounding teeth. Follow-up at 3 and 12 months verifies integration and gum health."}].map((item)=>(
<div key={item.n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
<span className="text-5xl font-display font-bold text-gray-100 block mb-4">{item.n}</span>
<h3 className="text-xl font-display font-bold text-gray-900 mb-3">{item.t}</h3>
<p className="text-gray-600 text-sm leading-relaxed">{item.b}</p>
</div>))}
</div>
</div>
</section>

{/* TRUST BAR */}
<section className="py-16 bg-gray-900">
<div className="container-width">
<div className="grid md:grid-cols-3 gap-10 text-center mb-10">
<div><p className="text-4xl font-display font-bold text-brand-300 mb-2">350+</p><p className="text-gray-400 text-sm">Verified implant specialists across the UK</p></div>
<div><p className="text-4xl font-display font-bold text-brand-300 mb-2">12,000+</p><p className="text-gray-400 text-sm">Patients successfully matched since launch</p></div>
<div><p className="text-4xl font-display font-bold text-brand-300 mb-2">100%</p><p className="text-gray-400 text-sm">Free to use — no fees, no obligations</p></div>
</div>
<div className="border-t border-gray-700 pt-8 text-center">
<p className="text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed text-sm">Every specialist admitted to our network is GDC-verified, carries professional indemnity, and has documented clinical outcomes. We re-audit providers annually and remove any who fall below our quality threshold.</p>
<button onClick={()=>setIsModalOpen(true)} className="btn-primary text-lg !px-8 !py-4">Get Matched with a Specialist</button>
</div>
</div>
</section>

<FAQSection faqs={FAQS_SERVICES}/>
<Footer/>
</div>
);
}
