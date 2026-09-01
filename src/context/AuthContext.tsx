import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, AUTHORIZED_ADMIN_EMAIL, isAuthorizedAdminEmail } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const authorized = isAuthorizedAdminEmail(currentUser.email);
        if (authorized) {
          setUser(currentUser);
          setIsAdmin(true);
          setAuthError(null);
        } else {
          // Immediately reject and sign out unauthorized Google accounts
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
          setAuthError(
            'Access denied. This account is not authorized to access the administrator dashboard.'
          );
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;

      if (!isAuthorizedAdminEmail(loggedUser.email)) {
        // Immediate sign out and explicit denial
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
        setAuthError(
          'Access denied. This account is not authorized to access the administrator dashboard.'
        );
        setLoading(false);
        return false;
      }

      setUser(loggedUser);
      setIsAdmin(true);
      setAuthError(null);
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      let message = 'Failed to sign in with Google. Please try again.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup was closed before completing authentication.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = 'Authentication request was cancelled.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error during authentication. Please check your internet connection.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized in Firebase OAuth settings. Please add this domain to Firebase Authentication Authorized Domains.';
      }
      
      setAuthError(message);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setAuthError(null);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        authError,
        signInWithGoogle,
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
