'use client';

import { useState, useEffect } from 'react';
import { JobStatus } from '@/app/types';
import { markTransformationFailed } from '@/app/lib/imageStorage';
import { persistTransformationToGallery } from '@/app/lib/imagePersistence';
import { useAuth } from '@/app/context/AuthContext';

interface TransformationResultsProps {
    jobId: string | null;
    onComplete?: () => void;
}

export default function TransformationResults({ jobId, onComplete }: TransformationResultsProps) {
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: number]: boolean }>({});
    const { refreshUser } = useAuth();

    // Proper gallery persistence - download and store images permanently
    const saveToGalleryPermanently = async (transformationId: string, images: any[], userId: string) => {
        try {
            console.log('🏛️ Persisting transformation to gallery permanently...');
            await persistTransformationToGallery(transformationId, images, userId);
            console.log('✅ Transformation persisted to gallery successfully');
        } catch (error) {
            console.error('❌ Failed to persist to gallery:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (!jobId) {
            setJobStatus(null);
            return;
        }

        setLoading(true);
        setError(null);

        const pollJob = async () => {
            try {
                console.log('Polling job status for:', jobId);
                const response = await fetch(`/api/jobs/${jobId}`);
                const data = await response.json();
                console.log('Job status response:', data);

                if (response.ok) {
                    setJobStatus(data);
                    
                    if (data.status === 'SUCCEEDED') {
                        console.log('🎉 Job completed successfully:', data.status);
                        
                        // Proper gallery persistence - download and store images permanently
                        if (data.transformationId && data.images && data.images.length > 0) {
                            try {
                                await saveToGalleryPermanently(
                                    data.transformationId,
                                    data.images,
                                    data.userId
                                );
                            } catch (error) {
                                console.error('❌ Failed to persist to gallery:', error);
                                // Don't fail the entire process if gallery save fails
                                // The images are still displayed to the user
                            }
                        }
                        
                        // Refresh user data to update credits
                        await refreshUser();
                        
                        setLoading(false);
                        if (onComplete) onComplete();
                        return;
                    } else if (data.status === 'FAILED') {
                        console.log('Job failed:', data.status);
                        
                        // Mark transformation as failed
                        if (data.transformationId) {
                            try {
                                await markTransformationFailed(
                                    data.transformationId,
                                    data.error || 'Transformation failed'
                                );
                            } catch (error) {
                                console.error('❌ Failed to mark transformation as failed:', error);
                            }
                        }
                        
                        setLoading(false);
                        if (onComplete) onComplete();
                        return;
                    }
                } else {
                    console.error('Job status error:', data);
                    setError(data.error || 'Failed to get job status');
                    setLoading(false);
                    return;
                }

                // Continue polling if still processing
                console.log('Continuing to poll, current status:', data.status);
                setTimeout(pollJob, 2000);
            } catch (err) {
                console.error('Polling error:', err);
                setError('Failed to check job status');
                setLoading(false);
            }
        };

        pollJob();
    }, [jobId, onComplete]);

    if (!jobId) return null;

    const downloadImage = async (url: string, filename: string) => {
        try {
            console.log('Starting download for:', url);
            
            // Use our proxy to fetch the image (to handle CORS)
            const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status}`);
            }
            
            const blob = await response.blob();
            console.log('Image blob created:', blob.type, blob.size);
            
            // Create blob URL and download
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up blob URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            
            console.log('Download initiated successfully');
            
        } catch (error) {
            console.error('Download failed:', error);
            console.log('Falling back to opening in new tab');
            
            // Fallback: open direct URL in new tab
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transformation Results</h2>

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {jobStatus?.status === 'QUEUED' ? 'Queued for processing...' : 'Transforming your image...'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">This usually takes 30-60 seconds</p>
                </div>
            )}

            {error && (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="text-red-600 font-medium mb-2">Transformation Failed</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            )}

            {jobStatus?.status === 'FAILED' && (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="text-red-600 font-medium mb-2">Transformation Failed</p>
                    <p className="text-gray-600">{jobStatus.error || 'An error occurred during processing'}</p>
                </div>
            )}

            {jobStatus?.status === 'SUCCEEDED' && jobStatus.images && jobStatus.images.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-green-600 font-medium">✓ Transformation completed successfully!</p>
                        <span className="text-sm text-gray-500">
                            {jobStatus.images.length} {jobStatus.images.length === 1 ? 'variation' : 'variations'} generated
                        </span>
                    </div>

                    <div className={`grid gap-6 ${jobStatus.images.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
                        {jobStatus.images.map((image, index) => (
                            <div key={index} className="group relative">
                                <div className="bg-gray-100 rounded-lg overflow-hidden relative" style={{ minHeight: '300px' }}>
                                    {/* Loading state */}
                                    {imageLoadingStates[index] === true && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto mb-2"></div>
                                                <p className="text-sm text-gray-600">Loading image...</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Image display with multiple fallback strategies */}
                                    <img
                                        src={`/api/image-proxy?url=${encodeURIComponent(image.url)}`}
                                        alt={`Transformation ${index + 1}`}
                                        className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                                        loading="eager"
                                        onLoadStart={() => {
                                            console.log('🖼️ Image load started via proxy:', image.url);
                                            setImageLoadingStates(prev => ({ ...prev, [index]: true }));
                                        }}
                                        onError={(e) => {
                                            console.error('❌ Proxied image failed to load:', image.url);
                                            console.log('🔄 Trying direct URL as fallback...');
                                            
                                            // Fallback to direct URL
                                            const img = e.currentTarget as HTMLImageElement;
                                            img.src = image.url;
                                            img.crossOrigin = 'anonymous';
                                            
                                            // If direct URL also fails, show error
                                            img.onerror = () => {
                                                console.error('❌ Direct URL also failed:', image.url);
                                                setImageLoadingStates(prev => ({ ...prev, [index]: false }));
                                                img.style.display = 'none';
                                                
                                                // Show error message with retry button
                                                const errorDiv = document.createElement('div');
                                                errorDiv.className = 'flex items-center justify-center h-full text-red-500 bg-red-50 rounded';
                                                errorDiv.style.minHeight = '300px';
                                                errorDiv.innerHTML = `
                                                    <div class="text-center p-4">
                                                        <p class="font-medium">Failed to load image</p>
                                                        <p class="text-sm mt-2">Click "View Full" to open in new tab</p>
                                                        <button 
                                                            onclick="window.open('${image.url}', '_blank')"
                                                            class="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                                        >
                                                            Open Direct URL
                                                        </button>
                                                    </div>
                                                `;
                                                img.parentNode?.appendChild(errorDiv);
                                            };
                                        }}
                                        onLoad={(e) => {
                                            console.log('✅ Image loaded successfully via proxy:', image.url);
                                            const img = e.currentTarget as HTMLImageElement;
                                            console.log('📐 Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
                                            setImageLoadingStates(prev => ({ ...prev, [index]: false }));
                                        }}
                                        style={{ 
                                            backgroundColor: 'white',
                                            minHeight: '300px',
                                            maxWidth: '100%',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                                
                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                                        <button
                                            onClick={() => downloadImage(image.url, `transformation-${index + 1}.png`)}
                                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Download
                                        </button>
                                        <button
                                            onClick={() => window.open(image.url, '_blank')}
                                            className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                                        >
                                            View Full
                                        </button>
                                    </div>
                                </div>

                                {/* Variation label */}
                                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                    Variation {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bulk actions */}
                    <div className="mt-6 flex items-center justify-center space-x-4">
                        <button
                            onClick={() => {
                                jobStatus.images?.forEach((image, index) => {
                                    setTimeout(async () => {
                                        await downloadImage(image.url, `transformation-${index + 1}.png`);
                                    }, index * 500);
                                });
                            }}
                            className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                        >
                            Download All
                        </button>
                    </div>
                </div>
            )}

            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && jobStatus && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-mono mb-2">
                        Debug: Job ID: {jobId} | Status: {jobStatus.status} | Request ID: {jobStatus.requestId}
                    </p>
                    <p className="text-xs text-gray-600 font-mono mb-2">
                        Images Count: {jobStatus.images?.length || 0}
                    </p>
                    {jobStatus.images && jobStatus.images.length > 0 && (
                        <div className="text-xs text-gray-600 font-mono">
                            <p>Image URLs:</p>
                            {jobStatus.images.map((img, idx) => (
                                <div key={idx} className="mb-2 p-2 bg-white rounded border">
                                    <p className="font-semibold">Image {idx + 1}:</p>
                                    <p className="text-xs text-gray-600 mb-1">Original URL:</p>
                                    <p className="break-all text-blue-600 text-xs mb-2">{img.url}</p>
                                    <p className="text-xs text-gray-600 mb-1">Proxied URL:</p>
                                    <p className="break-all text-green-600 text-xs mb-2">/api/image-proxy?url={encodeURIComponent(img.url)}</p>
                                    <p>Loading State: {imageLoadingStates[idx] === true ? 'Loading...' : imageLoadingStates[idx] === false ? 'Loaded/Error' : 'Not started'}</p>
                                    {img.width && img.height && (
                                        <p>Dimensions: {img.width} x {img.height}</p>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => window.open(img.url, '_blank')}
                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                        >
                                            Test Original
                                        </button>
                                        <button 
                                            onClick={() => window.open(`/api/image-proxy?url=${encodeURIComponent(img.url)}`, '_blank')}
                                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                        >
                                            Test Proxy
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {jobStatus.transformation && (
                        <details className="mt-2">
                            <summary className="text-xs text-gray-600 cursor-pointer">Full Response Data</summary>
                            <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-40">
                                {JSON.stringify(jobStatus, null, 2)}
                            </pre>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
}
