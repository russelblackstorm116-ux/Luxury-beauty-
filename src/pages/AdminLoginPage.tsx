import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AUTHORIZED_ADMIN_EMAIL } from '../firebase/config';

interface AdminLoginPageProps {
  onBackToHome: () => void;
}

// Google SVG icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToHome }) => {
  const { signInWithGoogle, authError, clearAuthError, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    await signInWithGoogle();
    setIsSigningIn(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4" id="admin-login-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
          id="btn-back-to-storefront-login"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-stone-900 flex items-center justify-center text-amber-400 shadow-md mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Administrator Access
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Sign in with Google to manage products, Amazon links, and storefront settings.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-stone-200">
          {/* Error Alert if Unauthorized or Sign-In Fails */}
          {authError && (
            <div
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3"
              id="admin-auth-error-banner"
            >
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold mb-0.5">Authorization Error</p>
                <p className="leading-snug">{authError}</p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Strict Access Control</p>
              <p className="text-amber-800 mt-0.5">
                Only the designated administrator account (<strong>{AUTHORIZED_ADMIN_EMAIL}</strong>) is authorized to access this portal. All other Google accounts will be rejected.
              </p>
            </div>
          </div>

          {/* Sign In with Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn || loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm shadow-xs hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            id="btn-sign-in-google"
          >
            <GoogleIcon />
            <span>
              {isSigningIn || loading ? 'Verifying Google Account...' : 'Sign in with Google'}
            </span>
          </button>

          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-400">
              Protected by Firebase Authentication & Security Rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
