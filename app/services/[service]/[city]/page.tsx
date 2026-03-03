'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Globe, ArrowUpRight, ChevronUp, CheckCircle, Shield, Clock, Award, Users } from '@/components/Icons';
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
  'implant-dentures': 'https://images.pexels.com/photos/3779699/pexels-photo-3779699.jpeg',
};

const SERVICE_CONTENT: Record<string, {
  tagline: string;
  intro: string;
  who: string;
  process: string;
  cost: string;
  costRange: string;
  candidateCriteria: string[];
  processSteps: { title: string; desc: string }[];
}> = {
  'single-tooth': {
    tagline: 'The most common implant procedure. One missing tooth replaced permanently with a titanium post and custom-milled ceramic crown.',
    intro: 'A single tooth implant is the gold-standard replacement for one missing tooth. Unlike a bridge — which grinds down two adjacent healthy teeth to support a false tooth in the middle — an implant stands completely independently in the jaw. The titanium post fuses with the bone over 6–12 weeks in a process called osseointegration, after which a custom ceramic crown is attached that is indistinguishable from a natural tooth in colour, shape, and function.',
    who: 'Single tooth implants are suitable for the majority of adults who have lost a tooth through decay, trauma, or failed root canal treatment. The primary requirements are adequate jawbone volume at the site (or willingness to undergo a bone graft first), healthy gums free from active periodontal disease, and no uncontrolled systemic conditions that impair healing. Smokers can receive implants but are advised of the higher failure risk and counselled accordingly.',
    process: 'Treatment begins with a CBCT 3D scan to assess bone volume and proximity to nerves and sinuses. If bone is sufficient, the implant post is placed under local anaesthetic in a 45–90 minute procedure. A healing cap sits flush with the gum during the osseointegration period. Once the implant has integrated — typically 8–16 weeks — an abutment is attached and impressions taken for the custom crown. The crown fitting appointment takes around 30 minutes.',
    cost: 'Single tooth implants in the UK range from £1,500 to £3,500 for the full treatment including post, abutment, and crown. Cost variation reflects clinician experience, practice location, implant brand, and crown material. Our network provides itemised quotes before any commitment.',
    costRange: '£1,500 – £3,500',
    candidateCriteria: [
      'One or more missing teeth due to extraction, trauma, or decay',
      'Sufficient jawbone density at the implant site, or willingness to graft',
      'Gums free from active periodontal (gum) disease',
      'Non-smoker, or aware of elevated risk and willing to reduce smoking',
      'No uncontrolled diabetes or conditions that impair osseointegration',
      'Commitment to annual hygiene and monitoring appointments',
    ],
    processSteps: [
      { title: 'CBCT Scan & Consultation', desc: 'A 3D cone beam CT scan maps your bone volume, nerve pathways, and sinus anatomy. Your specialist reviews this alongside a full clinical examination to confirm you are a suitable candidate and plan the implant position precisely.' },
      { title: 'Implant Placement', desc: 'Under local anaesthetic (sedation available), a small incision is made in the gum and the titanium post is placed into the prepared socket. Most patients describe the procedure as similar in discomfort to a straightforward extraction. You leave with a healing cap or temporary crown.' },
      { title: 'Osseointegration', desc: 'Over 8–16 weeks the titanium surface bonds with your jawbone through a biological process called osseointegration. During this period you maintain normal eating and oral hygiene. A mid-point check at 6–8 weeks confirms integration is progressing as expected.' },
      { title: 'Abutment & Crown', desc: 'Once fully integrated, a small connector piece called an abutment is attached to the implant. Digital impressions or a physical mould are taken and sent to the dental laboratory. Your custom-milled ceramic crown arrives within 1–2 weeks and is fitted in a 30-minute appointment.' },
      { title: 'Aftercare', desc: 'A 3-month post-placement review checks soft tissue health and bite alignment. Annual hygiene and monitoring visits thereafter are included in your treatment plan. With proper care, your implant should function for 20–30 years.' },
    ],
  },
  'multiple-teeth': {
    tagline: 'Replace several missing teeth with individual implants or implant-supported bridges — without touching healthy adjacent teeth.',
    intro: 'When two or more adjacent or scattered teeth are missing, multiple tooth implants offer a permanent, stable solution that preserves full chewing function and prevents the bone resorption that follows tooth loss. Depending on how many teeth are missing and their positions, your specialist will recommend either individual implants for each tooth or an implant-supported bridge — where two implants support a three- or four-unit bridge spanning the gap. Both approaches leave neighbouring healthy teeth completely untouched.',
    who: 'Candidates for multiple tooth implants are adults missing two or more teeth, whether consecutively or in different quadrants of the mouth. The same eligibility criteria apply as for single implants — adequate bone volume, healthy gums, and no systemic conditions preventing healing — though cases with more missing teeth are often planned across two surgical stages. Patients previously told they needed full dentures are frequently found to be better served by multiple implants or an implant-supported partial restoration.',
    process: 'Assessment involves full-arch CBCT scanning to map all available bone across the treatment sites. Where teeth are missing in different areas, implants may be placed in a single surgical session or staged across two procedures. Bridge designs are planned digitally before any surgery begins, so the final result is visualised and agreed before a single incision is made.',
    cost: 'Multiple tooth implant costs depend on the number of implants placed and whether bridges are used to span gaps. Expect £1,500–£2,800 per implant with volume savings available when four or more implants are placed in one session.',
    costRange: '£1,500 – £2,800 per implant',
    candidateCriteria: [
      'Two or more missing teeth in any position or quadrant',
      'Sufficient bone at each planned implant site (or graft candidacy)',
      'No active gum disease or willingness to complete periodontal treatment first',
      'Realistic expectations regarding staged treatment over several months',
      'Commitment to diligent home oral hygiene around multiple implants',
      'No uncontrolled systemic health conditions affecting healing',
    ],
    processSteps: [
      { title: 'Full-Arch Assessment', desc: 'A comprehensive CBCT scan and clinical examination maps every potential implant site. Your specialist discusses single implants vs bridge-on-implant options and presents a digital treatment plan showing the proposed outcome.' },
      { title: 'Treatment Planning', desc: 'For complex multiple-tooth cases, a detailed restorative plan is designed before surgery begins. This includes the number of implants, their positions, angulations, and the final bridge or crown design — all confirmed in writing with itemised costs.' },
      { title: 'Surgical Placement', desc: 'Implants are placed in a single session where bone quality permits, or across two staged procedures if different areas require preparatory treatment. Local anaesthetic is standard; IV sedation is available at most of our network practices.' },
      { title: 'Integration Period', desc: 'The osseointegration period typically runs 8–20 weeks for multiple implants. Temporary restorations maintain aesthetics and function throughout. A mid-point review at 8 weeks assesses progress across all sites.' },
      { title: 'Final Restorations', desc: 'Individual crowns or bridge units are fabricated to your exact specifications using digital impressions. Fitting appointments are scheduled per arch or quadrant. Final bite adjustments are made and the result photographed for your records.' },
    ],
  },
  'full-arch': {
    tagline: 'Replace an entire upper or lower arch with 4–6 implants. Permanent, fixed teeth — not dentures.',
    intro: 'Full arch restoration — most commonly delivered as All-on-4 or All-on-6 — replaces every tooth in the upper or lower jaw using just four or six precisely angled implant posts. A full fixed bridge is attached to those posts, giving you a complete set of permanent teeth that cannot be removed, do not rely on adhesive, and restore full biting force. It is the most comprehensive implant solution available and is frequently the most cost-effective per-tooth option for patients who have lost most or all of their teeth.',
    who: 'Full arch restoration is suitable for patients who have lost all or nearly all teeth in one or both arches, including long-term denture wearers who want a permanent alternative. The All-on-4 technique specifically is designed to work in patients with reduced bone density — the posterior implants are angled to engage denser anterior bone, frequently avoiding the need for bone grafts. Patients with heavily decayed or failing teeth are also candidates, with extractions and implant placement completed in a single surgical session.',
    process: 'Full arch cases begin with a comprehensive consultation including full-arch CBCT scanning and a detailed restorative evaluation. The surgical session — under sedation for most patients — places four or six implants and attaches a provisional full-arch bridge the same day. The provisional bridge is worn for 3–6 months while osseointegration completes, then replaced with the definitive high-strength ceramic or zirconia bridge.',
    cost: 'Full arch restoration typically costs £9,000–£18,000 per arch inclusive of all implants, the provisional bridge, and the final prosthetic. Both arches together range from £16,000 to £28,000 at most of our network practices. Finance options spread this across up to 60 monthly payments.',
    costRange: '£9,000 – £18,000 per arch',
    candidateCriteria: [
      'Missing all or most teeth in the upper or lower arch',
      'Long-term denture wearer seeking a fixed, permanent alternative',
      'Sufficient anterior bone volume (angled implants reduce graft need)',
      'No active infection or uncontrolled periodontal disease',
      'Willingness to commit to a 6–12 month treatment timeline',
      'Good general health with no uncontrolled conditions affecting healing',
    ],
    processSteps: [
      { title: 'Comprehensive Planning', desc: 'Full-arch CBCT scanning, digital smile design, and a detailed restorative plan are completed before surgery. You see a digital preview of your final result and approve the tooth shape, size, and shade in advance.' },
      { title: 'Extractions & Implant Placement', desc: 'Any remaining failing teeth are removed and four or six implants placed in the same procedure under sedation. The angled placement technique maximises contact with available bone, typically removing the need for grafting.' },
      { title: 'Provisional Bridge Fitted Same Day', desc: 'A pre-fabricated provisional full-arch bridge is attached directly to the implants before you leave. You walk out with a complete set of fixed temporary teeth on the day of surgery.' },
      { title: 'Osseointegration Period', desc: 'Over 3–6 months the implants fuse with the bone. The provisional bridge is functional throughout — you eat normally, maintain hygiene with an interdental brush and water flosser, and attend mid-point reviews.' },
      { title: 'Definitive Bridge Fitting', desc: 'Once integration is confirmed, precision digital impressions are taken for the final bridge. The definitive prosthetic — milled from high-strength zirconia or ceramic — is fitted and adjusted to your exact bite. The result is permanent, beautiful, and built to last decades.' },
    ],
  },
  'bone-grafting': {
    tagline: 'Rebuild the foundation. Advanced bone and sinus procedures that make implants possible when volume is insufficient.',
    intro: 'When a tooth is lost, the jawbone that once supported its root begins to resorb — losing both height and width over months and years. Patients who have worn dentures for several years, or who lost teeth after trauma or long-standing infection, frequently have insufficient bone to support an implant without first rebuilding the site. Bone grafting and sinus lift procedures restore the volume and density needed to predictably place and integrate implants. Far from being a complication, these are well-established, routine procedures that our specialist network performs regularly.',
    who: 'Bone grafting is indicated for patients who have been told they cannot have implants due to thin or insufficient bone, those who have worn dentures for more than two or three years, patients who lost teeth after jaw infections or cysts, and those requiring implants in the posterior upper jaw where the maxillary sinus limits available bone height. Sinus lifts specifically address the upper back jaw. A CBCT scan is the definitive diagnostic tool — many patients told by a general dentist that grafting is impossible are reassessed by specialists and found to be viable candidates.',
    process: 'Bone grafting uses material placed at the implant site to stimulate new bone growth. The graft source can be the patient\'s own bone (autograft), donor bone (allograft), bovine-derived material (xenograft), or synthetic alternatives — your specialist will advise the most appropriate option. Healing takes 4–9 months before implant placement. Sinus lifts are performed through a small window in the lateral sinus wall, with the membrane gently elevated and the space filled with graft material.',
    cost: 'Bone grafting costs range from £500 to £2,500 depending on the volume of graft material required and the technique used. Sinus lifts are typically £1,200–£2,500 per side. These costs are in addition to implant placement fees.',
    costRange: '£500 – £2,500',
    candidateCriteria: [
      'Insufficient bone width or height at the planned implant site',
      'Long-term denture wearer with significant bone resorption',
      'Upper back jaw where sinus proximity limits bone height',
      'Bone loss following jaw infection, cyst removal, or trauma',
      'Previously told implants are not possible due to bone volume',
      'Willingness to undertake a longer treatment timeline (12–18 months total)',
    ],
    processSteps: [
      { title: 'CBCT Assessment', desc: 'A 3D CBCT scan precisely measures bone volume at every planned implant site. Deficiency sites are identified and a grafting strategy is planned — including graft source, volume, and likely healing timeline — before any treatment begins.' },
      { title: 'Graft Procedure', desc: 'Performed under local anaesthetic, the graft material is placed at the deficient site and covered with a resorbable membrane that guides new bone formation. The gum is sutured closed. Most patients experience mild swelling for 3–5 days.' },
      { title: 'Healing Period', desc: 'New bone forms gradually over 4–9 months. A follow-up CBCT at the 4-month mark assesses graft integration. Patients are reviewed at 6–8 week intervals throughout. Normal eating and speaking are maintained during healing.' },
      { title: 'Implant Placement', desc: 'Once the grafted bone has matured and achieved sufficient density, implant placement proceeds as standard. The combined graft-and-implant approach delivers long-term stability comparable to placement in native bone.' },
      { title: 'Crown or Restoration', desc: 'Following osseointegration of the implant into the grafted bone, the abutment and crown or bridge are fabricated and fitted in the usual sequence. The full treatment journey from graft to final crown typically spans 12–18 months.' },
    ],
  },
  'immediate-implants': {
    tagline: 'Tooth out, implant in, temporary crown fitted — all in a single appointment.',
    intro: 'Immediate load implants — also called same-day implants or teeth-in-a-day — allow the implant post to be placed and a temporary crown or bridge attached in a single surgical session, often on the same day a failing tooth is extracted. Not every patient qualifies, but for those who do, the benefits are significant: no gap in your smile, no waiting months with a denture, and a restoration that immediately functions and looks like a natural tooth while the implant integrates with the bone beneath.',
    who: 'Immediate loading is suitable for patients with good bone density at the extraction site, no active infection at the time of surgery, and a bite pattern that allows the temporary crown to be kept out of heavy occlusal contact during healing. It is most predictably applied to front teeth, where aesthetic impact is greatest. Posterior single teeth and full-arch cases (teeth-in-a-day for All-on-4) are also well-established indications. Patients with poor bone density, active infection, or heavy grinding habits are usually advised to follow the conventional staged approach.',
    process: 'Your specialist will assess your bone volume and extraction site health at the consultation stage. If immediate loading is deemed appropriate, the tooth extraction, implant placement, and temporary crown attachment are coordinated in a single surgical session typically lasting 90–120 minutes. The temporary restoration is fabricated in advance or chairside on the day. It is adjusted to ensure minimal occlusal contact while the implant integrates — this is the critical factor in immediate load success.',
    cost: 'Immediate load implants carry a similar cost to conventional implants in the £1,800–£3,500 range per tooth, with the convenience of same-day temporisation often included rather than charged separately. Full-arch same-day cases are priced comparably to standard All-on-4 treatment.',
    costRange: '£1,800 – £3,500',
    candidateCriteria: [
      'Good bone density and volume at the planned extraction and implant site',
      'No active infection, abscess, or acute periodontal disease at the site',
      'Front or premolar teeth where aesthetic benefit is most pronounced',
      'Bite pattern that allows the temporary crown to be kept free of heavy contact',
      'Non-grinder, or willing to wear a night guard during the healing period',
      'Full-arch cases assessed individually — often suitable for All-on-4 protocols',
    ],
    processSteps: [
      { title: 'Eligibility Assessment', desc: 'A detailed CBCT scan evaluates bone quality, volume, and the angulation of the extraction socket. Your specialist confirms whether immediate loading is a predictable option for your specific case and explains the alternative if not.' },
      { title: 'Extraction', desc: 'The failing tooth is removed as atraumatically as possible to preserve the socket walls and surrounding bone. Careful extraction technique significantly increases the likelihood of successful immediate implant placement.' },
      { title: 'Immediate Implant Placement', desc: 'The implant post is placed directly into the fresh extraction socket in the same appointment. Precise positioning within the socket is critical — angulation and depth are planned using the CBCT data to ensure the final crown emerges in exactly the right position.' },
      { title: 'Temporary Crown Fitted', desc: 'A pre-fabricated or chairside-milled temporary crown is attached to the implant the same day. It is adjusted so that it makes no heavy contact when you bite — this protects the integrating implant from disruptive forces during the healing period.' },
      { title: 'Final Crown at 3–4 Months', desc: 'Once osseointegration is confirmed at your 3-month review, digital impressions are taken for the definitive ceramic crown. The temporary is removed, the abutment refined if needed, and the permanent crown fitted — completing your restoration in roughly half the time of conventional implant treatment.' },
    ],
  },
  'implant-dentures': {
    tagline: 'Stop your denture moving. Two to four implants give your existing denture the stability it was always missing.',
    intro: 'Implant-retained dentures — also called overdentures or snap-on dentures — use two to four implants per arch as fixed anchor points onto which your denture clips securely. Unlike conventional dentures that rely on suction and adhesive, an implant-retained denture cannot slip when you eat, speak, or laugh. For many long-term denture wearers, this is a life-changing upgrade that can often be achieved by retrofitting implants to an existing denture rather than starting from scratch.',
    who: 'Implant-retained dentures are ideal for existing denture wearers who experience instability, soreness from denture movement, or difficulty eating certain foods. They are particularly effective for lower dentures, which traditionally offer the least stability. Patients with significant bone resorption who may not have enough bone for a full fixed bridge are often excellent candidates — just two implants in the front of the lower jaw can transform a loose denture into a stable, confident fit. The procedure is less complex than full arch fixed restorations and typically costs considerably less.',
    process: 'If your existing denture is in good condition, it can frequently be retrofitted with locator abutments — small attachment mechanisms that clip into fittings placed on the implants. Where the denture is worn or poorly fitting, a new one is fabricated to work with the implant system. Two implants for a lower overdenture is the most common configuration; four implants per arch deliver even greater stability and are recommended where budget permits.',
    cost: 'Implant-retained dentures typically cost £3,500–£7,000 per arch inclusive of two to four implants and the attachment mechanism. Where a new denture is required, add £800–£1,500 for the prosthetic. This remains significantly more affordable than a full fixed bridge.',
    costRange: '£3,500 – £7,000 per arch',
    candidateCriteria: [
      'Current denture wearer experiencing instability or soreness',
      'Difficulty eating, speaking, or socialising with confidence in your denture',
      'Sufficient bone for two to four implants — far less than full fixed solutions require',
      'Existing denture in reasonable condition (or willingness to have a new one made)',
      'Preference for a removable but stable solution rather than a fixed bridge',
      'Good general health with no conditions preventing implant placement',
    ],
    processSteps: [
      { title: 'Denture & Bone Assessment', desc: 'Your existing denture is evaluated alongside a CBCT scan to determine bone availability and the optimal number and position of implants. Two implants for a lower overdenture is usually sufficient; four is recommended for the upper arch.' },
      { title: 'Implant Placement', desc: 'Two to four implants are placed under local anaesthetic. The procedure is typically shorter and less involved than a full fixed arch case. You continue wearing your existing denture (suitably modified) during the healing period.' },
      { title: 'Healing & Integration', desc: 'Osseointegration takes 8–14 weeks. Your specialist reviews the integration at 6 and 12 weeks. If any implants are placed in the lower front jaw — the most common configuration — healing is reliably predictable due to the excellent bone density in this region.' },
      { title: 'Attachment Fitting', desc: 'Locator abutments are placed on each implant. Corresponding female attachment components are incorporated into your denture — either by retrofitting your existing denture or delivering the newly fabricated one. The denture clicks positively onto the implants.' },
      { title: 'Review & Adjustment', desc: 'A fitting and bite review at two weeks ensures comfort and correct occlusion. The attachments are designed to be replaced periodically (typically every 12–18 months) as they wear — a simple chairside procedure. Your implants themselves should last 20 years or more.' },
    ],
  },
};

