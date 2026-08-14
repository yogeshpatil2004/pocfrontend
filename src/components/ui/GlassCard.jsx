import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white/60 backdrop-blur-xl border border-slate-200 rounded-lg p-6
        ${hoverEffect ? 'hover:border-primary-600/50 hover:shadow-[0_0_30px_rgba(255,106,33,0.18)] transition-all duration-300 hover:-translate-y-1' : ''}
        ${glow ? 'border-primary-300 shadow-[0_0_25px_rgba(255,106,33,0.15)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
