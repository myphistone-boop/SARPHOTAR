import React, { useEffect } from 'react';
import { Product } from '../types';
import { Button } from './ui/Button';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose, onAddToCart, onBuyNow }) => {
  useEffect(() => {
    if (product) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Sheet */}
      <div className="relative w-full md:w-[600px] max-h-[90vh] bg-[#0F141C] md:rounded-2xl rounded-t-3xl overflow-y-auto animate-float-up shadow-2xl border border-white/10">
        
        {/* Drag Handle (Mobile) */}
        <div className="sticky top-0 left-0 right-0 h-8 flex items-center justify-center bg-[#0F141C] z-20 md:hidden" onClick={onClose}>
            <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>

        {/* Close Button (Desktop) */}
        <button 
            onClick={onClose}
            className="hidden md:flex absolute top-4 right-4 z-30 w-8 h-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
            ✕
        </button>

        <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-radial-highlight relative">
                     <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                     <div className="absolute bottom-4 left-4">
                         <h3 className="text-3xl font-black italic uppercase text-white drop-shadow-lg">{product.name}</h3>
                         <p className="text-accent font-bold">{product.tagline}</p>
                     </div>
                </div>

                <div className="space-y-4">
                    <p className="text-lg font-medium text-white">{product.story.line1} <span className="text-textMuted">{product.story.line2}</span></p>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {product.bullets.map((b, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                <div className="text-[10px] uppercase text-textMuted">{b.label}</div>
                                <div className="text-sm font-bold text-white">{b.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <Button fullWidth variant="primary" onClick={() => onBuyNow(product)} className="mb-3 bg-accent text-bg hover:bg-white">
                        Acheter • {product.price}€
                    </Button>
                     <Button fullWidth variant="secondary" onClick={() => onAddToCart(product)}>
                        Ajouter au panier
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
