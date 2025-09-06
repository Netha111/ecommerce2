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
    name: 'E-Commerce Catalog with Model',
    prompt: `
Transform this product photo into a professional e-commerce catalog image worn naturally by the correct type of human model:  
- If children's clothing → a realistic child model of appropriate age.  
- If women’s clothing → a realistic female model.  
- If men’s clothing → a realistic male model.  

Ensure the model looks natural and photorealistic, with accurate fabric fit and texture preserved.  
- Shirts/tops → show the model in ¾ body framing (waist-up), highlighting the upper body while keeping part of the lower body for balance.  
- Pants/shorts → show the model in ¾ body framing (knee-up), highlighting the lower body while including some upper body for realism.  
- Dresses/outfits → show the full body in a clean front view.  

Background: clean studio white seamless, soft even lighting, no harsh shadows.  
Style: professional fashion photography, catalog-ready, natural skin tones, realistic proportions, commercial product presentation.`,
    description: 'Professional catalog photo with correct human model'
},

'lifestyle': {
    name: 'Lifestyle Setting',
    prompt: `
Transform this product photo into a natural lifestyle image worn or placed in a realistic everyday environment.  
Select the correct human model type based on the product:  
- Children’s clothes → a child model in a playful or casual lifestyle scene.  
- Women’s clothing → a female model in a modern home, café, or outdoor setting.  
- Men’s clothing → a male model in an urban, office, or casual lifestyle scene.  

Ensure realistic fit and natural posing.  
- Shirts/tops → ¾ body (waist-up), upper body in focus but some lower body visible.  
- Pants/shorts → ¾ body (knee-up), lower body emphasized with upper body still present.  
- Dresses/outfits → full body shown naturally.  

Background: modern interiors, natural daylight, or subtle lifestyle context.  
Style: authentic, warm tones, lifestyle fashion photography.`,
    description: 'Natural lifestyle environment with realistic model'
},

'luxury': {
    name: 'Luxury Showcase',
    prompt: `
Transform this product photo into a luxury fashion showcase worn by the correct type of model:  
- Child clothing → child model in premium boutique-style shoot.  
- Women’s clothing → elegant female model styled like a luxury fashion brand.  
- Men’s clothing → sophisticated male model styled in a premium fashion ad.  

Clothing should appear perfectly fitted, with textures and details highlighted.  
- Shirts/tops → ¾ body (waist-up), focus on upper body with elegant framing.  
- Pants/shorts → ¾ body (knee-up), focus on lower body with refined styling.  
- Dresses/outfits → full body with luxury posing.  

Background: dramatic, premium backdrops (dark tones, textured walls, luxury studio lighting).  
Style: high-end editorial, fashion magazine aesthetic, dramatic lighting.`,
    description: 'Premium luxury presentation with fashion model'
},

'minimal': {
    name: 'Minimal Clean',
    prompt: `
Transform this product into a minimal clean presentation with the correct type of model:  
- Children’s clothes → child model in simple clean minimal setup.  
- Women’s clothing → female model styled with minimalist elegance.  
- Men’s clothing → male model with neutral, clean styling.  

Ensure clothing fit is accurate and natural.  
- Shirts/tops → ¾ body (waist-up), upper body emphasized with balance.  
- Pants/shorts → ¾ body (knee-up), lower body emphasized with balance.  
- Dresses/outfits → full body in clean minimalist pose.  

Background: soft gradient or neutral tones, subtle shadows, minimalist photography.  
Style: simple, clean, geometric, contemporary fashion catalog aesthetic.`,
    description: 'Minimal clean catalog style with model'
}

} as const;

export type TransformationStyleKey = keyof typeof TRANSFORMATION_STYLES;
