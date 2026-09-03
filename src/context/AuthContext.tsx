// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { UserProfile } from '../types.ts';

interface AdminSession {
  token: string;
  email: string;
  displayName: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  adminSession: AdminSession | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  adminLogin: (username: string, passcode: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  getIdToken: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = localStorage.getItem('jcc_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // User is admin if Firebase role is 'admin', email is admin, or active admin session exists
  const isAdmin = Boolean(
    adminSession !== null ||
    userProfile?.role === 'admin' ||
    (user?.email && (
      user.email.toLowerCase().includes('admin') ||
      user.email.toLowerCase() === 'kushbhusareiit@gmail.com' ||
      user.email.toLowerCase() === 'director@jagdamb.com' ||
      user.email.toLowerCase() === 'jagdambcoachingcenter@gmail.com'
    ))
  );

  const adminLogin = async (username: string, passcode: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: passcode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const session: AdminSession = {
          token: data.token,
          email: data.email || 'admin@jagdamb.com',
          displayName: data.displayName || 'Administrator',
          role: 'admin',
        };
        setAdminSession(session);
        localStorage.setItem('jcc_admin_session', JSON.stringify(session));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error while logging in' };
    }
  };

  const adminLogout = () => {
    setAdminSession(null);
    localStorage.removeItem('jcc_admin_session');
  };

  const getIdToken = async (): Promise<string | null> => {
    if (adminSession) {
      return adminSession.token;
    }
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch (err) {
      console.error('Failed to get Firebase ID token:', err);
      return null;
    }
  };

  const syncUserProfile = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: currentUser.displayName,
          photoUrl: currentUser.photoURL,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.warn('Failed to sync user profile with backend:', error);
    }
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await syncUserProfile(auth.currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request'
      ) {
        // User voluntarily dismissed the Google popup window; this is expected user behavior
        console.info('Sign-in popup closed by user.');
        return;
      }
      if (error?.code === 'auth/popup-blocked') {
        console.warn('Popup blocked by browser. Please allow popups for this site.');
        return;
      }
      console.warn('Google sign-in exception:', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      adminLogout();
      await fbSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        adminSession,
        isAdmin,
        loading,
        signInWithGoogle,
        signOut,
        adminLogin,
        adminLogout,
        getIdToken,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
