import React from 'react';
import { GlassCard } from '../ui/GlassCard';

export const CapabilitiesGrid = ({ capabilities = [] }) => {
  if (!capabilities || capabilities.length === 0) {
    return null; // Keep section clean when empty
  }

  return (
    <section id="capabilities" className="py-20 bg-slate-50 relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">
            // Core Engineering Pillar
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-headline">
            Enterprise AI Capabilities
          </h2>
          <p className="text-slate-500 font-sans text-base">
            Modular intelligence modules engineered for high accuracy, deterministic fallbacks, and zero data leakage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => (
            <GlassCard key={idx} className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-headline">{cap.title}</h3>
                <p className="text-sm text-slate-500 font-sans leading-relaxed">{cap.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between font-mono text-xs text-primary-500">
                <span>{cap.highlight}</span>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
};
