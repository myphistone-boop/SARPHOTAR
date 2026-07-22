import React from 'react';

export type Tab = 'home' | 'arsenal' | 'cart' | 'help';

interface TabBarProps {
  active: Tab;
  cartCount: number;
  onChange: (t: Tab) => void;
}

const ICONS: Record<Tab, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  arsenal: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  cart: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  help: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></>,
};
const LABELS: Record<Tab, string> = { home: 'ACCUEIL', arsenal: 'ARSENAL', cart: 'PANIER', help: 'AIDE' };
const ORDER: Tab[] = ['home', 'arsenal', 'cart', 'help'];

export const TabBar: React.FC<TabBarProps> = ({ active, cartCount, onChange }) => (
  <nav className="app-chrome fixed bottom-0 left-0 right-0 z-40 pb-safe bg-carbon2/90 backdrop-blur-xl border-t border-white/10">
    <div className="max-w-2xl mx-auto flex items-stretch px-2 h-16">
      {ORDER.map((t) => {
        const on = active === t;
        return (
          <button key={t} onClick={() => onChange(t)} className="relative flex-1 flex flex-col items-center justify-center gap-1 group">
            {on && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-accent shadow-glow" />}
            <div className={`relative transition-colors ${on ? 'text-accent' : 'text-muted group-active:text-ghost'}`}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[t]}</svg>
              {t === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 grid place-items-center rounded-full bg-accent text-[9px] font-bold text-carbon">{cartCount}</span>
              )}
            </div>
            <span className={`font-hud text-[9px] tracking-[0.14em] transition-colors ${on ? 'text-ghost' : 'text-muted/70'}`}>{LABELS[t]}</span>
          </button>
        );
      })}
    </div>
  </nav>
);
