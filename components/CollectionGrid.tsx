
import React, { useRef } from 'react';
import { Product } from '../types';

interface CollectionGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isDarkMode: boolean;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ products, onProductSelect, onAddToCart, isDarkMode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth;
      
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Determine colors based on dark mode prop
  // Range: Monochrome (Black/White)
  const rangeStart = isDarkMode ? '#FFFFFF' : '#000000';
  const rangeEnd = isDarkMode ? '#AAAAAA' : '#444444';

  return (
    <div className="w-full max-w-[1400px] mx-auto px-0 md:px-6 relative group">
      
      {/* Mobile Navigation Arrows (Overlay) */}
      <div className="absolute top-[40%] -translate-y-1/2 left-4 z-30 md:hidden">
          <button 
            onClick={() => scroll('left')} 
            className="w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-md border border-white/20 active:scale-90 transition-transform shadow-lg"
            aria-label="Produit précédent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
      </div>
      <div className="absolute top-[40%] -translate-y-1/2 right-4 z-30 md:hidden">
          <button 
            onClick={() => scroll('right')} 
            className="w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-md border border-white/20 active:scale-90 transition-transform shadow-lg"
             aria-label="Produit suivant"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex md:grid md:grid-cols-3 gap-0 md:gap-16 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-8 md:pb-0"
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-full md:min-w-0 px-6 md:px-0 flex flex-col items-center gap-8 snap-center">

            {/* IMAGE + MONOCHROME FRAME */}
            <div className="relative p-[4px] rounded-[32px] bg-gradient-to-br from-black via-gray-600 to-black dark:from-white dark:via-gray-400 dark:to-white w-full">

              {/* PRODUCT NAME BADGE */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-zinc-100/95 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-black/5">
                  <span className="text-[13px] font-black uppercase tracking-wide text-zinc-800">
                    {product.name}
                  </span>
                </div>
              </div>

              {/* ACTION CARDS */}
              <div className="pointer-events-none absolute inset-x-4 bottom-[-12px] z-20 flex justify-between gap-8">
                <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductSelect(product);
                    }}
                    className="pointer-events-auto cursor-pointer bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-black/5 text-[14px] font-black uppercase tracking-widest text-zinc-800 hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all"
                >
                  Choisir
                </div>

                <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }} 
                    className="pointer-events-auto cursor-pointer bg-zinc-900/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-black/10 text-[14px] font-black uppercase tracking-widest text-white hover:bg-black hover:scale-105 active:scale-95 transition-all"
                >
                  + panier
                </div>
              </div>

              {/* IMAGE */}
              <img
                src={product.image}
                alt={product.name}
                className="block w-full h-auto rounded-[32px] cursor-pointer"
                onClick={() => onProductSelect(product)}
              />
            </div>

            {/* STATS */}
            <div className="w-full space-y-3">
              <StatBar label="PORTÉE" value={product.specs.range} start={rangeStart} end={rangeEnd} />
              <StatBar label="CADENCE" value={product.specs.rate} start="#FF5500" end="#D40000" />
              <StatBar label="CAPACITÉ" value={product.specs.capacity} start="#00E5FF" end="#2979FF" />
            </div>

            {/* TAGLINE REMOVED HERE */}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- STAT BAR ---------- */

const StatBar = ({
  label,
  value,
  start,
  end,
}: {
  label: string;
  value: number;
  start: string;
  end: string;
}) => {
  const segments = 24;
  const filled = Math.floor((value / 100) * segments);

  const hexToRgb = (hex: string) => {
    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return res
      ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) }
      : { r: 0, g: 0, b: 0 };
  };

  const interpolate = (a: string, b: string, f: number) => {
    const c1 = hexToRgb(a);
    const c2 = hexToRgb(b);
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * f),
      g: Math.round(c1.g + (c2.g - c1.g) * f),
      b: Math.round(c1.b + (c2.b - c1.b) * f),
    };
  };

  return (
    <div className="bg-zinc-100 dark:bg-[#111] dark:border dark:border-white/10 rounded-xl p-3 transition-colors duration-300">
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300 mb-2 transition-colors duration-300">
        {label}
      </div>

      <div className="flex gap-[2px] h-[6px]">
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filled;
          const f = filled > 1 ? i / (filled - 1) : 0;
          const rgb = isFilled ? interpolate(start, end, f) : null;

          // We pass RGB variables to the style for the keyframe to use
          const style = isFilled
            ? ({
                '--r': rgb!.r,
                '--g': rgb!.g,
                '--b': rgb!.b,
                backgroundColor: `rgb(${rgb!.r},${rgb!.g},${rgb!.b})`,
                animation: 'amplifiedPulse 2s ease-in-out infinite',
                animationDelay: `${i * 30}ms`,
              } as React.CSSProperties)
            : undefined;

          return (
            <div
              key={i}
              className={`flex-1 skew-x-[-20deg] rounded-[1px] transition-colors duration-300 ${
                isFilled ? '' : 'bg-zinc-300 dark:bg-zinc-800'
              }`}
              style={style}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes amplifiedPulse {
          0%, 100% { 
            transform: scaleY(1); 
            filter: brightness(1);
            box-shadow: 0 0 2px rgba(var(--r), var(--g), var(--b), 0.3);
          }
          50% { 
            transform: scaleY(1.4); 
            filter: brightness(1.3);
            box-shadow: 
              /* Core (Tight & Opaque) */
              0 0 6px rgba(var(--r), var(--g), var(--b), 0.9),
              /* Glow (Mid) */
              0 0 12px rgba(var(--r), var(--g), var(--b), 0.6),
              /* Atmosphere (Wide) */
              0 0 20px rgba(var(--r), var(--g), var(--b), 0.3);
          }
        }
      `}</style>
    </div>
  );
};
