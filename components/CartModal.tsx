
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

export const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  total, 
  onRemoveItem, 
  onCheckout 
}) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !animateIn) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Drawer Panel */}
      <div className={`relative w-full md:w-[450px] h-full bg-white dark:bg-[#080808] shadow-2xl flex flex-col border-l border-black/5 dark:border-white/10 transition-transform duration-300 ease-out ${animateIn ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5 bg-surface dark:bg-[#0A0A0A]">
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <h2 className="text-xl font-black italic uppercase font-display text-black dark:text-white tracking-wider">
                    Inventaire <span className="text-textMuted text-base not-italic ml-1">({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
                </h2>
            </div>
            <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black dark:text-white"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    </div>
                    <p className="text-lg font-black uppercase font-display text-black dark:text-white mb-2">Votre arsenal est vide</p>
                    <p className="text-sm text-textMuted max-w-[200px]">Équipez-vous avant de rejoindre le terrain.</p>
                    <button onClick={onClose} className="mt-6 text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 text-black dark:text-white">
                        Retour au catalogue
                    </button>
                </div>
            ) : (
                cart.map((item) => (
                    <div key={item.id} className="group relative flex gap-4 bg-surface dark:bg-white/5 p-3 rounded-xl border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all">
                        {/* Image */}
                        <div className="w-20 h-20 bg-white dark:bg-black rounded-lg flex items-center justify-center shrink-0 p-1">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-black uppercase font-display text-black dark:text-white leading-tight pr-4">
                                        {item.name}
                                    </h3>
                                    <span className="text-sm font-bold text-black dark:text-white">
                                        {(item.price * item.quantity).toFixed(2)}€
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider mt-1">{item.tagline}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <div className="text-xs font-medium text-textMuted bg-white dark:bg-black/30 px-2 py-1 rounded">
                                    Qté: <span className="text-black dark:text-white font-bold">{item.quantity}</span>
                                </div>
                                <button 
                                    onClick={() => onRemoveItem(item.id)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    Retirer
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
            <div className="p-6 border-t border-black/5 dark:border-white/5 bg-surface dark:bg-[#0A0A0A] space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-textMuted">Sous-total</span>
                    <span className="text-2xl font-black font-display text-black dark:text-white">{total.toFixed(2)}€</span>
                </div>
                
                <p className="text-[10px] text-center text-textMuted">Taxes et frais de port calculés à l'étape suivante.</p>
                
                <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={onCheckout}
                    className="h-14 shadow-lg shadow-black/20 dark:shadow-white/10"
                >
                    Procéder au paiement
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};
