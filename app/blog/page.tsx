'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { Search, ArrowUpRight, ChevronUp } from '@/components/Icons';
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

const slugify = (s: string) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogPage, setBlogPage] = useState(1);
  const [articles, setArticles] = useState<ArticleWithDate[]>([]);
  const postsPerPage = 6;

  useEffect(() => {
    let cancelled = false;
    fetch('/articles.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<Article>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const startDate = new Date('2026-02-10T00:00:00');
            const articlesPerDay = 3;
            const usedSlugs = new Set<string>();
            const articlesWithDates: ArticleWithDate[] = (results.data || [])
              .filter((a: Article) => a && a['Article Title'] && a['Article Title'].trim())
              .map((a: Article, index: number) => {
                const dayOffset = Math.floor(index / articlesPerDay);
                const publishDate = new Date(startDate);
                publishDate.setDate(publishDate.getDate() + dayOffset);
                const baseSlug = (a['Slug'] || '').trim() || slugify(a['Article Title']);
                const uniqueSlug = makeUniqueSlug(baseSlug, usedSlugs);
                const imgs = extractImageUrls(a['Article Content'] || '');
                const featuredImage = imgs.length ? imgs[imgs.length - 1] : undefined;
                return { ...a, Slug: uniqueSlug, publishDate, index, featuredImage };
              });
            if (!cancelled) setArticles(articlesWithDates);
          },
        });
      })
      .catch(() => { if (!cancelled) setArticles([]); });
    return () => { cancelled = true; };
  }, []);

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

  const publishedArticles = useMemo(() => {
    const today = new Date();
    return articles.filter((article) => article.publishDate <= today);
  }, [articles]);

  const filteredPosts = useMemo(() => {
    if (!blogSearchQuery) return publishedArticles;
    const q = blogSearchQuery.toLowerCase().trim();
    return publishedArticles.filter((post) => {
      const title = (post['Article Title'] || '').toLowerCase();
      return title.includes(q);
    });
  }, [blogSearchQuery, publishedArticles]);

  const paginatedPosts = useMemo(() => {
    const start = (blogPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, blogPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getExcerpt = (content: string, length: number = 120) => {
    const text = (content || '').replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-white">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />
      <button onClick={scrollToTop}
        className={`fixed bottom-6 left-6 z-[70] w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="section-padding bg-white">
        <div className="container-width space-y-16">
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Dental Implants <span className="text-blue-500 italic">Insights</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert clinical advice, pricing updates, and patient success stories.
            </p>
            <div className="max-w-xl mx-auto relative mt-6">
              <input type="text" placeholder="Search articles by topic..." value={blogSearchQuery}
                onChange={(e) => { setBlogSearchQuery(e.target.value); setBlogPage(1); }}
                className="w-full bg-white border border-gray-200 rounded-xl px-6 py-3 pl-12 text-gray-900 focus:border-brand-500 outline-none transition-all shadow-sm" />
              <Search className="absolute left-4 top-[0.85rem] text-gray-400 w-6 h-6" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {paginatedPosts.map((post) => (
              <Link key={post.Slug} href={`/blog/${post.Slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 shadow-sm">
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt={post['Article Title']}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><div className="text-6xl opacity-10">📝</div></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    {post.wp_category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                    {post['Article Title']}
                  </h2>
                  <p className="text-gray-600 text-sm mb-6 flex-1">{getExcerpt(post['Article Content'])}</p>
                  <div className="flex items-center gap-2 text-brand-600 font-medium text-sm">
                    Read more <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center text-gray-400">No articles found.</div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setBlogPage(page)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${blogPage === page ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
