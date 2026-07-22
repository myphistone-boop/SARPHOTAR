import React from 'react';

export const ServiceBar: React.FC = () => {
  const items = [
    {
      title: 'Livraison Offerte',
      desc: 'Dans toute la France Métropolitaine',
      icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
    },
    {
      title: 'Expédition Rapide',
      desc: 'Commande traitée sous 24h (jours ouvrés)',
      icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    },
    {
      title: 'Paiement Sécurisé',
      desc: 'Apple Pay • Google Pay • CB · Stripe',
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    },
  ];

  return (
    <div className="w-full bg-panel border-y border-white/10 py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
        {items.map((it, i) => (
          <div key={i} className="flex flex-col items-center text-center px-4 pt-6 md:pt-0 first:pt-0">
            <div className="mb-3 text-hud">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg>
            </div>
            <h4 className="font-hud text-sm font-semibold uppercase tracking-[0.15em] text-white mb-1">{it.title}</h4>
            <p className="text-xs text-muted font-medium">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
