import React from 'react';

export const TechSpecs: React.FC = () => {
  const features = [
    {
      title: "MOTEUR HIGH-TORQUE",
      subtitle: "Pression Constante",
      desc: "Fini le pompage manuel. Notre moteur électrique maintient une pression maximale du premier au dernier tir. Cadence impitoyable.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
      )
    },
    {
      title: "LITHIUM CORE",
      subtitle: "Rechargeable USB",
      desc: "Une autonomie conçue pour durer toute la nuit. Recharge rapide via câble inclus. Pas de piles jetables, juste de la puissance pure.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line></svg>
      )
    },
    {
      title: "JOINT ÉTANCHE IPX4",
      subtitle: "Compartiment Isolé",
      desc: "L'électronique est protégée par un joint silicone de qualité industrielle. Conçu pour résister aux éclaboussures intenses.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.74 5.74a8 8 0 1 1-11.48 0l5.74-5.74z"/><path d="M12 2.69l-5.74 5.74"/><path d="M12 22a7.9 7.9 0 0 0 8-7.9"/></svg>
      )
    }
  ];

  return (
    <section className="py-12 bg-zinc-50 dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-200 to-transparent dark:from-[#111] pointer-events-none opacity-50 transition-colors duration-500"></div>
      <div className="absolute -left-20 top-20 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-[2px] w-12 bg-black dark:bg-white"></div>
                <span className="text-black dark:text-white font-bold tracking-widest uppercase text-sm">Ingénierie</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter font-display leading-[0.9] text-black dark:text-white">
                Zéro Pompage.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-400 dark:from-white dark:to-gray-500">100% Électrique.</span>
            </h2>
            <p className="mt-8 text-lg text-textMuted dark:text-gray-400 max-w-2xl leading-relaxed">
                Oubliez les pistolets à eau manuels de votre enfance. NovElec™ introduit une mécanique motorisée fluide, alimentée par batterie, pour une domination tactique sans interruption.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
                <div key={idx} className="group relative p-8 border border-black/5 dark:border-white/10 hover:border-black/50 dark:hover:border-white/50 bg-white dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all duration-500 rounded-xl overflow-hidden shadow-lg shadow-transparent hover:shadow-black/5 dark:hover:shadow-white/5">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    <div className="relative z-10 mb-6 text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                        {feature.icon}
                    </div>
                    
                    <h3 className="relative z-10 text-xl font-black italic uppercase font-display mb-1 text-black dark:text-white">{feature.title}</h3>
                    <div className="relative z-10 text-xs font-bold text-black dark:text-white uppercase tracking-wider mb-4">{feature.subtitle}</div>
                    
                    <p className="relative z-10 text-sm text-textMuted dark:text-gray-400 font-medium leading-relaxed group-hover:text-black dark:group-hover:text-gray-300 transition-colors">
                        {feature.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};