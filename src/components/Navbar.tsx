import React from 'react';
import { ShoppingBag, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WebsiteSettings } from '../types';

interface NavbarProps {
  settings: WebsiteSettings;
  onNavigateToAdmin: () => void;
  onNavigateToHome: () => void;
  isAdminView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onNavigateToAdmin,
  onNavigateToHome,
  isAdminView,
}) => {
  const { user, isAdmin, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onNavigateToHome}
          className="flex items-center gap-2.5 text-left group"
          id="nav-brand-btn"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-amber-400 shadow-xs group-hover:bg-stone-800 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-stone-900 tracking-tight block leading-none">
              {settings.creatorName || 'TikTok Creator'}
            </span>
            <span className="text-[11px] font-medium text-amber-700 tracking-wide">
              Amazon Recommendations
            </span>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          {isAdminView ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToHome}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                id="btn-nav-view-storefront"
              >
                View Storefront
              </button>
              {user && (
                <button
                  onClick={signOutUser}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
                  id="btn-nav-signout"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <button
                  onClick={onNavigateToAdmin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                  id="btn-nav-admin-dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={onNavigateToAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 text-xs font-medium transition-colors"
                  title="Creator Admin Login"
                  id="btn-nav-admin-login"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
