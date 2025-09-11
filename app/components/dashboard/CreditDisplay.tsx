'use client';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface CreditDisplayProps {
  showBuyButton?: boolean;
  className?: string;
}

export default function CreditDisplay({ showBuyButton = true, className = '' }: CreditDisplayProps) {
  const { appUser } = useAuth();

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-[#0F3DFF] bg-opacity-10 rounded-lg">
            <svg className="w-6 h-6 text-[#0F3DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Available Credits</p>
            <p className="text-2xl font-bold text-gray-900">{appUser?.credits || 0}</p>
          </div>
        </div>
        
        {showBuyButton && (
          <Link
            href="/pricing"
            className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
          >
            Buy Credits
          </Link>
        )}
      </div>
      
      {appUser?.credits === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            You&apos;re out of credits! Purchase more to continue transforming images.
          </p>
        </div>
      )}
    </div>
  );
}
