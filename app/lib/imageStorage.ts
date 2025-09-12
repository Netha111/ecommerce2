import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface ImageData {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
}

export interface TransformationData {
  id: string;
  userId: string;
  status: 'processing' | 'completed' | 'failed';
  originalImageUrl: string;
  originalImageName: string;
  transformedImageUrls: string[];
  transformationType: string;
  createdAt: any;
  completedAt?: any;
  errorMessage?: string;
}

/**
 * Save transformation results to Firestore
 */
export async function saveTransformationResults(
  transformationId: string,
  images: ImageData[],
  userId: string
): Promise<void> {
  try {
    console.log('💾 Saving transformation results:', { transformationId, imageCount: images.length, userId });
    
    const transformationRef = doc(db, 'transformations', transformationId);
    
    // Check if document exists first
    const { getDoc } = await import('firebase/firestore');
    const docSnap = await getDoc(transformationRef);
    
    if (!docSnap.exists()) {
      console.error('❌ Transformation document does not exist:', transformationId);
      // Try to create it as a fallback
      await createTransformationDocument(transformationId, images, userId);
      return;
    }
    
    const imageUrls = images.map(img => img.url).filter(url => url); // Filter out undefined URLs
    
    // Create comprehensive update object
    const updateData: any = {
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      savedToGallery: true,
      savedToGalleryAt: serverTimestamp(),
    };
    
    // Only add transformedImageUrls if we have valid URLs
    if (imageUrls.length > 0) {
      updateData.transformedImageUrls = imageUrls;
    }
    
    // Only add imageMetadata if we have valid images with metadata
    const validMetadata = images
      .filter(img => img.url) // Only include images with valid URLs
      .map(img => ({
        url: img.url,
        ...(img.width && { width: img.width }),
        ...(img.height && { height: img.height }),
        ...(img.size && { size: img.size }),
        ...(img.format && { format: img.format })
      }));
    
    if (validMetadata.length > 0) {
      updateData.imageMetadata = validMetadata;
    }
    
    await updateDoc(transformationRef, updateData);
    console.log('✅ Transformation results saved successfully');

  } catch (error) {
    console.error('❌ Error saving transformation results:', error);
    throw error;
  }
}

// Fallback function to create transformation document if it doesn't exist
async function createTransformationDocument(
  transformationId: string,
  images: ImageData[],
  userId: string
): Promise<void> {
  try {
    console.log('🔄 Creating missing transformation document:', transformationId);
    
    const { setDoc } = await import('firebase/firestore');
    const transformationRef = doc(db, 'transformations', transformationId);
    
    const imageUrls = images.map(img => img.url).filter(url => url);
    
    const newTransformationData = {
      userId,
      status: 'completed',
      transformedImageUrls: imageUrls,
      imageMetadata: images
        .filter(img => img.url)
        .map(img => ({
          url: img.url,
          ...(img.width && { width: img.width }),
          ...(img.height && { height: img.height }),
          ...(img.size && { size: img.size }),
          ...(img.format && { format: img.format })
        })),
      createdAt: serverTimestamp(),
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdAsFallback: true,
    };

    await setDoc(transformationRef, newTransformationData);
    console.log('✅ Fallback transformation document created');
    
  } catch (error) {
    console.error('❌ Error creating fallback transformation document:', error);
    throw error;
  }
}

/**
 * Mark transformation as failed
 */
export async function markTransformationFailed(
  transformationId: string,
  errorMessage: string
): Promise<void> {
  try {
    const transformationRef = doc(db, 'transformations', transformationId);
    
    // Check if document exists first
    const { getDoc } = await import('firebase/firestore');
    const docSnap = await getDoc(transformationRef);
    
    if (!docSnap.exists()) {
      console.error('Transformation document does not exist:', transformationId);
      return;
    }
    
    await updateDoc(transformationRef, {
      status: 'failed',
      errorMessage: errorMessage || 'Unknown error occurred',
      failedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

  } catch (error) {
    console.error('Error marking transformation as failed:', error);
    throw error;
  }
}

/**
 * Get user's transformation history
 */
export async function getUserTransformations(userId: string, limit: number = 50): Promise<TransformationData[]> {
  try {
    const response = await fetch(`/api/transformations?userId=${userId}&limit=${limit}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch transformations');
    }
    
    return data.transformations || [];
  } catch (error) {
    return [];
  }
}

/**
 * Download image with proper error handling
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    // Use our proxy to handle CORS
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
  } catch (error) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
