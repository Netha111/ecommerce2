'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '../components/dashboard/ImageUpload';
import TransformationResults from '../components/dashboard/TransformationResults';
import { TransformationStyleKey } from '../types';

export default function DashboardPage() {
    const { firebaseUser, appUser, loading, signOutAsync } = useAuth();
    const router = useRouter();
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!loading && !firebaseUser) {
            router.push('/signin');
        }
    }, [firebaseUser, loading, router]);

    const handleImageUpload = async (file: File, style: TransformationStyleKey) => {
        if (!appUser) return;

        setIsProcessing(true);
        setCurrentJobId(null);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('userId', appUser.uid);
            formData.append('style', style);

            // Using real fal.ai API now that credits are available
            // Switch back to '/api/transform-mock' if you need to test without credits
            const response = await fetch('/api/transform', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentJobId(data.jobId);
            } else {
                alert(data.error || 'Failed to start transformation');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
            setIsProcessing(false);
        }
    };

    const handleTransformationComplete = () => {
        setIsProcessing(false);
        // Don't refresh the page - this breaks the results display
        // Instead, we'll update the user data in context
        console.log('Transformation completed successfully');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F3DFF] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show signin prompt if not authenticated
    if (!firebaseUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Please sign in</h1>
                    <Link href="/signin" className="bg-[#0F3DFF] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0d2fd8]">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#0F3DFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="font-bold text-xl text-[#0F3DFF]">StyleForge AI</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/dashboard/gallery"
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Gallery
                            </Link>
                            <span className="text-gray-700">
                                Welcome, {appUser?.name || appUser?.email || 'User'}!
                            </span>
                            <button 
                                onClick={signOutAsync}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Transform your product photos with AI</p>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-[#0F3DFF] bg-opacity-10 rounded-lg">
                                <svg className="w-6 h-6 text-[#0F3DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Available Credits</p>
                                <p className="text-2xl font-bold text-gray-900">{appUser?.credits || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-[#FF6B35] bg-opacity-10 rounded-lg">
                                <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Transformations</p>
                                <p className="text-2xl font-bold text-gray-900">{appUser?.totalTransformations || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-500 bg-opacity-10 rounded-lg">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                                <p className="text-2xl font-bold text-gray-900 capitalize">{appUser?.plan || 'Free'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <ImageUpload
                    onUpload={handleImageUpload}
                    isProcessing={isProcessing}
                    userCredits={appUser?.credits || 0}
                />

                {/* Transformation Results */}
                <TransformationResults
                    jobId={currentJobId}
                    onComplete={handleTransformationComplete}
                />

                {/* Buy Credits Section */}
                {appUser?.credits === 0 && (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Need More Credits?</h2>
                        <p className="text-gray-600 mb-6">
                            You've used all your free credits. Purchase more to continue transforming images.
                        </p>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#FF6B35] transition-colors cursor-pointer">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Buy Credits</h3>
                            <p className="text-gray-600">Purchase more credits for transformations</p>
                            <p className="text-sm text-gray-500 mt-2">Coming soon in Phase 3</p>
                        </div>
                    </div>
                )}

                {/* User Info (for testing) */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information (Debug)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p><span className="font-medium">User ID:</span> {appUser?.uid}</p>
                            <p><span className="font-medium">Email:</span> {appUser?.email}</p>
                            <p><span className="font-medium">Name:</span> {appUser?.name || 'Not set'}</p>
                            <p><span className="font-medium">Plan:</span> {appUser?.plan}</p>
                        </div>
                        <div>
                            <p><span className="font-medium">Credits:</span> {appUser?.credits}</p>
                            <p><span className="font-medium">Total Transformations:</span> {appUser?.totalTransformations}</p>
                            <p><span className="font-medium">Email Notifications:</span> {appUser?.emailNotifications ? 'Yes' : 'No'}</p>
                            <p><span className="font-medium">Auto Renew:</span> {appUser?.planAutoRenew ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}