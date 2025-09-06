import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const imageUrl = url.searchParams.get('url');
        
        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        // Validate that the URL is from fal.ai to prevent abuse
        if (!imageUrl.includes('fal.media')) {
            return NextResponse.json({ error: 'Only fal.ai images are allowed' }, { status: 403 });
        }

        console.log('Proxying image:', imageUrl);

        // Fetch the image from fal.ai
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'StyleForge-AI-Proxy/1.0',
                'Accept': 'image/*',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch image:', response.status, response.statusText);
            return NextResponse.json(
                { error: `Failed to fetch image: ${response.status}` }, 
                { status: response.status }
            );
        }

        // Get the image data
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';

        console.log('Image fetched successfully:', {
            size: imageBuffer.byteLength,
            contentType: contentType
        });

        // Return the image with proper headers
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error) {
        console.error('Image proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy image' }, 
            { status: 500 }
        );
    }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
