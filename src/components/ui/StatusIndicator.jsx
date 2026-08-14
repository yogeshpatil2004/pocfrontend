import React from 'react';

export const StatusIndicator = ({ status = 'Online', ping = true }) => {
  const isHealthy = status.toLowerCase().includes('online') || status.toLowerCase().includes('healthy') || status.toLowerCase().includes('ready');

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700">
      <span className="relative flex h-2 w-2">
        {ping && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHealthy ? 'bg-primary-600' : 'bg-amber-400'}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isHealthy ? 'bg-primary-600' : 'bg-amber-400'}`}></span>
      </span>
      <span>{status}</span>
    </div>
  );
};
