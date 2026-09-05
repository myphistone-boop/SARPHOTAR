import React from 'react';

const hexToRgb = (hex: string) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 0, g: 0, b: 0 };
};
const mix = (a: string, b: string, f: number) => {
  const c1 = hexToRgb(a), c2 = hexToRgb(b);
  const k = Math.max(0, Math.min(1, f));
  return { r: Math.round(c1.r + (c2.r - c1.r) * k), g: Math.round(c1.g + (c2.g - c1.g) * k), b: Math.round(c1.b + (c2.b - c1.b) * k) };
};

export const STAT_META = {
  range: { label: 'PORTÉE', start: '#FFFFFF', end: '#7C828A' },
  rate: { label: 'CADENCE', start: '#FF6A2C', end: '#FF3B30' },
  capacity: { label: 'CAPACITÉ', start: '#38E1F0', end: '#2C90FF' },
};

interface StatBarProps {
  label: string;
  value: number;
  start: string;
  end: string;
  segments?: number;
  size?: 'sm' | 'md';
  animateEntry?: boolean;
  showValue?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, start, end, segments = 22, size = 'sm', animateEntry = false, showValue = true }) => {
  const filled = Math.round((value / 100) * segments);
  const h = size === 'md' ? 'h-[7px]' : 'h-[6px]';
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-hud text-[9px] font-medium uppercase tracking-[0.2em] text-muted">{label}</span>
        {showValue && <span className="font-hud text-[9px] text-ghost/80">{value}<span className="text-muted">/100</span></span>}
      </div>
      <div className={`flex gap-[2px] ${h}`}>
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filled;
          const f = filled > 1 ? i / (filled - 1) : 0;
          const c = isFilled ? mix(start, end, f) : null;
          const stagger = i * 18;
          const anim = isFilled
            ? animateEntry
              ? `barEntry 420ms cubic-bezier(0.16,1,0.3,1) ${stagger}ms backwards, segPulse 2.2s ease-in-out infinite ${stagger + 420}ms`
              : 'segPulse 2.2s ease-in-out infinite'
            : animateEntry ? `barEntry 420ms cubic-bezier(0.16,1,0.3,1) ${stagger}ms backwards` : undefined;
          const style = isFilled
            ? ({ ['--r' as string]: c!.r, ['--g' as string]: c!.g, ['--b' as string]: c!.b, backgroundColor: `rgb(${c!.r},${c!.g},${c!.b})`, animation: anim, animationDelay: animateEntry ? undefined : `${i * 30}ms` } as React.CSSProperties)
            : ({ animation: anim } as React.CSSProperties);
          return <div key={i} className={`flex-1 skew-x-[-20deg] rounded-[1px] ${isFilled ? '' : 'bg-white/8'}`} style={style} />;
        })}
      </div>
    </div>
  );
};

export const StatTriplet: React.FC<{ specs: { range: number; rate: number; capacity: number }; segments?: number; size?: 'sm' | 'md'; animateEntry?: boolean; showValue?: boolean }> = ({ specs, segments, size, animateEntry, showValue = true }) => (
  <div className="space-y-2.5">
    <StatBar label={STAT_META.range.label} value={specs.range} start={STAT_META.range.start} end={STAT_META.range.end} segments={segments} size={size} animateEntry={animateEntry} showValue={showValue} />
    <StatBar label={STAT_META.rate.label} value={specs.rate} start={STAT_META.rate.start} end={STAT_META.rate.end} segments={segments} size={size} animateEntry={animateEntry} showValue={showValue} />
    <StatBar label={STAT_META.capacity.label} value={specs.capacity} start={STAT_META.capacity.start} end={STAT_META.capacity.end} segments={segments} size={size} animateEntry={animateEntry} showValue={showValue} />
  </div>
);
