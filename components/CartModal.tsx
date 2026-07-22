import React, { useEffect, useState } from 'react';
import { CartItem } from '../types';
import { Button } from './ui/Button';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, total, onRemoveItem, onCheckout }) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => { document.body.style.overflow = ''; }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !animateIn) return null;

  const count = cart.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full md:w-[450px] h-full bg-ink border-l border-white/10 shadow-panel flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${animateIn ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-panel pt-safe">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-hud rounded-full animate-pulse" />
            <h2 className="text-xl font-black italic uppercase font-display text-white tracking-wider">
              Inventaire <span className="font-hud text-sm not-italic text-muted ml-1">({count})</span>
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/10 text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full grid place-items-center mb-4 text-muted">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              </div>
              <p className="text-lg font-black uppercase font-display text-white mb-2">Arsenal vide</p>
              <p className="text-sm text-muted max-w-[200px]">Équipez-vous avant de rejoindre le terrain.</p>
              <button onClick={onClose} className="mt-6 font-hud text-[11px] uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 text-hud">Retour au catalogue</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-panel border border-white/8 p-3 rounded-xl hover:border-white/20 transition-all">
                <div className="w-20 h-20 bg-black/40 border border-white/5 rounded-lg grid place-items-center shrink-0 p-1">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-sm font-black uppercase font-display text-white leading-tight">{item.name}</h3>
                      <span className="text-sm font-bold text-white whitespace-nowrap">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                    <p className="font-hud text-[10px] text-muted uppercase tracking-wider mt-1">{item.tagline}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-hud text-[11px] text-muted bg-black/40 px-2 py-1 rounded border border-white/5">
                      QTÉ <span className="text-white">{item.quantity}</span>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="font-hud text-[10px] uppercase tracking-widest text-danger hover:text-danger/80 transition-colors flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 pb-safe border-t border-white/10 bg-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-hud text-xs uppercase tracking-[0.2em] text-muted">Sous-total</span>
              <span className="text-2xl font-black font-display text-white">{total.toFixed(2)}€</span>
            </div>
            <p className="font-hud text-[9px] text-center text-muted tracking-wider">Taxes et port calculés à l'étape suivante · Paiement Stripe sécurisé</p>
            <Button variant="primary" fullWidth onClick={onCheckout} className="h-14">Procéder au paiement</Button>
          </div>
        )}
      </div>
    </div>
  );
};
