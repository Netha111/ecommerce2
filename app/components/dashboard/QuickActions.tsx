'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function QuickActions() {
  const { appUser } = useAuth();

  const actions = [
    {
      title: 'Upload & Transform',
      description: 'Upload your product images and transform them with AI',
      href: '/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-[#FF6B35] hover:bg-[#e55a2b]'
    },
    {
      title: 'View Gallery',
      description: 'Browse all your transformed images',
      href: '/dashboard/gallery',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Buy Credits',
      description: 'Purchase more credits for transformations',
      href: '/pricing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Account Settings',
      description: 'Manage your account and billing',
      href: '/account',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg text-white ${action.color} transition-colors`}>
              {action.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {action.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
