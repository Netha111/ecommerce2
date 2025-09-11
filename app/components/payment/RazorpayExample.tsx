'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RazorpayIntegration from './RazorpayIntegration';
import { useAuth } from '@/app/context/AuthContext';

interface Plan {
  id: string;
  name: string;
  amount: string;
  credits: number;
  description: string;
}

export default function RazorpayExample() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Example plans
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      amount: '499',
      credits: 50,
      description: 'Basic plan with 50 credits'
    },
    {
      id: 'standard',
      name: 'Standard',
      amount: '999',
      credits: 120,
      description: 'Standard plan with 120 credits'
    },
    {
      id: 'premium',
      name: 'Premium',
      amount: '1999',
      credits: 300,
      description: 'Premium plan with 300 credits'
    }
  ];

  const handleSuccess = (data: any) => {
    setMessage({
      text: `Payment successful! Your account has been credited with ${data.credits} credits.`,
      type: 'success'
    });
    
    // Redirect to dashboard after successful payment
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleError = (error: any) => {
    setMessage({
      text: `Payment failed: ${error.message || 'Unknown error'}`,
      type: 'error'
    });
  };

  if (!firebaseUser) {
    return (
      <div className="p-4 bg-yellow-50 rounded-md">
        <p className="text-yellow-700">Please sign in to purchase credits.</p>
        <button
          onClick={() => router.push('/signin')}
          className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' :
          message.type === 'error' ? 'bg-red-50 text-red-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">₹{plan.amount}</p>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <p className="font-medium mb-6">{plan.credits} Credits</p>
            
            <RazorpayIntegration
              userEmail={firebaseUser.email || ''}
              planDetails={{
                name: plan.name,
                amount: plan.amount,
                credits: plan.credits,
                description: plan.description
              }}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        ))}
      </div>
    </div>
  );
}