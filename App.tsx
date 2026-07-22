import React, { useState, useEffect, useCallback } from 'react';
import { WEAPONS, Weapon } from './data/catalog';
import { useCart } from './hooks/useCart';
import { TabBar, Tab } from './components/TabBar';
import { HomeScreen } from './screens/HomeScreen';
import { ArsenalScreen } from './screens/ArsenalScreen';
import { WeaponScreen } from './screens/WeaponScreen';
import { CartScreen } from './screens/CartScreen';
import { HelpScreen } from './screens/HelpScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { ContactSheet } from './components/ContactSheet';
import { LegalSheet } from './components/LegalSheet';

function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState<{ open: boolean; order: string | null }>({ open: false, order: null });
  const [refTag, setRefTag] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  const { addToCart, removeFromCart, clearCart, count, cart, total } = useCart();

  // boot splash
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1150);
    return () => clearTimeout(t);
  }, []);

  // ?ref capture
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const ref = q.get('ref');
    if (ref) { sessionStorage.setItem('ref', ref); setRefTag(ref); }
    else { const s = sessionStorage.getItem('ref'); if (s) setRefTag(s); }
  }, []);

  // ?payment_success handling (Stripe success_url)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('payment_success') === 'true') {
      setSuccess({ open: true, order: q.get('order') });
      clearCart();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [clearCart]);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const handleAddToCart = (w: Weapon) => { addToCart(w); notify(`${w.name} ajouté`); };

  const processCheckout = useCallback(async (items: { key: string; quantity: number }[]) => {
    setCheckingOut(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, ref: refTag }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { console.error('Checkout error:', data.error); alert("Erreur lors de l'initialisation du paiement. Veuillez réessayer."); }
    } catch (e) { console.error('Network error:', e); alert('Une erreur est survenue.'); }
    finally { setCheckingOut(false); }
  }, [refTag]);

  const handleBuyNow = (w: Weapon) => processCheckout([{ key: w.id, quantity: 1 }]);
  const handleCheckoutFromCart = () => { if (count === 0) return; processCheckout(cart.map((i) => ({ key: i.id, quantity: i.quantity }))); };

  const openWeapon = (w: Weapon) => { setWeapon(w); };
  const goArsenal = () => { setWeapon(null); setTab('arsenal'); window.scrollTo(0, 0); };
  const changeTab = (t: Tab) => { setWeapon(null); setTab(t); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen carbon text-ghost selection:bg-accent selection:text-carbon">
      {/* Boot splash */}
      {booting && (
        <div className="fixed inset-0 z-[200] bg-carbon carbon grid place-items-center animate-fade">
          <div className="flex flex-col items-center">
            <div className="grid place-items-center w-16 h-16 rounded-2xl bg-ghost text-carbon font-display font-black italic text-4xl leading-none mb-5 shadow-glow animate-float">S</div>
            <div className="font-display text-2xl font-black italic uppercase tracking-tight text-ghost mb-4">SARPHOTAR™</div>
            <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent animate-boot-bar" />
            </div>
            <div className="font-hud text-[9px] tracking-[0.3em] text-muted mt-3">INITIALISATION DE L'ARSENAL</div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed top-safe left-1/2 -translate-x-1/2 z-[110] mt-3 transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}`}>
        <div className="bg-surface border border-accent/30 px-5 py-3 rounded-full shadow-card flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="font-hud text-xs uppercase tracking-wider text-ghost">{toast}</span>
        </div>
      </div>

      {/* Tab screens */}
      {tab === 'home' && <HomeScreen weapons={WEAPONS} onOpenWeapon={openWeapon} onAddToCart={handleAddToCart} onGoArsenal={goArsenal} onContact={() => setContactOpen(true)} />}
      {tab === 'arsenal' && <ArsenalScreen weapons={WEAPONS} onOpenWeapon={openWeapon} onAddToCart={handleAddToCart} />}
      {tab === 'cart' && <CartScreen cart={cart} total={total} checkingOut={checkingOut} onRemove={removeFromCart} onCheckout={handleCheckoutFromCart} onGoArsenal={goArsenal} />}
      {tab === 'help' && <HelpScreen onContact={() => setContactOpen(true)} onOpenLegal={() => setLegalOpen(true)} />}

      {/* Weapon inspector overlay */}
      {weapon && (
        <WeaponScreen
          weapon={weapon}
          weapons={WEAPONS}
          onBack={() => setWeapon(null)}
          onSwitch={setWeapon}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Checkout overlay */}
      {checkingOut && (
        <div className="fixed inset-0 z-[120] bg-carbon/85 backdrop-blur-md grid place-items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <div className="font-hud text-ghost uppercase tracking-[0.25em] text-xs animate-pulse">Connexion Stripe…</div>
          </div>
        </div>
      )}

      {/* Success */}
      {success.open && <SuccessScreen orderNumber={success.order} onClose={() => setSuccess({ open: false, order: null })} />}

      {/* Sheets */}
      <ContactSheet isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <LegalSheet isOpen={legalOpen} onClose={() => setLegalOpen(false)} />

      {/* Bottom navigation */}
      {!weapon && !success.open && <TabBar active={tab} cartCount={count} onChange={changeTab} />}
    </div>
  );
}

export default App;
