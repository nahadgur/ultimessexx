'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Globe, ArrowUpRight, ChevronUp, CheckCircle, Shield, Clock, Award } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { LOCATIONS, SERVICES, FAQS_LOCATION } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const IMAGES: Record<string,string> = {
  'single-tooth':'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?q=80&w=1170&auto=format&fit=crop',
  'multiple-teeth':'https://images.pexels.com/photos/6502343/pexels-photo-6502343.jpeg',
  'full-arch':'https://images.pexels.com/photos/4687905/pexels-photo-4687905.jpeg',
  'bone-grafting':'https://images.pexels.com/photos/6629364/pexels-photo-6629364.jpeg',
  'immediate-implants':'https://images.pexels.com/photos/5355826/pexels-photo-5355826.jpeg',
  'implant-dentures':'https://images.pexels.com/photos/3779699/pexels-photo-3779699.jpeg',
};

const CONTENT: Record<string,{tagline:string;costRange:string;intro:string;who:string;process:string;criteria:string[];steps:{title:string;desc:string}[]}> = {
  'single-tooth':{
    tagline:'One missing tooth replaced permanently with a titanium post and custom ceramic crown — no damage to adjacent teeth.',
    costRange:'£1,500 – £3,500',
    intro:'A single tooth implant is the gold-standard replacement for one missing tooth. Unlike a bridge — which requires grinding down two healthy adjacent teeth — an implant stands completely independently in the jaw. The titanium post fuses with the bone over 8–16 weeks through osseointegration, after which a custom ceramic crown is attached that is indistinguishable from a natural tooth in appearance and function.',
    who:'Single tooth implants suit the majority of adults who have lost a tooth through decay, trauma, or failed root canal treatment. The key requirements are adequate jawbone volume at the site, healthy gums free from active periodontal disease, and no uncontrolled systemic conditions that impair healing.',
    process:'Treatment begins with a CBCT 3D scan to assess bone volume and map nerve and sinus anatomy. The implant post is placed under local anaesthetic in a 45–90 minute procedure. After osseointegration — typically 8–16 weeks — an abutment is attached and a custom crown fitted. The full journey from consultation to final crown usually takes 3–6 months.',
    criteria:['One or more missing teeth due to extraction, trauma, or decay','Sufficient jawbone density at the implant site, or willingness to graft','Gums free from active periodontal disease','No uncontrolled systemic conditions affecting healing','Commitment to annual hygiene and monitoring appointments'],
    steps:[
      {title:'CBCT Scan & Consultation',desc:'A 3D cone beam CT scan maps your bone volume, nerve pathways, and sinus anatomy. Your specialist confirms candidacy and plans the implant position precisely before any treatment begins.'},
      {title:'Implant Placement',desc:'Under local anaesthetic, the titanium post is placed into the jawbone in a 45–90 minute procedure. Most patients compare discomfort to a straightforward extraction. A healing cap is fitted the same day.'},
      {title:'Osseointegration',desc:'Over 8–16 weeks the titanium fuses with your jawbone. You eat and speak normally throughout. A mid-point check at 6–8 weeks confirms integration is progressing correctly.'},
      {title:'Crown Fitting',desc:'Once integrated, an abutment is attached and digital impressions taken. Your custom ceramic crown is fabricated and fitted in a 30-minute appointment — completing your restoration.'},
      {title:'Aftercare',desc:'A 3-month post-placement review checks soft tissue health and bite alignment. Annual hygiene and monitoring visits maintain the implant for decades.'},
    ],
  },
  'multiple-teeth':{
    tagline:'Replace several missing teeth with individual implants or implant-supported bridges — without touching healthy adjacent teeth.',
    costRange:'£1,500 – £2,800 per implant',
    intro:'When two or more adjacent or scattered teeth are missing, multiple tooth implants offer a permanent, stable solution that preserves full chewing function and prevents the bone resorption that follows tooth loss. Depending on the positions, your specialist will recommend either individual implants or an implant-supported bridge spanning the gap. Either approach leaves neighbouring healthy teeth completely untouched.',
    who:'Candidates are adults missing two or more teeth, whether consecutively or in different quadrants. The same eligibility criteria apply as for single implants — adequate bone volume, healthy gums, and no systemic conditions preventing healing. Patients previously told they needed full dentures are frequently found to be better served by multiple implants.',
    process:'Assessment involves full-arch CBCT scanning to map available bone across all treatment sites. Where teeth are missing in different areas, implants may be placed in a single surgical session or staged across two procedures. Bridge designs are planned digitally before any surgery begins.',
    criteria:['Two or more missing teeth in any position or quadrant','Sufficient bone at each planned implant site','No active gum disease or willingness to complete periodontal treatment first','Commitment to treatment over several months','No uncontrolled systemic health conditions affecting healing'],
    steps:[
      {title:'Full-Arch Assessment',desc:'A comprehensive CBCT scan and clinical examination maps every potential implant site. Your specialist discusses single implants versus bridge-on-implant options and presents a digital treatment plan.'},
      {title:'Treatment Planning',desc:'For complex cases, a detailed restorative plan is designed before surgery — including implant positions, angulations, and final bridge or crown design — confirmed in writing with itemised costs.'},
      {title:'Surgical Placement',desc:'Implants are placed in a single session where bone quality permits, or across two staged procedures. Local anaesthetic is standard; IV sedation is available at most network practices.'},
      {title:'Integration Period',desc:'Osseointegration typically runs 8–20 weeks for multiple implants. Temporary restorations maintain aesthetics and function throughout. A mid-point review at 8 weeks assesses progress.'},
      {title:'Final Restorations',desc:'Individual crowns or bridge units are fabricated using digital impressions. Fitting appointments are scheduled per arch or quadrant, with final bite adjustments made at each stage.'},
    ],
  },
  'full-arch':{
    tagline:'Replace an entire upper or lower arch with 4–6 implants. Permanent fixed teeth — not removable dentures.',
    costRange:'£9,000 – £18,000 per arch',
    intro:'Full arch restoration — most commonly delivered as All-on-4 or All-on-6 — replaces every tooth in the upper or lower jaw using just four or six precisely angled implant posts. A full fixed bridge is attached to those posts, giving you a complete set of permanent teeth that cannot be removed, do not use adhesive, and restore full biting force. It is the most comprehensive implant solution and is frequently the most cost-effective per-tooth option for patients who have lost most or all of their teeth.',
    who:'Full arch restoration suits patients who have lost all or nearly all teeth in one or both arches, including long-term denture wearers who want a permanent alternative. The All-on-4 technique is specifically designed for patients with reduced bone density — angled implants engage denser bone and frequently avoid the need for grafts. Patients with heavily failing teeth are also candidates, with extractions and implant placement in one session.',
    process:'Full arch cases begin with comprehensive CBCT scanning and a restorative evaluation. The surgical session — typically under sedation — places four or six implants and attaches a provisional full-arch bridge the same day. The provisional is worn for 3–6 months while osseointegration completes, then replaced with the definitive zirconia or ceramic bridge.',
    criteria:['Missing all or most teeth in the upper or lower arch','Long-term denture wearer seeking a fixed permanent alternative','Sufficient anterior bone volume — angled implants reduce graft requirements','No active infection or uncontrolled periodontal disease','Willingness to commit to a 6–12 month treatment timeline'],
    steps:[
      {title:'Comprehensive Planning',desc:'Full-arch CBCT scanning and digital smile design are completed before surgery. You see a digital preview of your final result and approve tooth shape, size, and shade in advance.'},
      {title:'Extractions & Implant Placement',desc:'Any remaining failing teeth are removed and four or six implants placed in the same procedure under sedation. Angled placement maximises contact with available bone, typically avoiding grafting.'},
      {title:'Same-Day Provisional Bridge',desc:'A pre-fabricated provisional full-arch bridge is attached directly to the implants before you leave. You walk out with a complete set of fixed temporary teeth on the day of surgery.'},
      {title:'Osseointegration Period',desc:'Over 3–6 months the implants fuse with the bone. The provisional bridge is fully functional throughout — you eat normally and maintain hygiene with an interdental brush and water flosser.'},
      {title:'Definitive Bridge Fitting',desc:'Once integration is confirmed, precision digital impressions are taken for the final bridge. The definitive zirconia prosthetic is fitted and adjusted to your exact bite — permanent and built to last decades.'},
    ],
  },
  'bone-grafting':{
    tagline:'Rebuild the foundation. Bone and sinus procedures that make implants possible when volume is insufficient.',
    costRange:'£500 – £2,500',
    intro:'When a tooth is lost, the jawbone that supported its root begins to resorb — losing height and width over months and years. Patients who have worn dentures for several years, or who lost teeth after trauma or infection, frequently have insufficient bone to support an implant without first rebuilding the site. Bone grafting and sinus lift procedures restore the volume and density needed to place and integrate implants predictably.',
    who:'Bone grafting is indicated for patients told they cannot have implants due to thin bone, those who have worn dentures for more than two or three years, patients who lost teeth after jaw infections or cysts, and those requiring implants in the upper back jaw where the maxillary sinus limits available height. Many patients told grafting is impossible are reassessed by specialists and found to be viable candidates.',
    process:'Bone grafting uses material placed at the implant site to stimulate new bone growth. The graft source can be the patient\'s own bone, donor bone, bovine-derived material, or synthetic alternatives — your specialist will advise the most appropriate option. Healing takes 4–9 months before implant placement. Sinus lifts are performed through a small window in the lateral sinus wall, with the membrane elevated and the space filled with graft material.',
    criteria:['Insufficient bone width or height at the planned implant site','Long-term denture wearer with significant bone resorption','Upper back jaw with sinus proximity limiting bone height','Bone loss following infection, cyst removal, or trauma','Previously told implants are not possible due to bone volume'],
    steps:[
      {title:'CBCT Assessment',desc:'A 3D scan precisely measures bone volume at every planned implant site. Deficiency sites are identified and a grafting strategy planned — including graft source, volume, and healing timeline.'},
      {title:'Graft Procedure',desc:'Under local anaesthetic, graft material is placed at the deficient site and covered with a resorbable membrane guiding new bone formation. Most patients experience mild swelling for 3–5 days.'},
      {title:'Healing Period',desc:'New bone forms over 4–9 months. A follow-up CBCT at 4 months assesses integration. Reviews at 6–8 week intervals monitor healing throughout. Normal eating is maintained during this period.'},
      {title:'Implant Placement',desc:'Once the grafted bone has matured, implant placement proceeds as standard. The combined approach delivers long-term stability comparable to placement in native bone.'},
      {title:'Final Restoration',desc:'Following osseointegration, the crown or bridge is fabricated and fitted in the usual sequence. The full journey from graft to final crown typically spans 12–18 months.'},
    ],
  },
  'immediate-implants':{
    tagline:'Tooth out, implant in, temporary crown fitted — all in a single appointment.',
    costRange:'£1,800 – £3,500',
    intro:'Immediate load implants — also called same-day implants — allow the implant post to be placed and a temporary crown attached in a single surgical session, often on the same day a failing tooth is extracted. For patients who qualify, the benefits are significant: no gap in your smile, no waiting months with a denture, and a restoration that immediately functions and looks like a natural tooth while the implant integrates beneath.',
    who:'Immediate loading suits patients with good bone density at the extraction site, no active infection at the time of surgery, and a bite pattern that allows the temporary crown to be kept out of heavy contact during healing. It is most predictably applied to front teeth where aesthetic impact is greatest. Patients with poor bone density, active infection, or heavy grinding habits are usually advised to follow the conventional staged approach.',
    process:'Your specialist assesses bone volume and extraction site health at consultation. If immediate loading is appropriate, the extraction, implant placement, and temporary crown attachment are coordinated in a single session lasting 90–120 minutes. The temporary is adjusted to ensure minimal occlusal contact while the implant integrates — the critical factor in immediate load success.',
    criteria:['Good bone density and volume at the planned implant site','No active infection or acute periodontal disease at the site','Front or premolar teeth where aesthetic benefit is most pronounced','Bite pattern allowing the temporary crown to avoid heavy contact','Non-grinder, or willing to wear a night guard during healing'],
    steps:[
      {title:'Eligibility Assessment',desc:'A CBCT scan evaluates bone quality, volume, and extraction socket angulation. Your specialist confirms whether immediate loading is predictable for your specific case.'},
      {title:'Extraction',desc:'The failing tooth is removed as atraumatically as possible to preserve the socket walls and surrounding bone — critical for successful immediate placement.'},
      {title:'Immediate Implant Placement',desc:'The implant post is placed directly into the fresh extraction socket in the same appointment. Precise positioning is planned using CBCT data to ensure correct final crown emergence.'},
      {title:'Same-Day Crown',desc:'A pre-fabricated or chairside-milled temporary crown is attached the same day. It is adjusted so it makes no heavy contact when you bite, protecting the integrating implant during healing.'},
      {title:'Final Crown at 3–4 Months',desc:'Once osseointegration is confirmed, digital impressions are taken for the definitive ceramic crown. The temporary is removed and the permanent crown fitted — completing your restoration.'},
    ],
  },
  'implant-dentures':{
    tagline:'Stop your denture moving. Two to four implants give your existing denture the stability it has always lacked.',
    costRange:'£3,500 – £7,000 per arch',
    intro:'Implant-retained dentures — also called overdentures — use two to four implants per arch as fixed anchor points onto which your denture clips securely. Unlike conventional dentures that rely on suction and adhesive, an implant-retained denture cannot slip when you eat, speak, or laugh. For many long-term denture wearers, this is a life-changing upgrade that can often be achieved by retrofitting implants to an existing denture.',
    who:'Implant-retained dentures are ideal for existing denture wearers who experience instability, soreness from movement, or difficulty eating certain foods. They are particularly effective for lower dentures, which traditionally offer the least stability. Patients with significant bone resorption who may not have enough bone for a full fixed bridge are often excellent candidates — just two implants in the lower front jaw can transform a loose denture.',
    process:'If your existing denture is in good condition, it can frequently be retrofitted with locator abutments — attachment mechanisms that clip into fittings placed on the implants. Where the denture is worn, a new one is fabricated to work with the implant system. Two implants for a lower overdenture is the most common configuration; four implants deliver even greater stability.',
    criteria:['Current denture wearer experiencing instability or soreness','Difficulty eating, speaking, or socialising confidently in your denture','Sufficient bone for two to four implants','Existing denture in reasonable condition, or willingness to have a new one made','Good general health with no conditions preventing implant placement'],
    steps:[
      {title:'Denture & Bone Assessment',desc:'Your existing denture is evaluated alongside a CBCT scan to determine bone availability and optimal implant number and position. Two implants for a lower overdenture is usually sufficient.'},
      {title:'Implant Placement',desc:'Two to four implants are placed under local anaesthetic. The procedure is shorter than a full fixed arch case. You continue wearing your existing denture during the healing period.'},
      {title:'Osseointegration',desc:'Integration takes 8–14 weeks. Reviews at 6 and 12 weeks confirm progress. Lower front jaw implants heal reliably due to the excellent bone density in this region.'},
      {title:'Attachment Fitting',desc:'Locator abutments are placed on each implant. Corresponding female attachment components are added to your denture — either retrofitted or built into a new one. The denture clips positively onto the implants.'},
      {title:'Review & Adjustment',desc:'A fitting and bite review at two weeks ensures comfort and correct occlusion. Attachments are replaced every 12–18 months as they wear — a simple chairside procedure. The implant posts themselves last 20+ years.'},
    ],
  },
};

