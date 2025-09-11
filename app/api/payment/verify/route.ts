import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, runTransaction, serverTimestamp } from 'firebase/firestore';

// Razorpay key secret from environment variables
const key_secret = process.env.RAZORPAY_KEY_SECRET;

// Helper function to get user by email
async function getUserByEmail(email: string) {
    try {
        console.log('Looking up user by email:', email);
        
        // Query users collection by email field
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        console.log(`Found ${querySnapshot.size} users with email ${email}`);
        
        if (querySnapshot.empty) {
            // If no user found by email, try direct lookup (in case email is actually a UID)
            const directRef = doc(db, 'users', email);
            const directDoc = await getDoc(directRef);
            
            if (directDoc.exists()) {
                console.log('Found user by direct ID lookup');
                return {
                    id: directDoc.id,
                    ...directDoc.data()
                };
            }
            
            console.log('No user found with email or ID:', email);
            return null;
        }
        
        // Return the first matching user
        const userDoc = querySnapshot.docs[0];
        console.log('Found user by email query:', userDoc.id);
        return {
            id: userDoc.id,
            ...userDoc.data()
        };
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}

// Helper function to verify Razorpay signature
function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const sign = orderId + "|" + paymentId;
    const generated_signature = crypto
        .createHmac("sha256", key_secret!)
        .update(sign)
        .digest("hex");
    return generated_signature === signature;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10; // Max 10 requests per minute per IP
    
    const key = ip;
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    if (current.count >= maxRequests) {
        return false;
    }
    
    current.count++;
    return true;
}

// Named export for POST method
export async function POST(
    req: Request,
    { params }: { params: Record<string, string> }
) {
    try {
        // Get client IP for rate limiting
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
        
        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json({
                success: false,
                message: 'Too many requests. Please try again later.'
            }, { status: 429 });
        }

        // Parse request body
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            notes = {}
        } = body;
        
        console.log('Payment verification request:', { 
            razorpay_order_id, 
            razorpay_payment_id, 
            notes 
        });

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({
                success: false,
                message: 'Missing required payment details'
            }, { status: 400 });
        }

        // Validate field formats
        if (typeof razorpay_order_id !== 'string' || 
            typeof razorpay_payment_id !== 'string' || 
            typeof razorpay_signature !== 'string') {
            return NextResponse.json({
                success: false,
                message: 'Invalid payment data format'
            }, { status: 400 });
        }

        // Validate signature format (should be hex string)
        if (!/^[a-f0-9]+$/i.test(razorpay_signature)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid signature format'
            }, { status: 400 });
        }

        // Verify payment signature
        if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid payment signature'
            }, { status: 400 });
        }

        // Extract user email and credits from notes
        if (!notes || typeof notes !== 'object') {
            return NextResponse.json({
                success: false,
                message: 'Invalid payment notes'
            }, { status: 400 });
        }

        const userEmail = notes.email;
        if (!userEmail) {
            return NextResponse.json({
                success: false,
                message: 'User email not found in payment notes'
            }, { status: 400 });
        }

        // Use credits from notes
        const credits = Number(notes.credits) || 0;
        if (credits <= 0) {
            return NextResponse.json({
                success: false,
                message: 'Invalid credits amount'
            }, { status: 400 });
        }
        
        console.log('Credits to add:', credits, 'for user:', userEmail);

        // Get user by email
        console.log('Searching for user with email:', userEmail);
        
        // First try to query by email field
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);
        
        console.log(`Found ${querySnapshot.size} users with email ${userEmail}`);
        
        if (querySnapshot.empty) {
            console.error('No user found with email:', userEmail);
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }
        
        // Get the first matching user document
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        console.log('Found user with ID:', userId);
        
        // Get user document reference
        const userRef = doc(db, 'users', userId);
        
        // Use a transaction to safely update credits
        let newCredits = 0;
        let paymentResult;

        try {
            // First check if the user document exists before starting the transaction
            const userDocCheck = await getDoc(userRef);
            if (!userDocCheck.exists()) {
                console.error('User document not found for ID:', userId);
                return NextResponse.json({
                    success: false,
                    message: 'User document not found'
                }, { status: 404 });
            }
            
            console.log('Starting transaction for user:', userId);
            
            paymentResult = await runTransaction(db, async (transaction) => {
                const latestUserDoc = await transaction.get(userRef);
                
                if (!latestUserDoc.exists()) {
                    console.error('User document not found in transaction for ID:', userId);
                    throw new Error('User document not found');
                }
                
                console.log('User document found, updating credits');
                const userData = latestUserDoc.data();
                
                // Check if payment was already processed
                const payments = userData.payments || [];
                const existingPayment = payments.find(
                    (p: any) => p.orderId === razorpay_order_id || p.paymentId === razorpay_payment_id
                );
                
                if (existingPayment) {
                    throw new Error('Payment already processed');
                }
                
                // Calculate new credits
                const currentCredits = userData.credits || 0;
                newCredits = currentCredits + credits;
                console.log(`Updating credits from ${currentCredits} to ${newCredits}`);
                
                // Create payment record
                const paymentRecord = {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    credits: credits,
                    planName: notes.planName || 'Standard',
                    amount: notes.amount || 0,
                    timestamp: new Date().toISOString(), // Use ISO string instead of serverTimestamp() for arrays
                    status: 'completed'
                };
                
                // Update user document
                transaction.update(userRef, {
                    credits: newCredits,
                    payments: [...payments, paymentRecord],
                    lastPayment: paymentRecord,
                    updatedAt: serverTimestamp(), // Keep serverTimestamp() for direct fields
                    lastUpdated: new Date().toISOString() // Add a regular date field as backup
                });
                
                return { newCredits, paymentRecord };
            });
            
            console.log('Transaction completed successfully');
        } catch (transactionError) {
            console.error('Transaction failed:', transactionError);
            
            return NextResponse.json({
                success: false,
                message: `Transaction failed: ${(transactionError as Error).message}`
            }, { status: 500 });
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'success', // Match the message expected by frontend
            credits: newCredits,
            planName: notes.planName || 'Standard'
        });

    } catch (error) {
        // Log and handle any errors
        console.error('Payment verification error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json({
            success: false,
            message: `Payment verification failed: ${errorMessage}`
        }, { status: 500 });
    }
}

// Export for OPTIONS method to handle CORS preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}
