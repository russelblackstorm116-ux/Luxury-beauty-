import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WebsiteSettings } from '../types';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigateToAdmin }) => {
  const { isAdmin } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-stone-200 bg-white/70 py-10 px-4 text-center text-xs text-stone-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-medium text-stone-600">
          © {currentYear} {settings.creatorName || 'TikTok Creator'}. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateToAdmin}
            className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors text-xs font-medium"
            id="footer-admin-link"
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Dashboard</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Access</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};
