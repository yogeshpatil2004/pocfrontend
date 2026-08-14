import React from 'react';
import { Cpu, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const ArchitectureDiagram = () => {
  const steps = [
    { title: "1. Natural Query Request", desc: "User inputs plain English question via API or UI." },
    { title: "2. Schema Inspection", desc: "Agent introspects Supabase PostgreSQL DDL & foreign keys." },
    { title: "3. LLM Translation", desc: "LangChain orchestrates GPT-4o / Claude 3.5 Sonnet to construct AST." },
    { title: "4. SQL Sanitization", desc: "Validates against SQL injection, restricted DROP statements, & latency limits." },
    { title: "5. Supabase Execution", desc: "Runs async query, streams serialized JSON response back in <250ms." }
  ];

  return (
    <GlassCard hoverEffect={false} className="space-y-6">
      <div className="flex items-center gap-2 text-slate-900 font-headline font-bold text-xl">
        <Layers className="w-5 h-5 text-primary-600" />
        <span>Agent Execution Pipeline Architecture</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 relative">
            <div className="font-mono text-xs text-primary-600 font-bold">{step.title}</div>
            <div className="font-sans text-xs text-slate-500 leading-relaxed">{step.desc}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
