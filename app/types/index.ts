// Transformation types
export interface Transformation {
    id: string;
    userId: string;
    status: 'processing' | 'completed' | 'failed' | 'cancelled';
    
    // Images
    originalImageUrl: string;
    originalImagePath: string;
    originalImageName: string;
    originalImageSize: number;
    
    transformedImageUrls: string[];
    transformedImagePaths: string[];
    
    // Transformation Details
    transformationType: string;
    transformationPrompt: string;
    creditsUsed: number;
    processingTime: number;
    
    // API Details
    nanoBananaJobId: string | null;
    apiResponse: any;
    
    // Timestamps
    createdAt: any;
    startedAt: any | null;
    completedAt: any | null;
    failedAt: any | null;
    
    // Error Handling
    errorMessage: string | null;
    retryCount: number;
}

// Job status for in-memory storage (temporary)
export interface JobStatus {
    status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    requestId?: string;
    images?: Array<{ url: string }>;
    error?: string;
}

// Upload response
export interface UploadResponse {
    jobId: string;
    requestId: string;
}

// Transformation styles
export const TRANSFORMATION_STYLES = {
    'studio-white': {
        name: 'Studio White Background',
        prompt: 'professional studio white background, catalog photography, soft shadows, high key lighting, ecommerce product photo',
        description: 'Clean white background perfect for e-commerce'
    },
    'lifestyle': {
        name: 'Lifestyle Setting',
        prompt: 'lifestyle product photography, natural setting, soft natural lighting, modern interior',
        description: 'Natural lifestyle environment'
    },
    'luxury': {
        name: 'Luxury Showcase',
        prompt: 'luxury product photography, premium background, dramatic lighting, high-end commercial style',
        description: 'Premium luxury presentation'
    },
    'minimal': {
        name: 'Minimal Clean',
        prompt: 'minimal clean background, soft gradient, modern aesthetic, product focus',
        description: 'Simple and clean minimal style'
    }
} as const;

export type TransformationStyleKey = keyof typeof TRANSFORMATION_STYLES;
