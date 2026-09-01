import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isFiltered, onResetFilters }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto"
      id="empty-state-container"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-5 shadow-sm">
        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">
        {isFiltered ? 'No matching products found' : 'No products available yet.'}
      </h3>

      <p className="text-sm text-stone-600 leading-relaxed mb-6">
        {isFiltered
          ? 'Try adjusting your search terms or category filters to find what you are looking for.'
          : 'The creator has not published any products to the storefront yet. Please check back soon or follow on TikTok for updates!'}
      </p>

      {isFiltered && onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
          id="btn-reset-filters"
        >
          <Sparkles className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );
};
