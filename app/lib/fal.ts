import { fal } from "@fal-ai/client";

if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY is missing from environment variables");
}

// Debug: Log FAL_KEY status in development
if (process.env.NODE_ENV === 'development') {
    console.log('🔑 FAL_KEY Status:', {
        exists: !!process.env.FAL_KEY,
        length: process.env.FAL_KEY?.length || 0,
        prefix: process.env.FAL_KEY ? `${process.env.FAL_KEY.substring(0, 15)}...` : 'Missing'
    });
}

// Configure fal client with API key
fal.config({ credentials: process.env.FAL_KEY });

export { fal };

// Types for NanoBanana API
export interface NanoBananaRequest {
    prompt: string;
    image_urls?: string[];
    num_images?: number;
    output_format?: 'png' | 'jpg' | 'webp';
}

export interface NanoBananaResponse {
    images: Array<{
        url: string;
        width: number;
        height: number;
    }>;
}

export interface QueueResponse {
    request_id: string;
    gateway_request_id: string;
}

export interface WebhookPayload {
    request_id: string;
    status: 'OK' | 'ERROR';
    payload?: NanoBananaResponse;
    error?: string;
}
