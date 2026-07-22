import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = performance.now();
    setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick?.(e);
  };

  const base =
    'relative overflow-hidden font-hud font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed border';

  const variants = {
    // bright confident CTA
    primary:
      'bg-white text-ink border-white hover:shadow-[0_0_22px_rgba(255,255,255,0.35)]',
    // tactical cyan
    accent:
      'bg-hud text-ink border-hud hover:shadow-[0_0_24px_rgba(56,225,240,0.55)]',
    secondary:
      'bg-panel2 text-white border-white/10 hover:border-white/40 hover:bg-steel',
    outline:
      'bg-white/[0.02] border-white/20 text-white hover:border-hud hover:text-hud hover:shadow-[0_0_18px_rgba(56,225,240,0.25)]',
    ghost:
      'bg-transparent text-muted hover:text-white border-transparent',
  };

  const sizeClass = 'py-4 px-8 rounded-md text-sm';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${variants[variant]} ${widthClass} ${sizeClass} ${className}`}
      onClick={createRipple}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute bg-white/25 rounded-full pointer-events-none animate-ping"
          style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)', width: '200%', paddingBottom: '200%' }}
        />
      ))}
    </button>
  );
};
