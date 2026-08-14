import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { StatusIndicator } from '../ui/StatusIndicator';

export const ModelStatusTable = ({ models = [] }) => {
  return (
    <GlassCard hoverEffect={false} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 font-headline">Active Model Registries</h3>
        <span className="font-mono text-xs text-slate-500">Total: {models.length}</span>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-white text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Model Pipeline</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Avg Latency</th>
              <th className="px-4 py-3">Health Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-700">
            {models.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">{m.name}</td>
                <td className="px-4 py-3 text-slate-500">{m.version}</td>
                <td className="px-4 py-3 text-blue-400">{m.provider}</td>
                <td className="px-4 py-3 text-primary-500">{m.latency}</td>
                <td className="px-4 py-3">
                  <StatusIndicator status={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
