'use client';

import { useState, useEffect } from 'react';
import { JobStatus } from '@/app/types';

interface TransformationResultsProps {
    jobId: string | null;
    onComplete?: () => void;
}

export default function TransformationResults({ jobId, onComplete }: TransformationResultsProps) {
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    
                    if (data.status === 'SUCCEEDED' || data.status === 'FAILED') {
                        console.log('Job completed with status:', data.status);
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

    const downloadImage = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transformation Results</h2>

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F3DFF] mx-auto mb-4"></div>
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

            {jobStatus?.status === 'SUCCEEDED' && jobStatus.images && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-green-600 font-medium">✓ Transformation completed successfully!</p>
                        <span className="text-sm text-gray-500">
                            {jobStatus.images.length} variations generated
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {jobStatus.images.map((image, index) => (
                            <div key={index} className="group relative">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={image.url}
                                        alt={`Transformation ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
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
                                            className="bg-[#0F3DFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0d2fd8] transition-colors"
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
                                    setTimeout(() => {
                                        downloadImage(image.url, `transformation-${index + 1}.png`);
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
                    <p className="text-xs text-gray-600 font-mono">
                        Debug: Job ID: {jobId} | Status: {jobStatus.status} | Request ID: {jobStatus.requestId}
                    </p>
                </div>
            )}
        </div>
    );
}
