# StyleForge AI - Complete MVP Development Plan

## 🎯 Project Overview
**Goal**: Build a complete MVP for AI-powered product photo transformation from scratch
- Users upload product images → AI transforms them → Users download results
- Credit-based system prevents free users from using API
- Secure payments via Razorpay
- All data stored in Firebase

**Tech Stack**: Next.js + Firebase + NanoBanana API + Razorpay

---

## 🔥 FIREBASE SETUP (FROM SCRATCH)

### Firebase Project Configuration
- **Project ID**: ecommerce-5175a
- **Authentication**: Email/Password enabled
- **Firestore**: Database created
- **Storage**: Bucket created
- **Security Rules**: To be configured

### Required Firebase Collections & Documents

#### 1. **Users Collection** (`users`)
```typescript
// Document ID: user.uid
{
  // Basic Info
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email
  name: string | null;            // Display name
  photoURL: string | null;        // Profile picture URL
  
  // Credits & Plan
  credits: number;                // Available credits (default: 3)
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  subscriptionId: string | null;  // Razorpay subscription ID
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | null;
  
  // Usage Tracking
  totalTransformations: number;   // Lifetime transformations
  totalCreditsUsed: number;       // Lifetime credits consumed
  lastTransformationAt: Timestamp | null;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp | null;
  
  // Settings
  emailNotifications: boolean;    // Default: true
  planAutoRenew: boolean;         // Default: true
  
  // Billing
  billingAddress: {
    name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
  } | null;
}
```

#### 2. **Transformations Collection** (`transformations`)
```typescript
// Document ID: auto-generated
{
  // Basic Info
  id: string;                     // Auto-generated ID
  userId: string;                 // Reference to users collection
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  
  // Images
  originalImageUrl: string;       // Firebase Storage URL
  originalImagePath: string;      // Storage path
  originalImageName: string;      // Original filename
  originalImageSize: number;      // File size in bytes
  
  transformedImageUrls: string[]; // Array of transformed image URLs
  transformedImagePaths: string[]; // Array of storage paths
  
  // Transformation Details
  transformationType: string;     // Style applied
  transformationPrompt: string;   // AI prompt used
  creditsUsed: number;            // Credits consumed
  processingTime: number;         // Time taken in seconds
  
  // API Details
  nanoBananaJobId: string | null; // NanoBanana job ID
  apiResponse: any;               // Full API response
  
  // Timestamps
  createdAt: Timestamp;
  startedAt: Timestamp | null;
  completedAt: Timestamp | null;
  failedAt: Timestamp | null;
  
  // Error Handling
  errorMessage: string | null;
  retryCount: number;             // Default: 0
}
```

#### 3. **Payments Collection** (`payments`)
```typescript
// Document ID: auto-generated
{
  // Basic Info
  id: string;                     // Auto-generated ID
  userId: string;                 // Reference to users collection
  
  // Razorpay Details
  razorpayPaymentId: string;      // Razorpay payment ID
  razorpayOrderId: string;        // Razorpay order ID
  razorpaySignature: string;      // Payment signature
  
  // Payment Details
  amount: number;                 // Amount in paise
  currency: string;               // Default: 'INR'
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  
  // Plan Details
  planId: string;                 // Plan purchased
  planName: string;               // Human readable plan name
  creditsPurchased: number;       // Credits added
  planDuration: number;           // Duration in days
  
  // Timestamps
  createdAt: Timestamp;
  paidAt: Timestamp | null;
  expiresAt: Timestamp | null;
  
  // Billing
  billingEmail: string;
  billingName: string | null;
}
```

#### 4. **Subscriptions Collection** (`subscriptions`)
```typescript
// Document ID: auto-generated
{
  // Basic Info
  id: string;                     // Auto-generated ID
  userId: string;                 // Reference to users collection
  razorpaySubscriptionId: string; // Razorpay subscription ID
  
  // Plan Details
  planId: string;                 // Plan ID
  planName: string;               // Plan name
  status: 'active' | 'cancelled' | 'past_due' | 'paused';
  
  // Billing
  amount: number;                 // Amount in paise
  currency: string;               // Default: 'INR'
  interval: 'monthly' | 'yearly';
  
  // Credits
  creditsPerCycle: number;        // Credits per billing cycle
  creditsUsed: number;            // Credits used in current cycle
  
  // Timestamps
  createdAt: Timestamp;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  nextBillingDate: Timestamp;
  cancelledAt: Timestamp | null;
}
```

