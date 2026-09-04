import React from 'react';
import { ShoppingBag, Sparkles, Plus, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
  onNavigateToAdmin?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onResetFilters,
  onNavigateToAdmin,
}) => {
  const { isAdmin, user } = useAuth();

  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto"
      id="empty-state-container"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-5 shadow-sm">
        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">
        {isFiltered ? 'No matching products found' : 'No products available yet'}
      </h3>

      <p className="text-sm text-stone-600 leading-relaxed mb-6">
        {isFiltered
          ? 'Try adjusting your search terms or category filters to find what you are looking for.'
          : 'This storefront currently has no products. Only the administrator can add verified Amazon recommendations.'}
      </p>

      {isFiltered && onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
          id="btn-reset-filters"
        >
          <Sparkles className="w-4 h-4" />
          Clear All Filters
        </button>
      )}

      {!isFiltered && onNavigateToAdmin && (
        <button
          onClick={onNavigateToAdmin}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-xs cursor-pointer"
          id="btn-empty-state-admin-action"
        >
          {isAdmin && user ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Go to Admin Dashboard to Add Products</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Administrator Login</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
