import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search AI POCs..." }) => {
  return (
    <div className="relative max-w-md w-full">
      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/80 border border-slate-200 rounded pl-10 pr-4 py-2 text-xs font-mono text-slate-900 placeholder-gray-500 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-500 transition-all"
      />
    </div>
  );
};
