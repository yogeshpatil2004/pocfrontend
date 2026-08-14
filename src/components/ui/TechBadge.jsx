import React from 'react';

export const TechBadge = ({ label, variant = 'default' }) => {
  const styles = {
    default: "bg-primary-600/10 text-primary-500 border-primary-200",
    accent: "bg-slate-100 text-slate-900 border-slate-200",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-medium border ${styles[variant] || styles.default}`}>
      {label}
    </span>
  );
};
