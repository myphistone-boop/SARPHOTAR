import React from 'react';

interface FooterProps {
  onOpenLegal: (section: 'privacy' | 'terms' | 'policies') => void;
  onOpenContact: () => void;
  onScrollToCollection: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenContact, onScrollToCollection }) => {
  return (
    <footer className="bg-panel border-t border-white/10 text-white pt-14 pb-28 md:pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="grid place-items-center w-8 h-8 rounded-md bg-white text-ink font-display font-black italic text-lg leading-none">S</span>
            <h1 className="text-3xl font-black italic font-display">SARPHOTAR™</h1>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-4 font-medium tracking-wide">Réalisme et qualité. L'arsenal électrique de la bataille d'eau.</p>
          <span className="inline-flex items-center gap-2 font-hud text-[10px] tracking-[0.25em] text-hud/80">
            <span className="w-1.5 h-1.5 rounded-full bg-hud animate-pulse" /> SYSTEM ONLINE
          </span>
        </div>

        <div>
          <h4 className="font-hud text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-white">Produits</h4>
          <ul className="space-y-3 text-sm text-muted font-medium">
            <li><button onClick={onScrollToCollection} className="hover:text-hud transition-colors">Arsenal complet</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-hud text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-white">Aide</h4>
          <ul className="space-y-3 text-sm text-muted font-medium">
            <li><button onClick={onOpenContact} className="hover:text-hud transition-colors">Nous contacter</button></li>
            <li><button onClick={() => onOpenLegal('policies')} className="hover:text-hud transition-colors">Politiques</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 font-hud text-[10px] text-muted uppercase tracking-[0.15em]">
        <p>© 2026 Sarphotar™ Inc.</p>
        <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors">Mentions Légales</button>
      </div>
    </footer>
  );
};
