import React from 'react';
import { Button } from '../components/ui/Button';

interface SuccessScreenProps {
  orderNumber?: string | null;
  onClose: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderNumber, onClose }) => (
  <div className="fixed inset-0 z-[90] bg-carbon carbon-soft overflow-y-auto no-scrollbar animate-fade">
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md bg-surface border border-white/10 rounded-xl3 p-8 text-center shadow-card brackets edge-top screen-in">
        <div className="absolute top-0 inset-x-0 h-1 bg-good rounded-t-xl3" />
        <div className="w-20 h-20 rounded-full bg-good/10 ring-4 ring-good/20 grid place-items-center mx-auto mb-6 text-good">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h1 className="text-3xl font-black italic uppercase font-display text-ghost mb-2">Commande Reçue</h1>
        {orderNumber && <p className="font-hud text-[11px] tracking-[0.2em] text-accent mb-4">RÉF · {orderNumber}</p>}
        <div className="w-12 h-1 bg-white/10 mx-auto mb-6 rounded-full" />
        <p className="text-ghost/80 font-medium mb-6 leading-relaxed">Votre commande a bien été prise en compte et sera traitée dans les plus brefs délais.</p>
        <div className="bg-surface2 border border-white/10 rounded-xl p-4 mb-8 text-left space-y-2">
          <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-good mb-1">Délai estimé : 12 jours</p>
          <p className="text-sm text-ghost/80">Un e-mail de confirmation Stripe vous est envoyé.</p>
          <p className="text-sm text-ghost/80">Un e-mail de suivi sera envoyé dès la préparation du colis.</p>
          <p className="text-sm text-ghost/80">Support (avec votre n° de facture Stripe) : <span className="text-ghost font-semibold">sarphotar.pro@gmail.com</span></p>
        </div>
        <Button variant="primary" fullWidth onClick={onClose}>Retour à l'accueil</Button>
      </div>
    </div>
  </div>
);
