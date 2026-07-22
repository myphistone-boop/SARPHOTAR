import React, { useEffect, useState } from 'react';

interface LegalSheetProps { isOpen: boolean; onClose: () => void; }
type TabType = 'cgv' | 'data' | 'refund' | 'shipping';

const CONTENT: Record<TabType, { title: string; body: React.ReactNode }> = {
  cgv: { title: 'Conditions Générales de Vente', body: (<>
    <p><strong className="text-ghost">1. Objet</strong><br />Les présentes conditions régissent les ventes par Sarphotar™ de pistolets à eau électriques.</p>
    <p><strong className="text-ghost">2. Prix</strong><br />Les prix sont indiqués en euros toutes taxes comprises, sauf indication contraire.</p>
    <p><strong className="text-ghost">3. Commandes</strong><br />Sarphotar™ se réserve le droit d'annuler toute commande d'un client avec lequel existerait un litige.</p>
    <p><strong className="text-ghost">4. Paiement</strong><br />Le règlement s'effectue par carte bancaire via le système sécurisé Stripe.</p></>) },
  data: { title: 'Politique de Confidentialité', body: (<>
    <p><strong className="text-ghost">1. Collecte</strong><br />Les informations recueillies sont nécessaires à la gestion de votre commande (Nom, Adresse, Email).</p>
    <p><strong className="text-ghost">2. Cookies</strong><br />Notre site utilise des cookies pour améliorer l'expérience utilisateur.</p>
    <p><strong className="text-ghost">3. Droit d'accès</strong><br />Conformément au RGPD, vous bénéficiez d'un droit d'accès et de rectification.</p></>) },
  refund: { title: 'Politique de Remboursement', body: (<>
    <p><strong className="text-ghost">1. Rétractation</strong><br />Vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation.</p>
    <p><strong className="text-ghost">2. Retour</strong><br />Les retours sont à effectuer dans leur état d'origine et complets.</p>
    <p><strong className="text-ghost">3. Frais</strong><br />Les frais de retour sont à la charge du client.</p></>) },
  shipping: { title: 'Politique de Livraison', body: (<>
    <p><strong className="text-ghost">1. Zones</strong><br />Les produits sont livrés à l'adresse indiquée lors de la commande.</p>
    <p><strong className="text-ghost">2. Délais</strong><br />Commandes traitées sous 24 à 48h ouvrées (Colissimo, Chronopost).</p>
    <p><strong className="text-ghost">3. Retard</strong><br />En cas de retard, un e-mail vous sera adressé.</p></>) },
};
const TABS: { id: TabType; label: string }[] = [
  { id: 'cgv', label: 'CGV' }, { id: 'data', label: 'Données' }, { id: 'refund', label: 'Remb.' }, { id: 'shipping', label: 'Livraison' },
];

export const LegalSheet: React.FC<LegalSheetProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<TabType>('cgv');

  useEffect(() => {
    if (isOpen) { setMounted(true); setTab('cgv'); document.body.style.overflow = 'hidden'; }
    else { const t = setTimeout(() => setMounted(false), 300); document.body.style.overflow = ''; return () => clearTimeout(t); }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl bg-surface border-t border-white/10 rounded-t-xl3 h-[85vh] flex flex-col pb-safe ${isOpen ? 'sheet-in' : ''}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h2 className="text-xl font-black italic uppercase font-display text-ghost">Politiques</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-ghost"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="flex gap-2 px-5 py-3 overflow-x-auto no-scrollbar border-b border-white/8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 font-hud text-[11px] uppercase tracking-wide px-4 py-2 rounded-full transition-colors ${tab === t.id ? 'bg-ghost text-carbon' : 'text-muted hover:text-ghost bg-white/[0.03]'}`}>{t.label}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 text-sm leading-loose text-muted">
          <div className="space-y-4 screen-in">
            <h3 className="text-lg font-black uppercase text-ghost mb-3 font-display italic">{CONTENT[tab].title}</h3>
            {CONTENT[tab].body}
          </div>
        </div>
        <div className="p-3 border-t border-white/8 text-center font-hud text-[10px] text-muted tracking-wider">Document à valeur informative · Mise à jour 01/2026</div>
      </div>
    </div>
  );
};
