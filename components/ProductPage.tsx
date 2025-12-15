
import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { PRODUCTS, getReviewsForProduct } from '../constants';
import { Button } from './ui/Button';

interface ProductPageProps {
  product: Product | null;
  onClose: () => void;
  onSwitchProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

// Helper to convert hex to RGB object
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

// Helper to interpolate between two colors
const interpolateColorObj = (color1: string, color2: string, factor: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    const f = Math.max(0, Math.min(1, factor));
    
    const r = Math.round(c1.r + (c2.r - c1.r) * f);
    const g = Math.round(c1.g + (c2.g - c1.g) * f);
    const b = Math.round(c1.b + (c2.b - c1.b) * f);
    
    return { r, g, b };
};

export const ProductPage: React.FC<ProductPageProps> = ({ 
  product, 
  onClose, 
  onSwitchProduct, 
  onAddToCart, 
  onBuyNow,
  isDarkMode,
  onToggleTheme
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoadCount, setReviewsLoadCount] = useState(0);
  
  // Transition State: simple trigger for visual effects only
  const [triggerEffect, setTriggerEffect] = useState(false);
  
  const reviewsRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false); // Track if modal was already open

  // Effect to handle Product Switching Animation
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      
      // Determine if this is an "Open" action or a "Switch" action
      const isSwitching = isOpenRef.current;
      isOpenRef.current = true;

      setAnimateIn(true);
      setCurrentImageIndex(0);
      setReviews(getReviewsForProduct(product.id, 5, 0)); 
      setReviewsLoadCount(0);
      window.scrollTo(0, 0);

      // Trigger Visual Effect (Flash/Scan)
      // If opening (slide up), delay effect so it's visible. If switching, instant.
      const effectDelay = isSwitching ? 0 : 400; 
      
      const tStart = setTimeout(() => setTriggerEffect(true), effectDelay);
      const tEnd = setTimeout(() => setTriggerEffect(false), effectDelay + 500); // 500ms effect duration

