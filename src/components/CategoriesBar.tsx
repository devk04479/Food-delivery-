import React from 'react';
import { Category, CategoryId } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface CategoriesBarProps {
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="relative overflow-hidden rounded-3xl bg-stone-950 text-white p-5 sm:p-7 border border-stone-800/80 shadow-2xl">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-serif tracking-tight">
                Explore Menu Categories
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                Select a category to filter your favorite fresh cravings
              </p>
            </div>
            <button
              id="cat-view-all-btn"
              onClick={() => onSelectCategory('all')}
              className="text-xs sm:text-sm font-bold text-orange-400 hover:text-orange-300 hover:underline cursor-pointer transition-colors"
            >
              View All ({(Object.values(categoryCounts) as number[]).reduce((a, b) => a + b, 0) || '25+'})
            </button>
          </div>

          {/* Horizontal scrollable category list */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'all' 
                ? (Object.values(categoryCounts) as number[]).reduce((a, b) => a + b, 0)
                : categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`group shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-lg shadow-orange-500/30 scale-[1.02]'
                      : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200 border-stone-800 hover:border-stone-700 shadow-xs'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-800 text-stone-300 group-hover:bg-orange-500/20 group-hover:text-orange-400'
                    }`}
                  >
                    <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-stone-100'}`}>
                      {cat.name}
                    </div>
                    <div className={`text-[11px] font-medium ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                      {count > 0 ? `${count} items` : 'Explore'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
