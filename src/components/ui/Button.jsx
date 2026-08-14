import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-mono font-medium tracking-wide transition-all duration-300 rounded disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-[#131313]";
  
  const variants = {
    primary: "bg-primary-600 text-slate-900 hover:bg-[#ff8243] shadow-[0_0_20px_rgba(255,106,33,0.3)] hover:shadow-[0_0_30px_rgba(255,106,33,0.5)] border border-primary-600",
    secondary: "bg-transparent text-slate-900 border border-[#a98a7e]/40 hover:border-primary-600 hover:bg-primary-600/10",
    ghost: "bg-transparent text-slate-900 hover:text-primary-600 hover:translate-x-1 transition-transform",
    outline: "border border-slate-300 text-slate-900 hover:border-white hover:bg-slate-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon className="w-4 h-4" />}
    </button>
  );
};
