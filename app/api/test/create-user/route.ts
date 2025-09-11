import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }
    
    // Create a test user document with the email as the ID
    const userRef = doc(db, 'users', email);
    
    const userData = {
      uid: email, // Using email as UID for test purposes
      email: email,
      name: 'Test User',
      photoURL: null,
      
      // Credits & Plan
      credits: 3,
      plan: 'free',
      subscriptionId: null,
      subscriptionStatus: null,
      
      // Usage Tracking
      totalTransformations: 0,
      totalCreditsUsed: 0,
      lastTransformationAt: null,
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      
      // Settings
      emailNotifications: true,
      planAutoRenew: true,
      
      // Billing
      billingAddress: null,
    };
    
    await setDoc(userRef, userData);
    
    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        email,
        credits: 3
      }
    });
    
  } catch (error) {
    console.error('Error creating test user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      message: `Failed to create test user: ${errorMessage}`
    }, { status: 500 });
  }
}