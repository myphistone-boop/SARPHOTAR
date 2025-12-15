import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  products: Product[];
  onProductSelect: (product: Product) => void;
  currentProduct?: Product;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onCartClick, 
  isDarkMode, 
  onToggleTheme,
  products,
  onProductSelect,
  currentProduct
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isArsenalOpen, setIsArsenalOpen] = useState(false);
  // ARSENAL MOBILE OPEN BY DEFAULT
  const [isMobileArsenalOpen, setIsMobileArsenalOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  // Ref for Arsenal Dropdown to handle click outside
  const arsenalRef = useRef<HTMLDivElement>(null);

  // Detect scroll to adjust header appearance
  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  // Click Outside Handler for Arsenal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (arsenalRef.current && !arsenalRef.current.contains(event.target as Node)) {
        setIsArsenalOpen(false);
      }
    };

    if (isArsenalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isArsenalOpen]);

  const navLinks = [
    { name: 'Collection', href: '#shop' },
    { name: 'Technologie', href: '#specs' },
    { name: 'Services', href: '#services' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArsenalSelect = (product: Product) => {
    onProductSelect(product);
    setIsArsenalOpen(false);
  };

  return (
    <>
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none`}>
        {/* Background Layer */}
        <div className={`absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 h-full z-0 transition-all duration-500 ${scrolled ? 'opacity-100 shadow-sm' : 'opacity-95'}`}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            {/* Logo Area + Promo Badge */}
            <div className="pointer-events-auto flex items-center gap-3 relative z-20 shrink-0">
                <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-2xl font-black tracking-tighter italic font-display text-black dark:text-white">
                    SARPHOTAR<span className="text-black dark:text-white">™</span><span className="text-black dark:text-white">.</span>
                </a>
                
                {/* PROMO BADGE: Visible, doesn't overlap theme */}
                <div className="hidden xs:flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse-slow transform hover:scale-105 transition-transform cursor-default">
                   <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                   <span className="text-[9px] font-black uppercase tracking-wider whitespace-nowrap">Noël -50%</span>
                </div>
            </div>
            
            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex pointer-events-auto items-center gap-8 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => (
                    <a 
                        key={link.name}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                        className="text-sm font-bold uppercase tracking-widest text-textMuted dark:text-darkTextMuted hover:text-black dark:hover:text-white transition-colors relative group"
                    >
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                ))}
            </nav>
            
            {/* Right Icons Area */}
            {/* FLEX ORDER STRATEGY: 
                Mobile: Theme(1) -> Arsenal(2) -> Cart(3) -> Menu(4) 
                Desktop: Arsenal(1) -> Divider(2) -> Theme(3) -> Cart(4)
            */}
            <div className="flex items-center gap-2 md:gap-3 pointer-events-auto relative z-20">
                
                {/* 1. THEME TOGGLE (Mobile: Order 1, Desktop: Order 3) */}
                <button 
                    onClick={onToggleTheme}
                    className="order-1 md:order-3 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    )}
                </button>

                {/* 2. ARSENAL BUTTON (Mobile: Order 2, Desktop: Order 1) */}
                <div ref={arsenalRef} className="relative order-2 md:order-1">
                    <button 
                        onClick={() => setIsArsenalOpen(!isArsenalOpen)}
                        className="flex items-center gap-2 bg-black/5 dark:bg-white/10 px-3 py-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/20 transition-all group border border-transparent hover:border-black/30 dark:hover:border-white/30"
                    >
                         {/* Unified Text Style for Mobile & PC */}
                         <span className="text-xs font-bold text-black dark:text-white uppercase tracking-widest group-hover:text-black dark:group-hover:text-white transition-colors">ARSENAL</span>
                         <svg 
                            className={`w-4 h-4 text-black dark:text-white transition-transform duration-300 ${isArsenalOpen ? 'rotate-180' : ''}`} 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         >
                            <polyline points="6 9 12 15 18 9"></polyline>
                         </svg>
                    </button>

                    {/* Arsenal Dropdown */}
                    {isArsenalOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 md:w-96 bg-white dark:bg-[#111] rounded-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-float-up z-50">
                            <div className="p-2 space-y-1">
                                {products.map((p) => {
                                  const isActive = currentProduct?.id === p.id;
                                  return (
                                    <button
                                        key={p.id}
                                        onClick={() => handleArsenalSelect(p)}
                                        className={`w-full flex items-center gap-3 p-2 md:p-3 rounded-lg transition-colors group text-left ${isActive ? 'bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20' : 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 dark:bg-white/5 rounded-md p-1 flex items-center justify-center">
                                            <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                        </div>
                                        <div>
                                            <div className={`text-xs md:text-sm font-black italic uppercase font-display transition-colors ${isActive ? 'text-black dark:text-white' : 'text-black dark:text-white group-hover:text-black dark:group-hover:text-white'}`}>
                                                {p.name}
                                            </div>
                                            <div className="text-[9px] md:text-[10px] text-gray-500 font-bold">{p.tagline}</div>
                                        </div>
                                    </button>
                                  );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. DIVIDER (Mobile: Hidden, Desktop: Order 2) */}
                <div className="hidden md:block md:order-2 h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-1"></div>

                {/* 4. CART ACTION (Mobile: Order 3, Desktop: Order 4) */}
                <button 
                    onClick={onCartClick}
                    className="order-3 md:order-4 group relative p-2 flex items-center gap-2 hover:opacity-70 transition-opacity text-black dark:text-white"
                    aria-label="Panier"
                >
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black dark:bg-white text-[9px] font-bold text-white dark:text-black animate-pulse">
                            {cartCount}
                        </span>
                        )}
                    </div>
                </button>

                {/* 5. MENU (Mobile: Order 4, Desktop: Hidden) */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="order-4 md:hidden p-2 text-black dark:text-white focus:outline-none ml-1"
                    aria-label="Menu"
                >
                     <div className="w-6 h-6 flex flex-col justify-center items-end gap-1.5">
                        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-4 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                     </div>
                </button>
            </div>
        </div>
        </header>

        {/* MOBILE MENU OVERLAY */}
        <div className={`fixed inset-0 z-40 bg-white dark:bg-black transition-transform duration-500 ease-in-out md:hidden flex flex-col pt-24 px-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
             <nav className="flex flex-col gap-6 items-center justify-start overflow-y-auto h-full pb-20 no-scrollbar">
                
                {/* MOBILE ARSENAL DROPDOWN */}
                <div className="flex flex-col items-center w-full mt-4">
                    <button 
                        onClick={() => setIsMobileArsenalOpen(!isMobileArsenalOpen)}
                        className="text-3xl font-black italic uppercase font-display text-black dark:text-white hover:text-black dark:hover:text-white transition-colors flex items-center gap-3"
                    >
                        ARSENAL
                        <svg 
                            className={`w-6 h-6 transition-transform duration-300 ${isMobileArsenalOpen ? 'rotate-180' : ''}`} 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    
                    <div className={`flex flex-col gap-3 w-full max-w-xs transition-all duration-500 ease-in-out overflow-hidden ${isMobileArsenalOpen ? 'max-h-[500px] opacity-100 my-6' : 'max-h-0 opacity-0'}`}>
                        {products.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    onProductSelect(p);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-4 bg-zinc-50 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 active:scale-95 transition-all text-left group hover:border-black/30 dark:hover:border-white/30"
                            >
                                <div className="w-12 h-12 bg-white dark:bg-black/20 rounded-lg p-1 flex items-center justify-center shrink-0">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </div>
                                <div>
                                    <div className="text-base font-black italic uppercase font-display text-black dark:text-white leading-none mb-1 group-hover:text-black dark:group-hover:text-white transition-colors">{p.name}</div>
                                    <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">{p.tagline}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {navLinks.map((link, idx) => (
                    <a 
                        key={link.name}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                        className="text-3xl font-black italic uppercase font-display text-black dark:text-white hover:text-black dark:hover:text-white transition-colors"
                        style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                        {link.name}
                    </a>
                ))}
                
                <div className="w-12 h-1 bg-black/20 dark:bg-white/20 mt-8 mb-8 rounded-full shrink-0"></div>

                <div className="text-center shrink-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-textMuted mb-2">Service Client</p>
                    <p className="text-sm font-medium text-black dark:text-white">support@sarphotar.com</p>
                </div>
             </nav>
        </div>
    </>
  );
};