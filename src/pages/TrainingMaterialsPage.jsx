import React from 'react';
import { TrainingExplorer } from '../components/training/TrainingExplorer';

export const TrainingMaterialsPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header section */}
      <div className="space-y-4">
        <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">Enterprise Training Resources</span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-headline">
          Training Materials
        </h1>
        <p className="text-slate-500 font-sans text-base max-w-2xl">
          Browse and access internal learning paths, code repositories, documentation, and video tutorials.
        </p>
      </div>

      {/* Nested Folder Explorer Component */}
      <TrainingExplorer isAdmin={false} />

    </div>
  );
};
