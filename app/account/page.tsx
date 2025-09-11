'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import CreditDisplay from '../components/dashboard/CreditDisplay';
import BillingHistory from '../components/payment/BillingHistory';

export default function AccountPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account, billing, and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{appUser?.name || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{appUser?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <p className="text-gray-900 text-sm font-mono">{appUser?.uid}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Plan</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {appUser?.plan || 'Free'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p className="text-gray-900">
                    {appUser?.createdAt ? new Date(appUser.createdAt as any).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Credits */}
            <CreditDisplay />

            {/* Subscription Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Current Plan</h3>
                    <p className="text-sm text-gray-600">
                      {appUser?.plan === 'free' 
                        ? 'You are currently on the free plan with 3 credits'
                        : `You are on the ${appUser?.plan} plan`
                      }
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appUser?.plan === 'free' 
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {appUser?.plan === 'free' ? 'Free' : 'Active'}
                  </span>
                </div>

                {appUser?.subscriptionStatus && (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">Subscription Status</h3>
                      <p className="text-sm text-gray-600">
                        {appUser.subscriptionStatus === 'active' 
                          ? 'Your subscription is active and will auto-renew'
                          : 'Your subscription is not active'
                        }
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appUser.subscriptionStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {appUser.subscriptionStatus}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => router.push('/pricing')}
                    className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                  >
                    {appUser?.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                  </button>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <BillingHistory />
          </div>
        </div>
      </main>
    </div>
  );
}