import React, { useEffect, useState } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: 'privacy' | 'terms' | 'policies';
}

type TabType = 'cgv' | 'data' | 'refund' | 'shipping';

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('cgv');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab('cgv');
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => { document.body.style.overflow = ''; }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !animateIn) return null;

  const content: Record<TabType, { title: string; body: React.ReactNode }> = {
    cgv: {
      title: 'Conditions Générales de Vente',
      body: (<>
        <p><strong className="text-white">1. Objet</strong><br />Les présentes conditions régissent les ventes par la société Sarphotar™ de pistolets à eau électriques.</p>
        <p><strong className="text-white">2. Prix</strong><br />Les prix de nos produits sont indiqués en euros toutes taxes comprises, sauf indication contraire.</p>
        <p><strong className="text-white">3. Commandes</strong><br />Vous pouvez passer commande sur notre site internet. Sarphotar™ se réserve le droit d'annuler toute commande d'un client avec lequel existerait un litige.</p>
        <p><strong className="text-white">4. Paiement</strong><br />Le règlement s'effectue par carte bancaire via le système sécurisé Stripe.</p>
      </>),
    },
    data: {
      title: 'Politique de Confidentialité',
      body: (<>
        <p><strong className="text-white">1. Collecte des données</strong><br />Les informations recueillies sont nécessaires à la gestion de votre commande (Nom, Adresse, Email).</p>
        <p><strong className="text-white">2. Cookies</strong><br />Notre site utilise des cookies pour améliorer l'expérience utilisateur.</p>
        <p><strong className="text-white">3. Droit d'accès</strong><br />Conformément au RGPD, vous bénéficiez d'un droit d'accès et de rectification à vos données.</p>
      </>),
    },
    refund: {
      title: 'Politique de Remboursement',
      body: (<>
        <p><strong className="text-white">1. Délai de rétractation</strong><br />Vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation.</p>
        <p><strong className="text-white">2. Conditions de retour</strong><br />Les retours sont à effectuer dans leur état d'origine et complets (emballage, accessoires, notice).</p>
        <p><strong className="text-white">3. Frais de retour</strong><br />Les frais de retour sont à la charge du client.</p>
      </>),
    },
    shipping: {
      title: 'Politique de Livraison',
      body: (<>
        <p><strong className="text-white">1. Zones de livraison</strong><br />Les produits sont livrés à l'adresse indiquée lors de la commande.</p>
        <p><strong className="text-white">2. Délais d'expédition</strong><br />Les commandes sont traitées sous 24 à 48h ouvrées (Colissimo, Chronopost).</p>
        <p><strong className="text-white">3. Retard de livraison</strong><br />En cas de retard, un email vous sera adressé pour vous informer.</p>
      </>),
    },
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'cgv', label: 'Commerciales' },
    { id: 'data', label: 'Données' },
    { id: 'refund', label: 'Remboursement' },
    { id: 'shipping', label: 'Livraison' },
  ];

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-panel border border-white/10 w-full max-w-4xl h-[80vh] rounded-2xl shadow-panel overflow-hidden flex flex-col md:flex-row transition-transform duration-300 ${animateIn ? 'scale-100 translate-y-0' : 'scale-95 translate-y-6'}`}>
        <div className="w-full md:w-64 bg-ink border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
          <div className="p-5 pb-2"><h2 className="text-xl font-black italic uppercase font-display text-white">Politiques</h2></div>
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible p-3 gap-2 no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`text-left px-4 py-3 rounded-lg font-hud text-xs uppercase tracking-wide transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-ink' : 'text-muted hover:bg-white/5 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-panel">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="flex-1 overflow-y-auto p-7 md:p-10 text-sm leading-loose text-muted no-scrollbar">
            <div className="space-y-4 animate-float-up">
              <h3 className="text-lg font-black uppercase text-white mb-4 font-display italic">{content[activeTab].title}</h3>
              {content[activeTab].body}
            </div>
          </div>
          <div className="p-4 border-t border-white/10 text-center font-hud text-[10px] text-muted tracking-wider">
            Document à valeur informative · Dernière mise à jour : 01/2026
          </div>
        </div>
      </div>
    </div>
  );
};
