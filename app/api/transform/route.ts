import { NextRequest, NextResponse } from "next/server";
import { fal } from "@/app/lib/fal";
import { hasEnoughCredits } from "@/app/lib/credits";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import crypto from "node:crypto";
import { TRANSFORMATION_STYLES } from "@/app/types";

// In-memory job storage (replace with Redis/DB in production)
const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

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

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (image.size > maxSize) {
            return NextResponse.json({ error: "File size too large. Maximum 10MB allowed." }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(image.type)) {
            return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 });
        }

        // Get user data and check credits
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = userSnap.data();
        const userCredits = userData.credits || 0;
        const requiredCredits = 1; // Each transformation costs 1 credit (single image for testing)

        if (!await hasEnoughCredits(userCredits, requiredCredits)) {
            return NextResponse.json({ 
                error: "Insufficient credits",
                credits: userCredits,
                required: requiredCredits
            }, { status: 402 });
        }

        // Get transformation style
        const transformationStyle = TRANSFORMATION_STYLES[style as keyof typeof TRANSFORMATION_STYLES] || TRANSFORMATION_STYLES['studio-white'];

        // Debug: Log API key status
        console.log('Transform API - FAL_KEY Status:', {
            exists: !!process.env.FAL_KEY,
            length: process.env.FAL_KEY?.length || 0
        });

        // Upload file to fal storage
        console.log('Uploading file to fal storage...');
        const imageUrl = await fal.storage.upload(image);
        console.log('File uploaded successfully:', imageUrl);

        // Generate job ID
        const jobId = crypto.randomUUID();
        jobs.set(jobId, { status: "QUEUED" });

        // Create webhook URL
        const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL}/api/fal/webhook?jobId=${jobId}`;
        console.log('Webhook URL:', webhookUrl);

        // Submit job to fal queue
        console.log('Submitting to fal queue with payload:', {
            model: "fal-ai/nano-banana/edit",
            prompt: transformationStyle.prompt,
            num_images: 3
        });

        // Use NanoBanana edit model as specified in the setup guide
        console.log('🎨 Submitting to fal with image URL:', imageUrl);
        const { request_id } = await fal.queue.submit("fal-ai/nano-banana/edit", {
            input: {
                prompt: transformationStyle.prompt,
                image_urls: [imageUrl], // Array of image URLs as per setup guide
                num_images: 1, // Single image for testing to save credits
                output_format: "png",
            },
            webhookUrl: webhookUrl, // Use webhook for reliable results
        });

        console.log('Job submitted successfully with request_id:', request_id);

        // Create transformation record in Firestore
        const transformationData = {
            userId,
            status: 'processing' as const,
            
            // Images
            originalImageUrl: imageUrl,
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
            userId,
            startTime: Date.now() // For processing time calculation
        });

        return NextResponse.json({ 
            jobId, 
            requestId: request_id,
            transformationId: transformationRef.id,
            style: transformationStyle.name
        });

    } catch (error) {
        console.error('Transform API Error:', error);
        return NextResponse.json({ 
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
