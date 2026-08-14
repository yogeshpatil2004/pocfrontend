import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SearchBar } from '../components/solutions/SearchBar';
import { PocGrid } from '../components/solutions/PocGrid';
import { getPocs } from '../api/pocsApi';

export const SolutionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPocs({
      status: 'PUBLISHED',
      search: searchTerm
    }).then(data => {
      setPocs(data);
      setLoading(false);
    });
  }, [searchTerm]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Back Button */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
      </div>

      {/* Header section */}
      <div className="space-y-4">
        <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">AI Solutions Library</span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-headline">
          Autonomous POC Gallery
        </h1>
        <p className="text-slate-500 font-sans text-base max-w-2xl">
          Explore interactive research prototypes, text-to-SQL translation engines, and enterprise multimodal tools.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="pb-6 border-b border-slate-200">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Grid List */}
      <PocGrid pocs={pocs} loading={loading} />

    </div>
  );
};