export default function ServicePage({ params }: { params: { service: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const service = SERVICES.find(s => s.id === params.service);
  if (!service) notFound();

  const content = CONTENT[params.service] || CONTENT['single-tooth'];
  const heroImage = IMAGES[params.service] || IMAGES['single-tooth'];
  const allCities = Object.values(LOCATIONS).flat();

  useEffect(() => {
    const h = () => setShowScrollTop(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) > 0.3);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filtered.length) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* HERO */}
      <div className="relative overflow-hidden min-h-[580px] flex items-end pb-16 pt-32">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-gray-900/55 to-gray-900/90" />
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
              <p className="text-lg text-white/80 leading-relaxed max-w-xl mb-4">{content.tagline}</p>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-5 py-3 inline-flex">
                <span className="text-white/60 text-sm">Indicative cost:</span>
                <span className="text-white font-bold text-lg">{content.costRange}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4">
              <p className="text-white font-semibold">Find a specialist near you</p>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                <input type="text" placeholder="Search your city..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-9 text-white placeholder:text-white/40 focus:border-brand-400 outline-none text-sm" />
              </div>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full !py-3">Get Matched Free</button>
              {['GDC-Verified Specialists', 'Free Matching', '0% Finance', 'Same-Week Appointments'].map(l => (
                <div key={l} className="flex items-center gap-2 text-white/70 text-xs">
                  <span className="text-brand-300">✓</span> {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5">What Are {service.title}?</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                <p>{content.intro}</p>
                <p>{content.who}</p>
                <p>{content.process}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-7">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-5">Am I a Candidate?</h3>
                <div className="space-y-3">
                  {content.criteria.map((c, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-sm leading-relaxed">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{icon:<Shield className="w-5 h-5 text-brand-600"/>,label:'GDC Verified'},{icon:<Clock className="w-5 h-5 text-brand-600"/>,label:'2hr Response'},{icon:<Award className="w-5 h-5 text-brand-600"/>,label:'Free Service'}].map((item,i) => (
                  <div key={i} className="bg-brand-50 rounded-xl border border-brand-100 p-4 flex flex-col items-center text-center gap-2">
                    {item.icon}
                    <span className="text-brand-700 font-semibold text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full !py-4">Check My Eligibility — Free</button>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3 text-center">The Treatment Process</h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-10 text-sm">Every step explained — from first consultation through to completed restoration.</p>
          <div className="space-y-4 max-w-3xl mx-auto">
            {content.steps.map((step, i) => (
              <div key={i} className="flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-sm">{i + 1}</div>
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
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3 text-center">
            {service.title} — Find a Specialist Near You
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10 text-sm">
            Our verified network covers {allCities.length}+ towns and cities across the UK. Select your location for specialist availability and local pricing.
          </p>
          <div className="flex flex-col gap-10">
            {Object.entries(filteredLocations).map(([region, cities]) => (
              <div key={region}>
                <h3 className="text-base font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-600" /> {region}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cities.map(city => (
                    <Link key={city} href={`/services/${params.service}/${city.toLowerCase().replace(/\s+/g,'-')}`}
                      className="group px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-brand-200 hover:bg-brand-50 hover:shadow-md transition-all flex items-center justify-between">
                      <span className="text-gray-600 group-hover:text-gray-900 font-medium text-sm">{city}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-600 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(filteredLocations).length === 0 && (
              <div className="text-center py-16 text-gray-400">No locations found for &ldquo;{searchQuery}&rdquo;.</div>
            )}
          </div>
        </div>
      </section>

      <FAQSection faqs={FAQS_LOCATION} />
      <Footer />
    </div>
  );
}
