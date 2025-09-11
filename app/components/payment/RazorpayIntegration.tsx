'use client';

import React, { useState } from 'react';

interface RazorpayIntegrationProps {
  userEmail: string;
  planDetails: {
    name: string;
    amount: string; // in INR
    credits: number;
    description?: string;
  };
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function RazorpayIntegration({
  userEmail,
  planDetails,
  onSuccess,
  onError
}: RazorpayIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    // Check if Razorpay is available
    if (typeof window === 'undefined' || !(window as any).Razorpay) {
      onError?.({ message: 'Razorpay script not loaded. Please refresh the page.' });
      return;
    }

    // Validate inputs
    if (!userEmail || !planDetails.amount || !planDetails.credits) {
      onError?.({ message: 'Invalid payment details. Please refresh the page.' });
      return;
    }

    // Validate amount
    const amount = parseInt(planDetails.amount);
    if (isNaN(amount) || amount <= 0) {
      onError?.({ message: 'Invalid amount. Please refresh the page.' });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create Razorpay order
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          useremail: userEmail,
          detail: {
            amount: planDetails.amount,
            credits: planDetails.credits,
            name: planDetails.name,
            price: `₹${planDetails.amount}`,
          },
        }),
      });

      const data = await response.json();
      
      if (data.msg !== 'success' || !data.order) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "StyleForge AI",
        currency: "INR",
        amount: parseInt(planDetails.amount) * 100, // Convert to paisa
        order_id: data.order.id,
        description: planDetails.description || `Purchase ${planDetails.credits} credits`,
        handler: async function (response: any) {
          try {
            // Step 3: Verify payment with our backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                notes: data.order.notes, // Pass the notes from the order which contains credits info
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              onSuccess?.(verifyData);
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError?.(error);
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: "#FF6B35",
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#FF6B35] hover:bg-[#e55a2b] focus:bg-[#FF6B35] active:bg-[#e55a2b]"
    >
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  );
}