import React from 'react';

interface HelpScreenProps {
  onContact: () => void;
  onOpenLegal: () => void;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({ onContact, onOpenLegal }) => {
  const Row = ({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick?: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 bg-surface border border-white/8 rounded-xl p-4 text-left hover:border-accent/40 transition-colors edge-top active:scale-[0.99]">
      <span className="grid place-items-center w-11 h-11 rounded-lg bg-white/5 border border-white/10 text-accent shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black italic uppercase font-display text-ghost">{title}</div>
        <div className="text-[13px] text-muted mt-0.5">{desc}</div>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-muted"><polyline points="9 18 15 12 9 6" /></svg>
    </button>
  );

  return (
    <div className="screen-in pb-tabbar min-h-screen">
      <div className="app-chrome sticky top-0 z-30 pt-safe bg-carbon/85 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center">
          <h1 className="text-2xl font-black italic uppercase font-display text-ghost leading-none">Aide & Support</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-4 space-y-3">
        <div className="bg-surface border border-white/10 rounded-xl2 p-5 edge-top">
          <div className="font-hud text-[10px] tracking-[0.3em] text-accent mb-1">CENTRE DE COMMANDEMENT</div>
          <p className="text-ghost/80 text-sm leading-relaxed">Une question sur une commande, un produit ou une livraison ? Notre équipe répond sous 24h.</p>
        </div>

        <Row onClick={onContact} title="Nous contacter" desc="Formulaire · réponse sous 24h" icon={<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />} />
        <Row title="Suivi de commande" desc="Un e-mail Stripe contient votre facture et suivi" icon={<><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>} />
        <Row onClick={onOpenLegal} title="Politiques & mentions" desc="CGV · Données · Remboursement · Livraison" icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>} />

        <div className="bg-surface border border-white/8 rounded-xl2 p-5 text-center edge-top mt-2">
          <p className="font-hud text-[10px] tracking-[0.2em] text-muted mb-1">SUPPORT DIRECT</p>
          <a href="mailto:sarphotar.pro@gmail.com" className="text-ghost font-semibold">sarphotar.pro@gmail.com</a>
        </div>
      </div>
    </div>
  );
};
