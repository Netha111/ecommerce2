# Razorpay Payment Integration Guide

## Overview

This guide explains the Razorpay payment flow implementation in our application. The integration follows best practices for secure payment processing, proper credit management, and error handling.

## Payment Flow

1. **Create Order**: Frontend calls `/api/razorpay` to create a Razorpay order
2. **Process Payment**: User completes payment through Razorpay checkout
3. **Verify Payment**: Frontend calls `/api/payment/verify` with payment details
4. **Update Credits**: Backend verifies signature and updates user credits using Firestore transaction
5. **Webhook Logging**: Razorpay webhooks log events but don't update credits (single source of truth)

## API Endpoints

### 1. `/api/razorpay`

Creates a Razorpay order with the specified amount and notes.

**Request:**
```json
{
  "useremail": "user@example.com",
  "detail": {
    "amount": "999",
    "credits": 100,
    "name": "Standard Plan",
    "price": "₹999"
  }
}
```

**Response:**
```json
{
  "msg": "success",
  "order": {
    "id": "order_123456789",
    "amount": 99900,
    "currency": "INR",
    "notes": {
      "email": "user@example.com",
      "credits": 100,
      "planName": "Standard Plan"
    }
  }
}
```

### 2. `/api/payment/verify`

Verifies the payment signature and updates user credits using a Firestore transaction.

**Request:**
```json
{
  "razorpay_order_id": "order_123456789",
  "razorpay_payment_id": "pay_123456789",
  "razorpay_signature": "signature_hash",
  "notes": {
    "email": "user@example.com",
    "credits": 100,
    "planName": "Standard Plan"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "success",
  "credits": 150,
  "planName": "Standard Plan"
}
```

### 3. `/api/razorpay/webhook`

Handles Razorpay webhook events. Only logs events without updating credits to avoid duplication.

## Frontend Integration

We provide a reusable `RazorpayIntegration` component that handles the complete payment flow:

```tsx
import RazorpayIntegration from '@/app/components/payment/RazorpayIntegration';

// In your component
<RazorpayIntegration
  userEmail={user.email}
  planDetails={{
    name: "Standard Plan",
    amount: "999",
    credits: 100,
    description: "Standard plan with 100 credits"
  }}
  onSuccess={(data) => console.log('Payment successful', data)}
  onError={(error) => console.error('Payment failed', error)}
/>
```

## Security Considerations

1. **Signature Verification**: All payments are verified using Razorpay's signature verification
2. **Firestore Transactions**: Credits are updated using atomic transactions to prevent race conditions
3. **Duplicate Prevention**: System checks for existing payments to prevent duplicate credit updates
4. **Single Source of Truth**: Only the payment verification endpoint updates credits
5. **Error Handling**: Comprehensive error handling and logging throughout the flow

## Testing

Use Razorpay test cards for testing the payment flow:

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **Authentication Required**: `4000 0000 0000 0028`

For all test cards:
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Name**: Any name

## Troubleshooting

1. **Payment Verification Failed**
   - Check if Razorpay signature is correct
   - Verify that notes contain valid email and credits

2. **Credits Not Updated**
   - Check Firestore transaction logs
   - Verify user document exists in Firestore

3. **Razorpay Checkout Not Opening**
   - Ensure Razorpay script is loaded
   - Check if NEXT_PUBLIC_RAZORPAY_KEY_ID is set correctly

## Implementation Details

### Credit Update Logic

The credit update uses a Firestore transaction to ensure atomicity:

1. Begin transaction
2. Get current user document
3. Check if payment already processed
4. Calculate new credits
5. Update user document with new credits and payment record
6. Commit transaction

This approach prevents race conditions when multiple payments are processed simultaneously.

### Webhook Handling

Webhooks only log events without updating credits to avoid duplication. The payment verification endpoint is the single source of truth for credit updates.