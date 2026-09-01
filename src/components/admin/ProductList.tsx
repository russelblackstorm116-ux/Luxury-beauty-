import React, { useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ExternalLink,
  ShoppingBag,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  onAddNew: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string, currentPublished: boolean) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddNew,
  onEdit,
  onDelete,
  onTogglePublish,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique categories
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c && c.trim())))
  );

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      filterCategory === 'all' || p.category?.toLowerCase() === filterCategory.toLowerCase();

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && p.published) ||
      (filterStatus === 'draft' && !p.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(productToDelete.id);
      onShowToast(`Deleted "${productToDelete.name}" successfully`, 'success');
      setProductToDelete(null);
    } catch (err: any) {
      console.error('Delete product error:', err);
      onShowToast(err.message || 'Product deletion failure', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6" id="admin-product-list-view">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Manage Products ({products.length})</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Add, update, reorder, or publish products to your TikTok storefront.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-colors shadow-xs"
          id="btn-admin-add-product"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
            id="input-admin-search-products"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden text-stone-700 font-medium"
            id="select-admin-category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden text-stone-700 font-medium"
            id="select-admin-status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Products Table / Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No products found</h3>
          <p className="text-xs text-stone-500 mt-1 mb-5">
            {products.length === 0
              ? 'Your storefront does not have any products yet. Click "Add New Product" to add real Amazon items.'
              : 'No products matched your search or filter criteria.'}
          </p>
          {products.length === 0 ? (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Clicks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-stone-900 text-sm truncate">{product.name}</p>
                          <a
                            href={product.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 mt-0.5 truncate"
                          >
                            <span className="truncate">{product.amazonUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      {product.category ? (
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-100 text-stone-700">
                          {product.category}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-semibold text-stone-900 text-xs">
                      {product.price ? (
                        typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price
                      ) : (
                        <span className="text-stone-400 font-normal">—</span>
                      )}
                    </td>

                    {/* Clicks */}
                    <td className="py-3 px-4 text-xs font-medium text-stone-600">
                      {product.clicks || 0}
                    </td>

                    {/* Status & Quick Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onTogglePublish(product.id, product.published)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          product.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {product.published ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">Delete Product?</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-5">
              Are you sure you want to permanently delete <strong>&quot;{productToDelete.name}&quot;</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
