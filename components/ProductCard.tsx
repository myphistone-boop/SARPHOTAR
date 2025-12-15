import React from 'react';

interface ProductCard {
  id: string;
  name: string;
  tagline: string;
  imageSrc: string;
  specs: {
    range: number;
    rate: number;
    capacity: number;
  };
}

const PRODUCTS: ProductCard[] = [
  {
    id: '01',
    name: 'NovElec™',
    tagline: 'Electric Series',
    imageSrc: 'https://storage.googleapis.com/novelec_assets/Pistolet',
    specs: { range: 70, rate: 65, capacity: 70 },
  },
  {
    id: '02',
    name: 'PulseX™',
    tagline: 'Power Flow',
    imageSrc: 'https://storage.googleapis.com/novelec_assets/Fusil%20NovElec',
    specs: { range: 80, rate: 75, capacity: 85 },
  },
  {
    id: '03',
    name: 'AquaCore™',
    tagline: 'Impact Line',
    imageSrc: 'https://storage.googleapis.com/novelec_assets/Gatling',
    specs: { range: 90, rate: 95, capacity: 90 },
  },
];

/* ---------- HELPERS (IDENTIQUES À TA PAGE PRODUIT) ---------- */

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const interpolateColorObj = (color1: string, color2: string, factor: number) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const f = Math.max(0, Math.min(1, factor));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * f),
    g: Math.round(c1.g + (c2.g - c1.g) * f),
    b: Math.round(c1.b + (c2.b - c1.b) * f),
  };
};

const renderSegmentedBar = (
  label: string,
  value: number,
  type: 'range' | 'rate' | 'capacity'
) => {
  const segments = 24;
  const filledSegments = Math.floor((value / 100) * segments);

  const gradientConfig = {
    range: { start: '#FFAA00', end: '#FF5500' },
    rate: { start: '#FF5500', end: '#D40000' },
    capacity: { start: '#00E5FF', end: '#2979FF' },
  }[type];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">
          {label}
        </span>
      </div>

      <div className="flex gap-[2px] h-[6px]">
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filledSegments;
          const factor = filledSegments > 1 ? i / (filledSegments - 1) : 0;
          const color = isFilled
            ? interpolateColorObj(
                gradientConfig.start,
                gradientConfig.end,
                factor
              )
            : null;

          const style = isFilled
            ? ({
                '--r': color!.r,
                '--g': color!.g,
                '--b': color!.b,
                backgroundColor: `rgb(${color!.r}, ${color!.g}, ${color!.b})`,
                animation: 'strongPulse 1s ease-in-out infinite',
                animationDelay: `${i * 20}ms`,
              } as React.CSSProperties)
            : undefined;

          return (
            <div
              key={i}
              className={`flex-1 skew-x-[-20deg] rounded-[1px] ${
                !isFilled ? 'bg-white/10' : ''
              }`}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ------------------ COMPONENT ------------------ */

export const CollectionGrid: React.FC = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {PRODUCTS.map((product, index) => (
          <div key={product.id} className="group flex flex-col gap-4">

            {/* IMAGE */}
            <div className="relative flex justify-center p-8">
              <div className="p-[4px] rounded-[32px] bg-gradient-to-br from-[#FFD27D] via-[#E6B65C] to-[#B8892E]">
                <img
                  src={product.imageSrc}
                  alt={product.name}
                  className="block max-w-full rounded-[32px] transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
            </div>

            {/* STATS BARS (JUSTE SOUS L’IMAGE) */}
            <div className="px-4 space-y-2">
              {renderSegmentedBar('PORTÉE', product.specs.range, 'range')}
              {renderSegmentedBar('CADENCE', product.specs.rate, 'rate')}
              {renderSegmentedBar('CAPACITÉ', product.specs.capacity, 'capacity')}
            </div>

            {/* TEXT */}
            <div className="text-center">
              <h3 className="text-2xl font-black italic uppercase text-white">
                {product.name}
              </h3>
              <span className="text-xs font-bold tracking-widest text-orange uppercase">
                {product.tagline}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes strongPulse {
          0%, 100% {
            transform: scaleY(1);
            filter: brightness(1);
            box-shadow: 0 0 5px rgba(var(--r), var(--g), var(--b), 0.4);
          }
          5% {
            transform: scaleY(1.3);
            filter: brightness(1.3) saturate(1.2);
            box-shadow:
              0 0 20px rgba(var(--r), var(--g), var(--b), 0.8),
              0 0 40px rgba(var(--r), var(--g), var(--b), 0.4);
          }
          15% {
            transform: scaleY(1);
            filter: brightness(1);
            box-shadow: 0 0 5px rgba(var(--r), var(--g), var(--b), 0.4);
          }
        }
      `}</style>
    </div>
  );
};
