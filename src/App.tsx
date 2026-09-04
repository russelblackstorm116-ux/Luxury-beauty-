import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, WebsiteSettings, ViewMode } from './types';
import { subscribePublishedProducts } from './services/productsService';
import { subscribeSettings, DEFAULT_SETTINGS } from './services/settingsService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { PublicStorefront } from './pages/PublicStorefront';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('public');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync route with URL on mount and hash/popstate
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path === '/admin' || hash === '#admin') {
        setCurrentView('admin');
      } else if (path === '/' || path === '' || hash === '#home' || hash === '') {
        setCurrentView('public');
      } else {
        // Unknown route
        setCurrentView('404');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  // Update URL and browser history smoothly
  const navigateTo = (view: ViewMode) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (view === 'public') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', '/404');
    }
  };

  // Subscribe to real-time published products for public visitors
  useEffect(() => {
    const unsubscribe = subscribePublishedProducts(
      (items) => {
        setProducts(items);
        setLoadingProducts(false);
      },
      (err) => {
        console.error('Error fetching published products:', err);
        setLoadingProducts(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to website settings
  useEffect(() => {
    const unsubscribe = subscribeSettings((updatedSettings) => {
      setSettings(updatedSettings);
      // Update document title dynamically
      if (updatedSettings.creatorName) {
        document.title = `${updatedSettings.creatorName} | Amazon Recommendations Storefront`;
      }
    });
    return () => unsubscribe();
  }, []);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View routing
  if (currentView === '404') {
    return (
      <>
        <NotFoundPage onBackToHome={() => navigateTo('public')} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (currentView === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-stone-800 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-stone-600">Verifying administrator authorization...</p>
          </div>
        </div>
      );
    }

    if (isAdmin && user) {
      return (
        <>
          <AdminDashboard
            settings={settings}
            onNavigateToHome={() => navigateTo('public')}
            onShowToast={showToast}
          />
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </>
      );
    }

    return (
      <>
        <AdminLoginPage onBackToHome={() => navigateTo('public')} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // Public Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar
        settings={settings}
        onNavigateToAdmin={() => navigateTo('admin')}
        onNavigateToHome={() => navigateTo('public')}
        isAdminView={false}
      />

      <PublicStorefront
        products={products}
        settings={settings}
        loading={loadingProducts}
        onShowToast={showToast}
        onNavigateToAdmin={() => navigateTo('admin')}
      />

      <Footer
        settings={settings}
        onNavigateToAdmin={() => navigateTo('admin')}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
