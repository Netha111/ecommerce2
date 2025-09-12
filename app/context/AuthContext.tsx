'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

export type AppUser = {
    // Basic Info
    uid: string;
    email: string | null;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    photoURL: string | null;
    
    // Credits & Plan
    credits: number;
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    subscriptionId: string | null;
    subscriptionStatus: 'active' | 'canceled' | 'past_due' | null;
    
    // Usage Tracking
    totalTransformations: number;
    totalCreditsUsed: number;
    lastTransformationAt: unknown | null;
    
    // Timestamps
    createdAt: unknown;
    updatedAt: unknown;
    lastLoginAt: unknown | null;
    
    // Settings
    emailNotifications: boolean;
    planAutoRenew: boolean;
    
    // Billing
    billingAddress: {
        name: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        pincode: string | null;
    } | null;
};

type AuthContextValue = {
    firebaseUser: User | null;
    appUser: AppUser | null;
    loading: boolean;
    signOutAsync: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            if (!user) {
                setAppUser(null);
                setLoading(false);
                return;
            }

            // Ensure user document exists
            const ref = doc(db, 'users', user.uid);
            const snap = await getDoc(ref);
            if (!snap.exists()) {
                // Parse displayName to extract firstName and lastName
                const displayName = user.displayName ?? '';
                const nameParts = displayName.split(' ');
                const firstName = nameParts[0] ?? null;
                const lastName = nameParts.slice(1).join(' ') || null;

                const newUser: AppUser = {
                    // Basic Info
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName ?? null,
                    firstName: firstName,
                    lastName: lastName,
                    photoURL: user.photoURL ?? null,
                    
                    // Credits & Plan
                    credits: 3,
                    plan: 'free',
                    subscriptionId: null,
                    subscriptionStatus: null,
                    
                    // Usage Tracking
                    totalTransformations: 0,
                    totalCreditsUsed: 0,
                    lastTransformationAt: null,
                    
                    // Timestamps
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastLoginAt: serverTimestamp(),
                    
                    // Settings
                    emailNotifications: true,
                    planAutoRenew: true,
                    
                    // Billing
                    billingAddress: null,
                };
                await setDoc(ref, newUser);
                setAppUser(newUser);
            } else {
                const data = snap.data() as AppUser;
                // Backfill missing fields if necessary
                const updates: Partial<AppUser> = {};
                if (data.credits === undefined) updates.credits = 3;
                if (!data.email && user.email) updates.email = user.email;
                if (!data.plan) updates.plan = 'free';
                if (data.totalTransformations === undefined) updates.totalTransformations = 0;
                if (data.totalCreditsUsed === undefined) updates.totalCreditsUsed = 0;
                if (data.emailNotifications === undefined) updates.emailNotifications = true;
                if (data.planAutoRenew === undefined) updates.planAutoRenew = true;
                if (!data.updatedAt) updates.updatedAt = serverTimestamp();
                
                // Backfill firstName and lastName for existing users
                if (!data.firstName && !data.lastName && data.name) {
                    const nameParts = data.name.split(' ');
                    updates.firstName = nameParts[0] ?? null;
                    updates.lastName = nameParts.slice(1).join(' ') || null;
                } else if (!data.firstName && !data.lastName && user.displayName) {
                    const nameParts = user.displayName.split(' ');
                    updates.firstName = nameParts[0] ?? null;
                    updates.lastName = nameParts.slice(1).join(' ') || null;
                }
                
                updates.lastLoginAt = serverTimestamp();
                
                if (Object.keys(updates).length > 0) await updateDoc(ref, updates);
                setAppUser({ ...data, ...updates });
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const refreshUser = async () => {
        if (!firebaseUser) return;
        
        try {
            const ref = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data() as AppUser;
                setAppUser(data);
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    const value = useMemo<AuthContextValue>(() => ({
        firebaseUser,
        appUser,
        loading,
        signOutAsync: () => signOut(auth),
        refreshUser,
    }), [firebaseUser, appUser, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
