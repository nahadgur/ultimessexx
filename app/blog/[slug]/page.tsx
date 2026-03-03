'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LeadFormModal from '@/components/LeadFormModal';
import BlogCtaBanner from '@/components/BlogCtaBanner';

interface Article {
  'Article Title': string;
  'Article Content': string;
  'wp_category': string;
  'Slug': string;
  'Meta Title': string;
  'Meta Description': string;
  'Schema Markup': string;
  'Status': string;
  'Further Reading'?: string;
}

interface ArticleWithDate extends Article {
  publishDate: Date;
  index: number;
  featuredImage?: string;
  cleanedHtml?: string;
}

type ReadingLink = { url: string; label: string };

const slugify = (s: string) =>
  (s || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const makeUniqueSlug = (base: string, used: Set<string>) => {
  const cleanBase = base && base.length ? base : 'post';
  let slug = cleanBase;
  let i = 2;
  while (used.has(slug)) slug = `${cleanBase}-${i++}`;
  used.add(slug);
  return slug;
};

const extractImageUrls = (html: string): string[] => {
  const out: string[] = [];
  const s = html || '';
  const srcRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = srcRe.exec(s))) out.push(m[1]);
  const urlRe = /(https?:\/\/[^\s"']+\.(?:png|jpe?g|webp|gif))(?:\?[^\s"']*)?/gi;
  while ((m = urlRe.exec(s))) out.push(m[1]);
  return Array.from(new Set(out));
};

const cleanArticleHtml = (html: string) => {
  let h = html || '';
  h = h.replace(/<\/?(strong|b)\b[^>]*>/gi, '');
  h = h.replace(/\sstyle=["'][^"']*["']/gi, '');
  h = h.replace(/\s(width|height)=["'][^"']*["']/gi, '');
  return h;
};

const ensureParagraphs = (html: string) => {
  let h = (html || '').trim();
  if (!h) return '';
  const hasBlocks = /<\s*p\b/i.test(h) || /<\s*h[1-6]\b/i.test(h) || /<\s*(ul|ol|table|blockquote|pre)\b/i.test(h);
  if (hasBlocks) return h;
  const brSplit = h.split(/<br\s*\/?>\s*<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
  if (brSplit.length > 1) return brSplit.map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
  const nlSplit = h.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
  if (nlSplit.length > 1) return nlSplit.map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
  return `<p>${h.replace(/\n/g, '<br />')}</p>`;
};

const FURTHER_READING_POOL: ReadingLink[] = [
  { url: 'https://www.dentalimplants.com', label: 'Dental Implants (official site)' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov/?term=dental+implants', label: 'PubMed: Dental Implants research' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov/?term=clear+implants', label: 'PubMed: Clear implants research' },
  { url: 'https://www.mouthhealthy.org/all-topics-a-z/orthodontics', label: 'MouthHealthy (ADA): Orthodontics' },
  { url: 'https://www.nhs.uk/conditions/orthodontics/', label: 'NHS: Orthodontics' },
  { url: 'https://www.mayoclinic.org/tests-procedures/braces/about/pac-20384670', label: 'Mayo Clinic: Braces overview' },
  { url: 'https://www.cdc.gov/oralhealth', label: 'CDC: Oral health' },
  { url: 'https://www.ajodo.org', label: 'AJODO (orthodontic journal)' },
];

const hashString = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

const pickFurtherReading = (key: string, count: number = 3): ReadingLink[] => {
  const pool = FURTHER_READING_POOL;
  if (!pool.length) return [];
  const start = hashString(key || 'post') % pool.length;
  const out: ReadingLink[] = [];
  for (let i = 0; i < pool.length && out.length < Math.min(count, pool.length); i++) out.push(pool[(start + i) % pool.length]);
  return out;
};

const splitHtmlAfterFirstH2Section = (html: string): [string, string] => {
  if (!html) return ['', ''];
  const firstH2Match = html.match(/<h2[\s>]/i);
  if (!firstH2Match || firstH2Match.index === undefined) return [html, ''];
  const afterFirstH2 = html.slice(firstH2Match.index + firstH2Match[0].length);
  const nextHeadingMatch = afterFirstH2.match(/<h[23][\s>]/i);
  if (!nextHeadingMatch || nextHeadingMatch.index === undefined) return [html, ''];
  const splitPoint = firstH2Match.index + firstH2Match[0].length + nextHeadingMatch.index;
  return [html.slice(0, splitPoint), html.slice(splitPoint)];
};

export default function ArticlePage() {
  const params = useParams();
  const rawSlug = params?.slug as string | string[] | undefined;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [article, setArticle] = useState<ArticleWithDate | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleWithDate[]>([]);
  const [furtherReading, setFurtherReading] = useState<ReadingLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(height > 0 ? scrollPos / height > 0.3 : false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch('/articles.csv')
      .then((r) => r.text())
      .then((csvText) => {
        Papa.parse<Article>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const startDate = new Date('2026-02-10T00:00:00');
            const articlesPerDay = 3;
            const usedSlugs = new Set<string>();
            const all: ArticleWithDate[] = (results.data || [])
              .filter((a) => a && a['Article Title'] && a['Article Title'].trim())
              .map((a, index) => {
                const dayOffset = Math.floor(index / articlesPerDay);
                const publishDate = new Date(startDate);
                publishDate.setDate(publishDate.getDate() + dayOffset);
                const baseSlug = (a['Slug'] || '').trim() || slugify(a['Article Title']);
                const uniqueSlug = makeUniqueSlug(baseSlug, usedSlugs);
                const imgs = extractImageUrls(a['Article Content'] || '');
                const featuredImage = imgs.length ? imgs[imgs.length - 1] : undefined;
                const cleanedHtml = ensureParagraphs(cleanArticleHtml(a['Article Content'] || ''));
                return { ...a, Slug: uniqueSlug, publishDate, index, featuredImage, cleanedHtml };
              });

            const found = all.find((a) => a.Slug === slug) || null;
            setArticle(found);
            if (found) {
              setFurtherReading(pickFurtherReading(found.Slug, 3));
              const sameCategory = all.filter((a) => a.Slug !== slug && a.wp_category === found.wp_category);
              const fill = all.filter((a) => a.Slug !== slug && a.wp_category !== found.wp_category);
              setRelatedArticles([...sameCategory, ...fill].slice(0, 3));
            }
          },
        });
      });
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-slate-700">
        <Navigation onOpenModal={() => setIsModalOpen(true)} />
        <div className="pt-32 px-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900">Article not found</h1>
          <Link href="/blog" className="text-blue-500 underline mt-6 inline-block">Back to blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const articleClasses = [
    'p-10 max-w-none',
    '[&_h1]:font-display [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h1]:mt-10 [&_h1]:mb-5',
    '[&_h2]:font-display [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4',
    '[&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3',
    '[&_h4]:text-xl [&_h4]:font-black [&_h4]:text-slate-900 [&_h4]:mt-7 [&_h4]:mb-3',
    '[&_p]:text-slate-600 [&_p]:font-medium [&_p]:leading-relaxed [&_p]:mb-5',
    '[&_a]:text-blue-500 [&_a]:font-black [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-600',
    '[&_ul]:my-6 [&_ul]:pl-7 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:space-y-3 [&_ul]:text-slate-600 [&_ul]:font-medium',
    '[&_ol]:my-6 [&_ol]:pl-7 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:space-y-3 [&_ol]:text-slate-600 [&_ol]:font-medium',
    '[&_li]:leading-relaxed [&_li]:pl-1 [&_li]:marker:text-blue-500',
    '[&_blockquote]:my-8 [&_blockquote]:rounded-3xl [&_blockquote]:border [&_blockquote]:border-slate-200 [&_blockquote]:bg-slate-50 [&_blockquote]:p-6 [&_blockquote]:text-slate-700 [&_blockquote]:font-medium',
    '[&_blockquote_p]:mb-0',
    '[&_hr]:my-10 [&_hr]:border-slate-200',
    '[&_img]:w-full [&_img]:h-auto [&_img]:rounded-3xl [&_img]:border [&_img]:border-slate-200 [&_img]:shadow-lg [&_img]:my-8',
    '[&_table]:w-full [&_table]:my-10 [&_table]:overflow-hidden [&_table]:rounded-3xl [&_table]:border [&_table]:border-slate-200 [&_table]:bg-white [&_table]:shadow-lg',
    '[&_thead]:bg-slate-50',
    '[&_th]:text-left [&_th]:px-5 [&_th]:py-4 [&_th]:text-slate-900 [&_th]:text-sm [&_th]:font-black [&_th]:tracking-wide',
    '[&_td]:px-5 [&_td]:py-4 [&_td]:text-slate-600 [&_td]:text-sm [&_td]:font-medium [&_td]:border-t [&_td]:border-slate-200',
    'hover:[&_tbody_tr]:bg-slate-50',
    '[&_code]:px-2 [&_code]:py-1 [&_code]:rounded-lg [&_code]:bg-slate-100 [&_code]:text-slate-800 [&_code]:text-[0.95em]',
    '[&_pre]:my-8 [&_pre]:p-6 [&_pre]:rounded-3xl [&_pre]:bg-slate-50 [&_pre]:border [&_pre]:border-slate-200 [&_pre]:overflow-x-auto',
  ].join(' ');

  const [htmlBefore, htmlAfter] = splitHtmlAfterFirstH2Section(article.cleanedHtml || '');

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-slate-100 border border-slate-200 shadow-lg flex items-center justify-center text-slate-500"
        >
          <ChevronUp />
        </button>
      )}

      <div className="pt-28 pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
          <Link href="/blog" className="hover:text-brand-600 transition-colors font-medium">Back to blog</Link>
          {article.wp_category && (
            <>
              <span>/</span>
              <span className="text-gray-400">{article.wp_category}</span>
            </>
          )}
        </div>

        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          <div className="relative h-[380px] md:h-[480px]">
            {article.featuredImage && (
              <img
                src={article.featuredImage}
                alt={article['Article Title']}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                {article.wp_category && (
                  <span className="px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                    {article.wp_category}
                  </span>
                )}
                <span className="text-white/60 text-xs">
                  {article.publishDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="text-white/60 text-xs">
                  · {Math.max(1, Math.round((article['Article Content'] || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} min read
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
                {article['Article Title']}
              </h1>
            </div>
          </div>

          {htmlAfter ? (
            <>
              <div className={articleClasses} dangerouslySetInnerHTML={{ __html: htmlBefore }} />
              <div className="px-10 pb-2">
                <BlogCtaBanner onOpenModal={() => setIsModalOpen(true)} />
              </div>
              <div className={articleClasses} dangerouslySetInnerHTML={{ __html: htmlAfter }} />
            </>
          ) : (
            <div className={articleClasses} dangerouslySetInnerHTML={{ __html: article.cleanedHtml || '' }} />
          )}
        </div>

        <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="text-brand-300 text-xs font-semibold uppercase tracking-widest mb-2">Free Matching Service</p>
              <h2 className="text-2xl font-display font-bold mb-2">Ready to speak to a specialist?</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our free service connects you with a GDC-verified implant specialist in your area within 2 hours. No cost, no obligation.
              </p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary whitespace-nowrap !px-8 !py-4">
              Get Matched Free
            </button>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <Link
                  key={a.Slug}
                  href={`/blog/${a.Slug}`}
                  className="group rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:border-brand-200 hover:shadow-xl transition-all shadow-sm bg-white"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-50">
                    {a.featuredImage ? (
                      <img
                        src={a.featuredImage}
                        alt={a['Article Title']}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                        <span className="text-4xl opacity-30">placeholder</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-brand-600 text-white text-[10px] font-semibold rounded-full">
                      {a.wp_category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors leading-snug">
                      {a['Article Title']}
                    </h3>
                    <div className="flex items-center gap-1 text-brand-600 font-medium text-sm mt-auto">
                      Read article <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {furtherReading.length > 0 && (
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-4">Further Reading &amp; Clinical Sources</h2>
            <ul className="space-y-2">
              {furtherReading.map((l) => (
                <li key={l.url} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 flex-shrink-0"></span>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 text-sm font-medium underline underline-offset-2"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
