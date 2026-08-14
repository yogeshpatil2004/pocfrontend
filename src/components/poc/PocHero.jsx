import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TechBadge } from '../ui/TechBadge';
import { StatusIndicator } from '../ui/StatusIndicator';

export const PocHero = ({ poc }) => {
  return (
    <div className="space-y-6">
      <Link to="/solutions" className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to POC Library
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-3">

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-headline">
            {poc.title}
          </h1>

          <p className="text-slate-700 font-sans text-base max-w-3xl leading-relaxed">
            {poc.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {poc.tags?.map((t, idx) => (
              <TechBadge key={idx} label={t} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
