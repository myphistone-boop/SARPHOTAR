import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Button } from './ui/Button';

interface ComparisonMatrixProps {
  products: Product[];
}

const PRODUCT_CLASSES: Record<string, string> = {
  'novelec-pistol': 'ARME DE POING / LÉGER',
  'ciovelec-rifle': 'ASSAUT / POLYVALENT',
  'novelec-gatling': 'LOURD / SUPPRESSION'
};

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ products }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fonction de navigation mobile
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth; // Scroll d'une largeur d'écran
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Composant TechBar (Jauge)
  const TechBar = ({ value, color = "bg-black dark:bg-white", shadowColor = "rgba(255,255,255,0.6)" }: { value: number; color?: string; shadowColor?: string }) => {
    const segments = 15;
    const filledSegments = Math.floor((value / 100) * segments);

    return (
      <div className="flex gap-[3px] w-full h-[18px] mt-3">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-full skew-x-[-20deg] rounded-[1px] transition-all duration-300 ${
              i < filledSegments 
                ? `${color} opacity-100` 
                : 'bg-[#333333]' // Dark grey, high contrast against black background
            }`}
            style={{
                boxShadow: i < filledSegments ? `0 0 8px ${shadowColor}` : 'none'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full py-24 md:py-32 bg-[#050505] text-white overflow-hidden selection:bg-white selection:text-black">
      
      {/* Background Grid & Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-0 md:px-4">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-20 px-4">
          <div className="inline-flex items-center gap-3 mb-4 opacity-80">
             <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
             <span className="text-sm font-mono tracking-[0.3em] uppercase text-white">Arsenal Tactique</span>
             <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase font-display tracking-tighter pr-8 pb-4 inline-block">
            Choisis Ton <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 py-2">Arme</span>
          </h2>
        </div>

        {/* Matrix Container */}
        <div className="relative w-full group/container">
            
            {/* Mobile Navigation Arrows (Visible only on mobile) */}
            <button 
                onClick={() => scroll('left')}
                className="md:hidden absolute left-2 top-[30%] z-40 p-3 bg-black/50 backdrop-blur border border-white/20 rounded-full text-white active:scale-95 transition-transform"
                aria-label="Previous Weapon"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
                onClick={() => scroll('right')}
                className="md:hidden absolute right-2 top-[30%] z-40 p-3 bg-black/50 backdrop-blur border border-white/20 rounded-full text-white active:scale-95 transition-transform"
                aria-label="Next Weapon"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>


            <div 
                ref={scrollContainerRef}
                className="overflow-x-auto pb-12 no-scrollbar touch-pan-x snap-x snap-mandatory"
            >
                {/* 
                   Layout Change:
                   - Mobile: Flexbox (Carousel)
                   - Desktop: Grid (Comparison Table)
                */}
                <div className="flex md:grid md:grid-cols-[160px_1fr_1fr_1fr] md:min-w-[1100px] w-full">
                    
                    {/* --- LABELS COLUMN (Hidden on Mobile) --- */}
                    <div className="hidden md:flex flex-col pt-72 md:pt-80 border-r border-white/5 bg-[#050505]/95 backdrop-blur-md sticky left-0 z-20 shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
                        {['Portée', 'Cadence', 'Capacité', 'Poids', 'Role'].map((label, idx) => (
                            <div key={idx} className="h-28 flex items-center px-6 border-b border-white/5">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500 font-display">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* --- PRODUCT COLUMNS --- */}
                    {products.map((product) => {
                        const isHovered = hoveredId === product.id;
                        const isDimmed = hoveredId !== null && hoveredId !== product.id;

                        return (
                            <div 
                                key={product.id}
                                // Mobile: w-full (take full width), Desktop: auto
                                className={`relative flex flex-col transition-all duration-500 group border-r border-white/5 cursor-pointer w-full flex-shrink-0 md:w-auto snap-center
                                    ${isDimmed ? 'md:opacity-40 md:grayscale-[50%]' : 'opacity-100'}
                                `}
                                onMouseEnter={() => setHoveredId(product.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Background Spotlight Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                                
                                {/* Top Selection Line (Desktop only effect mostly) */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-white transition-all duration-300 ${isHovered ? 'opacity-100 shadow-[0_0_20px_white]' : 'opacity-0'}`}></div>

                                {/* --- HEADER: BIG IMAGE & NAME --- */}
                                <div className="h-72 md:h-80 px-4 pb-8 flex flex-col items-center justify-end text-center relative overflow-visible">
                                    
                                    {/* Image container */}
                                    <div className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-500 ease-out md:group-hover:scale-110 md:group-hover:-translate-y-4">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="relative z-10 translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="text-[10px] font-mono text-white mb-2 tracking-[0.2em] uppercase opacity-60 md:group-hover:opacity-100">
                                            {PRODUCT_CLASSES[product.id] || 'INCONNU'}
                                        </div>
                                        <h3 className="text-3xl md:text-2xl font-black italic uppercase font-display leading-none mb-1 text-white transition-colors">{product.name}</h3>
                                        <p className="text-lg font-bold text-gray-400">{product.price}€</p>
                                    </div>
                                </div>

                                {/* --- DATA ROWS --- */}
                                <div className="h-28 px-8 flex flex-col justify-center border-b border-white/5 bg-white/[0.02] md:group-hover:bg-white/[0.05] transition-colors">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">PORTÉE</span>
                                        <span className="text-3xl font-black text-white font-display italic tracking-tight">{product.specs.range}<span className="text-base text-white ml-1 font-bold">%</span></span>
                                    </div>
                                    <TechBar value={product.specs.range} color="bg-white" shadowColor="rgba(255, 255, 255, 0.6)" />
                                </div>

                                <div className="h-28 px-8 flex flex-col justify-center border-b border-white/5 bg-white/[0.02] md:group-hover:bg-white/[0.05] transition-colors">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">CADENCE</span>
                                        <span className="text-3xl font-black text-white font-display italic tracking-tight">{product.specs.rate}<span className="text-base text-white ml-1 font-bold">%</span></span>
                                    </div>
                                    <TechBar 
                                        value={product.specs.rate} 
                                        color={product.specs.rate > 80 ? "bg-red-500" : "bg-white"} 
                                        shadowColor={product.specs.rate > 80 ? "rgba(239, 68, 68, 0.6)" : "rgba(255, 255, 255, 0.6)"}
                                    />
                                </div>

                                <div className="h-28 px-8 flex flex-col justify-center border-b border-white/5 bg-white/[0.02] md:group-hover:bg-white/[0.05] transition-colors">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">CAPACITÉ</span>
                                        <span className="text-3xl font-black text-white font-display italic tracking-tight">{product.specs.capacity}<span className="text-base text-white ml-1 font-bold">%</span></span>
                                    </div>
                                    <TechBar value={product.specs.capacity} color="bg-white" shadowColor="rgba(255, 255, 255, 0.6)" />
                                </div>
                                
                                <div className="h-28 px-8 flex items-center justify-center border-b border-white/5 bg-white/[0.02] md:group-hover:bg-white/[0.05]">
                                    <span className="text-sm font-mono text-gray-400 border border-white/10 px-3 py-1 rounded bg-black/20">
                                        {product.id === 'novelec-gatling' ? 'LOURD' : 'LÉGER'}
                                    </span>
                                </div>

                                <div className="h-28 px-8 flex items-center justify-center border-b border-white/5 bg-white/[0.02] md:group-hover:bg-white/[0.05]">
                                    <span className={`text-[10px] font-bold uppercase py-2 px-4 rounded border-2 transition-all duration-300 ${
                                        isHovered ? 'border-white text-white bg-white/10 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-white/10 text-gray-600'
                                    }`}>
                                        {PRODUCT_CLASSES[product.id]?.split(' / ')[0]}
                                    </span>
                                </div>

                                {/* Bottom Action Area */}
                                <div className="p-8 bg-gradient-to-t from-white/10 to-transparent md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-all duration-300">
                                    <Button fullWidth variant="primary" className="text-sm py-4 border-white bg-white text-black hover:bg-black hover:text-white hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                        SÉLECTIONNER
                                    </Button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};