export default function ServiceCitiesPage({ params }: { params: { service: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const service = SERVICES.find(s => s.id === params.service);
  if (!service) notFound();

  const content = SERVICE_CONTENT[params.service] || SERVICE_CONTENT['single-tooth'];
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

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filtered.length > 0) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  const allCities = Object.values(LOCATIONS).flat();

  return (
    <div className="min-h-screen bg-white">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* HERO */}
      <div className="relative overflow-hidden min-h-[600px] flex items-end pb-16 pt-32">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={service.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-gray-900/50 to-gray-900/90" />
        </div>
        <div className="relative z-10 container-width w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm text-white/70 mb-5 backdrop-blur-sm">
            <Link href="/services" className="hover:text-brand-300 transition-colors">All Services</Link>
            <span>/</span>
            <span className="text-white">{service.title}</span>
          </div>
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-end">
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                {service.title}
                <span className="block text-brand-300 italic mt-1">in {allCities.length}+ UK Locations</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed max-w-xl mb-6">{content.tagline}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                {['GDC-Verified Specialists', 'Free Matching Service', '0% Finance Available', 'Same-Week Appointments'].map((label) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm text-white/80 font-medium">
                    <span className="w-4 h-4 rounded-full bg-brand-500/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[9px] font-bold">✓</span>
                    </span>
                    {label}
                  </div>
                ))}
              </div>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary text-lg !px-8 !py-4">
                Get Matched Now
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Indicative Cost</p>
              <p className="text-3xl font-display font-bold text-white mb-1">{content.costRange}</p>
              <p className="text-white/60 text-sm mb-4">Finance available from £0 deposit. Exact quote provided before any treatment begins.</p>
              <div className="max-w-xl relative flex items-center">
                <Globe className="absolute left-4 text-white/40 w-5 h-5 z-10" />
                <input type="text" placeholder="Search your city..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 pl-11 text-white placeholder:text-white/40 focus:border-brand-400 outline-none transition-all text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT THIS TREATMENT */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5">
                What Are {service.title}?
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                <p>{content.intro}</p>
                <p>{content.who}</p>
                <p>{content.process}</p>
                <p>{content.cost}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-5">Are You a Candidate?</h3>
                <div className="space-y-3">
                  {content.candidateCriteria.map((criterion, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-sm leading-relaxed">{criterion}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <Shield className="w-5 h-5 text-brand-600" />, label: 'GDC Verified' },
                  { icon: <Clock className="w-5 h-5 text-brand-600" />, label: '2hr Response' },
                  { icon: <Award className="w-5 h-5 text-brand-600" />, label: 'Free Service' },
                ].map((item, i) => (
                  <div key={i} className="bg-brand-50 rounded-xl border border-brand-100 p-4 flex flex-col items-center text-center gap-2">
                    {item.icon}
                    <span className="text-brand-700 font-semibold text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full !py-4">
                Check My Eligibility — Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
              The {service.title} Treatment Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every step explained — so you know exactly what to expect from your first consultation through to the completed restoration.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {content.processSteps.map((step, i) => (
              <div key={i} className="flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITY GRID */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
              {service.title} — Find a Specialist Near You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our verified network covers {allCities.length}+ towns and cities across the UK. Select your location to see specialist availability and local pricing for {service.title.toLowerCase()}.
            </p>
          </div>
          <div className="flex flex-col gap-10">
            {Object.entries(filteredLocations).map(([region, cities]) => (
              <div key={region}>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-600" /> {region}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cities.map((city) => {
                    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link key={city} href={`/services/${params.service}/${citySlug}`}
                        className="group px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-brand-200 hover:bg-brand-50 hover:shadow-md transition-all flex items-center justify-between">
                        <span className="text-gray-600 group-hover:text-gray-900 font-medium text-sm leading-snug">{city}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-600 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {Object.keys(filteredLocations).length === 0 && (
            <div className="text-center py-16 text-gray-400">No locations found for &ldquo;{searchQuery}&rdquo;.</div>
          )}
        </div>
      </section>

      <FAQSection faqs={FAQS_LOCATION} />
      <Footer />
    </div>
  );
}
