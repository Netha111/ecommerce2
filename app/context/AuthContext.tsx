'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

export type AppUser = {
    uid: string;
    email: string | null;
    name: string | null;
    photoURL: string | null;
    credits: number;
    createdAt?: unknown;
    plan?: 'free' | 'pro' | 'enterprise';
};

type AuthContextValue = {
    firebaseUser: User | null;
    appUser: AppUser | null;
    loading: boolean;
    signOutAsync: () => Promise<void>;
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
                const newUser: AppUser = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName ?? null,
                    photoURL: user.photoURL ?? null,
                    credits: 3,
                    createdAt: serverTimestamp(),
                    plan: 'free',
                };
                await setDoc(ref, newUser);
                setAppUser(newUser);
            } else {
                const data = snap.data() as AppUser;
                // Backfill missing fields if necessary
                const updates: Partial<AppUser> = {};
                if (data.credits === undefined) updates.credits = 3;
                if (!data.email && user.email) updates.email = user.email;
                if (Object.keys(updates).length > 0) await updateDoc(ref, updates);
                setAppUser({ ...data, ...updates });
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        firebaseUser,
        appUser,
        loading,
        signOutAsync: () => signOut(auth),
    }), [firebaseUser, appUser, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
