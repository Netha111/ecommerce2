'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Transformation } from '../../types';

export default function GalleryPage() {
    const { firebaseUser, appUser, loading } = useAuth();
    const router = useRouter();
    const [transformations, setTransformations] = useState<Transformation[]>([]);
    const [loadingTransformations, setLoadingTransformations] = useState(true);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!loading && !firebaseUser) {
            router.push('/signin');
        }
    }, [firebaseUser, loading, router]);

    // Load transformations
    useEffect(() => {
        if (appUser) {
            loadTransformations();
        }
    }, [appUser]);

    const loadTransformations = async () => {
        if (!appUser) return;

        try {
            const response = await fetch(`/api/transformations?userId=${appUser.uid}&limit=50`);
            const data = await response.json();

            if (response.ok) {
                setTransformations(data.transformations);
            } else {
                console.error('Failed to load transformations:', data.error);
            }
        } catch (error) {
            console.error('Error loading transformations:', error);
        } finally {
            setLoadingTransformations(false);
        }
    };

    const downloadImage = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Unknown';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#0F3DFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">S</span>
                                </div>
                                <span className="font-bold text-xl text-[#0F3DFF]">StyleForge AI</span>
                            </Link>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-600">Gallery</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/dashboard"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Dashboard
                            </Link>
                            <span className="text-gray-700">
                                {appUser?.credits || 0} credits
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Transformation Gallery</h1>
                    <p className="text-gray-600">View all your AI-transformed images</p>
                </div>

                {loadingTransformations ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F3DFF] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your transformations...</p>
                    </div>
                ) : transformations.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transformations yet</h3>
                        <p className="text-gray-600 mb-6">Start by uploading and transforming your first image</p>
                        <Link 
                            href="/dashboard"
                            className="bg-[#0F3DFF] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0d2fd8]"
                        >
                            Upload Images
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {transformations.map((transformation) => (
                            <div key={transformation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {transformation.originalImageName}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(transformation.createdAt)} • {transformation.transformationType}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            transformation.status === 'completed' 
                                                ? 'bg-green-100 text-green-800'
                                                : transformation.status === 'failed'
                                                ? 'bg-red-100 text-red-800'
                                                : transformation.status === 'processing'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {transformation.status}
                                        </div>
                                    </div>

                                    {transformation.status === 'completed' && transformation.transformedImageUrls.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Original Image */}
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Original</p>
                                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={transformation.originalImageUrl}
                                                        alt="Original"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Transformed Images */}
                                            {transformation.transformedImageUrls.map((url, index) => (
                                                <div key={index} className="space-y-2">
                                                    <p className="text-sm font-medium text-gray-700">Variation {index + 1}</p>
                                                    <div className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                        <img
                                                            src={url}
                                                            alt={`Transformation ${index + 1}`}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                                                                <button
                                                                    onClick={() => downloadImage(url, `${transformation.originalImageName}-variation-${index + 1}.png`)}
                                                                    className="bg-white text-gray-900 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
                                                                >
                                                                    Download
                                                                </button>
                                                                <button
                                                                    onClick={() => window.open(url, '_blank')}
                                                                    className="bg-[#0F3DFF] text-white px-3 py-1 rounded text-sm font-medium hover:bg-[#0d2fd8]"
                                                                >
                                                                    View
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : transformation.status === 'failed' ? (
                                        <div className="text-center py-8">
                                            <p className="text-red-600">Transformation failed</p>
                                            {transformation.errorMessage && (
                                                <p className="text-sm text-gray-600 mt-2">{transformation.errorMessage}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0F3DFF] mx-auto"></div>
                                            <p className="text-gray-600 mt-2">Processing...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
