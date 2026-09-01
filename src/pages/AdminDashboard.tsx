import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, WebsiteSettings, AdminTab } from '../types';
import {
  subscribeAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductPublish
} from '../services/productsService';
import { updateWebsiteSettings } from '../services/settingsService';
import { DashboardStats } from '../components/admin/DashboardStats';
import { ProductList } from '../components/admin/ProductList';
import { ProductForm } from '../components/admin/ProductForm';
import { SettingsForm } from '../components/admin/SettingsForm';
import { AUTHORIZED_ADMIN_EMAIL } from '../firebase/config';

interface AdminDashboardProps {
  settings: WebsiteSettings;
  onNavigateToHome: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onNavigateToHome,
  onShowToast,
}) => {
  const { user, signOutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAllProducts(
      (data) => {
        setProducts(data);
        setLoadingProducts(false);
      },
      (err) => {
        console.error('Failed to load products in admin:', err);
        setLoadingProducts(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleCreateProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'clicks'>
  ) => {
    await addProduct(productData);
    onShowToast('Product added successfully!', 'success');
    setActiveTab('products');
  };

  const handleUpdateProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'clicks'>
  ) => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, productData);
    onShowToast('Product updated successfully!', 'success');
    setEditingProduct(null);
    setActiveTab('products');
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('add-product');
  };

  const handleCancelForm = () => {
    setEditingProduct(null);
    setActiveTab('products');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-900" id="admin-dashboard-root">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm block leading-none">Admin Panel</span>
            <span className="text-[10px] text-amber-400 font-mono">{user?.email || AUTHORIZED_ADMIN_EMAIL}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-stone-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside
        className={`w-full md:w-64 bg-stone-900 text-white flex flex-col shrink-0 border-r border-stone-800 transition-all duration-200 ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
        id="admin-sidebar"
      >
        {/* Admin Branding */}
        <div className="p-6 border-b border-stone-800 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight">Creator Admin</h1>
              <p className="text-[11px] text-stone-400">TikTok Amazon Bio Link</p>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Authorized Account</div>
            <div className="text-xs text-stone-300 font-mono truncate mt-0.5" title={user?.email || AUTHORIZED_ADMIN_EMAIL}>
              {user?.email || AUTHORIZED_ADMIN_EMAIL}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setEditingProduct(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
            id="nav-tab-dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
              activeTab === 'products'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
            id="nav-tab-products"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'products' ? 'bg-stone-950 text-white font-bold' : 'bg-stone-800 text-stone-400'
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setActiveTab('add-product');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
              activeTab === 'add-product' && !editingProduct
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
            id="nav-tab-add-product"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              setEditingProduct(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
            id="nav-tab-settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={onNavigateToHome}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            id="btn-sidebar-view-site"
          >
            <ExternalLink className="w-4 h-4 text-stone-400" />
            <span>View Public Storefront</span>
          </button>

          <button
            onClick={signOutUser}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
            id="btn-sidebar-signout"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardStats
            products={products}
            onNavigateToAddProduct={() => {
              setEditingProduct(null);
              setActiveTab('add-product');
            }}
            onNavigateToProducts={() => setActiveTab('products')}
            onEditProduct={handleStartEdit}
          />
        )}

        {activeTab === 'products' && (
          <ProductList
            products={products}
            onAddNew={() => {
              setEditingProduct(null);
              setActiveTab('add-product');
            }}
            onEdit={handleStartEdit}
            onDelete={deleteProduct}
            onTogglePublish={toggleProductPublish}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'add-product' && (
          <ProductForm
            initialProduct={editingProduct}
            onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={handleCancelForm}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsForm
            settings={settings}
            onSave={updateWebsiteSettings}
            onShowToast={onShowToast}
          />
        )}
      </main>
    </div>
  );
};
