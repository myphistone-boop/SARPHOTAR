import React from 'react';
import { Product } from '../types';
import { Button } from './ui/Button';

interface StickyBottomBarProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ product, onAddToCart, onBuyNow }) => {
  return (
    <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto flex items-center gap-6">
        <div className="hidden md:flex flex-col">
            <span className="text-xs text-textMuted dark:text-darkTextMuted uppercase font-bold tracking-wider">{product.name}</span>
            <span className="text-xl font-black text-black dark:text-white font-display">{product.price}€</span>
        </div>
        
        <div className="flex-1 grid grid-cols-[1fr_2fr] gap-3">
            <Button 
                variant="outline" 
                onClick={() => onAddToCart(product)}
                className="text-xs font-bold uppercase tracking-wider py-3"
            >
                Panier
            </Button>
            <Button 
                variant="primary" 
                onClick={() => onBuyNow(product)}
                className="text-sm font-bold uppercase tracking-widest py-3"
            >
                Acheter <span className="hidden sm:inline ml-1">• {product.price}€</span>
            </Button>
        </div>
      </div>
    </div>
  );
};