import React from 'react';
import { ShoppingBag, Eye, EyeOff, MousePointerClick, Plus, ArrowRight, ExternalLink } from 'lucide-react';
import { Product } from '../../types';

interface DashboardStatsProps {
  products: Product[];
  onNavigateToAddProduct: () => void;
  onNavigateToProducts: () => void;
  onEditProduct: (product: Product) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  products,
  onNavigateToAddProduct,
  onNavigateToProducts,
  onEditProduct,
}) => {
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const unpublishedProducts = products.filter((p) => !p.published).length;
  const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);

  const recentProducts = [...products]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8" id="admin-dashboard-stats-view">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Products</p>
            <h4 className="text-2xl font-extrabold text-stone-900 mt-0.5">{totalProducts}</h4>
          </div>
        </div>

        {/* Published Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Published</p>
            <h4 className="text-2xl font-extrabold text-stone-900 mt-0.5">{publishedProducts}</h4>
          </div>
        </div>

        {/* Unpublished Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Unpublished</p>
            <h4 className="text-2xl font-extrabold text-stone-900 mt-0.5">{unpublishedProducts}</h4>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Amazon Clicks</p>
            <h4 className="text-2xl font-extrabold text-stone-900 mt-0.5">{totalClicks}</h4>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-lg font-bold">Add a New Amazon Product</h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Published a new TikTok video? Add the Amazon link here so your bio link visitors can view and purchase it immediately.
          </p>
        </div>
        <button
          onClick={onNavigateToAddProduct}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors shrink-0 shadow-xs"
          id="btn-quick-add-product"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Recently Added Products */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-stone-900">Recently Added Products</h3>
          {totalProducts > 0 && (
            <button
              onClick={onNavigateToProducts}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <span>View All ({totalProducts})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-10 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-800">No products added yet</p>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Click the button below to add your first real Amazon product.
            </p>
            <button
              onClick={onNavigateToAddProduct}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentProducts.map((prod) => (
              <div
                key={prod.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/80 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">{prod.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {prod.category && (
                        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {prod.category}
                        </span>
                      )}
                      {prod.price && (
                        <span className="text-[11px] font-semibold text-stone-700">
                          {typeof prod.price === 'number' ? `$${prod.price.toFixed(2)}` : prod.price}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prod.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {prod.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={prod.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Open on Amazon"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onEditProduct(prod)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
