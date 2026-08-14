import React from 'react';
import { Activity, Clock, CheckCircle2, Cpu } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const MetricsCards = ({ metrics }) => {
  const cards = [
    { title: "Total Served Queries", value: metrics?.totalRequests || "4,829,102", icon: Activity, change: "+14% vs last week", color: "text-primary-600" },
    { title: "Avg API Latency", value: metrics?.avgLatency || "214ms", icon: Clock, change: "-12ms improvement", color: "text-blue-400" },
    { title: "Query Success Rate", value: metrics?.successRate || "99.94%", icon: CheckCircle2, change: "Optimal Uptime", color: "text-emerald-400" },
    { title: "Active AI Models", value: metrics?.activeModels || 12, icon: Cpu, change: "Supabase DB Pool Active", color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <GlassCard key={i} className="space-y-3 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
              <span>{c.title}</span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono">{c.value}</div>
            <div className="font-mono text-[11px] text-slate-400">{c.change}</div>
          </GlassCard>
        );
      })}
    </div>
  );
};
