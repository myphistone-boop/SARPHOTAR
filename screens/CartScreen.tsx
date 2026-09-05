import React from 'react';
import { CartItem } from '../types';
import { Button } from '../components/ui/Button';
import { PaymentRow, Guarantee } from '../components/Trust';
import { euro } from '../lib/format';

interface CartScreenProps {
  cart: CartItem[];
  total: number;
  checkingOut: boolean;
  onRemove: (id: string) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onCheckout: () => void;
  onGoArsenal: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ cart, total, checkingOut, onRemove, onInc, onDec, onCheckout, onGoArsenal }) => {
  const count = cart.reduce((a, i) => a + i.quantity, 0);
  return (
    <div className="screen-in pb-tabbar min-h-screen">
      <div className="app-chrome sticky top-0 z-30 pt-safe bg-carbon/85 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-good animate-pulse-dot" />
          <h1 className="text-2xl font-black italic uppercase font-display text-ghost leading-none">Inventaire <span className="font-hud text-sm not-italic text-muted ml-1">({count})</span></h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 grid place-items-center mb-4 text-muted">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </div>
            <p className="text-lg font-black uppercase font-display text-ghost mb-2">Arsenal vide</p>
            <p className="text-sm text-muted mb-6 max-w-[220px]">Équipez-vous avant de rejoindre le terrain.</p>
            <Button variant="accent" onClick={onGoArsenal}>Voir l'arsenal</Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-surface border border-white/8 p-3 rounded-xl edge-top">
                  <div className="w-20 h-20 bg-black/40 border border-white/5 rounded-lg grid place-items-center shrink-0 p-1"><img src={item.image} alt={item.name} loading="lazy" className="mask-orb-sm w-full h-full object-contain" /></div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="text-sm font-black uppercase font-display text-ghost leading-tight">{item.name}</h3>
                        <span className="text-sm font-bold text-ghost whitespace-nowrap">{euro(item.price * item.quantity)}</span>
                      </div>
                      <p className="font-hud text-[10px] text-muted uppercase tracking-wider mt-1">{item.tagline}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-black/40 rounded-lg border border-white/8 p-0.5">
                        <button onClick={() => onDec(item.id)} aria-label="Diminuer" className="w-7 h-7 grid place-items-center rounded-md text-ghost hover:bg-white/10 active:scale-90 transition-all">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                        <span className="font-hud text-sm text-ghost w-6 text-center">{item.quantity}</span>
                        <button onClick={() => onInc(item.id)} aria-label="Augmenter" className="w-7 h-7 grid place-items-center rounded-md text-ghost hover:bg-white/10 active:scale-90 transition-all">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="font-hud text-[10px] uppercase tracking-widest text-danger hover:text-danger/80 transition-colors flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg> Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panier moyen : proposer un second exemplaire, réel (incrémente le panier). */}
            {cart.length > 0 && count < 2 && (
              <button
                onClick={() => onInc(cart[0].id)}
                className="mt-4 w-full flex items-center gap-3 bg-surface border border-accent/25 rounded-xl p-4 text-left edge-top hover:border-accent/50 transition-colors active:scale-[0.99]"
              >
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 text-accent shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-black italic uppercase font-display text-ghost leading-tight">Vous jouez à deux ?</div>
                  <div className="text-[12px] text-muted leading-snug mt-0.5">Ajoutez un second exemplaire : un pour vous, un pour votre adversaire.</div>
                </div>
              </button>
            )}

            <div className="mt-4 bg-surface border border-white/10 rounded-xl2 p-5 edge-top">
              <div className="flex items-center justify-between mb-1"><span className="font-hud text-xs uppercase tracking-[0.2em] text-muted">Sous-total</span><span className="text-2xl font-black font-display text-ghost">{euro(total)}</span></div>
              <p className="font-hud text-[9px] text-muted tracking-wider mb-4">Livraison offerte · réception sous 10 à 15 jours · paiement sécurisé par Stripe</p>
              <Button variant="accent" fullWidth onClick={onCheckout} disabled={checkingOut}>
                {checkingOut ? 'Redirection en cours' : 'Procéder au paiement'}
              </Button>
              <PaymentRow className="mt-3 justify-center" />
              <Guarantee className="mt-2 justify-center" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
