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
import { BottomNav } from './components/BottomNav';
import { Button } from './components/ui/Button';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [legalSection, setLegalSection] = useState<'privacy' | 'terms' | 'policies' | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [refTag, setRefTag] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart, removeFromCart, clearCart, count, cart, total } = useCart();

  const shopSectionRef = useRef<HTMLDivElement>(null);

  // Ensure the dark HUD theme is always applied (single-theme app)
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Auto-scroll to Arsenal on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shopSectionRef.current) {
        const yOffset = window.innerWidth < 768 ? 60 : 80;
        const y = shopSectionRef.current.getBoundingClientRect().top + window.pageYOffset - yOffset;
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Capture ?ref= and persist it
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ref = query.get('ref');
    if (ref) {
      sessionStorage.setItem('ref', ref);
      setRefTag(ref);
    } else {
      const stored = sessionStorage.getItem('ref');
      if (stored) setRefTag(stored);
    }
  }, []);

  // Handle Payment Success from URL
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success') === 'true') {
      setIsPaymentSuccess(true);
      clearCart();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [clearCart]);

  const scrollToShop = () => {
    if (!shopSectionRef.current) return;
    const yOffset = window.innerWidth < 768 ? 60 : 80;
    const y = shopSectionRef.current.getBoundingClientRect().top + window.pageYOffset - yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleProductSelectFromHeader = (product: Product) => {
    setSelectedProduct(product);
    setViewProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setToastMessage(`${product.name} ajouté au panier`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const processCheckout = async (items: { key: string; quantity: number }[]) => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, ref: refTag }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert("Erreur lors de l'initialisation du paiement. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Une erreur est survenue.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleBuyNow = (product: Product) => processCheckout([{ key: product.id, quantity: 1 }]);

  const handleCheckoutFromCart = () => {
    if (count === 0) return;
    processCheckout(cart.map((item) => ({ key: item.id, quantity: item.quantity })));
  };

  const handleCartClick = () => setIsCartModalOpen(true);

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-hud selection:text-ink">
      {/* Checkout loading overlay */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-[120] bg-ink/85 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-hud border-t-transparent rounded-full animate-spin" />
            <div className="font-hud text-white uppercase tracking-[0.25em] text-xs animate-pulse">Connexion Stripe…</div>
          </div>
        </div>
      )}

      {/* Payment success */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-float-up">
          <div className="bg-panel border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-panel relative overflow-hidden hud-frame">
            <div className="absolute top-0 inset-x-0 h-1 bg-hud" />
            <button onClick={() => setIsPaymentSuccess(false)} className="absolute top-4 right-4 text-white hover:text-hud p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <div className="w-20 h-20 bg-hud/10 rounded-full grid place-items-center mx-auto mb-6 ring-4 ring-hud/20 text-hud">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 className="text-3xl font-black italic uppercase font-display text-white mb-2">Commande Reçue</h2>
            <div className="w-12 h-1 bg-white/10 mx-auto mb-6 rounded-full" />
            <p className="text-white/80 font-medium mb-6 leading-relaxed">Votre commande a bien été prise en compte et sera traitée dans les plus brefs délais.</p>
            <div className="bg-panel2 border border-white/10 p-4 rounded-xl mb-8 text-left space-y-2">
              <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-hud mb-1">Délai estimé : 12 jours</p>
              <p className="text-sm text-white/80">Un e-mail de confirmation Stripe vous est envoyé.</p>
              <p className="text-sm text-white/80">Un e-mail de suivi sera envoyé dès la préparation du colis.</p>
              <p className="text-sm text-white/80">Support (avec votre n° de facture Stripe) : <span className="text-white font-semibold">sarphotar.pro@gmail.com</span></p>
            </div>
            <Button fullWidth variant="primary" onClick={() => setIsPaymentSuccess(false)}>Retour à l'accueil</Button>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[80] transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-panel border border-hud/30 px-5 py-3 rounded-full shadow-panel flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-hud"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="font-hud text-xs uppercase tracking-wider text-white">{toastMessage}</span>
        </div>
      </div>

      <Header
        cartCount={count}
        onCartClick={handleCartClick}
        products={PRODUCTS}
        onProductSelect={handleProductSelectFromHeader}
        currentProduct={selectedProduct}
      />

      <Hero onShopClick={scrollToShop} />

      <main>
        <section id="shop" ref={shopSectionRef} className="pt-6 pb-6 md:pt-10 md:pb-10 flex flex-col items-center relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[72px]">
          <div className="px-6 mb-8 text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-hud rounded-full animate-pulse" />
              <span className="font-hud text-[10px] uppercase tracking-[0.3em] text-hud">Collection Complète</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-3 font-display text-white leading-[0.9]">
              Arsenal <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-hud to-white">Sarphotar™</span>
            </h2>
            <p className="text-sm md:text-base text-muted font-medium leading-normal max-w-lg mx-auto">
              Performance pure. Design industriel. Choisissez votre calibre parmi nos trois modèles d'élite.
            </p>
          </div>

          <CollectionGrid
            products={PRODUCTS}
            onProductSelect={(p) => { setSelectedProduct(p); setViewProduct(p); }}
            onAddToCart={handleAddToCart}
          />
        </section>

        <div id="specs"><TechSpecs /></div>
        <div id="services"><ServiceBar /></div>
        <div id="faq"><FAQ /></div>
      </main>

      <Footer
        onOpenLegal={(section) => setLegalSection(section)}
        onOpenContact={() => setIsContactOpen(true)}
        onScrollToCollection={scrollToShop}
      />

      <BottomNav
        cartCount={count}
        onArsenal={scrollToShop}
        onSpecs={() => scrollToId('specs')}
        onCart={handleCartClick}
        onContact={() => setIsContactOpen(true)}
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
      />

      <LegalModal isOpen={!!legalSection} onClose={() => setLegalSection(null)} section={legalSection || 'policies'} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default App;
