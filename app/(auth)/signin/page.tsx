'use client';

import { FormEvent, useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { firebaseUser, loading: authLoading } = useAuth();
    const router = useRouter();

    // Redirect if already signed in
    useEffect(() => {
        if (!authLoading && firebaseUser) {
            router.push('/dashboard');
        }
    }, [firebaseUser, authLoading, router]);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect will happen automatically via useEffect
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Sign in</h1>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="submit" disabled={loading} className="w-full bg-[#0F3DFF] text-white py-3 rounded-lg font-medium hover:bg-[#0d2fd8] disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
                <p className="text-sm text-gray-600 mt-4">No account? <Link href="/signup" className="text-[#0F3DFF]">Create one</Link></p>
            </div>
        </main>
    );
}
