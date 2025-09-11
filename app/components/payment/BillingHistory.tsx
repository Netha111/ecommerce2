'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface PaymentRecord {
  id: string;
  amount: number;
  credits: number;
  plan: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  paymentMethod: string;
  transactionId: string;
}

export default function BillingHistory() {
  const { appUser } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - in a real app, this would fetch from your API
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        amount: 1999,
        credits: 500,
        plan: 'Professional',
        status: 'completed',
        createdAt: new Date().toISOString(),
        paymentMethod: 'Razorpay',
        transactionId: 'txn_123456789'
      },
      {
        id: '2',
        amount: 1,
        credits: 50,
        plan: 'Starter',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        paymentMethod: 'Razorpay',
        transactionId: 'txn_987654321'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h2>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h2>
      
      {payments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No payment history found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{payment.plan} Plan</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Amount: ₹{payment.amount}</p>
                    <p>Credits: {payment.credits}</p>
                    <p>Method: {payment.paymentMethod}</p>
                    <p>Transaction ID: {payment.transactionId}</p>
                    <p>Date: {formatDate(payment.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">₹{payment.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
