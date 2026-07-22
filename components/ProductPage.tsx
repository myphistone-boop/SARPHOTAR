import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { PRODUCTS, getReviewsForProduct } from '../constants';
import { Button } from './ui/Button';
import { WeaponViewer } from './WeaponViewer';

interface ProductPageProps {
  product: Product | null;
  onClose: () => void;
  onSwitchProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const RARITY: Record<number, { label: string; color: string }> = {
  0: { label: 'RARE', color: '#38E1F0' },
  1: { label: 'EPIC', color: '#8A6BFF' },
  2: { label: 'LÉGENDAIRE', color: '#FF6A2C' },
};

const hexToRgb = (hex: string) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 0, g: 0, b: 0 };
};
const mix = (a: string, b: string, f: number) => {
  const c1 = hexToRgb(a), c2 = hexToRgb(b);
  const k = Math.max(0, Math.min(1, f));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * k),
    g: Math.round(c1.g + (c2.g - c1.g) * k),
    b: Math.round(c1.b + (c2.b - c1.b) * k),
  };
};

export const ProductPage: React.FC<ProductPageProps> = ({ product, onClose, onSwitchProduct, onAddToCart, onBuyNow }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoadCount, setReviewsLoadCount] = useState(0);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      setAnimateIn(true);
      setImgIndex(0);
      setReviews(getReviewsForProduct(product.id, 5, 0));
      setReviewsLoadCount(0);
      return () => { document.body.style.overflow = ''; };
    } else {
      document.body.style.overflow = '';
      setAnimateIn(false);
    }
  }, [product?.id]);

  if (!product) return null;

  const rarityIdx = Math.max(0, PRODUCTS.findIndex((p) => p.id === product.id));
  const rarity = RARITY[rarityIdx] ?? RARITY[0];

  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleLoadMoreReviews = () => {
    if (reviewsLoadCount >= 10) return;
    setReviews((prev) => [...prev, ...getReviewsForProduct(product.id, 5, prev.length)]);
    setReviewsLoadCount((c) => c + 1);
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5 text-hud">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );

  const SegBar = ({ label, value, start, end }: { label: string; value: number; start: string; end: string }) => {
    const segments = 26;
    const filled = Math.round((value / 100) * segments);
    return (
      <div className="bg-panel2 border border-white/5 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-hud text-[10px] font-medium uppercase tracking-[0.2em] text-muted">{label}</span>
          <span className="font-hud text-[10px] text-white">{value}<span className="text-muted">/100</span></span>
        </div>
        <div className="flex gap-[2px] h-[7px]">
          {Array.from({ length: segments }).map((_, i) => {
            const isFilled = i < filled;
            const f = filled > 1 ? i / (filled - 1) : 0;
            const c = isFilled ? mix(start, end, f) : null;
            const stagger = i * 16;
            const style = isFilled
              ? ({
                  ['--r' as string]: c!.r, ['--g' as string]: c!.g, ['--b' as string]: c!.b,
                  backgroundColor: `rgb(${c!.r},${c!.g},${c!.b})`,
                  animation: `barEntry 420ms cubic-bezier(0.16,1,0.3,1) ${stagger}ms backwards, hudPulse 2.2s ease-in-out infinite ${stagger + 420}ms`,
                } as React.CSSProperties)
              : ({ animation: `barEntry 420ms cubic-bezier(0.16,1,0.3,1) ${stagger}ms backwards` } as React.CSSProperties);
            return <div key={i} className={`flex-1 skew-x-[-20deg] rounded-[1px] ${isFilled ? '' : 'bg-white/8'}`} style={style} />;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-[60] bg-ink overflow-y-auto overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Top nav */}
      <nav className="hud-ui fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 pt-safe flex justify-between items-start pointer-events-none">
        <button
          onClick={onClose}
          className="pointer-events-auto group flex items-center gap-2 bg-panel/80 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 hover:border-hud/60 transition-all"
        >
          <span className="bg-white text-ink rounded-full p-1 group-hover:scale-90 transition-transform">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </span>
          <span className="font-hud text-[10px] tracking-[0.2em] text-white hidden sm:block">FERMER</span>
        </button>

        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-panel/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 hover:border-hud/50 transition-all min-w-[170px] md:min-w-[210px] justify-between"
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-hud text-[8px] text-hud/80 uppercase tracking-[0.3em] mb-0.5">ARSENAL</span>
              <span className="text-sm font-black italic uppercase text-white font-display leading-none">{product.name}</span>
            </div>
            <svg className={`w-4 h-4 text-hud transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 md:w-96 bg-panel border border-white/10 rounded-xl shadow-panel overflow-hidden animate-float-up z-50">
              <div className="p-2 space-y-1">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onSwitchProduct(p); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors border ${p.id === product.id ? 'bg-white/10 border-hud/30' : 'border-transparent hover:bg-white/5'}`}
                  >
                    <div className="w-14 h-14 bg-black/40 rounded-lg p-1 flex items-center justify-center border border-white/5">
                      <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-base font-black italic uppercase font-display text-white truncate">{p.name}</div>
                      <div className="font-hud text-[10px] text-muted tracking-wider">{p.tagline}</div>
                    </div>
                    <span className="ml-auto font-hud text-sm text-hud">{p.price}€</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Viewer */}
        <div className="w-full md:w-1/2 md:h-screen md:fixed md:left-0 md:top-0 bg-panel scanlines relative flex flex-col pt-16 md:pt-0 border-b md:border-b-0 md:border-r border-white/10">
          <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(70% 55% at 50% 45%, ${rarity.color}18, transparent 70%)` }} />
          <div className="flex-1 relative h-[52vh] md:h-full">
            <WeaponViewer
              images={product.gallery}
              name={product.name}
              index={imgIndex}
              onIndexChange={setImgIndex}
              introKey={product.id}
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full md:w-1/2 md:ml-auto relative bg-ink p-6 md:p-16 md:pt-28 pb-28 md:pb-16">
          {/* rarity + level */}
          <div className="flex items-center gap-3 mb-4 animate-float-up">
            <span className="font-hud text-[10px] font-semibold tracking-[0.25em] px-2.5 py-1 rounded" style={{ color: rarity.color, background: `${rarity.color}1A`, border: `1px solid ${rarity.color}44` }}>
              {rarity.label}
            </span>
            <span className="font-hud text-[10px] tracking-[0.2em] text-muted">WEAPON LVL {String(rarityIdx + 1).padStart(2, '0')}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black italic uppercase font-display tracking-tighter text-white leading-[0.85] mb-2 animate-float-up">{product.name}</h1>
          <p className="font-hud text-xs tracking-[0.2em] uppercase text-muted mb-6">{product.tagline}</p>

          {/* price + actions */}
          <div className="bg-panel border border-white/10 p-5 rounded-xl mb-8 relative overflow-hidden hud-frame">
            <div className="flex items-end justify-between mb-5 pb-4 border-b border-white/5">
              <div>
                <span className="font-hud text-[10px] uppercase text-muted tracking-[0.2em] mb-1 block">Prix unitaire</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black font-display text-white leading-none">{product.price}€</span>
                  {product.originalPrice && <span className="text-lg font-bold text-muted line-through decoration-danger decoration-2">{product.originalPrice}€</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 bg-hud/10 border border-hud/30 px-2 py-1 rounded text-hud mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-hud animate-pulse" />
                  <span className="font-hud text-[9px] tracking-widest">EN STOCK</span>
                </span>
                <span className="block font-hud text-[9px] text-muted tracking-wider">LIVRAISON 24H</span>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_2fr] gap-2.5">
              <Button onClick={() => onAddToCart(product)} variant="outline" className="h-14 !text-xs">Panier</Button>
              <Button onClick={() => onBuyNow(product)} variant="primary" className="h-14 !text-sm">Acheter</Button>
            </div>
          </div>

          {/* stats */}
          <div className="mb-8">
            <h3 className="font-hud text-[11px] font-semibold uppercase tracking-[0.25em] text-hud mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-hud" /> Statistiques
            </h3>
            <div className="space-y-2.5">
              <SegBar label="PORTÉE" value={product.specs.range} start="#FFFFFF" end="#8A9099" />
              <SegBar label="CADENCE" value={product.specs.rate} start="#FF6A2C" end="#FF3B30" />
              <SegBar label="CAPACITÉ" value={product.specs.capacity} start="#38E1F0" end="#2C90FF" />
            </div>
          </div>

          {/* rating */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-black italic font-display text-white">{product.rating}</span>
                {renderStars(Math.round(product.rating))}
              </div>
              <button onClick={scrollToReviews} className="text-left font-hud text-[10px] text-muted uppercase tracking-wider underline hover:text-white transition-colors">
                Voir les {product.reviewCount} rapports
              </button>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <p className="text-[11px] font-medium text-muted max-w-[140px] leading-tight">98% des acheteurs recommandent ce modèle pour les batailles nocturnes.</p>
          </div>

          {/* briefing */}
          <div className="mb-10">
            <h3 className="font-hud text-[11px] font-semibold uppercase tracking-[0.25em] text-hud mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-hud" /> Briefing
            </h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-white mb-3">{product.story.line1}</p>
            <p className="text-base leading-relaxed text-muted mb-6">{product.story.line2} Conçu avec des polymères haute densité et une électronique étanche, c'est l'outil ultime pour dominer l'été.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {product.bullets.map((b, i) => (
                <div key={i} className="bg-panel2 border border-white/5 p-3 rounded-lg">
                  <div className="font-hud text-[9px] uppercase text-muted tracking-wider mb-1">{b.label}</div>
                  <div className="text-sm font-black italic font-display text-white">{b.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* reviews */}
          <div ref={reviewsRef} className="border-t border-white/10 pt-8">
            <h3 className="text-2xl font-black italic uppercase font-display text-white mb-6">
              Field Reports <span className="font-hud text-base not-italic text-hud ml-2">({product.reviewCount})</span>
            </h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-panel border border-white/8 p-5 rounded-xl hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{r.name}</span>
                      {r.verified && <span className="font-hud text-[9px] bg-hud/10 text-hud px-2 py-0.5 rounded-full tracking-wide border border-hud/20">VÉRIFIÉ</span>}
                    </div>
                    <span className="font-hud text-[10px] text-muted">{r.date}</span>
                  </div>
                  <div className="mb-2">{renderStars(r.rating)}</div>
                  <p className="text-sm text-white/70 leading-relaxed mb-3">"{r.content}"</p>
                  {r.image && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/10 max-w-[200px]">
                      <img src={r.image} alt="Rapport client" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center pb-4">
              {reviewsLoadCount < 10 ? (
                <button onClick={handleLoadMoreReviews} className="font-hud text-[11px] uppercase tracking-[0.2em] border border-white/15 px-8 py-3 rounded-md text-white hover:border-hud hover:text-hud transition-all">
                  Charger plus de rapports
                </button>
              ) : (
                <span className="font-hud text-[10px] text-muted uppercase tracking-[0.2em]">Tous les rapports affichés</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="hud-ui md:hidden fixed bottom-0 left-0 right-0 z-[70] p-3 pb-safe bg-panel/90 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col shrink-0">
            <span className="font-hud text-[9px] text-muted uppercase tracking-wider truncate max-w-[90px]">{product.name}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black font-display text-white">{product.price}€</span>
              {product.originalPrice && <span className="text-[11px] text-muted line-through decoration-danger">{product.originalPrice}€</span>}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-[1fr_1.6fr] gap-2">
            <button onClick={() => onAddToCart(product)} className="font-hud text-[10px] uppercase tracking-[0.15em] py-3 rounded-md border border-white/15 text-white active:scale-95 transition-transform">Panier</button>
            <button onClick={() => onBuyNow(product)} className="font-hud text-xs uppercase tracking-[0.15em] py-3 rounded-md bg-white text-ink active:scale-95 transition-transform">Acheter</button>
          </div>
        </div>
      </div>
    </div>
  );
};
