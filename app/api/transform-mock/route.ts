import { NextRequest, NextResponse } from "next/server";
import { hasEnoughCredits } from "@/app/lib/credits";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import crypto from "node:crypto";
import { TRANSFORMATION_STYLES } from "@/app/types";

// In-memory job storage (same as real transform route)
const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

// Mock transformed images (using existing images from your public folder)
const MOCK_IMAGES = [
    { url: "/images/after1.png" },
    { url: "/images/after2.png" },
    { url: "/images/after3.png" }
];

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const userId = String(form.get("userId") || "");
        const style = String(form.get("style") || "studio-white");
        const image = form.get("image");

        // Validate inputs
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (!(image instanceof File)) {
            return NextResponse.json({ error: "Image file is required" }, { status: 400 });
        }

        // Get user data and check credits
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = userSnap.data();
        const userCredits = userData.credits || 0;
        const requiredCredits = 1;

        if (!await hasEnoughCredits(userCredits, requiredCredits)) {
            return NextResponse.json({ 
                error: "Insufficient credits",
                credits: userCredits,
                required: requiredCredits
            }, { status: 402 });
        }

        // Get transformation style
        const transformationStyle = TRANSFORMATION_STYLES[style as keyof typeof TRANSFORMATION_STYLES] || TRANSFORMATION_STYLES['studio-white'];

        // Create mock original image URL (using existing image from public folder)
        const originalImageUrl = "/images/before1.jpeg";

        // Generate job ID
        const jobId = crypto.randomUUID();
        const request_id = `mock_${crypto.randomUUID()}`;

        // Set initial job status
        jobs.set(jobId, { 
            status: "QUEUED", 
            requestId: request_id,
            userId
        });

        // Create transformation record in Firestore
        const transformationData = {
            userId,
            status: 'processing' as const,
            
            // Images - using placeholder for original
            originalImageUrl: originalImageUrl,
            originalImagePath: `transformations/${userId}/${jobId}/original.${image.name.split('.').pop()}`,
            originalImageName: image.name,
            originalImageSize: image.size,
            
            transformedImageUrls: [],
            transformedImagePaths: [],
            
            // Transformation Details
            transformationType: style,
            transformationPrompt: transformationStyle.prompt,
            creditsUsed: requiredCredits,
            processingTime: 0,
            
            // API Details
            nanoBananaJobId: request_id,
            apiResponse: null,
            
            // Timestamps
            createdAt: serverTimestamp(),
            startedAt: serverTimestamp(),
            completedAt: null,
            failedAt: null,
            
            // Error Handling
            errorMessage: null,
            retryCount: 0,
        };

        const transformationRef = await addDoc(collection(db, 'transformations'), transformationData);

        // Update job storage with transformation ID
        jobs.set(jobId, { 
            status: "QUEUED", 
            requestId: request_id,
            transformationId: transformationRef.id,
            userId
        });

        // Simulate processing delay then complete
        setTimeout(async () => {
            // Update job to completed
            jobs.set(jobId, { 
                status: "SUCCEEDED", 
                requestId: request_id,
                images: MOCK_IMAGES,
                transformationId: transformationRef.id,
                userId
            });

            // Update transformation in Firestore
            const transformationUpdateRef = doc(db, 'transformations', transformationRef.id);
            await import('firebase/firestore').then(({ updateDoc, serverTimestamp }) => {
                return updateDoc(transformationUpdateRef, {
                    status: 'completed',
                    transformedImageUrls: MOCK_IMAGES.map(img => img.url),
                    apiResponse: { images: MOCK_IMAGES },
                    completedAt: serverTimestamp(),
                    processingTime: 5000, // 5 seconds
                });
            });

            // Deduct credits and update user stats
            const { deductCredits, updateTransformationStats } = await import('@/app/lib/credits');
            await deductCredits(userId, 1);
            await updateTransformationStats(userId);

            console.log(`Mock transformation ${jobId} completed`);
        }, 5000); // Complete after 5 seconds

        return NextResponse.json({ 
            jobId, 
            requestId: request_id,
            transformationId: transformationRef.id,
            style: transformationStyle.name,
            mock: true
        });

    } catch (error) {
        console.error('Mock Transform API Error:', error);
        return NextResponse.json({ 
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
