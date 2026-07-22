import React, { useEffect, useState } from 'react';

interface BottomNavProps {
  cartCount: number;
  onArsenal: () => void;
  onSpecs: () => void;
  onCart: () => void;
  onContact: () => void;
}

/** App-style bottom tab bar (mobile). Gives the "native app" feel; hidden on desktop. */
export const BottomNav: React.FC<BottomNavProps> = ({ cartCount, onArsenal, onSpecs, onCart, onContact }) => {
  const [active, setActive] = useState('arsenal');

  // reflect scroll position into the active tab
  useEffect(() => {
    const ids = ['shop', 'specs', 'services', 'faq'];
    const onScroll = () => {
      let cur = 'arsenal';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
          cur = id === 'shop' ? 'arsenal' : id === 'specs' ? 'specs' : cur;
        }
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const Tab = ({
    id, label, onClick, badge, children,
  }: { id: string; label: string; onClick: () => void; badge?: number; children: React.ReactNode }) => {
    const isActive = active === id;
    return (
      <button
        onClick={() => { setActive(id); onClick(); }}
        className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 group"
      >
        {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-hud shadow-[0_0_10px_#38E1F0]" />}
        <div className={`relative transition-colors ${isActive ? 'text-hud' : 'text-white/55 group-active:text-white'}`}>
          {children}
          {badge ? (
            <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full bg-ember text-[9px] font-bold text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <span className={`font-hud text-[9px] tracking-[0.15em] transition-colors ${isActive ? 'text-white' : 'text-white/45'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="md:hidden hud-ui fixed bottom-0 left-0 right-0 z-[55] pb-safe bg-panel/85 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-stretch px-2">
        <Tab id="arsenal" label="ARSENAL" onClick={onArsenal}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        </Tab>
        <Tab id="specs" label="TECH" onClick={onSpecs}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10"/><path d="M4 6V4"/><path d="M12 20v-8"/><path d="M12 8V4"/><path d="M20 20v-4"/><path d="M20 12V4"/><circle cx="4" cy="8" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="20" cy="14" r="2"/></svg>
        </Tab>
        <Tab id="cart" label="PANIER" onClick={onCart} badge={cartCount}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </Tab>
        <Tab id="support" label="SUPPORT" onClick={onContact}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </Tab>
      </div>
    </nav>
  );
};
