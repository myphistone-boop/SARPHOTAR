import React from 'react';

export const TechSpecs: React.FC = () => {
  const features = [
    {
      title: 'MOTEUR HIGH-TORQUE',
      subtitle: 'Pression Constante',
      desc: "Fini le pompage manuel. Notre moteur électrique maintient une pression maximale du premier au dernier tir. Cadence impitoyable.",
      icon: <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />,
    },
    {
      title: 'LITHIUM CORE',
      subtitle: 'Rechargeable USB-C',
      desc: "Une autonomie conçue pour durer toute la nuit. Recharge rapide via câble inclus. Pas de piles jetables, juste de la puissance pure.",
      icon: <><rect x="2" y="7" width="20" height="10" rx="2" /><line x1="22" y1="11" x2="22" y2="13" /><line x1="6" y1="7" x2="6" y2="17" /><line x1="10" y1="7" x2="10" y2="17" /></>,
    },
    {
      title: 'JOINT ÉTANCHE IPX4',
      subtitle: 'Compartiment Isolé',
      desc: "L'électronique est protégée par un joint silicone de qualité industrielle. Conçu pour résister aux éclaboussures intenses.",
      icon: <path d="M12 2.69l5.74 5.74a8 8 0 1 1-11.48 0z" />,
    },
  ];

  return (
    <section className="py-16 bg-ink relative overflow-hidden scanlines">
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute -left-24 top-24 w-72 h-72 bg-hud/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-hud" />
            <span className="font-hud text-hud font-semibold tracking-[0.3em] uppercase text-xs">Ingénierie</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter font-display leading-[0.9] text-white">
            Zéro Pompage.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-hud to-white">100% Électrique.</span>
          </h2>
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            Oubliez les pistolets à eau manuels de votre enfance. Sarphotar™ introduit une mécanique motorisée fluide, alimentée par batterie, pour une domination tactique sans interruption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <div key={idx} className="group relative p-7 border border-white/10 bg-panel hover:border-hud/40 transition-all duration-500 rounded-xl overflow-hidden hud-frame">
              <div className="absolute inset-0 bg-gradient-to-br from-hud/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10 mb-6 text-hud">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
              </div>
              <div className="relative z-10 font-hud text-[10px] uppercase tracking-[0.2em] text-muted mb-1">{String(idx + 1).padStart(2, '0')} · {f.subtitle}</div>
              <h3 className="relative z-10 text-xl font-black italic uppercase font-display mb-3 text-white">{f.title}</h3>
              <p className="relative z-10 text-sm text-muted font-medium leading-relaxed group-hover:text-white/70 transition-colors">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
