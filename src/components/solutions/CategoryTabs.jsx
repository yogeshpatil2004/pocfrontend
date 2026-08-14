import React from 'react';

export const CategoryTabs = ({ categories = [], activeCategory, onSelectCategory }) => {
  if (!categories || categories.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`
              px-4 py-2 rounded text-xs font-mono tracking-wide transition-all whitespace-nowrap border
              ${isSelected
                ? 'bg-primary-600 text-slate-900 border-primary-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-primary-600'
              }
            `}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
