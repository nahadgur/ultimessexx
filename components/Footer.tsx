'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import { SERVICES, LOCATIONS } from '@/lib/data';

interface Article {
  'Article Title': string;
  'Slug': string;
  'Article Content': string;
  'wp_category': string;
}

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

export default function Footer() {
  const allCities = Object.values(LOCATIONS).flat();
  const topCities = allCities.slice(0, 12);
  const [latestArticles, setLatestArticles] = useState<{ title: string; slug: string }[]>([]);

  useEffect(() => {
    fetch('/articles.csv')
      .then((r) => r.text())
      .then((csvText) => {
        Papa.parse<Article>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const usedSlugs = new Set<string>();
            const today = new Date();
            const startDate = new Date('2026-02-10T00:00:00');
            const articlesPerDay = 3;

            const published = (results.data || [])
              .filter((a) => a && a['Article Title'] && a['Article Title'].trim())
              .map((a, index) => {
                const dayOffset = Math.floor(index / articlesPerDay);
                const publishDate = new Date(startDate);
                publishDate.setDate(publishDate.getDate() + dayOffset);
                const baseSlug = (a['Slug'] || '').trim() || slugify(a['Article Title']);
                const uniqueSlug = makeUniqueSlug(baseSlug, usedSlugs);
                return { title: a['Article Title'], slug: uniqueSlug, publishDate };
              })
              .filter((a) => a.publishDate <= today);

            // Latest 3
            const latest = published.slice(-3).reverse();
            setLatestArticles(latest.map((a) => ({ title: a.title, slug: a.slug })));
          },
        });
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Top row: Brand + columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 text-white mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-md flex items-center justify-center text-white font-bold text-sm">ID</div>
              <span className="font-display font-bold text-lg text-white">Essex Dental Implants</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Independent referral network connecting patients with verified dental implant specialists across Essex and the wider UK. Free matching service — no obligation.
            </p>
            <p className="text-xs text-gray-500 italic border-l-2 border-gray-700 pl-3">
              Trusted by 12,000+ patients since 2020
            </p>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-white font-semibold mb-4">Treatments</h4>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link href={`/services/${service.id}`} className="text-sm hover:text-brand-400 transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Locations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Locations</h4>
            <ul className="space-y-3">
              {topCities.map((city) => {
                const slug = city.toLowerCase().replace(/\s+/g, '-');
                return (
                  <li key={city}>
                    <Link href={`/location/${slug}`} className="text-sm hover:text-brand-400 transition-colors">
                      Dental Implants in {city}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources + Latest Articles */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-sm hover:text-brand-400 transition-colors">Blog & Guides</Link></li>
              <li><Link href="/services" className="text-sm hover:text-brand-400 transition-colors">All Treatments</Link></li>
              <li><Link href="/location" className="text-sm hover:text-brand-400 transition-colors">All Locations</Link></li>
              <li><Link href="/#faq" className="text-sm hover:text-brand-400 transition-colors">FAQ</Link></li>
            </ul>

            <h4 className="text-slate-900 font-bold mt-8 mb-5 uppercase tracking-widest text-[10px]">Latest Articles</h4>
            <ul className="space-y-3">
              {latestArticles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/blog/${article.slug}`} className="text-sm hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO-rich location links bar */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Dental Implants Near You</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {allCities.map((city) => {
              const slug = city.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link key={city} href={`/location/${slug}`} className="text-xs text-gray-500 hover:text-brand-400 transition-colors">
                  {city}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Essex Dental Implants. Independent referral facilitator — not a dental provider.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/blog" className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
