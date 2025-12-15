import React, { useEffect, useState } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: 'privacy' | 'terms' | 'policies';
}

type TabType = 'cgv' | 'data' | 'refund' | 'shipping';

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, section }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('cgv');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Default to shipping if policies is requested, or logic mapping
      setActiveTab('cgv'); 
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

  const renderContent = () => {
    switch (activeTab) {
        case 'cgv':
            return (
                <div className="space-y-4 animate-float-up">
                    <h3 className="text-lg font-bold text-black dark:text-white uppercase mb-4">Conditions Générales de Vente</h3>
                    <p><strong>1. Objet</strong><br/>Les présentes conditions régissent les ventes par la société Sarphotar™ de pistolets à eau électriques.</p>
                    <p><strong>2. Prix</strong><br/>Les prix de nos produits sont indiqués en euros toutes taxes comprises (TVA et autres taxes applicables au jour de la commande), sauf indication contraire.</p>
                    <p><strong>3. Commandes</strong><br/>Vous pouvez passer commande sur notre site internet. Sarphotar™ se réserve le droit d'annuler ou de refuser toute commande d'un client avec lequel il existerait un litige.</p>
                    <p><strong>4. Paiement</strong><br/>Le fait de valider votre commande implique pour vous l'obligation de payer le prix indiqué. Le règlement de vos achats s'effectue par carte bancaire grâce au système sécurisé.</p>
                </div>
            );
        case 'data':
            return (
                <div className="space-y-4 animate-float-up">
                    <h3 className="text-lg font-bold text-black dark:text-white uppercase mb-4">Politique de Confidentialité</h3>
                     <p><strong>1. Collecte des données</strong><br/>Les informations recueillies sur le site sont nécessaires pour la gestion de votre commande (Nom, Adresse, Email). Elles font l’objet d’un traitement informatique et sont destinées au secrétariat de l’association.</p>
                     <p><strong>2. Cookies</strong><br/>Notre site utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur ce site, vous acceptez l'utilisation des cookies.</p>
                     <p><strong>3. Droit d'accès</strong><br/>Conformément à la loi « informatique et libertés » et au RGPD, vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent.</p>
                </div>
            );
        case 'refund':
             return (
                <div className="space-y-4 animate-float-up">
                    <h3 className="text-lg font-bold text-black dark:text-white uppercase mb-4">Politique de Remboursement</h3>
                    <p><strong>1. Délai de rétractation</strong><br/>Conformément aux dispositions légales, vous disposez d'un délai de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalité.</p>
                    <p><strong>2. Conditions de retour</strong><br/>Les retours sont à effectuer dans leur état d'origine et complets (emballage, accessoires, notice). Dans ce cadre, votre responsabilité est engagée. Tout dommage subi par le produit à cette occasion peut être de nature à faire échec au droit de rétractation.</p>
                    <p><strong>3. Frais de retour</strong><br/>Les frais de retour sont à la charge du client.</p>
                </div>
            );
        case 'shipping':
            return (
                <div className="space-y-4 animate-float-up">
                    <h3 className="text-lg font-bold text-black dark:text-white uppercase mb-4">Politique de Livraison</h3>
                    <p><strong>1. Zones de livraison</strong><br/>Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande, dans le délai indiqué sur la page de validation de la commande.</p>
                    <p><strong>2. Délais d'expédition</strong><br/>Les commandes sont généralement traitées sous 24 à 48h ouvrées. Les délais de livraison du transporteur (Colissimo, Chronopost) sont donnés à titre indicatif.</p>
                    <p><strong>3. Retard de livraison</strong><br/>En cas de retard d'expédition, un mail vous sera adressé pour vous informer d'une éventuelle conséquence sur le délai de livraison qui vous a été indiqué.</p>
                </div>
            );
    }
  };

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Content Container */}
      <div className={`relative bg-white dark:bg-[#111] w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-transform duration-300 ${animateIn ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 bg-surface dark:bg-[#0A0A0A] border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 flex flex-col">
            <div className="p-6 pb-2">
                <h2 className="text-xl font-black italic uppercase font-display text-black dark:text-white">Politiques</h2>
            </div>
            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible p-4 gap-2">
                <button 
                    onClick={() => setActiveTab('cgv')}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeTab === 'cgv' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    Commerciales
                </button>
                <button 
                    onClick={() => setActiveTab('data')}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeTab === 'data' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    Données
                </button>
                <button 
                    onClick={() => setActiveTab('refund')}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeTab === 'refund' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    Remboursement
                </button>
                <button 
                    onClick={() => setActiveTab('shipping')}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeTab === 'shipping' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    Livraison
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white dark:bg-[#111]">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-black dark:text-white"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 text-sm leading-loose text-textMuted dark:text-gray-400">
                {renderContent()}
            </div>
            
            <div className="p-4 border-t border-black/5 dark:border-white/5 text-center text-[10px] text-gray-500">
                Document à valeur informative. Dernière mise à jour : 01/12/2024
            </div>
        </div>

      </div>
    </div>
  );
};