import React from 'react';
import { Terminal } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const TerminalLogs = ({ logs = [] }) => {
  return (
    <GlassCard hoverEffect={false} className="bg-white border-slate-200 space-y-4">
      <div className="flex items-center gap-2 text-slate-900 font-mono text-xs border-b border-slate-200 pb-3">
        <Terminal className="w-4 h-4 text-primary-600" />
        <span>System Telemetry & Access Stream</span>
      </div>

      <div className="font-mono text-xs text-slate-700 space-y-2 bg-slate-50 p-4 rounded border border-slate-100 max-h-60 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="leading-relaxed hover:text-primary-500 transition-colors">
            {log}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
