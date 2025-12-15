
import React, { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { useCart } from './hooks/useCart';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CollectionGrid } from './components/CollectionGrid';
import { ProductPage } from './components/ProductPage'; 
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { TechSpecs } from './components/TechSpecs';
import { ServiceBar } from './components/ServiceBar';
import { LegalModal } from './components/LegalModal';
import { ContactModal } from './components/ContactModal';
import { AdminInit } from './components/AdminInit';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [legalSection, setLegalSection] = useState<'privacy' | 'terms' | 'policies' | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
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

  // Check for admin flag in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
        setIsAdminOpen(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToShop = () => {
    if (!shopSectionRef.current) return;
    const yOffset = window.innerWidth < 768 ? 60 : 96;
    const y = shopSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleProductSelectFromHeader = (product: Product) => {
    setSelectedProduct(product);
    setViewProduct(product);
  };

  // --- NEW: STRIPE CHECKOUT LOGIC ---
  const handleBuyNow = async (product: Product) => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ offerKey: product.lookupKey }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
            window.location.href = data.url;
        } else {
            console.error('Checkout failed:', data.error);
            alert('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
            setIsCheckingOut(false);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Erreur de connexion.');
        setIsCheckingOut(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'selection:bg-white selection:text-black' : 'selection:bg-black selection:text-white'}`}>
      
      {/* LOADING OVERLAY FOR CHECKOUT */}
      {isCheckingOut && (
          <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white font-bold uppercase tracking-widest">Redirection Stripe...</span>
              </div>
          </div>
      )}

      <Header 
        cartCount={count} 
        onCartClick={() => alert('Panier ouvert')} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        products={PRODUCTS}
        onProductSelect={handleProductSelectFromHeader}
        currentProduct={selectedProduct}
      />
      
      <Hero onShopClick={scrollToShop} />

      <main>
        <section id="shop" ref={shopSectionRef} className="pt-2 pb-4 md:pt-8 md:pb-8 flex flex-col items-center relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[72px]">
            <div className="px-6 mb-8 text-center max-w-2xl mt-0 md:mt-0">
                <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">Collection Complète</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-3 font-display text-black dark:text-white leading-[0.9]">
                  Arsenal <span className="text-black dark:text-white">NovElec™</span>
                </h2>
                <p className="text-sm md:text-base text-textMuted dark:text-darkTextMuted font-medium leading-normal max-w-lg mx-auto">
                  Performance pure. Design industriel. Choisissez votre calibre parmi nos trois modèles d'élite.
                </p>
            </div>

            <CollectionGrid 
                products={PRODUCTS} 
                onProductSelect={(p) => {
                    setSelectedProduct(p);
                    setViewProduct(p);
                }}
                isDarkMode={isDarkMode}
            />
        </section>

        <div id="specs">
            <TechSpecs />
        </div>
        
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
        // Hidden trigger for admin
        onSecretAction={() => setIsAdminOpen(true)}
      />

      <ProductPage 
        product={viewProduct} 
        onClose={() => setViewProduct(null)} 
        onSwitchProduct={setViewProduct}
        onAddToCart={(p) => { addToCart(p); setViewProduct(null); }}
        onBuyNow={handleBuyNow}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <LegalModal 
        isOpen={!!legalSection} 
        onClose={() => setLegalSection(null)} 
        section={legalSection || 'policies'} 
      />

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      {isAdminOpen && (
        <AdminInit onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
}

export default App;
