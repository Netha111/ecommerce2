'use client';

import { FormEvent, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6;
    };

    const validateName = (name: string) => {
        return name.trim().length >= 2;
    };

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validation
        if (!validateName(firstName)) {
            setError('First name must be at least 2 characters long');
            setLoading(false);
            return;
        }

        if (!validateName(lastName)) {
            setError('Last name must be at least 2 characters long');
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`;
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: fullName });
            // Redirect will happen automatically via useEffect
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="font-bold text-2xl text-[#2D3748]">StyleForge AI</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[#2D3748] mb-2">Create your account</h1>
                        <p className="text-gray-600">Get started with AI-powered image transformations</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="First name" 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)} 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Last name" 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)} 
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors" 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                <input 
                                    type="password" 
                                    required 
                                    placeholder="Create a password (min 6 characters)" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                                <input 
                                    type="password" 
                                    required 
                                    placeholder="Confirm your password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors" 
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-medium hover:bg-[#e55a2b] disabled:opacity-60 transition-colors"
                            >
                                {loading ? 'Creating account…' : 'Create account'}
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-[#FF6B35] hover:text-[#e55a2b] font-medium transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
