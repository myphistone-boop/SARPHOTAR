
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] p-4 pb- safe-area-bottom bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 shadow-[0_-5px_30px_rgba(0,0,0,0.2)] animate-float-up">
      <div className="flex items-center gap-4">
        <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-textMuted dark:text-darkTextMuted uppercase font-bold tracking-wider truncate max-w-[100px]">{product.name}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-black dark:text-white font-display">{product.price}€</span>
                {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through decoration-red-500">{product.originalPrice}€</span>
                )}
            </div>
        </div>
        
        <div className="flex-1 grid grid-cols-[1fr_2fr] gap-2">
            <Button 
                variant="outline" 
                onClick={() => onAddToCart(product)}
                className="!text-[10px] !py-3 !px-2 border-black/10 dark:border-white/10"
            >
                Panier
            </Button>
            <Button 
                variant="primary" 
                onClick={() => onBuyNow(product)}
                className="!text-xs !py-3 !px-2 bg-black text-white dark:bg-white dark:text-black shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
                Acheter
            </Button>
        </div>
      </div>
    </div>
  );
};
