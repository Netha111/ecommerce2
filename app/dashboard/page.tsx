'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '../components/dashboard/ImageUpload';
import TransformationResults from '../components/dashboard/TransformationResults';
import CreditDisplay from '../components/dashboard/CreditDisplay';
import QuickActions from '../components/dashboard/QuickActions';
import Navigation from '../components/Navigation';
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
                    <Link href="/signin" className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e55a2b]">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Transform your product photos with AI</p>
                </div>

                {/* Quick Actions */}
                <QuickActions />

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <CreditDisplay showBuyButton={false} />

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