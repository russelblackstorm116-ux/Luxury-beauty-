import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  ShoppingBag,
  Share2
} from 'lucide-react';
import { Product, WebsiteSettings } from '../types';
import { CreatorHero } from '../components/CreatorHero';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { AmazonDisclosure } from '../components/AmazonDisclosure';
import { ShareModal } from '../components/ShareModal';

interface PublicStorefrontProps {
  products: Product[];
  settings: WebsiteSettings;
  loading: boolean;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name';

export const PublicStorefront: React.FC<PublicStorefrontProps> = ({
  products,
  settings,
  loading,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [isStoreShareOpen, setIsStoreShareOpen] = useState(false);

  // Extract all unique categories present in the published products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [products]);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let result = products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price-asc') {
        const pA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price || '0').replace(/[^0-9.]/g, '')) || 0;
        const pB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price || '0').replace(/[^0-9.]/g, '')) || 0;
        return pA - pB;
      }
      if (sortBy === 'price-desc') {
        const pA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price || '0').replace(/[^0-9.]/g, '')) || 0;
        const pB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price || '0').replace(/[^0-9.]/g, '')) || 0;
        return pB - pA;
      }
      // Default: Display Order (ascending) then newest
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const isFiltering = searchQuery.trim().length > 0 || selectedCategory !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen flex flex-col" id="public-storefront-page">
      {/* Creator Profile Hero Banner */}
      <CreatorHero
        settings={settings}
        productsCount={products.length}
        onOpenShare={() => setIsStoreShareOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pb-12">
        {/* Search, Category Filters, and Sort Options */}
        {products.length > 0 && (
          <div className="mb-8 space-y-4" id="storefront-controls">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Amazon recommendations..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-stone-200 shadow-2xs text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-amber-200/50 transition-all"
                  id="input-public-search"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-700 p-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full sm:w-auto appearance-none pl-4 pr-10 py-3 rounded-2xl bg-white border border-stone-200 shadow-2xs text-xs sm:text-sm font-semibold text-stone-800 focus:outline-hidden focus:border-stone-400"
                    id="select-public-sort"
                  >
                    <option value="featured">Featured Order</option>
                    <option value="newest">Newest Added</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                  <ArrowUpDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 shadow-2xs ${
                    selectedCategory === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                  id="category-pill-all"
                >
                  All Items ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 shadow-2xs ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-stone-900 text-white'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                    id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4">
                <div className="w-full aspect-square bg-stone-200 rounded-xl" />
                <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                <div className="h-3 bg-stone-100 rounded-md w-full" />
                <div className="h-10 bg-stone-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : processedProducts.length > 0 ? (
          /* Product Grid */
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="products-grid-container"
          >
            {processedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShare={(prod) => setShareProduct(prod)}
              />
            ))}
          </div>
        ) : (
          /* Empty State (Either no products in database or filtered to zero) */
          <EmptyState isFiltered={isFiltering} onResetFilters={resetFilters} />
        )}

        {/* Amazon Affiliate Disclosure Section */}
        <AmazonDisclosure text={settings.amazonDisclosureText} />
      </main>

      {/* Share Modals */}
      <ShareModal
        isOpen={isStoreShareOpen}
        onClose={() => setIsStoreShareOpen(false)}
        onShowToast={onShowToast}
      />

      <ShareModal
        isOpen={Boolean(shareProduct)}
        product={shareProduct}
        onClose={() => setShareProduct(null)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
