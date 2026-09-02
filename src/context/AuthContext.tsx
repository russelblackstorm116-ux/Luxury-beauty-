import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, AUTHORIZED_ADMIN_EMAIL, isAuthorizedAdminEmail } from '../firebase/config';

interface AuthErrorDetails {
  code: string;
  message: string;
  currentDomain?: string;
}

interface AuthContextType {
  user: User | { email: string; displayName?: string; uid?: string } | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  authErrorDetails: AuthErrorDetails | null;
  signInWithGoogle: (passcode?: string) => Promise<boolean>;
  loginWithPassword: (email: string, password: string) => boolean;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'tiktok_storefront_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; displayName?: string; uid?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorDetails, setAuthErrorDetails] = useState<AuthErrorDetails | null>(null);

  // Check stored local session on startup
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed && isAuthorizedAdminEmail(parsed.email)) {
          setUser({
            email: AUTHORIZED_ADMIN_EMAIL,
            displayName: parsed.displayName || 'Collins Monye (Admin)',
            uid: parsed.uid || 'admin-collins-primary'
          });
          setIsAdmin(true);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse admin session:', e);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const authorized = isAuthorizedAdminEmail(currentUser.email);
        if (authorized) {
          setUser(currentUser);
          setIsAdmin(true);
          setAuthError(null);
          setAuthErrorDetails(null);
          try {
            localStorage.setItem(
              ADMIN_STORAGE_KEY,
              JSON.stringify({ email: AUTHORIZED_ADMIN_EMAIL, displayName: currentUser.displayName })
            );
          } catch (_) {}
        } else {
          // Immediately reject and sign out unauthorized Google accounts
          await signOut(auth);
          try {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
          } catch (_) {}
          setUser(null);
          setIsAdmin(false);
          setAuthError(
            'Access denied. This account is not authorized to access the administrator dashboard.'
          );
          setAuthErrorDetails({
            code: 'auth/forbidden-account',
            message: 'Access denied. This account is not authorized to access the administrator dashboard.'
          });
        }
      } else {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!stored) {
          setUser(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithPassword = (email: string, password: string): boolean => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setAuthError('Unauthorized email address. Only the designated administrator account can sign in.');
      setAuthErrorDetails({
        code: 'auth/forbidden-email',
        message: 'Unauthorized email address. Only the designated administrator account can sign in.'
      });
      return false;
    }

    // Require password "Collins" (or "collins")
    if (cleanPass !== 'Collins' && cleanPass !== 'collins') {
      setAuthError('Incorrect administrator password. Please enter the valid password.');
      setAuthErrorDetails({
        code: 'auth/wrong-password',
        message: 'Incorrect administrator password.'
      });
      return false;
    }

    const adminUser = {
      email: AUTHORIZED_ADMIN_EMAIL,
      displayName: 'Collins Monye (Administrator)',
      uid: 'admin-collins-authenticated'
    };
    setUser(adminUser);
    setIsAdmin(true);
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
    } catch (_) {}
    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    setAuthErrorDetails(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;

      if (!isAuthorizedAdminEmail(loggedUser.email)) {
        // Immediate sign out and explicit denial
        await signOut(auth);
        try {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        } catch (_) {}
        setUser(null);
        setIsAdmin(false);
        const errText = 'Access denied. This account is not authorized to access the administrator dashboard.';
        setAuthError(errText);
        setAuthErrorDetails({
          code: 'auth/forbidden-account',
          message: errText
        });
        setLoading(false);
        return false;
      }

      setUser(loggedUser);
      setIsAdmin(true);
      setAuthError(null);
      setAuthErrorDetails(null);
      try {
        localStorage.setItem(
          ADMIN_STORAGE_KEY,
          JSON.stringify({ email: AUTHORIZED_ADMIN_EMAIL, displayName: loggedUser.displayName })
        );
      } catch (_) {}
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      let message = 'Failed to sign in with Google. Please try again.';
      const code = err.code || 'unknown';
      const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
      
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup was closed before completing authentication.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = 'Authentication request was cancelled.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error during authentication. Please check your internet connection.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = `This domain (${currentDomain}) is not authorized in Firebase OAuth settings. Please add this domain to Firebase Authentication Authorized Domains or use Direct Admin Access below.`;
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Google Sign-In provider is not enabled in the Firebase Console. Use Direct Admin Access below.';
      } else if (err.message) {
        message = err.message;
      }
      
      setAuthError(message);
      setAuthErrorDetails({
        code,
        message,
        currentDomain
      });
      setLoading(false);
      return false;
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign Out Error:', err);
    } finally {
      try {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      } catch (_) {}
      setUser(null);
      setIsAdmin(false);
      setAuthError(null);
      setAuthErrorDetails(null);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
    setAuthErrorDetails(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        authError,
        authErrorDetails,
        signInWithGoogle,
        loginWithPassword,
        signOutUser,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
