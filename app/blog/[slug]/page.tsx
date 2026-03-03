'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { Search, ArrowUpRight, ChevronUp, BookOpen, Clock, Tag } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LeadFormModal from '@/components/LeadFormModal';

interface Article {
  'Article Title': string;
  'Article Content': string;
  'wp_category': string;
  'Slug': string;
  'Meta Title': string;
  'Meta Description': string;
  'Schema Markup': string;
  'Status': string;
}

interface ArticleWithDate extends Article {
  publishDate: Date;
  index: number;
  featuredImage?: string;
}

const slugify = (s: string) => (s || '').toLowerCase().trim().replace(/['\"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const makeUniqueSlug = (base: string, used: Set<string>) => {
  const cleanBase = base && base.length ? base : 'post';
  let slug = cleanBase; let i = 2;
  while (used.has(slug)) slug = `${cleanBase}-${i++}`;
  used.add(slug); return slug;
};
const extractImageUrls = (html: string): string[] => {
  const out: string[] = []; const s = html || '';
  const srcRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi; let m: RegExpExecArray | null;
  while ((m = srcRe.exec(s))) out.push(m[1]);
  const urlRe = /(https?:\/\/[^\s"']+\.(?:png|jpe?g|webp|gif))(?:\?[^\s"']*)?/gi;
  while ((m = urlRe.exec(s))) out.push(m[1]);
  return Array.from(new Set(out));
};

const CATEGORIES = ['All', 'Treatment Guides', 'Cost & Finance', 'Patient Stories', 'Clinical Research', 'Aftercare'];

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogPage, setBlogPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState<ArticleWithDate[]>([]);
  const postsPerPage = 9;

  useEffect(() => {
    let cancelled = false;
    fetch('/articles.csv').then(r => r.text()).then(csvText => {
      Papa.parse<Article>(csvText, {
        header: true, skipEmptyLines: true,
        complete: (results) => {
          const startDate = new Date('2026-02-10T00:00:00');
          const usedSlugs = new Set<string>();
          const data: ArticleWithDate[] = (results.data || [])
            .filter(a => a && a['Article Title'] && a['Article Title'].trim())
            .map((a, index) => {
              const publishDate = new Date(startDate);
              publishDate.setDate(publishDate.getDate() + Math.floor(index / 3));
              const baseSlug = (a['Slug'] || '').trim() || slugify(a['Article Title']);
              const imgs = extractImageUrls(a['Article Content'] || '');
              return { ...a, Slug: makeUniqueSlug(baseSlug, usedSlugs), publishDate, index, featuredImage: imgs.length ? imgs[imgs.length - 1] : undefined };
            });
          if (!cancelled) setArticles(data);
        },
      });
    }).catch(() => { if (!cancelled) setArticles([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const s = window.scrollY; const h = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(h > 0 ? s / h > 0.3 : false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publishedArticles = useMemo(() => {
    const today = new Date();
    return articles.filter(a => a.publishDate <= today);
  }, [articles]);

  const filteredPosts = useMemo(() => {
    let filtered = publishedArticles;
    if (activeCategory !== 'All') filtered = filtered.filter(p => p.wp_category === activeCategory);
    if (blogSearchQuery) {
      const q = blogSearchQuery.toLowerCase();
      filtered = filtered.filter(p => (p['Article Title'] || '').toLowerCase().includes(q));
    }
    return filtered;
  }, [blogSearchQuery, activeCategory, publishedArticles]);

  const paginatedPosts = useMemo(() => {
    const start = (blogPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, blogPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getExcerpt = (content: string) => {
    const text = (content || '').replace(/<[^>]*>/g, '');
    return text.length > 140 ? text.substring(0, 140) + '...' : text;
  };

  const getReadTime = (content: string) => {
    const words = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

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
            Expert Dental Implant Knowledge
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-5">
            Dental Implant Insights, Guides <span className="text-brand-600">&amp; Patient Resources</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            The most common reason patients delay implant treatment is uncertainty — about cost, suitability, pain, and how long it all takes. This library answers every question with clinical depth. Every article is written or reviewed by GDC-registered implant clinicians, not generic health copywriters.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search articles by topic or keyword..." value={blogSearchQuery}
              onChange={(e) => { setBlogSearchQuery(e.target.value); setBlogPage(1); }}
              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 pl-12 text-gray-900 focus:border-brand-500 outline-none transition-all shadow-sm" />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="container-width">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { icon: <BookOpen className="w-5 h-5 text-brand-600" />, stat: `${publishedArticles.length}+`, label: 'Published Articles' },
              { icon: <Clock className="w-5 h-5 text-brand-600" />, stat: '5 min', label: 'Average Read Time' },
              { icon: <Tag className="w-5 h-5 text-brand-600" />, stat: '6', label: 'Topic Categories' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.icon}
                <div className="text-left">
                  <p className="font-display font-bold text-gray-900 text-lg">{item.stat}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-[73px] z-30">
        <div className="container-width">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setBlogPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="section-padding bg-white">
        <div className="container-width">
          {paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => (
                <Link key={post.Slug} href={`/blog/${post.Slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 shadow-sm">
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt={post['Article Title']}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-brand-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                      {post.wp_category || 'Guide'}
                    </div>
                    <div className="absolute bottom-3 right-4 flex items-center gap-1 text-white/80 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{getReadTime(post['Article Content'])} min read</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors leading-snug">
                      {post['Article Title']}
                    </h2>
                    <p className="text-gray-600 text-sm mb-5 flex-1 leading-relaxed">{getExcerpt(post['Article Content'])}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {post.publishDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-1 text-brand-600 font-medium text-sm">
                        Read article <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No articles found{blogSearchQuery ? ` for "${blogSearchQuery}"` : ''}.</p>
              <button onClick={() => { setBlogSearchQuery(''); setActiveCategory('All'); }} className="btn-secondary">Clear filters</button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button onClick={() => setBlogPage(p => Math.max(1, p - 1))} disabled={blogPage === 1}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-all text-sm font-medium">
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, blogPage - 3), blogPage + 2).map(page => (
                <button key={page} onClick={() => setBlogPage(page)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${blogPage === page ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setBlogPage(p => Math.min(totalPages, p + 1))} disabled={blogPage === totalPages}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-all text-sm font-medium">
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="container-width">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2 text-center">Browse by Topic</h2>
          <p className="text-gray-500 text-sm text-center max-w-xl mx-auto mb-8">Everything you need to know, organised by the questions patients ask most.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {e:"💷",t:"Cost and Finance",d:"UK implant pricing broken down by treatment type, region, and provider. Finance options, NHS funding rules, and how to compare quotes without being misled.",tags:["Single tooth cost","All-on-4 pricing","Finance plans"]},
              {e:"🔬",t:"Am I a Candidate?",d:"Eligibility for every implant type. What happens with bone loss, gum disease, diabetes, or heavy smoking. When grafting is needed and when it is not.",tags:["Bone loss","Gum disease","Medical conditions"]},
              {e:"📅",t:"Treatment Process",d:"Step-by-step guides from CBCT scan to final crown. What to expect during surgery, the osseointegration period, and how the crown appointment works.",tags:["Surgery day","Healing time","Crown fitting"]},
              {e:"⚡",t:"Same-Day Implants",d:"How immediate load and teeth-in-a-day protocols work, who qualifies, and the differences versus conventional staged treatment.",tags:["Immediate load","Teeth in a day","All-on-4"]},
              {e:"🛡️",t:"Aftercare and Longevity",d:"How to clean and maintain implants, what causes peri-implantitis, how to prevent it, and the long-term monitoring schedule to protect your investment.",tags:["Peri-implantitis","Cleaning","Long-term care"]},
              {e:"❓",t:"When Implants Fail",d:"Why implants fail, how common it is, the warning signs, and what options exist for salvage or replacement after a failed placement.",tags:["Failure causes","Warning signs","Replacement"]},
            ].map((topic,i)=>(
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-brand-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{topic.e}</div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{topic.t}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{topic.d}</p>
                <div className="flex flex-wrap gap-2">{topic.tags.map(tag=>(<span key={tag} className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-medium rounded-full">{tag}</span>))}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL INTRO */}
      <section className="section-padding bg-gray-50 border-t border-gray-100">
        <div className="container-width">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5">
                Why Good Information Matters Before You Choose Dental Implants
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Dental implant treatment is a significant financial and medical decision. Unlike a filling or a scale and polish, implants involve surgery, a healing period of several months, and a commitment to long-term maintenance. Patients who arrive at their first consultation with a realistic understanding of the process — the timeline, the costs, the candidacy requirements, and what to expect during recovery — consistently report better outcomes and higher satisfaction than those who go in blind.
                </p>
                <p>
                  This resource library exists to fill the information gap. We cover everything from the clinical basics of osseointegration to practical advice on financing your treatment, comparing All-on-4 versus full-arch bridge options, managing implants with gum disease, and what to do if an implant fails. Each article is written with input from clinicians who place implants daily — not generic health content writers working from secondary sources.
                </p>
                <p>
                  If you read an article and still have questions, our free matching service connects you with a verified specialist in your area who can give you personalised clinical guidance at no obligation. We believe an informed patient makes the best patient.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3">Most Read This Month</h3>
              {[
                'Dental Implant Cost 2025: A Complete UK Price Guide',
                'Am I a Good Candidate for Dental Implants?',
                'All-on-4 vs All-on-6: Which Is Right for You?',
                'How Long Do Dental Implants Last?',
                'Dental Implants on Finance: 0% Plans Explained',
              ].map((title, i) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-white rounded-xl border border-gray-100 hover:border-brand-200 transition-all cursor-pointer">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <p className="text-sm font-medium text-gray-700 leading-snug">{title}</p>
                </div>
              ))}
              <div className="bg-brand-600 rounded-2xl p-5 text-white mt-4">
                <h4 className="font-display font-bold mb-2">Ready to take the next step?</h4>
                <p className="text-brand-100 text-sm mb-4">Our free matching service connects you with a verified specialist in your area within 2 hours.</p>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-brand-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-all text-sm w-full">
                  Get Matched Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
