import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { tacticalAudio } from '../utils/audio';

export interface UserProfile {
  uid: string;
  email: string;
  callsign: string;
  displayName: string;
  phone?: string;
  role: 'COMMANDANT' | 'OPERATEUR' | 'RECRUE' | 'INVITE';
  memberTier: 'TEST' | 'TITULAIRE' | 'PREMIUM' | 'NON_MEMBRE';
  isStaff: boolean;
  photoURL?: string;
  createdAt: string;
}

interface SignUpData {
  email: string;
  password: string;
  callsign: string;
  displayName: string;
  phone?: string;
  memberTier?: 'TEST' | 'TITULAIRE' | 'PREMIUM' | 'NON_MEMBRE';
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithCredentials: (email: string, pass: string) => Promise<void>;
  signUpWithCredentials: (data: SignUpData) => Promise<void>;
  quickLoginDemo: (role: 'VIPER' | 'RECRUE') => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('fost_active_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Sync profile to localStorage
  const saveProfile = (prof: UserProfile | null) => {
    setUserProfile(prof);
    try {
      if (prof) {
        localStorage.setItem('fost_active_profile', JSON.stringify(prof));
      } else {
        localStorage.removeItem('fost_active_profile');
      }
    } catch {
      // ignore
    }
  };

  // Fetch or create profile in Firestore
  const loadOrCreateFirestoreProfile = async (user: User, customData?: Partial<UserProfile>): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        saveProfile(data);
        return data;
      } else {
        const fallbackCallsign = customData?.callsign || user.displayName?.split(' ')[0]?.toUpperCase() || 'OPÉRATIONNEL';
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || 'operator@fost.fr',
          callsign: fallbackCallsign,
          displayName: customData?.displayName || user.displayName || fallbackCallsign,
          phone: customData?.phone || '',
          role: customData?.role || 'OPERATEUR',
          memberTier: customData?.memberTier || 'TITULAIRE',
          isStaff: customData?.isStaff ?? (user.email === 'shana.boughazi@gmail.com' || Boolean(user.email?.includes('admin'))),
          photoURL: user.photoURL || 'https://lh3.googleusercontent.com/aida/AEtjO1XQ4NPkLyCWHlFwZY6vqbsOVRlZQJnE6fgc8YNbgs_-dlBFdlCcoQ7JaDzwhmuyA56e3etRIIzPnSesbEB8475B3iSe8z3rVXUu0eOz-GhoWZ7nDzwBFhtkmnxeSrFUCONzNkTorhFEoX_7nMRbnvBizPp_T7BLbrEW7j_Ip6aYUQfv7I9zTaho-5ja84qg7wSco0VPUxcaESzHdh8bt87zMS68ZvOHYoHIXgHoUglRxVhM3Nf3ZICOMz5kky7pMOGEb4qVQXJ7Gw',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        saveProfile(newProfile);
        return newProfile;
      }
    } catch (err) {
      console.warn("Could not sync profile to Firestore, falling back to local memory:", err);
      const fallbackCallsign = customData?.callsign || user.displayName?.split(' ')[0]?.toUpperCase() || 'OPERATEUR';
      const fallback: UserProfile = {
        uid: user.uid,
        email: user.email || 'operator@fost.fr',
        callsign: fallbackCallsign,
        displayName: customData?.displayName || user.displayName || fallbackCallsign,
        phone: customData?.phone || '',
        role: customData?.role || 'OPERATEUR',
        memberTier: customData?.memberTier || 'TITULAIRE',
        isStaff: customData?.isStaff || false,
        photoURL: user.photoURL || undefined,
        createdAt: new Date().toISOString()
      };
      saveProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadOrCreateFirestoreProfile(user);
      } else {
        // Only clear if not in demo mode
        const demoUser = localStorage.getItem('fost_demo_mode');
        if (!demoUser) {
          saveProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    tacticalAudio.playClick();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const res = await signInWithPopup(auth, provider);
      await loadOrCreateFirestoreProfile(res.user);
      localStorage.removeItem('fost_demo_mode');
      tacticalAudio.playConfirm();
    } catch (error) {
      tacticalAudio.playRogerBeep();
      console.error("Google Sign-in failed:", error);
      throw error;
    }
  };

  const signInWithDiscord = async () => {
    tacticalAudio.playClick();
    const provider = new OAuthProvider('discord.com');
    provider.addScope('identify');
    provider.addScope('email');
    try {
      const res = await signInWithPopup(auth, provider);
      await loadOrCreateFirestoreProfile(res.user);
      localStorage.removeItem('fost_demo_mode');
      tacticalAudio.playConfirm();
    } catch (error) {
      tacticalAudio.playRogerBeep();
      console.error("Discord Sign-in failed:", error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    tacticalAudio.playClick();
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    try {
      const res = await signInWithPopup(auth, provider);
      await loadOrCreateFirestoreProfile(res.user);
      localStorage.removeItem('fost_demo_mode');
      tacticalAudio.playConfirm();
    } catch (error) {
      tacticalAudio.playRogerBeep();
      console.error("Apple Sign-in failed:", error);
      throw error;
    }
  };

  const signInWithCredentials = async (email: string, pass: string) => {
    tacticalAudio.playClick();
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await loadOrCreateFirestoreProfile(res.user);
      localStorage.removeItem('fost_demo_mode');
      tacticalAudio.playConfirm();
    } catch (error) {
      tacticalAudio.playRogerBeep();
      console.error("Sign-in failed:", error);
      throw error;
    }
  };

  const signUpWithCredentials = async (data: SignUpData) => {
    tacticalAudio.playClick();
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (data.displayName) {
        await updateProfile(res.user, { displayName: data.displayName });
      }
      await loadOrCreateFirestoreProfile(res.user, {
        callsign: data.callsign.toUpperCase(),
        displayName: data.displayName,
        phone: data.phone,
        memberTier: data.memberTier || 'TITULAIRE',
        role: 'OPERATEUR'
      });
      localStorage.removeItem('fost_demo_mode');
      tacticalAudio.playConfirm();
    } catch (error) {
      tacticalAudio.playRogerBeep();
      console.error("Sign-up failed:", error);
      throw error;
    }
  };

  // Demo account quick switch
  const quickLoginDemo = async (role: 'VIPER' | 'RECRUE') => {
    tacticalAudio.playConfirm();
    const isViper = role === 'VIPER';
    const demoProf: UserProfile = {
      uid: isViper ? 'demo-viper-01' : 'demo-recrue-57',
      email: isViper ? 'viper.command@fost.fr' : 'recrue.alex@fost.fr',
      callsign: isViper ? 'VIPER-01' : 'SHADOW-57',
      displayName: isViper ? 'Ilyane (Commandant FOST)' : 'Alexandre Dubois',
      phone: '06 12 34 56 78',
      role: isViper ? 'COMMANDANT' : 'RECRUE',
      memberTier: isViper ? 'PREMIUM' : 'TEST',
      isStaff: isViper,
      photoURL: isViper
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnEPiIs4tkFQO9SBDGHHEgoZCLqrcxpgaj_k81rLoVOsv2wjpIORwPph18B2c3IfcnJJDlaUd8dH8VGtAJ0pwfwm8EuezId5vjMsFtYVGjP2Ne18NPiRiAcsQzrdO_yn7IXkeSDEJGDQkwXpRy4m172tKY6FW-jlaOtBScDL67NyzwzyMEdgGO61ncMop_qqOZvpc-Ix2uUHXuto1bvPUjYD33MDDjxGOLFZjanpiNDRrzv2ymXt5lzK_gTUzYNQC9sQ'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCdDxzlc4wch80yRJhaadSEfawWF1tsVCKM-hNeVyROUyXi5wdN1bVZdxlEswnZXLuVvzEemUrvy4URGiMTgnQzZhQWzwkTxX1MgXxhmBV7_KND6POAFVIJsWOcoK67JHHUoUTYfHFmpLvVhOK21L6al5ze4KjKKuhWni_CQug_qUFNnKB-3fhFrVQARvkoPtdVq4m8pigTzVesj34kEAV6AokrU_6U77x3KPSJ98IZPyDXCx_5de_',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('fost_demo_mode', 'true');
    saveProfile(demoProf);
  };

  const logout = async () => {
    tacticalAudio.playClick();
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem('fost_demo_mode');
    saveProfile(null);
    setCurrentUser(null);
    tacticalAudio.playRogerBeep();
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates };
    saveProfile(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      } catch (e) {
        console.warn('Could not sync profile update to Firestore', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithDiscord,
        signInWithApple,
        signInWithCredentials,
        signUpWithCredentials,
        quickLoginDemo,
        logout,
        updateUserProfile
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
