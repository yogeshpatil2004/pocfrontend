import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/solutions/SearchBar';
import { TrainingGrid } from '../components/training/TrainingGrid';
import { getTrainings } from '../api/trainingApi';

export const TrainingMaterialsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTrainings({
      status: 'PUBLISHED',
      search: searchTerm || undefined,
    }).then(data => {
      setTrainings(data);
      setLoading(false);
    });
  }, [searchTerm]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header section */}
      <div className="space-y-4">
        <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">Enterprise Training Resources</span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-headline">
          Training Materials
        </h1>
        <p className="text-slate-500 font-sans text-base max-w-2xl">
          Access comprehensive learning paths, documentation, and video tutorials for Vibodh AI enterprise solutions.
        </p>
      </div>

      {/* Filtering Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* Grid List */}
      <TrainingGrid trainings={trainings} loading={loading} />

    </div>
  );
};
