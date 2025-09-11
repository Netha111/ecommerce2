'use client';

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import CreditDisplay from '../../components/dashboard/CreditDisplay';
import BillingHistory from '../../components/payment/BillingHistory';

export default function BillingPage() {
  const { firebaseUser, appUser, loading } = useAuth();
  const router = useRouter();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/signin');
    }
  }, [firebaseUser, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F3DFF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show signin prompt if not authenticated
  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Please sign in</h1>
          <button
            onClick={() => router.push('/signin')}
            className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e55a2b]"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
          <p className="text-gray-600">Manage your billing information and payment history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credits */}
          <div className="lg:col-span-1">
            <CreditDisplay />
          </div>

          {/* Billing History */}
          <div className="lg:col-span-2">
            <BillingHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
