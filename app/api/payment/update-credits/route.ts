import { NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { userEmail, credits, orderId, paymentId } = await req.json();

    if (!userEmail || !credits || !orderId || !paymentId) {
      return NextResponse.json({
        message: "error",
        error: "Missing required fields"
      }, { status: 400 });
    }

    // Get user document reference
    const userDocRef = doc(db, 'users', userEmail);

    // Use a transaction to ensure atomic updates
    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        
        if (!userDoc.exists()) {
          throw new Error("User document not found");
        }

        const userData = userDoc.data();
        
        // Check if payment was already processed
        const existingPayment = (userData.payments || []).find(
          (p: any) => p.orderId === orderId || p.paymentId === paymentId
        );

        if (existingPayment) {
          throw new Error("Payment already processed");
        }

        // Calculate new credits
        const currentCredits = userData.credits || 0;
        const newCredits = currentCredits + credits;

        // Update the document
        transaction.update(userDocRef, {
          credits: newCredits,
          payments: [
            ...(userData.payments || []),
            {
              orderId,
              paymentId,
              credits,
              amount: credits * 10, // Store the amount paid
              timestamp: new Date().toISOString(),
              status: 'completed'
            }
          ],
          updatedAt: new Date().toISOString()
        });

        return { newCredits };
      });

      console.log("Successfully updated credits for user:", userEmail);

      return NextResponse.json({
        message: "success",
        newCredits: (await getDoc(userDocRef)).data()?.credits
      });
    } catch (transactionError) {
      console.error("Transaction failed:", transactionError);
      throw new Error(`Transaction failed: ${(transactionError as Error).message}`);
    }
  } catch (error) {
    console.error("Error updating credits:", error);
    return NextResponse.json({
      message: "error",
      error: (error as Error).message
    }, { status: 500 });
  }
}
