import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// In-memory job storage (same as other routes)
const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

export async function GET(_: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
    try {
        const { jobId } = await params;
        
        // Get job status from memory
        const jobData = jobs.get(jobId);
        if (!jobData) {
            return NextResponse.json({ status: "NOT_FOUND" }, { status: 404 });
        }

        // If job is still queued, try to check fal.ai status directly
        if (jobData.status === 'QUEUED' && jobData.requestId) {
            try {
                const { fal } = await import('@/app/lib/fal');
                const result = await fal.queue.status('fal-ai/nano-banana/edit', {
                    requestId: jobData.requestId
                });
                
                console.log('Direct fal.ai status check:', result);
                
                // If completed, get the result
                if (result.status === 'COMPLETED') {
                    const finalResult = await fal.queue.result('fal-ai/nano-banana/edit', {
                        requestId: jobData.requestId
                    });
                    
                    console.log('Direct fal.ai result:', finalResult);
                    
                    // Update job status
                    jobs.set(jobId, {
                        ...jobData,
                        status: 'SUCCEEDED',
                        images: finalResult.images || []
                    });
                    
                    // Update Firestore and deduct credits
                    if (jobData.transformationId && jobData.userId) {
                        const transformationRef = doc(db, 'transformations', jobData.transformationId);
                        const { updateDoc, serverTimestamp } = await import('firebase/firestore');
                        await updateDoc(transformationRef, {
                            status: 'completed',
                            transformedImageUrls: finalResult.images?.map((img: any) => img.url) || [],
                            apiResponse: finalResult,
                            completedAt: serverTimestamp(),
                        });
                        
                        // Deduct credits and update user stats
                        const { deductCredits, updateTransformationStats } = await import('@/app/lib/credits');
                        await deductCredits(jobData.userId, 1); // 1 credit for 1 image
                        await updateTransformationStats(jobData.userId);
                        
                        console.log('✅ Credits deducted and stats updated');
                    }
                    
                    return NextResponse.json({
                        ...jobData,
                        status: 'SUCCEEDED',
                        images: finalResult.images || []
                    });
                }
            } catch (error) {
                console.log('Direct status check failed:', error);
                // Continue with normal flow
            }
        }

        // If we have transformation ID, get full data from Firestore
        if (jobData.transformationId) {
            const transformationRef = doc(db, 'transformations', jobData.transformationId);
            const transformationSnap = await getDoc(transformationRef);
            
            if (transformationSnap.exists()) {
                const transformationData = transformationSnap.data();
                
                // Extract images from nested API response if available
                let images: any[] = [];
                if (transformationData.apiResponse?.data?.images) {
                    images = transformationData.apiResponse.data.images;
                } else if (transformationData.transformedImageUrls) {
                    images = transformationData.transformedImageUrls.map((url: string) => ({ url }));
                }
                
                // Return the proper format expected by the UI
                return NextResponse.json({
                    status: transformationData.status === 'completed' ? 'SUCCEEDED' : 
                           transformationData.status === 'failed' ? 'FAILED' : 'QUEUED',
                    requestId: jobData.requestId || transformationData.nanoBananaJobId,
                    transformationId: transformationSnap.id,
                    userId: transformationData.userId,
                    images: images,
                    transformation: {
                        id: transformationSnap.id,
                        ...transformationData
                    }
                });
            }
        }

        return NextResponse.json(jobData);

    } catch (error) {
        console.error('Get job error:', error);
        return NextResponse.json({ 
            status: "ERROR",
            error: "Internal server error" 
        }, { status: 500 });
    }
}
