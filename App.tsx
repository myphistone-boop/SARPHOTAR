
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
import { CartModal } from './components/CartModal';
import { Button } from './components/ui/Button';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [legalSection, setLegalSection] = useState<'privacy' | 'terms' | 'policies' | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  
  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const { addToCart, removeFromCart, clearCart, count, cart, total } = useCart();
  
  const shopSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to Arsenal on mount
  useEffect(() => {
    const scrollToArsenal = () => {
      if (shopSectionRef.current) {
        const yOffset = window.innerWidth < 768 ? 60 : 96;
        const y = shopSectionRef.current.getBoundingClientRect().top + window.pageYOffset - yOffset;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    };

    // Small delay to ensure the DOM is ready and the browser doesn't fight with the initial scroll restoration
    const timer = setTimeout(scrollToArsenal, 100);
    return () => clearTimeout(timer);
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Payment Success from URL
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success') === 'true') {
        setIsPaymentSuccess(true);
        clearCart();
        // Remove query params from URL without refresh to avoid showing success again on reload
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [clearCart]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToShop = () => {
    if (!shopSectionRef.current) return;

    const yOffset = window.innerWidth < 768 ? 60 : 96;

    const y =
      shopSectionRef.current.getBoundingClientRect().top +
      window.pageYOffset -
      yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleProductSelectFromHeader = (product: Product) => {
    setSelectedProduct(product);
    setViewProduct(product);
  };

  // Enhanced Add To Cart with Visual Feedback
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    
    // Show Toast
    setToastMessage(`${product.name} ajouté au panier`);
    setTimeout(() => {
        setToastMessage(null);
    }, 3000);
  };

  // Generic Checkout Handler calling the Backend API
  const processCheckout = async (items: { key: string, quantity: number }[]) => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Une erreur est survenue.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Buy Now: Immediate checkout for single product
  const handleBuyNow = (product: Product) => {
    processCheckout([{ key: product.id, quantity: 1 }]);
  };

  // Checkout from Cart Modal
  const handleCheckoutFromCart = () => {
     if (count === 0) return;

     const checkoutItems = cart.map(item => ({
      key: item.id,
      quantity: item.quantity
    }));
    
    processCheckout(checkoutItems);
  };

  // Open Cart Modal
  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'selection:bg-white selection:text-black' : 'selection:bg-black selection:text-white'}`}>
      
      {/* Loading Overlay for Checkout */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
             <div className="text-white font-bold uppercase tracking-widest text-sm animate-pulse">Redirection Stripe...</div>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up">
            <div className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                
                <button 
                    onClick={() => setIsPaymentSuccess(false)}
                    className="absolute top-4 right-4 text-black dark:text-white hover:opacity-70 p-2"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/20">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>

                <h2 className="text-3xl font-black italic uppercase font-display text-black dark:text-white mb-2">Commande Reçue</h2>
                
                <div className="w-12 h-1 bg-black/10 dark:bg-white/10 mx-auto mb-6 rounded-full"></div>

                <p className="text-black dark:text-white font-medium mb-6 leading-relaxed">
                    Votre commande a bien été prise en compte et sera traitée dans les plus brefs délais.
                </p>

                <div className="bg-surface dark:bg-white/5 p-4 rounded-xl mb-8 border border-black/5 dark:border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-textMuted dark:text-gray-400 mb-1">Délai de livraison estimé : 12 jours</p>
                    <p className="text-xl font-black font-display text-black dark:text-white">Un e-mail de confirmation Stripe est envoyé.</p>
                    <p className="text-xl font-black font-display text-black dark:text-white">Un e-mail de commande sera envoyé dès que le colis est préparé.</p>
                    <p className="text-xl font-black font-display text-black dark:text-white">Pour toute demande, contactez le support avec votre numéro de facture Stripe.</p>
                    <p className="text-xl font-black font-display text-black dark:text-white">E-mail du support : sarphotar.pro@gmail.com.</p>
                </div>

                <Button fullWidth variant="primary" onClick={() => setIsPaymentSuccess(false)} className="bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition-transform shadow-xl">
                    Retour à l'accueil
                </Button>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[80] transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center gap-3 border border-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span className="text-sm font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      </div>

      <Header 
        cartCount={count} 
        onCartClick={handleCartClick} 
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
                onAddToCart={handleAddToCart}
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
      />

      {/* MODALS */}
      
      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cart={cart}
        total={total}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckoutFromCart}
      />

      <ProductPage 
        product={viewProduct} 
        onClose={() => setViewProduct(null)} 
        onSwitchProduct={setViewProduct}
        onAddToCart={handleAddToCart} 
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
    </div>
  );
}

export default App;
