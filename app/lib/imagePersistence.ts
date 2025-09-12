import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase';

export interface ImageData {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
}

/**
 * Download image from URL and upload to Firebase Storage
 */
async function downloadAndStoreImage(
  imageUrl: string, 
  userId: string, 
  transformationId: string, 
  imageIndex: number
): Promise<string> {
  try {
    console.log(`📥 Downloading image ${imageIndex + 1} from:`, imageUrl);
    
    // Download image from fal.media
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'StyleForge-AI/1.0',
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    console.log(`📊 Image ${imageIndex + 1} downloaded:`, {
      size: imageBuffer.byteLength,
      contentType: contentType
    });

    // Create Firebase Storage path
    const fileName = `transformation-${imageIndex + 1}.${contentType.split('/')[1]}`;
    const storagePath = `transformations/${userId}/${transformationId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    // Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, imageBuffer, {
      contentType: contentType,
      customMetadata: {
        originalUrl: imageUrl,
        transformationId: transformationId,
        userId: userId,
        imageIndex: imageIndex.toString(),
        uploadedAt: new Date().toISOString()
      }
    });

    // Get permanent download URL
    const permanentUrl = await getDownloadURL(uploadResult.ref);
    
    console.log(`✅ Image ${imageIndex + 1} stored permanently:`, permanentUrl);
    
    return permanentUrl;

  } catch (error) {
    console.error(`❌ Failed to store image ${imageIndex + 1}:`, error);
    throw error;
  }
}

/**
 * Store all transformation images permanently in Firebase Storage
 */
export async function storeTransformationImagesPermanently(
  transformationId: string,
  images: ImageData[],
  userId: string
): Promise<string[]> {
  try {
    console.log(`🏛️ Storing ${images.length} images permanently for transformation:`, transformationId);
    
    const permanentUrls: string[] = [];
    
    // Download and store each image
    for (let i = 0; i < images.length; i++) {
      try {
        const permanentUrl = await downloadAndStoreImage(
          images[i].url, 
          userId, 
          transformationId, 
          i
        );
        permanentUrls.push(permanentUrl);
        
        // Add small delay to avoid rate limiting
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Failed to store image ${i + 1}, skipping:`, error);
        // Continue with other images even if one fails
      }
    }

    console.log(`✅ Successfully stored ${permanentUrls.length}/${images.length} images permanently`);
    
    return permanentUrls;

  } catch (error) {
    console.error('❌ Error storing transformation images permanently:', error);
    throw error;
  }
}

/**
 * Update transformation document with permanent image URLs
 */
export async function updateTransformationWithPermanentUrls(
  transformationId: string,
  permanentUrls: string[],
  originalImages: ImageData[]
): Promise<void> {
  try {
    console.log(`💾 Updating transformation with permanent URLs:`, transformationId);
    
    const transformationRef = doc(db, 'transformations', transformationId);
    
    // Create comprehensive metadata
    const imageMetadata = permanentUrls.map((url, index) => ({
      url: url,
      originalUrl: originalImages[index]?.url || '',
      ...(originalImages[index]?.width && { width: originalImages[index].width }),
      ...(originalImages[index]?.height && { height: originalImages[index].height }),
      ...(originalImages[index]?.size && { size: originalImages[index].size }),
      ...(originalImages[index]?.format && { format: originalImages[index].format }),
      storedPermanently: true,
      storedAt: serverTimestamp()
    }));

    const updateData = {
      status: 'completed',
      transformedImageUrls: permanentUrls,
      imageMetadata: imageMetadata,
      permanentStorage: true,
      permanentStorageAt: serverTimestamp(),
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(transformationRef, updateData);
    
    console.log(`✅ Transformation updated with permanent storage:`, transformationId);

  } catch (error) {
    console.error('❌ Error updating transformation with permanent URLs:', error);
    throw error;
  }
}

/**
 * Main function to handle complete image persistence
 */
export async function persistTransformationToGallery(
  transformationId: string,
  images: ImageData[],
  userId: string
): Promise<void> {
  try {
    console.log(`🎨 Persisting transformation to gallery:`, { transformationId, imageCount: images.length, userId });
    
    // Step 1: Download and store images permanently
    const permanentUrls = await storeTransformationImagesPermanently(
      transformationId, 
      images, 
      userId
    );
    
    if (permanentUrls.length === 0) {
      throw new Error('No images were successfully stored');
    }
    
    // Step 2: Update transformation document with permanent URLs
    await updateTransformationWithPermanentUrls(
      transformationId, 
      permanentUrls, 
      images
    );
    
    console.log(`✅ Transformation successfully persisted to gallery:`, transformationId);

  } catch (error) {
    console.error('❌ Error persisting transformation to gallery:', error);
    throw error;
  }
}
