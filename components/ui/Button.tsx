import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    if (onClick) onClick(e);
  };

  const baseStyles = "relative overflow-hidden font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2";
  
  // Requirement: Monochrome buttons (Black/White), perimeter turns active color on hover
  const variants = {
    primary: "bg-black text-white border-transparent hover:border-black hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:hover:border-white dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]",
    secondary: "bg-surface text-black border-transparent hover:border-black hover:bg-white dark:bg-surface2 dark:text-white dark:hover:bg-darkSurface dark:hover:border-white",
    outline: "bg-transparent border-black/20 text-black hover:border-black dark:border-white/20 dark:text-white dark:hover:border-white",
    ghost: "bg-transparent text-textMuted hover:text-black dark:hover:text-white border-transparent"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const sizeClass = "py-4 px-8 rounded-lg text-sm"; // More squared/box-like for Nike feel

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${sizeClass} ${className}`}
      onClick={createRipple}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-black/10 dark:bg-white/30 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            paddingBottom: '200%',
          }}
        />
      ))}
    </button>
  );
};