#### 5. **Usage Analytics Collection** (`usage_analytics`)
```typescript
// Document ID: auto-generated
{
  // Basic Info
  id: string;                     // Auto-generated ID
  userId: string;                 // Reference to users collection
  date: string;                   // YYYY-MM-DD format
  
  // Daily Usage
  transformationsCount: number;   // Transformations today
  creditsUsed: number;            // Credits used today
  imagesProcessed: number;        // Images processed today
  
  // API Usage
  apiCallsCount: number;          // API calls made
  apiErrorsCount: number;         // API errors
  averageProcessingTime: number;  // Average processing time
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 6. **System Settings Collection** (`system_settings`)
```typescript
// Document ID: 'app_config'
{
  // Credit System
  freeTierCredits: number;        // Default: 3
  creditCostPerTransformation: number; // Default: 1
  
  // Plans
  plans: {
    starter: {
      name: string;
      price: number;
      credits: number;
      features: string[];
    };
    professional: {
      name: string;
      price: number;
      credits: number;
      features: string[];
    };
    enterprise: {
      name: string;
      price: number;
      credits: number;
      features: string[];
    };
  };
  
  // API Limits
  maxFileSize: number;            // Max file size in bytes
  allowedFileTypes: string[];     // Allowed MIME types
  maxTransformationsPerDay: number; // Rate limiting
  
  // Timestamps
  updatedAt: Timestamp;
}
```

---

## 🚧 PHASE 1: Authentication System (FROM SCRATCH)
**Status**: 🚧 TO BUILD FROM SCRATCH

### Task 1.1: Firebase Project Setup
- [ ] Create Firebase project
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore database
- [ ] Create Storage bucket
- [ ] Configure security rules

### Task 1.2: Environment Variables
- [ ] Create `.env.local` with Firebase config
- [ ] Add Firebase environment variables
- [ ] Test Firebase connection

### Task 1.3: Authentication Pages
- [ ] Fix sign up page (`/signup`)
- [ ] Fix sign in page (`/signin`)
- [ ] Add form validation
- [ ] Add error handling
- [ ] Test authentication flow

### Task 1.4: User Management
- [ ] Create AuthContext
- [ ] Implement user state management
- [ ] Create user document in Firestore
- [ ] Add user profile management
- [ ] Test user creation

### Task 1.5: Navigation & Routing
- [ ] Update Navigation component
- [ ] Add protected routes
- [ ] Add redirect logic
- [ ] Test navigation flow

---

## 🚧 PHASE 2: API Integration (NanoBanana)
**Status**: 🚧 TO BUILD AFTER PHASE 1

### Task 2.1: NanoBanana API Setup
- [ ] Add NanoBanana API key to environment
- [ ] Create API utility functions
- [ ] Test API connection
- [ ] Add error handling

### Task 2.2: Dashboard Page
- [ ] Create `/dashboard` page
- [ ] Add image upload interface
- [ ] Add drag & drop functionality
- [ ] Add image preview
- [ ] Show credit balance

### Task 2.3: Credit System Implementation
- [ ] Check user credits before API call
- [ ] Deduct credits after transformation
- [ ] Block free users from API
- [ ] Add insufficient credits error
- [ ] Update usage analytics

### Task 2.4: Image Processing Flow
- [ ] Upload original image to Firebase Storage
- [ ] Call NanoBanana API
- [ ] Store transformed images
- [ ] Save transformation record
- [ ] Show before/after comparison

### Task 2.5: Results & Gallery
- [ ] Display transformed images
- [ ] Add download functionality
- [ ] Create transformation history
- [ ] Add image gallery
- [ ] Add delete functionality

---

## 🚧 PHASE 3: Payment Integration (Razorpay)
**Status**: 🚧 TO BUILD AFTER PHASE 2

### Task 3.1: Razorpay Setup
- [ ] Add Razorpay SDK
- [ ] Create Razorpay environment variables
- [ ] Set up payment plans
- [ ] Test Razorpay connection

### Task 3.2: Payment Flow
- [ ] Create payment API routes
- [ ] Add "Buy Credits" button
- [ ] Implement Razorpay checkout
- [ ] Handle payment success/failure
- [ ] Add payment verification

### Task 3.3: Subscription Management
- [ ] Create subscription plans
- [ ] Handle subscription creation
- [ ] Manage subscription status
- [ ] Add billing history
- [ ] Handle plan upgrades/downgrades

### Task 3.4: Credit Management
- [ ] Update user credits after payment
- [ ] Add credit purchase history
- [ ] Implement credit expiration
- [ ] Add credit usage tracking

---

## 🚧 PHASE 4: Polish & Deploy
**Status**: 🚧 FINAL PHASE

### Task 4.1: Error Handling & UX
- [ ] Add loading states
- [ ] Handle API errors gracefully
- [ ] Add success/error notifications
- [ ] Add retry mechanisms
- [ ] Add offline handling

### Task 4.2: Security & Validation
- [ ] Add input validation
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Test authentication security
- [ ] Validate payment security

### Task 4.3: Testing & Deployment
- [ ] Test all user flows
- [ ] Verify credit system
- [ ] Test payment integration
- [ ] Performance optimization
- [ ] Deploy to production

---

## 📁 Complete File Structure


app/
├── (auth)/
│ ├── signin/
│ │ └── page.tsx 🚧 TO FIX
│ └── signup/
│ └── page.tsx 🚧 TO FIX
├── dashboard/
│ ├── page.tsx 🚧 TO BUILD
│ ├── gallery/
│ │ └── page.tsx 🚧 TO BUILD
│ └── history/
│ └── page.tsx 🚧 TO BUILD
├── account/
│ ├── page.tsx 🚧 TO BUILD
│ ├── billing/
│ │ └── page.tsx 🚧 TO BUILD
│ └── settings/
│ └── page.tsx �� TO BUILD
├── api/
│ ├── auth/
│ │ └── route.ts 🚧 TO BUILD
│ ├── transform/
│ │ └── route.ts 🚧 TO BUILD
│ ├── payment/
│ │ ├── create/route.ts �� TO BUILD
│ │ ├── webhook/route.ts �� TO BUILD
│ │ └── verify/route.ts 🚧 TO BUILD
│ └── user/
│ ├── credits/route.ts �� TO BUILD
│ └── usage/route.ts 🚧 TO BUILD
├── components/
│ ├── auth/
│ │ ├── SignInForm.tsx �� TO BUILD
│ │ ├── SignUpForm.tsx �� TO BUILD
│ │ └── AuthGuard.tsx 🚧 TO BUILD
│ ├── dashboard/
│ │ ├── ImageUpload.tsx �� TO BUILD
│ │ ├── ImageGallery.tsx �� TO BUILD
│ │ ├── │ │ ├── CreditDisplay.tsx �� TO BUILD
│ │ └── TransformationCard.tsx 🚧 TO BUILD
│ ├── payment/
│ │ ├── PlanSelector.tsx �� TO BUILD
│ │ ├── PaymentModal.tsx �� TO BUILD
│ │ └── BillingHistory.tsx 🚧 TO BUILD
│ └── ui/
│ ├── Button.tsx �� TO BUILD
│ ├── Input.tsx �� TO BUILD
│ ├── Modal.tsx �� TO BUILD
│ └── Toast.tsx �� TO BUILD
├── lib/
│ ├── firebase.ts 🚧 TO UPDATE
│ ├── nanoBanana.ts 🚧 TO BUILD
│ ├── razorpay.ts 🚧 TO BUILD
│ ├── credits.ts 🚧 TO BUILD
│ ├── validation.ts 🚧 TO BUILD
│ └── utils.ts �� TO BUILD
├── types/
│ └── index.ts 🚧 TO BUILD
├── context/
│ ├── AuthContext.tsx 🚧 TO UPDATE
│ └── PaymentContext.tsx 🚧 TO BUILD
└── middleware.ts 🚧 TO BUILD


---

## 🎯 MVP Success Criteria

### Must Have:
1. 🚧 User can sign up and sign in
2. 🚧 User can upload product images
3. �� User can transform images using NanoBanana API
4. 🚧 User can download transformed images
5. 🚧 Credit system blocks free users from API
6. 🚧 User can buy credits via Razorpay
7. 🚧 User can view transformation history

### Nice to Have:
- Multiple transformation styles
- Bulk image processing
- Advanced image editing
- API access for developers
- White-label solutions

---

## 📝 Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB-5xSjL1ptNfHVuFL5YcGqiXBmJ-U7iM4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecommerce-5175a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecommerce-5175a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecommerce-5175a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1049383381276
NEXT_PUBLIC_FIREBASE_APP_ID=1:1049383381276:web:9b5e56eb4c0d2b5a5b72d9

# NanoBanana API
NANOBANANA_API_KEY=your_nanobanana_api_key
NANOBANANA_MODEL_ID=your_model_id
NANOBANANA_API_URL=https://api.nanobanana.com

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Development Workflow

### Step 1: Firebase Setup 🚧
- [ ] Create Firebase project
- [ ] Configure Authentication
- [ ] Set up Firestore
- [ ] Configure Storage
- [ ] Test Firebase connection

### Step 2: Authentication System 🚧
- [ ] Fix sign up/sign in pages
- [ ] Create AuthContext
- [ ] Test user creation
- [ ] Test authentication flow

### Step 3: API Integration 🚧
- [ ] Set up NanoBanana API
- [ ] Create dashboard
- [ ] Implement credit system
- [ ] Test transformation flow

### Step 4: Payment System ��
- [ ] Set up Razorpay
- [ ] Create payment flow
- [ ] Test credit purchase
- [ ] Verify credit updates

### Step 5: Polish & Deploy 🚧
- [ ] Add error handling
- [ ] Test all flows
- [ ] Deploy to production

---

## 📞 Notes

- **Start from scratch** - nothing is implemented yet
- **Test each phase** before moving to the next
- **Use Firebase** for all data storage
- **Focus on core user journey**: Upload → Transform → Download → Pay
- **Credit system is critical** - prevent abuse
- **Security is paramount** - validate everything
- **Keep it simple** - this is an MVP

**Ready to start Phase 1: Firebase Setup when you give the go-ahead! 🚀**