      return () => { 
        document.body.style.overflow = ''; 
        clearTimeout(tStart);
        clearTimeout(tEnd);
      }
    } else {
      document.body.style.overflow = '';
      setAnimateIn(false);
      setTriggerEffect(false);
      isOpenRef.current = false;
    }
  }, [product?.id]); // Trigger on ID change

  if (!product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMoreReviews = () => {
    if (reviewsLoadCount >= 10) return;
    
    const nextReviews = getReviewsForProduct(product.id, 5, reviews.length);
    setReviews(prev => [...prev, ...nextReviews]);
    setReviewsLoadCount(prev => prev + 1);
  };

  // Render Segmented Bar Function
  const renderSegmentedBar = (label: string, value: number, type: 'range' | 'rate' | 'capacity') => {
    const segments = 24; 
    const filledSegments = Math.floor((value / 100) * segments);

    // Dynamic color for Range based on Dark Mode
    const rangeStart = isDarkMode ? '#FFFFFF' : '#000000';
    const rangeEnd = isDarkMode ? '#AAAAAA' : '#444444';

    const gradientConfig = {
        range: { start: rangeStart, end: rangeEnd },
        rate: { start: '#FF5500', end: '#D40000' },
        capacity: { start: '#00E5FF', end: '#2979FF' }
    }[type];

    // Using product.id in key forces the component to remount and replay entry animation
    return (
        <div key={product.id + label} className="w-full mb-2 bg-surface dark:bg-[#111] p-3 rounded-lg border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-end mb-2 px-[1px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-textMuted dark:text-[#888] font-sans">{label}</span>
            </div>
            
            <div className="flex gap-[2px] w-full h-[6px] md:h-[8px]">
                {Array.from({ length: segments }).map((_, i) => {
                    const isFilled = i < filledSegments;
                    
                    const factor = filledSegments > 1 ? i / (filledSegments - 1) : 0;
                    const colorObj = isFilled 
                        ? interpolateColorObj(gradientConfig.start, gradientConfig.end, factor) 
                        : { r: 0, g: 0, b: 0 };

                    // Animation Timings
                    const stagger = i * 15; // 15ms stagger per bar for wave effect
                    const entryDuration = 400; // 400ms entry time
                    const pulseDelay = stagger + entryDuration; // Pulse starts after entry finishes

                    const style = (isFilled ? {
                        '--r': colorObj.r,
                        '--g': colorObj.g,
                        '--b': colorObj.b,
                        backgroundColor: `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`,
                        // Chain: Entry Animation -> Infinite Pulse
                        animation: `barEntry ${entryDuration}ms cubic-bezier(0.16, 1, 0.3, 1) ${stagger}ms backwards, strongPulsePage 2s ease-in-out infinite ${pulseDelay}ms`,
                    } : {
                        // Empty bars also animate in
                        animation: `barEntry ${entryDuration}ms cubic-bezier(0.16, 1, 0.3, 1) ${stagger}ms backwards`,
                    }) as React.CSSProperties;

                    return (
                        <div 
                            key={i}
                            className={`flex-1 h-full skew-x-[-20deg] rounded-[1px] ${
                                !isFilled ? 'bg-zinc-200 dark:bg-zinc-800' : '' 
                            }`}
                            style={style}
                        />
                    );
                })}
            </div>
            <style>{`
                @keyframes barEntry {
                    0% { transform: scaleY(0); opacity: 0; }
                    50% { transform: scaleY(1.5); opacity: 1; }
                    100% { transform: scaleY(1); opacity: 1; }
                }
                @keyframes strongPulsePage {
                    0%, 100% { 
                        transform: scaleY(1);
                        filter: brightness(1);
                        box-shadow: 0 0 5px rgba(var(--r), var(--g), var(--b), 0.4);
                    }
                    5% { 
                        transform: scaleY(1.4);
                        filter: brightness(1.3) saturate(1.2);
                        box-shadow: 
                            0 0 20px rgba(var(--r), var(--g), var(--b), 0.8),
                            0 0 40px rgba(var(--r), var(--g), var(--b), 0.4),
                            inset 0 0 10px rgba(255,255,255,0.5);
                    }
                    15% { 
                        transform: scaleY(1);
                        filter: brightness(1);
                        box-shadow: 0 0 5px rgba(var(--r), var(--g), var(--b), 0.4);
                    }
                }
            `}</style>
        </div>
    );
  };

  const renderStars = (rating: number) => {
    return (
        <div className="flex gap-1 text-black dark:text-white">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            ))}
        </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-[60] bg-bg dark:bg-darkBg overflow-y-auto overflow-x-hidden transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      
      {/* --- NON-BLOCKING TECH OVERLAY --- */}
      {triggerEffect && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {/* 1. Instant Flash */}
            <div className="absolute inset-0 bg-white/20 dark:bg-white/10 animate-flash-fade mix-blend-overlay"></div>
            
            {/* 2. Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-black/30 dark:to-white/30 animate-scan-fast opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-black/80 dark:bg-white/80 shadow-[0_0_20px_black] dark:shadow-[0_0_20px_white] animate-scan-fast"></div>
            
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-black/50 dark:border-white/50"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-black/50 dark:border-white/50"></div>
        </div>
      )}
      
      <style>{`
        @keyframes scan-fast {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(200vh); }
        }
        .animate-scan-fast {
            animation: scan-fast 0.6s linear forwards;
        }
        @keyframes flash-fade {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        .animate-flash-fade {
            animation: flash-fade 0.5s ease-out forwards;
        }
        @keyframes holidayPulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.05); filter: brightness(1.15); box-shadow: 0 10px 30px rgba(220,38,38,0.8); }
        }
      `}</style>


      {/* --- STICKY NAVIGATION HEADER --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex justify-between items-start pointer-events-none">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="pointer-events-auto group flex items-center gap-2 bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 py-2 md:px-4 rounded-full border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white transition-all shadow-lg"
        >
          <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-1 group-hover:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white hidden sm:block">Fermer</span>
        </button>

        {/* RIGHT ACTIONS: Theme + ARSENAL */}
        <div className="flex items-center gap-2 pointer-events-auto">
            {/* THEME TOGGLE */}
            <button 
                onClick={onToggleTheme}
                className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-md p-2.5 md:p-3 rounded-full border border-black/10 dark:border-white/10 shadow-2xl hover:bg-white dark:hover:bg-[#222] transition-all group text-black dark:text-white hover:text-black dark:hover:text-white"
                aria-label="Toggle Theme"
            >
                {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
            </button>

            {/* ARSENAL SELECTOR (Dropdown) */}
            <div className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 bg-white/90 dark:bg-[#111]/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-xl border border-black/10 dark:border-white/10 shadow-2xl hover:bg-white dark:hover:bg-[#222] transition-all min-w-[160px] md:min-w-[200px] justify-between group"
                >
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[8px] md:text-[9px] font-bold text-black dark:text-white uppercase tracking-widest mb-0.5">Arsenal</span>
                        <span className="text-xs md:text-sm font-black italic uppercase text-black dark:text-white font-display leading-none">{product.name}</span>
                    </div>
                    <svg 
                        className={`w-4 h-4 text-black dark:text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 md:w-96 bg-white dark:bg-[#111] rounded-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-float-up z-50">
                    <div className="p-2 space-y-1">
                        {PRODUCTS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => {
                            onSwitchProduct(p);
                            setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 p-3 md:p-4 rounded-lg transition-colors group ${
                            p.id === product.id 
                                ? 'bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 cursor-default' 
                                : 'hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            <img src={p.image} alt={p.name} className="w-12 h-12 md:w-16 md:h-16 object-contain mix-blend-multiply dark:mix-blend-normal rounded-lg" />
                            <div className="text-left">
                                <div className={`text-sm md:text-base font-black italic uppercase font-display ${p.id === product.id ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}>
                                    {p.name}
                                </div>
                                <div className="text-[10px] md:text-xs text-gray-500 font-bold">{p.tagline}</div>
                            </div>
                        </button>
                        ))}
                    </div>
                    </div>
                )}
            </div>
        </div>
      </nav>

      <div className="min-h-screen flex flex-col md:flex-row">
        
        {/* --- SECTION 1: VISUAL (Left Col / Top Mobile) --- */}
        <div className="w-full md:w-1/2 md:h-screen md:fixed md:left-0 md:top-0 bg-surface dark:bg-[#080808] relative flex flex-col pt-24 md:pt-0">
           {/* Background Grid */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
           </div>
           
           {/* Main Carousel Area */}
           <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                
                {/* Image - WITH GLITCH ANIMATION ON TRIGGER */}
                <div className={`relative w-full h-[350px] md:h-full max-h-[70vh] flex items-center justify-center p-8 transition-all duration-500 ${triggerEffect ? 'animate-glitch-quick' : ''}`}>
                    <img 
                        key={currentImageIndex} // Key forces animation reset on change
                        src={product.gallery[currentImageIndex]} 
                        alt={`${product.name} view ${currentImageIndex + 1}`} 
                        className="w-full h-full object-contain rounded-3xl mix-blend-multiply dark:mix-blend-normal [filter:drop-shadow(0_20px_50px_rgba(0,0,0,0.3))] animate-float z-10"
                    />
                </div>

                {/* Carousel Controls */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
                    <button 
                        onClick={prevImage}
                        className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur border border-black/5 dark:border-white/10 hover:border-black dark:hover:border-white text-black dark:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button 
                        onClick={nextImage}
                        className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur border border-black/5 dark:border-white/10 hover:border-black dark:hover:border-white text-black dark:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>

                {/* Dots Pagination */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {product.gallery.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-black dark:bg-white shadow-[0_0_10px_black] dark:shadow-[0_0_10px_white]' : 'w-2 bg-black/20 dark:bg-white/20'}`}
                        />
                    ))}
                </div>
           </div>
           {/* Add Quick Glitch Keyframes */}
           <style>{`
                @keyframes glitch-quick {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); filter: hue-rotate(-90deg); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .animate-glitch-quick {
                    animation: glitch-quick 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
           `}</style>
        </div>


        {/* --- SECTION 2: CONTENT SCROLL (Right Col / Bottom Mobile) --- */}
        <div className="w-full md:w-1/2 ml-auto relative bg-bg dark:bg-darkBg p-6 md:p-20 md:pt-32 pb-32">
            
            {/* 1. PC TITLE DISPLAY (Requested) */}
            <div className="hidden md:block mb-8 animate-float-up" style={{ animationDelay: '100ms' }}>
                 <h1 className="text-5xl lg:text-6xl font-black italic uppercase font-display tracking-tighter text-black dark:text-white leading-[0.85] mb-2">
                    {product.name}
                 </h1>
                 <p className="text-sm font-bold text-black dark:text-white tracking-[0.2em] uppercase pl-1">{product.tagline}</p>
            </div>

            {/* 3. PRICE & ACTIONS - Redesigned with Promo */}
            {/* MOVED UP AS REQUESTED */}
            <div className="bg-surface dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/5 mb-10 shadow-xl relative overflow-hidden">
                {/* Electric Badge Left (NEW) */}
                <div className="absolute top-0 left-0 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-br-xl shadow-lg z-10">
                    100% Électrique
                </div>

                {/* Promo Badge Right - UPDATED FOR VISIBILITY & PULSE */}
                <div className="absolute top-0 right-0 z-20">
                    <div className="relative bg-gradient-to-bl from-red-600 to-red-500 text-white text-xs md:text-sm font-black uppercase tracking-widest px-6 py-3 rounded-bl-3xl shadow-[0_5px_25px_rgba(220,38,38,0.5)] flex items-center gap-3"
                         style={{ animation: 'holidayPulse 2s ease-in-out infinite' }}>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                        Offre Noël -50%
                    </div>
                </div>

                <div className="flex items-end justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-4 mt-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase text-textMuted tracking-wider mb-1">Prix Unitaire</span>
                        <div className="flex items-baseline gap-3">
                            <div className="text-5xl font-black text-black dark:text-white font-display tracking-tight leading-none">
                                {product.price}€
                            </div>
                            {product.originalPrice && (
                                <div className="text-xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">
                                    {product.originalPrice}€
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                         <div className="inline-flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded text-green-500 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">En Stock</span>
                         </div>
                        <span className="block text-[10px] text-textMuted">Livraison 24h</span>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <Button onClick={() => onAddToCart(product)} variant="outline" className="h-14 md:h-16 text-xs md:text-sm">
                        Panier
                    </Button>
                    <Button onClick={() => onBuyNow(product)} variant="primary" className="h-14 md:h-16 text-sm md:text-base shadow-lg shadow-black/20 dark:shadow-white/20">
                        Acheter
                    </Button>
                </div>
            </div>

            {/* 2. PULSE BARS (Specs) */}
            <div className="mb-10">
                 {renderSegmentedBar("PORTÉE", product.specs.range, 'range')}
                 {renderSegmentedBar("CADENCE", product.specs.rate, 'rate')}
                 {renderSegmentedBar("CAPACITÉ", product.specs.capacity, 'capacity')}
            </div>

            {/* 4. RATING / AVIS SUMMARY */}
            <div className="flex items-center gap-4 mb-10 px-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl font-black italic font-display text-black dark:text-white">{product.rating}</span>
                        {renderStars(Math.round(product.rating))}
                    </div>
                    <button 
                        onClick={scrollToReviews}
                        className="text-left text-xs font-bold text-textMuted dark:text-darkTextMuted uppercase tracking-wider underline cursor-pointer hover:text-black dark:hover:text-white"
                    >
                        Voir les {product.reviewCount} avis certifiés
                    </button>
                </div>
                <div className="h-8 w-[1px] bg-black/10 dark:bg-white/10"></div>
                <div className="text-[10px] font-medium text-textMuted dark:text-[#666] max-w-[120px] leading-tight">
                    98% des acheteurs recommandent ce produit pour les batailles nocturnes.
                </div>
            </div>

            {/* 5. DESCRIPTION */}
            <div className="mb-12">
                <h3 className="text-sm font-black uppercase tracking-widest text-textMuted dark:text-darkTextMuted mb-4 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-black dark:bg-white"></span>
                    Briefing
                </h3>
                <p className="text-lg md:text-xl font-medium leading-relaxed text-black dark:text-white mb-4">
                    {product.story.line1}
                </p>
                <p className="text-base leading-relaxed text-textMuted dark:text-darkTextMuted mb-6">
                    {product.story.line2} Conçu avec des polymères haute densité et une électronique étanche, c'est l'outil ultime pour dominer l'été.
                </p>
                
                {/* Tech Bullets Inline - UPDATED GRID TO 2 Cols on mobile, 2 on desktop (looks better with 4 items than 3) */}
                <div className="grid grid-cols-2 gap-3">
                    {product.bullets.map((bullet, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-3 rounded border border-black/5 dark:border-white/5">
                            <div className="text-[9px] uppercase font-bold text-textMuted mb-1">{bullet.label}</div>
                            <div className="text-sm font-black text-black dark:text-white font-display italic">{bullet.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. AVIS CLIENTS DYNAMIQUES */}
            <div ref={reviewsRef} className="border-t border-black/5 dark:border-white/5 pt-10">
                <h3 className="text-2xl font-black italic uppercase font-display text-black dark:text-white mb-8">
                    Field Reports <span className="text-black dark:text-white text-lg not-italic align-middle ml-2">({product.reviewCount})</span>
                </h3>
                
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-[#111] p-6 rounded-xl border border-black/5 dark:border-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-black dark:text-white">{review.name}</span>
                                    {review.verified && (
                                        <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Achat Vérifié</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-textMuted font-medium">{review.date}</span>
                            </div>
                            <div className="mb-3">
                                {renderStars(review.rating)}
                            </div>
                            <p className="text-sm text-textMuted dark:text-gray-300 leading-relaxed">
                                "{review.content}"
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 text-center pb-8">
                    {reviewsLoadCount < 10 ? (
                        <Button 
                            variant="ghost" 
                            className="text-xs uppercase tracking-widest border border-black/10 dark:border-white/10 px-8 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                            onClick={handleLoadMoreReviews}
                        >
                            Voir plus d'avis
                        </Button>
                    ) : (
                        <span className="text-xs text-textMuted font-bold uppercase tracking-widest">Tous les avis récents affichés</span>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
