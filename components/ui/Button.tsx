import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', fullWidth = false, className = '', onClick, ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = performance.now();
    setRipples((p) => [...p, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600);
    onClick?.(e);
  };

  const base = 'relative overflow-hidden font-hud font-semibold uppercase tracking-[0.14em] rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2 py-4 px-7 text-sm border';
  const variants = {
    primary: 'bg-ghost text-carbon border-ghost hover:shadow-[0_0_22px_rgba(255,255,255,0.28)]',
    accent: 'bg-accent text-carbon border-accent hover:shadow-glow',
    outline: 'bg-white/[0.02] text-ghost border-white/15 hover:border-accent hover:text-accent',
    ghost: 'bg-transparent text-muted border-transparent hover:text-ghost',
  };

  return (
    <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} onClick={createRipple} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {ripples.map((r) => (
        <span key={r.id} className="absolute bg-white/25 rounded-full pointer-events-none animate-ping"
          style={{ left: r.x, top: r.y, transform: 'translate(-50%,-50%)', width: '200%', paddingBottom: '200%' }} />
      ))}
    </button>
  );
};
