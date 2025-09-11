'use client';

import React, { useState } from 'react';
import Toast from '../components/ui/Toast';
import RazorpayIntegration from '../components/payment/RazorpayIntegration';

// Client-side only component to check Razorpay status
function RazorpayStatus() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Using React state instead of direct window reference
  React.useEffect(() => {
    // This code only runs in the browser
    if (typeof window !== 'undefined') {
      setIsLoaded(typeof (window as any).Razorpay !== 'undefined');
    }
  }, []);
  
  return (
    <>{isLoaded ? '✅ Loaded' : '⏳ Loading...'}</>
  );
}

export default function TestPaymentPage() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testUser, setTestUser] = useState<{ email: string; created: boolean } | null>(null);

  const handleSuccess = (data: any) => {
    console.log('Payment successful:', data);
    setToast({
      message: `Payment verified! Credits added: ${data.credits}`,
      type: 'success',
      isVisible: true
    });
  };

  const handleError = (error: any) => {
    console.error('Payment error:', error);
    setToast({
      message: `Payment failed: ${error?.message || 'Unknown error'}`,
      type: 'error',
      isVisible: true
    });
  };
  
  const createTestUser = async () => {
    setIsLoading(true);
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      
      const response = await fetch('/api/test/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestUser({ email: testEmail, created: true });
        setToast({
          message: `Test user created: ${testEmail}`,
          type: 'success',
          isVisible: true
        });
      } else {
        setToast({
          message: `Failed to create test user: ${data.message}`,
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error creating test user:', error);
      setToast({
        message: 'Failed to create test user',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Payment Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Razorpay Status</h2>
        <p className="mb-2">Script loaded: <RazorpayStatus /></p>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Plan (₹1)</h2>
        <p className="mb-4">This is a test payment for 1 credit.</p>
        
        {!testUser ? (
          <div className="mb-6">
            <p className="mb-4 text-amber-600">You need to create a test user first to test the payment flow.</p>
            <button 
              onClick={createTestUser}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Test User'}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">Test user created: <strong>{testUser.email}</strong></p>
            </div>
            
            <RazorpayIntegration
              userEmail={testUser.email}
              planDetails={{
                name: "Test Plan",
                amount: "1",
                credits: 1,
                description: "Test payment for 1 credit"
              }}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Testing Instructions</h2>
        <p className="mb-2">Use the following test card details:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Card Number: <code>4111 1111 1111 1111</code></li>
          <li>Expiry: Any future date</li>
          <li>CVV: Any 3 digits</li>
          <li>Name: Any name</li>
        </ul>
        <p>For more details, see the <a href="/RAZORPAY_INTEGRATION_GUIDE.md" className="text-blue-600 hover:underline">Razorpay Integration Guide</a>.</p>
      </div>
    </div>
  );
}
