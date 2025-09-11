'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import RazorpayIntegration from './RazorpayIntegration';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planDetails: {
    name: string;
    amount: string;
    credits: number;
    description?: string;
  };
}

export default function PaymentModal({ isOpen, onClose, planDetails }: PaymentModalProps) {
  const { firebaseUser, refreshUser } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSuccess = async (data: any) => {
    console.log("Payment successful:", data);
    toast.success(`Payment successful! Your account has been credited with ${data.credits} credits.`);
    
    // Refresh user data to update credits
    await refreshUser();
    
    // Close modal
    onClose();
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleError = (error: any) => {
    console.error("Payment error:", error);
    toast.error(`Payment failed: ${error?.message || 'Unknown error'}`);
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Purchase Credits</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Plan Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{planDetails.name}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-[#0F3DFF]">₹{planDetails.amount}</span>
              <span className="text-sm text-gray-600">{planDetails.credits} credits</span>
            </div>
            {planDetails.description && (
              <p className="text-sm text-gray-600">{planDetails.description}</p>
            )}
          </div>

          {/* Payment Button */}
          {firebaseUser ? (
            <RazorpayIntegration
              userEmail={firebaseUser.email || ''}
              planDetails={planDetails}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Please sign in to purchase credits</p>
              <button
                onClick={() => {
                  onClose();
                  router.push('/signin');
                }}
                className="w-full bg-[#0F3DFF] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0d2fd8] transition-colors"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
