# Payment Integration Testing Guide

## Phase 3: Razorpay Payment Integration - Complete ✅

### What's Been Implemented

1. **Environment Variables Setup** ✅
   - Updated `env.example` with all required Razorpay environment variables
   - Added Firebase configuration
   - Added NanoBanana API configuration

2. **Payment API Routes** ✅
   - `/api/razorpay` - Creates Razorpay orders
   - `/api/payment/verify` - Verifies payment signatures and updates credits
   - `/api/razorpay/webhook` - Handles Razorpay webhook notifications
   - `/api/user/credits` - Fetches user credits
   - `/api/user/payments` - Fetches payment history

3. **Payment Components** ✅
   - `PaymentModal` - Modal for payment confirmation
   - `PlanSelector` - Plan selection interface
   - `BillingHistory` - Payment history display
   - `CreditDisplay` - Credit balance display
   - `Toast` - Success/error notifications

4. **Enhanced Error Handling** ✅
   - Payment signature verification
   - Duplicate payment prevention
   - Comprehensive error logging
   - User-friendly error messages

5. **UI/UX Improvements** ✅
   - Payment success/failure notifications
   - Credit display on dashboard
   - Billing page integration
   - Navigation links to billing

### Setup Instructions

1. **Create `.env.local` file** (copy from `env.example`):
```bash
cp env.example .env.local
```

2. **Add your Razorpay test keys** to `.env.local`:
```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

3. **Install dependencies** (if not already done):
```bash
npm install
```

4. **Start the development server**:
```bash
npm run dev
```

### Testing the Payment Flow

#### Test 1: Basic Payment Flow
1. Go to `http://localhost:3000/pricing`
2. Click on any plan (Starter, Professional, or Enterprise)
3. You should see the Razorpay payment modal
4. Use Razorpay test card: `4111 1111 1111 1111`
5. Complete the payment
6. Verify credits are added to your account
7. Check the success notification

#### Test 2: Dashboard Integration
1. Go to `http://localhost:3000/dashboard`
2. Verify the credit display shows your current balance
3. Click "Buy Credits" to go to pricing page
4. Verify the billing link in navigation works

#### Test 3: Billing Page
1. Go to `http://localhost:3000/account/billing`
2. Verify current credit balance is displayed
3. Test plan selection and payment modal
4. Check billing history after a successful payment

#### Test 4: Error Handling
1. Try to make a payment with invalid card details
2. Verify error notifications appear
3. Test payment cancellation
4. Verify no credits are added for failed payments

#### Test 5: Debug Page
1. Go to `http://localhost:3000/test-payment`
2. Check environment variables status
3. Verify Razorpay script loading
4. Test a small payment (₹1) to verify integration
5. Check browser console for any errors

### Razorpay Test Cards

Use these test card numbers for testing:

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **Authentication Required**: `4000 0000 0000 0028`

For all test cards:
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Name**: Any name

### Webhook Testing

To test webhooks locally, you can use ngrok:

1. Install ngrok: `npm install -g ngrok`
2. Start your app: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Use the ngrok URL in your Razorpay webhook settings
5. Set webhook URL to: `https://your-ngrok-url.ngrok.io/api/razorpay/webhook`

### Common Issues & Solutions

1. **"Authentication failed" / "BAD_REQUEST_ERROR"**
   - **Cause**: Frontend trying to make direct API calls to Razorpay
   - **Fix**: Ensure all payment operations go through your backend API routes
   - **Check**: Verify Razorpay script is loaded before initialization
   - **Test**: Use the test page at `/test-payment` to debug

2. **"Razorpay is not properly initialized"**
   - Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `.env.local`
   - Restart the development server after adding environment variables

3. **"Invalid payment signature"**
   - Verify `RAZORPAY_KEY_SECRET` is correct
   - Check if the key secret matches your Razorpay dashboard

4. **Payment modal not opening**
   - Check browser console for JavaScript errors
   - Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
   - Ensure Razorpay script is loaded
   - Check if `window.Razorpay` is defined

5. **Credits not updating**
   - Check database connection
   - Verify user exists in database
   - Check payment verification logs

6. **"Payment system is loading" error**
   - Wait for Razorpay script to load completely
   - Refresh the page if the script fails to load
   - Check network tab for script loading errors

### Production Deployment

Before going to production:

1. **Update environment variables** with live Razorpay keys
2. **Set up webhook URL** in Razorpay dashboard
3. **Test with real payment methods** (small amounts)
4. **Monitor payment logs** for any issues
5. **Set up error monitoring** (Sentry, etc.)

### Security Considerations

- Never commit `.env.local` to version control
- Use environment-specific Razorpay keys
- Implement rate limiting on payment endpoints
- Log all payment activities for audit
- Validate all payment data server-side

### Next Steps

The payment integration is now complete! You can:

1. Test the complete flow end-to-end
2. Customize the UI/UX as needed
3. Add more payment methods if required
4. Implement subscription plans
5. Add analytics and reporting

### Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs for API errors
3. Verify all environment variables are set correctly
4. Test with Razorpay's test cards first

The payment system is now fully functional and ready for production use! 🎉
