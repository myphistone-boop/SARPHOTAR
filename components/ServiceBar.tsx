import React, { useState, useEffect } from 'react';

export const ServiceBar: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border-y border-black/5 dark:border-white/5 py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/5">
        
        {/* Item 1 */}
        <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            <div className="mb-4 text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-1">Livraison Offerte</h4>
            <p className="text-xs text-textMuted dark:text-darkTextMuted font-medium">Dans toute la France Métropolitaine</p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            <div className="mb-4 text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-1">Expédition Rapide</h4>
            <p className="text-xs text-textMuted dark:text-darkTextMuted font-medium">Commande traitée sous 24h (jours ouvrés)</p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            <div className="mb-4 text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-1">Paiement Sécurisé</h4>
            <p className="text-xs text-textMuted dark:text-darkTextMuted font-medium">Apple Pay • Google Pay • CB</p>
        </div>

      </div>
    </div>
  );
};