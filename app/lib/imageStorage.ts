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
    const transformationRef = doc(db, 'transformations', transformationId);
    
    const imageUrls = images.map(img => img.url);
    
    await updateDoc(transformationRef, {
      status: 'completed',
      transformedImageUrls: imageUrls,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Store additional image metadata
      imageMetadata: images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        size: img.size,
        format: img.format
      }))
    });

  } catch (error) {
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
    
    await updateDoc(transformationRef, {
      status: 'failed',
      errorMessage,
      failedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

  } catch (error) {
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
