'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from './Icons';

interface NavigationProps {
  onOpenModal: () => void;
}

export default function Navigation({ onOpenModal }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled || !isHome ? 'glass-effect py-3 shadow-md' : 'bg-slate-900/60 backdrop-blur-md py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-colors ${scrolled || !isHome ? 'bg-slate-50' : 'bg-white/10'}`}>
              <Image
                src="/logo.png"
                alt="Essex Dental Implants"
                width={40}
                height={40}
                priority
                className="object-contain"
              />
            </div>
            <span className={`text-2xl font-black tracking-tight transition-colors ${scrolled || !isHome ? 'text-slate-900' : 'text-white'}`}>
              Essex Dental Implants
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-10 text-sm font-semibold transition-colors ${scrolled || !isHome ? 'text-slate-600' : 'text-white/80'}`}>
            <Link href="/services" className={pathname === '/services' ? 'text-blue-400' : 'hover:text-blue-400'}>Services</Link>
            <Link href="/location" className={pathname === '/location' ? 'text-blue-400' : 'hover:text-blue-400'}>Location</Link>
            <Link href="/blog" className={pathname === '/blog' ? 'text-blue-400' : 'hover:text-blue-400'}>Blog</Link>
            <button onClick={onOpenModal} className="px-7 py-2.5 bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/20">
              Find a Specialist
            </button>
          </div>

          {/* Mobile Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className={`md:hidden p-2 rounded-xl transition-colors ${scrolled || !isHome ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-white'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-sm transition-opacity duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 h-full w-[65%] bg-white border-l border-slate-200 p-6 pt-20 flex flex-col space-y-4 transition-transform duration-500 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} 
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold text-slate-700">Home</Link>
          <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold text-slate-700">Services</Link>
          <Link href="/location" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold text-slate-700">Location</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold text-slate-700">Blog</Link>
          <button 
            onClick={() => { 
              onOpenModal(); 
              setIsMobileMenuOpen(false); 
            }} 
            className="text-left px-4 py-3 font-bold text-blue-500"
          >
            Find a Specialist
          </button>
        </div>
      </div>
    </>
  );
}
