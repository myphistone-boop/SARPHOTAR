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
import { StickyCta } from './components/StickyCta';
import { CookieBanner } from './components/CookieBanner';
import { EmailCapture } from './components/EmailCapture';
import { track } from './lib/analytics';

/** Clé de stockage du montant du panier, relu au retour de Stripe. */
const PENDING_VALUE_KEY = 'sarphotar_pending_order_value';

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

  const { addToCart, removeFromCart, increment, decrement, clearCart, count, cart, total } = useCart();

  // Splash court : le contenu doit apparaître vite.
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Capture du tag d'affiliation ?ref, conservé le temps de la session.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const ref = q.get('ref');
    if (ref) { sessionStorage.setItem('ref', ref); setRefTag(ref); }
    else { const s = sessionStorage.getItem('ref'); if (s) setRefTag(s); }
  }, []);

  /**
   * Lien profond depuis une publicité : ?p=<id produit> ouvre directement la
   * fiche concernée. Permet à chaque campagne d'atterrir sur le produit
   * qu'elle met en avant plutôt que sur la page d'accueil générique.
   */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pid = q.get('p');
    if (!pid) return;
    const found = WEAPONS.find((w) => w.id === pid);
    if (found) {
      setWeapon(found);
      track('view_item', {
        currency: 'EUR',
        value: found.price,
        items: [{ item_id: found.id, item_name: found.name, price: found.price }],
      });
    }
  }, []);

  // Retour depuis Stripe Checkout (success_url).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('payment_success') !== 'true') return;

    const order = q.get('order');

    // Le montant a été mémorisé avant la redirection vers Stripe : sans lui,
    // l'événement d'achat partirait sans valeur et Meta/GA4 ne pourraient
    // calculer ni ROAS ni enchères optimisées.
    const stored = sessionStorage.getItem(PENDING_VALUE_KEY);
    const value = stored ? Number(stored) : undefined;
    sessionStorage.removeItem(PENDING_VALUE_KEY);

    setSuccess({ open: true, order });
    track('purchase', {
      transaction_id: order,
      currency: 'EUR',
      ...(Number.isFinite(value) && value! > 0 ? { value } : {}),
    });
    clearCart();
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [clearCart]);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const handleAddToCart = (w: Weapon) => {
    addToCart(w);
    notify(`${w.name} ajouté`);
    track('add_to_cart', { currency: 'EUR', value: w.price, items: [{ item_id: w.id, item_name: w.name, price: w.price }] });
  };

  const processCheckout = useCallback(async (items: { key: string; quantity: number }[], value: number) => {
    setCheckingOut(true);
    sessionStorage.setItem(PENDING_VALUE_KEY, String(value));
    track('begin_checkout', {
      currency: 'EUR',
      value,
      num_items: items.reduce((a, i) => a + i.quantity, 0),
    });
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, ref: refTag }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      console.error('Checkout error:', data.error);
      notify("Paiement indisponible. Merci de réessayer.");
    } catch (e) {
      console.error('Network error:', e);
      notify("Une erreur est survenue, merci de réessayer.");
    }
    // On ne relâche l'écran de chargement qu'en cas d'échec : en cas de
    // succès la page est en train d'être remplacée par Stripe.
    setCheckingOut(false);
  }, [refTag]);

  const handleBuyNow = (w: Weapon) => processCheckout([{ key: w.id, quantity: 1 }], w.price);
  const handleCheckoutFromCart = () => {
    if (count === 0) return;
    processCheckout(cart.map((i) => ({ key: i.id, quantity: i.quantity })), total);
  };

  const openWeapon = (w: Weapon) => {
    setWeapon(w);
    track('view_item', { currency: 'EUR', value: w.price, items: [{ item_id: w.id, item_name: w.name, price: w.price }] });
  };
  const goArsenal = () => { setWeapon(null); setTab('arsenal'); window.scrollTo(0, 0); };
  const changeTab = (t: Tab) => { setWeapon(null); setTab(t); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen carbon text-ghost selection:bg-accent selection:text-carbon">
      {/* Flash de marque à l'ouverture (pas de fausse barre de chargement) */}
      {booting && (
        <div className="fixed inset-0 z-[200] bg-carbon carbon grid place-items-center animate-fade">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-12 h-12 rounded-xl bg-ghost text-carbon font-display font-black italic text-2xl leading-none shadow-glow">S</div>
            <div className="font-display text-2xl font-black italic uppercase tracking-tight text-ghost">SARPHOTAR™</div>
          </div>
        </div>
      )}

      {/* Notification */}
      <div role="status" aria-live="polite" className={`fixed top-safe left-1/2 -translate-x-1/2 z-[110] mt-3 transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}`}>
        <div className="bg-surface border border-accent/30 px-5 py-3 rounded-full shadow-card flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="font-hud text-xs uppercase tracking-wider text-ghost">{toast}</span>
        </div>
      </div>

      {/* Écrans */}
      {tab === 'home' && (
        <HomeScreen
          weapons={WEAPONS}
          onOpenWeapon={openWeapon}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onGoArsenal={goArsenal}
          onContact={() => setContactOpen(true)}
          onOpenLegal={() => setLegalOpen(true)}
        />
      )}
      {tab === 'arsenal' && <ArsenalScreen weapons={WEAPONS} onOpenWeapon={openWeapon} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />}
      {tab === 'cart' && <CartScreen cart={cart} total={total} checkingOut={checkingOut} onRemove={removeFromCart} onInc={increment} onDec={decrement} onCheckout={handleCheckoutFromCart} onGoArsenal={goArsenal} />}
      {tab === 'help' && <HelpScreen onContact={() => setContactOpen(true)} onOpenLegal={() => setLegalOpen(true)} />}

      {/* Fiche produit */}
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

      {/* Redirection paiement */}
      {checkingOut && (
        <div className="fixed inset-0 z-[120] bg-carbon/85 backdrop-blur-md grid place-items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <div className="text-ghost/80 text-sm">Redirection vers le paiement sécurisé</div>
          </div>
        </div>
      )}

      {success.open && <SuccessScreen orderNumber={success.order} onClose={() => setSuccess({ open: false, order: null })} />}

      <ContactSheet isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <LegalSheet isOpen={legalOpen} onClose={() => setLegalOpen(false)} />

      {/* CTA persistant — accueil uniquement, au-dessus de la barre d'onglets */}
      {tab === 'home' && !weapon && !success.open && !contactOpen && !legalOpen && (
        <StickyCta onClick={goArsenal} />
      )}

      <CookieBanner />

      {/* Un seul popup sur le site, et jamais par-dessus un achat en cours. */}
      <EmailCapture blocked={Boolean(weapon) || success.open || contactOpen || legalOpen || checkingOut || tab === 'cart'} />

      {!weapon && !success.open && <TabBar active={tab} cartCount={count} onChange={changeTab} />}
    </div>
  );
}

export default App;
