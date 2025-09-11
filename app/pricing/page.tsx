'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import RazorpayIntegration from '../components/payment/RazorpayIntegration';
import Navigation from '../components/Navigation';

const plans = [
  {
    name: "Starter",
    price: "₹1",
    amount: "1",
    credits: 50,
    period: "one-time",
    description: "Perfect for small businesses and individual sellers",
    features: [
      "50 AI transformations",
      "3 style variations per image",
      "HD quality downloads",
      "Basic support",
      "Standard processing time"
    ],
    cta: "Buy Now",
    ctaColor: "bg-[#FF6B35] hover:bg-[#e55a2b]",
    popular: false
  },
  {
    name: "Professional",
    price: "₹1999",
    amount: "1999",
    credits: 500,
    period: "one-time",
    description: "Ideal for growing e-commerce businesses",
    features: [
      "500 AI transformations",
      "5 style variations per image",
      "4K quality downloads",
      "Priority support",
      "Faster processing time",
      "Custom style presets",
      "Bulk processing"
    ],
    cta: "Buy Now",
    ctaColor: "bg-[#FF6B35] hover:bg-[#e55a2b]",
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹6999",
    amount: "6999",
    credits: 2000,
    period: "one-time",
    description: "For large-scale operations and agencies",
    features: [
      "2000 AI transformations",
      "Unlimited style variations",
      "8K quality downloads",
      "24/7 dedicated support",
      "Instant processing",
      "Custom AI training",
      "API access",
      "White-label solutions"
    ],
    cta: "Buy Now",
    ctaColor: "bg-[#FF6B35] hover:bg-[#e55a2b]",
    popular: false
  }
];

export default function PricingPage() {
  const router = useRouter();
  const { firebaseUser, refreshUser, loading } = useAuth();

  const handleSuccess = async (data: any) => {
    console.log("Payment successful:", data);
    toast.success(`Payment successful! Your account has been credited with ${data.credits} credits.`);
    
    // Refresh user data to update credits
    await refreshUser();
    
    // Redirect to dashboard after successful payment
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleError = (error: any) => {
    console.error("Payment error:", error);
    toast.error(`Payment failed: ${error?.message || 'Unknown error'}`);
  };

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="py-20 bg-[#F7FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-[#2D3748] mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core AI transformation technology with no hidden fees.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan, index) => (
              <div key={index} className={`relative ${
                plan.popular 
                  ? 'lg:scale-105 z-10' 
                  : 'lg:scale-100'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#FF6B35] text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`h-full rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-white border-2 border-[#FF6B35] shadow-2xl' 
                    : 'bg-white shadow-lg'
                }`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-2">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-gray-500">{plan.description}</p>
                  </div>

                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {firebaseUser ? (
                    <RazorpayIntegration
                      userEmail={firebaseUser.email || ''}
                      planDetails={{
                        name: plan.name,
                        amount: plan.amount,
                        credits: plan.credits,
                        description: `${plan.name} plan with ${plan.credits} credits`
                      }}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  ) : (
                    <button
                      onClick={() => router.push('/signin')}
                      className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${plan.ctaColor}`}
                    >
                      Sign in to Purchase
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
