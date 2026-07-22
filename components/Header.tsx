import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  products: Product[];
  onProductSelect: (product: Product) => void;
  currentProduct?: Product;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onCartClick,
  products,
  onProductSelect,
  currentProduct,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isArsenalOpen, setIsArsenalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const arsenalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (arsenalRef.current && !arsenalRef.current.contains(e.target as Node)) setIsArsenalOpen(false);
    };
    if (isArsenalOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isArsenalOpen]);

  const navLinks = [
    { name: 'Arsenal', href: '#shop' },
    { name: 'Technologie', href: '#specs' },
    { name: 'Services', href: '#services' },
    { name: 'FAQ', href: '#faq' },
  ];

  const scrollTo = (href: string) => {
    setIsMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="hud-ui fixed top-0 left-0 right-0 z-50 pointer-events-none pt-safe">
        <div
          className={`absolute inset-0 h-full z-0 transition-all duration-500 ${
            scrolled ? 'bg-ink/85 backdrop-blur-xl border-b border-white/10' : 'bg-gradient-to-b from-ink/90 to-transparent'
          }`}
        />
        {/* animated hud hairline */}
        <div className={`absolute bottom-0 left-0 h-px w-full overflow-hidden transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-hud to-transparent animate-[marquee_3s_linear_infinite]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Wordmark */}
          <div className="pointer-events-auto flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2.5 group"
            >
              <span className="grid place-items-center w-8 h-8 rounded-md bg-white text-ink font-display font-black italic text-lg leading-none group-hover:shadow-[0_0_18px_rgba(255,255,255,0.4)] transition-shadow">S</span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter italic font-display text-white">SARPHOTAR™</span>
                <span className="hidden sm:flex items-center gap-1.5 font-hud text-[8px] tracking-[0.3em] text-hud/80 mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-hud animate-pulse" /> SYSTEM ONLINE
                </span>
              </span>
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex pointer-events-auto items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="font-hud text-xs uppercase tracking-[0.2em] text-muted hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-hud transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
            {/* Arsenal */}
            <div ref={arsenalRef} className="relative">
              <button
                onClick={() => setIsArsenalOpen(!isArsenalOpen)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-md hover:border-hud/50 transition-all group"
              >
                <span className="font-hud text-[11px] font-semibold text-white uppercase tracking-[0.2em]">ARSENAL</span>
                <svg className={`w-3.5 h-3.5 text-hud transition-transform duration-300 ${isArsenalOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>

              {isArsenalOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 md:w-96 bg-panel border border-white/10 rounded-xl shadow-panel overflow-hidden animate-float-up z-50">
                  <div className="px-4 py-2 border-b border-white/5 font-hud text-[9px] tracking-[0.3em] text-hud/80">SÉLECTION DE L'ÉQUIPEMENT</div>
                  <div className="p-2 space-y-1">
                    {products.map((p) => {
                      const active = currentProduct?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => { onProductSelect(p); setIsArsenalOpen(false); }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left border ${active ? 'bg-white/10 border-hud/30' : 'border-transparent hover:bg-white/5'}`}
                        >
                          <div className="w-12 h-12 bg-black/40 rounded-md p-1 flex items-center justify-center border border-white/5">
                            <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-black italic uppercase font-display text-white truncate">{p.name}</div>
                            <div className="font-hud text-[10px] text-muted tracking-wider truncate">{p.tagline}</div>
                          </div>
                          <span className="ml-auto font-hud text-xs text-hud">{p.price}€</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block h-6 w-px bg-white/10" />

            {/* Cart */}
            <button onClick={onCartClick} className="relative p-2 text-white hover:text-hud transition-colors" aria-label="Panier">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-ember text-[9px] font-bold text-white">{cartCount}</span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white" aria-label="Menu">
              <div className="w-6 h-6 flex flex-col justify-center items-end gap-1.5">
                <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-4'}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div className={`hud-ui fixed inset-0 z-40 bg-ink tech-grid transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col pt-24 px-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-3 mt-2">
          <span className="font-hud text-[10px] tracking-[0.3em] text-hud/80 mb-1">ÉQUIPEMENT</span>
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => { onProductSelect(p); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-4 bg-panel border border-white/10 p-3.5 rounded-xl active:scale-[0.98] transition-all text-left"
            >
              <div className="w-14 h-14 bg-black/40 rounded-lg p-1.5 flex items-center justify-center border border-white/5 shrink-0">
                <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-black italic uppercase font-display text-white leading-none mb-1">{p.name}</div>
                <div className="font-hud text-[10px] text-muted tracking-widest uppercase">{p.tagline}</div>
              </div>
              <span className="ml-auto font-hud text-hud">{p.price}€</span>
            </button>
          ))}
        </div>

        <nav className="flex flex-col gap-1 mt-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="py-3 border-b border-white/5 text-2xl font-black italic uppercase font-display text-white/90 hover:text-hud transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="mt-auto mb-8 text-center">
          <p className="font-hud text-[10px] tracking-[0.3em] text-muted mb-1">SUPPORT TACTIQUE</p>
          <p className="text-sm font-medium text-white">sarphotar.pro@gmail.com</p>
        </div>
      </div>
    </>
  );
};
