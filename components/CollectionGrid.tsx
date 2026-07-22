import React, { useRef } from 'react';
import { Product } from '../types';

interface CollectionGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const RARITY = [
  { label: 'RARE', color: '#38E1F0' },
  { label: 'EPIC', color: '#8A6BFF' },
  { label: 'LÉGENDAIRE', color: '#FF6A2C' },
];

export const CollectionGrid: React.FC<CollectionGridProps> = ({ products, onProductSelect, onAddToCart }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth : el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-0 md:px-6 relative">
      {/* Mobile arrows */}
      <button onClick={() => scroll('left')} className="md:hidden absolute top-[38%] left-3 z-30 w-10 h-10 grid place-items-center bg-panel/80 text-white rounded-full backdrop-blur border border-white/10 active:scale-90 transition-transform" aria-label="Précédent">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button onClick={() => scroll('right')} className="md:hidden absolute top-[38%] right-3 z-30 w-10 h-10 grid place-items-center bg-panel/80 text-white rounded-full backdrop-blur border border-white/10 active:scale-90 transition-transform" aria-label="Suivant">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      <div
        ref={scrollRef}
        className="flex md:grid md:grid-cols-3 gap-0 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-4"
      >
        {products.map((product, idx) => {
          const rarity = RARITY[idx % RARITY.length];
          return (
            <div key={product.id} className="min-w-full md:min-w-0 px-5 md:px-0 snap-center">
              <div
                className="group relative bg-panel border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-colors duration-300 shadow-panel"
                style={{ ['--rar' as string]: rarity.color }}
              >
                {/* top glow line */}
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${rarity.color}, transparent)` }} />

                {/* header row */}
                <div className="flex items-center justify-between px-4 pt-3.5">
                  <span
                    className="font-hud text-[9px] font-semibold tracking-[0.25em] px-2 py-1 rounded"
                    style={{ color: rarity.color, background: `${rarity.color}1A`, border: `1px solid ${rarity.color}44` }}
                  >
                    {rarity.label}
                  </span>
                  <span className="font-hud text-[9px] tracking-[0.2em] text-muted">NIV. {String(idx + 1).padStart(2, '0')} / 03</span>
                </div>

                {/* image stage */}
                <button onClick={() => onProductSelect(product)} className="relative w-full aspect-[4/3] mt-1 dot-grid overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(60% 60% at 50% 55%, ${rarity.color}22, transparent 70%)` }} />
                  {/* hud brackets */}
                  <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/25" />
                  <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/25" />
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.06] [filter:drop-shadow(0_16px_28px_rgba(0,0,0,0.6))]"
                  />
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 font-hud text-[9px] tracking-[0.2em] text-hud/90 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                    INSPECTER
                  </span>
                </button>

                {/* name */}
                <div className="px-4 pt-3">
                  <h3 className="text-2xl font-black italic uppercase font-display text-white leading-none">{product.name}</h3>
                  <p className="font-hud text-[10px] tracking-[0.2em] text-muted mt-1 uppercase">{product.tagline}</p>
                </div>

                {/* stats */}
                <div className="px-4 pt-4 space-y-2.5">
                  <StatBar label="PORTÉE" value={product.specs.range} start="#FFFFFF" end="#8A9099" />
                  <StatBar label="CADENCE" value={product.specs.rate} start="#FF6A2C" end="#FF3B30" />
                  <StatBar label="CAPACITÉ" value={product.specs.capacity} start="#38E1F0" end="#2C90FF" />
                </div>

                {/* price + actions */}
                <div className="px-4 py-4 mt-2">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-black font-display text-white">{product.price}€</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted line-through decoration-danger decoration-2">{product.originalPrice}€</span>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 font-hud text-[9px] tracking-widest text-hud">
                      <span className="w-1.5 h-1.5 rounded-full bg-hud animate-pulse" /> EN STOCK
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_1.4fr] gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                      className="font-hud text-[11px] uppercase tracking-[0.15em] py-3 rounded-md border border-white/15 text-white hover:border-hud hover:text-hud transition-colors active:scale-95"
                    >
                      + Panier
                    </button>
                    <button
                      onClick={() => onProductSelect(product)}
                      className="font-hud text-[11px] uppercase tracking-[0.15em] py-3 rounded-md bg-white text-ink hover:shadow-[0_0_18px_rgba(255,255,255,0.35)] transition-all active:scale-95"
                    >
                      Choisir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Segmented HUD stat bar ---------- */
const hexToRgb = (hex: string) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 0, g: 0, b: 0 };
};
const mix = (a: string, b: string, f: number) => {
  const c1 = hexToRgb(a), c2 = hexToRgb(b);
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * f),
    g: Math.round(c1.g + (c2.g - c1.g) * f),
    b: Math.round(c1.b + (c2.b - c1.b) * f),
  };
};

const StatBar: React.FC<{ label: string; value: number; start: string; end: string }> = ({ label, value, start, end }) => {
  const segments = 22;
  const filled = Math.round((value / 100) * segments);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-hud text-[9px] font-medium uppercase tracking-[0.2em] text-muted">{label}</span>
        <span className="font-hud text-[9px] text-white/70">{value}</span>
      </div>
      <div className="flex gap-[2px] h-[6px]">
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filled;
          const f = filled > 1 ? i / (filled - 1) : 0;
          const c = isFilled ? mix(start, end, f) : null;
          const style = isFilled
            ? ({
                ['--r' as string]: c!.r, ['--g' as string]: c!.g, ['--b' as string]: c!.b,
                backgroundColor: `rgb(${c!.r},${c!.g},${c!.b})`,
                animation: 'hudPulse 2s ease-in-out infinite',
                animationDelay: `${i * 30}ms`,
              } as React.CSSProperties)
            : undefined;
          return (
            <div
              key={i}
              className={`flex-1 skew-x-[-20deg] rounded-[1px] ${isFilled ? '' : 'bg-white/10'}`}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
};
