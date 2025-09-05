import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Check if user has enough credits for transformation
 */
export async function hasEnoughCredits(userCredits: number, requiredCredits: number = 1): Promise<boolean> {
    return userCredits >= requiredCredits;
}

/**
 * Deduct credits from user account
 */
export async function deductCredits(userId: string, creditsToDeduct: number = 1): Promise<void> {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
        credits: increment(-creditsToDeduct),
        totalCreditsUsed: increment(creditsToDeduct),
        updatedAt: serverTimestamp()
    });
}

/**
 * Add credits to user account (for purchases)
 */
export async function addCredits(userId: string, creditsToAdd: number): Promise<void> {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
        credits: increment(creditsToAdd),
        updatedAt: serverTimestamp()
    });
}

/**
 * Update user transformation stats
 */
export async function updateTransformationStats(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
        totalTransformations: increment(1),
        lastTransformationAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}
