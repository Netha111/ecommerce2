'use client';

import { useState } from 'react';

export default function TestTransformPage() {
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testMockTransform = async () => {
        setLoading(true);
        try {
            // Create a simple test file
            const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            
            const formData = new FormData();
            formData.append('image', testFile);
            formData.append('userId', 'test-user-123');
            formData.append('style', 'studio-white');

            const response = await fetch('/api/transform-mock', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Transform response:', data);

            if (response.ok) {
                setJobId(data.jobId);
                startPolling(data.jobId);
            } else {
                console.error('Transform failed:', data);
            }
        } catch (error) {
            console.error('Transform error:', error);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (id: string) => {
        const poll = async () => {
            try {
                const response = await fetch(`/api/jobs/${id}`);
                const data = await response.json();
                console.log('Poll response:', data);
                
                setJobStatus(data);
                
                if (data.status === 'SUCCEEDED' || data.status === 'FAILED') {
                    console.log('Polling complete');
                    return;
                }
                
                setTimeout(poll, 2000);
            } catch (error) {
                console.error('Poll error:', error);
            }
        };
        
        poll();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Transform API Test</h1>
                
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">Test Mock Transform</h2>
                    <button
                        onClick={testMockTransform}
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Testing...' : 'Test Mock Transform'}
                    </button>
                </div>

                {jobId && (
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h2 className="text-lg font-semibold mb-4">Job Status</h2>
                        <p><strong>Job ID:</strong> {jobId}</p>
                        <p><strong>Status:</strong> {jobStatus?.status || 'Loading...'}</p>
                        
                        {jobStatus?.images && (
                            <div className="mt-4">
                                <h3 className="font-medium mb-2">Generated Images:</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {jobStatus.images.map((image: any, index: number) => (
                                        <div key={index} className="border rounded p-2">
                                            <img 
                                                src={image.url} 
                                                alt={`Result ${index + 1}`}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                            <p className="text-sm text-gray-600 mt-1">Image {index + 1}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Debug Info</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify({ jobId, jobStatus }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
