import React, { useState } from 'react';
import {
  Lock,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Globe
} from 'lucide-react';
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
  const {
    loginWithPassword,
    signInWithGoogle,
    authError,
    authErrorDetails,
    clearAuthError,
    loading
  } = useAuth();

  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const isUnauthorizedDomain =
    authErrorDetails?.code === 'auth/unauthorized-domain' ||
    (authError && authError.toLowerCase().includes('unauthorized domain')) ||
    (authError && authError.toLowerCase().includes('authorized domain'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setIsSubmitting(true);
    
    // Authenticate with Email & Password
    loginWithPassword(email, password);
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setIsSigningInGoogle(true);
    await signInWithGoogle();
    setIsSigningInGoogle(false);
  };

  const handleCopyDomain = () => {
    if (!currentDomain) return;
    navigator.clipboard.writeText(currentDomain);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4" id="admin-login-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors cursor-pointer"
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
            Secure Administrator Access
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600">
            Please enter your administrator credentials and password to manage your storefront products.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-stone-200">
          
          {/* Error Message Alert */}
          {authError && !isUnauthorizedDomain && (
            <div
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 animate-in fade-in"
              id="admin-auth-error-banner"
            >
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold mb-0.5">Authentication Error</p>
                <p className="leading-snug">{authError}</p>
              </div>
            </div>
          )}

          {/* Unauthorized Domain Guide (if Google OAuth was clicked and failed) */}
          {isUnauthorizedDomain && (
            <div
              className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-stone-900 text-xs"
              id="unauthorized-domain-fix-box"
            >
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-900">Domain Not Added to Google OAuth</div>
                  <p className="text-stone-700 mt-0.5">
                    Use the Email & Password form below to sign in directly without domain configuration.
                  </p>
                  <button
                    onClick={handleCopyDomain}
                    type="button"
                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDomain ? 'Copied!' : 'Copy Domain for Firebase'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secure Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="form-admin-password-login">
            {/* Email Field */}
            <div>
              <label htmlFor="input-admin-email" className="block text-xs font-bold text-stone-700 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Collinsmonye5227@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-hidden focus:border-stone-500 focus:ring-2 focus:ring-amber-200/50 transition-all font-mono text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="input-admin-password" className="block text-xs font-bold text-stone-700 mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-hidden focus:border-stone-500 focus:ring-2 focus:ring-amber-200/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading || !password}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-950 hover:bg-stone-900 text-amber-400 font-extrabold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              id="btn-submit-password-login"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              )}
              <span>Sign In to Admin Dashboard</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Or with Google
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Sign in with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningInGoogle || loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs shadow-2xs hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            id="btn-sign-in-google"
          >
            {isSigningInGoogle ? (
              <RefreshCw className="w-4 h-4 animate-spin text-stone-600" />
            ) : (
              <GoogleIcon />
            )}
            <span>Sign in with Google ({AUTHORIZED_ADMIN_EMAIL})</span>
          </button>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex items-start gap-2.5 text-stone-600 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              Protected portal strictly reserved for <span className="font-mono text-stone-900 font-bold">{AUTHORIZED_ADMIN_EMAIL}</span> with password required.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
