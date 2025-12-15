import React, { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { useCart } from './hooks/useCart';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
// Removed ProductCard import as we replaced the list with CollectionGrid
import { CollectionGrid } from './components/CollectionGrid';
import { ProductPage } from './components/ProductPage'; 
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { TechSpecs } from './components/TechSpecs';
import { ServiceBar } from './components/ServiceBar';
import { LegalModal } from './components/LegalModal';
import { ContactModal } from './components/ContactModal';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [legalSection, setLegalSection] = useState<'privacy' | 'terms' | 'policies' | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const { addToCart, count } = useCart();
  
  const shopSectionRef = useRef<HTMLDivElement>(null);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToShop = () => {
    if (!shopSectionRef.current) return;

    const yOffset = window.innerWidth < 768 ? 60 : 96;

    const y =
      shopSectionRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };


  const handleProductSelectFromHeader = (product: Product) => {
    setSelectedProduct(product);
    setViewProduct(product);
  };

  const handleBuyNow = (product: Product) => {
    window.location.href = product.stripeUrl;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'selection:bg-white selection:text-black' : 'selection:bg-black selection:text-white'}`}>
      
      <Header 
        cartCount={count} 
        onCartClick={() => alert('Panier ouvert')} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        products={PRODUCTS}
        onProductSelect={handleProductSelectFromHeader}
        currentProduct={selectedProduct}
      />
      
      {/* New Compact Hero */}
      <Hero onShopClick={scrollToShop} />

      <main>
        {/* Collection Section - Updated with CollectionGrid */}
        {/* OPTIMIZATION: Reduced padding and adjusted scroll-mt to place title right below header */}
        <section id="shop" ref={shopSectionRef} className="pt-2 pb-4 md:pt-8 md:pb-8 flex flex-col items-center relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[72px]">
            {/* Reduced margins (mb-8) and text sizes for compactness */}
            <div className="px-6 mb-8 text-center max-w-2xl mt-0 md:mt-0">
                <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">Collection Complète</span>
                </div>
                {/* Reduced font size: 5xl->4xl mobile, 7xl->6xl desktop */}
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-3 font-display text-black dark:text-white leading-[0.9]">
                  Arsenal <span className="text-black dark:text-white">NovElec™</span>
                </h2>
                {/* Reduced font size: lg->sm/base */}
                <p className="text-sm md:text-base text-textMuted dark:text-darkTextMuted font-medium leading-normal max-w-lg mx-auto">
                  Performance pure. Design industriel. Choisissez votre calibre parmi nos trois modèles d'élite.
                </p>
            </div>

            {/* The New Grid Section */}
            <CollectionGrid 
                products={PRODUCTS} 
                onProductSelect={(p) => {
                    setSelectedProduct(p);
                    setViewProduct(p);
                }}
                isDarkMode={isDarkMode}
            />
        </section>

        {/* Tech Specs Section */}
        <div id="specs">
            <TechSpecs />
        </div>
        
        {/* Service Bar */}
        <div id="services">
            <ServiceBar />
        </div>
        
        <div id="faq">
            <FAQ />
        </div>
      </main>

      <Footer 
        onOpenLegal={(section) => setLegalSection(section)} 
        onOpenContact={() => setIsContactOpen(true)}
        onScrollToCollection={scrollToShop}
      />

      {/* Full Screen Product Page */}
      <ProductPage 
        product={viewProduct} 
        onClose={() => setViewProduct(null)} 
        onSwitchProduct={setViewProduct}
        onAddToCart={(p) => { addToCart(p); setViewProduct(null); }}
        onBuyNow={handleBuyNow}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Legal Modal (Privacy/Terms/Policies) */}
      <LegalModal 
        isOpen={!!legalSection} 
        onClose={() => setLegalSection(null)} 
        section={legalSection || 'policies'} 
      />

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
}

export default App;