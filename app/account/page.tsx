'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function AccountPage() {
    const { firebaseUser, appUser, loading } = useAuth();

    if (loading) return <main className="min-h-screen flex items-center justify-center">Loading…</main>;
    if (!firebaseUser) return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-gray-700 mb-4">You need to sign in to view your account.</p>
                <Link className="inline-block bg-[#0F3DFF] text-white px-6 py-3 rounded-lg" href="/signin">Sign in</Link>
            </div>
        </main>
    );

    return (
        <main className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{appUser?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Credits</p>
                        <p className="text-gray-900">{appUser?.credits ?? 0}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
