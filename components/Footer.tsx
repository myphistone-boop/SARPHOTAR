
import React from 'react';

interface FooterProps {
  onOpenLegal: (section: 'privacy' | 'terms' | 'policies') => void;
  onOpenContact: () => void;
  onScrollToCollection: () => void;
  onSecretAction?: () => void; // New prop for admin trigger
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenContact, onScrollToCollection, onSecretAction }) => {
  return (
    <footer className="bg-[#111] text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        <div className="col-span-1">
           <h1 className="text-4xl font-black italic font-display mb-6">SARPHOTAR<span className="text-white">™</span></h1>
           <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium tracking-wide">
             Réalisme et qualité.
           </p>
        </div>

        <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 font-display text-white">Produits</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
                <li>
                    <button onClick={onScrollToCollection} className="hover:text-white transition-colors duration-300">
                        Collection
                    </button>
                </li>
            </ul>
        </div>

        <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 font-display text-white">Aide</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
                <li>
                    <button onClick={onOpenContact} className="hover:text-white transition-colors duration-300">
                        Nous contacter
                    </button>
                </li>
                <li>
                    <button onClick={() => onOpenLegal('policies')} className="hover:text-white transition-colors duration-300">
                        Politiques
                    </button>
                </li>
            </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
        <p className="cursor-default" onDoubleClick={onSecretAction}>© 2024 Sarphotar™ Inc.</p>
        <div className="flex gap-6">
            <button onClick={() => onOpenLegal('terms')} className="hover:text-gray-400 transition-colors">Mentions Légales</button>
        </div>
      </div>
    </footer>
  );
};
