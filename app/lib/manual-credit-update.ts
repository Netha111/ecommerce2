import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function manualCreditUpdate(userId: string, credits: number, orderId: string, paymentId: string) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  
  const currentCredits = userDoc.data().credits || 0;
  
  await updateDoc(userRef, {
    credits: currentCredits + credits,
    payments: [
      ...(userDoc.data().payments || []),
      {
        orderId,
        paymentId,
        credits,
        timestamp: new Date().toISOString(),
        status: 'completed',
        manualUpdate: true
      }
    ],
    updatedAt: new Date().toISOString()
  });
  
  return {
    previousCredits: currentCredits,
    newCredits: currentCredits + credits
  };
}
