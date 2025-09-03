'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { firebaseUser, appUser, signOutAsync } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#0F3DFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="font-poppins font-bold text-xl text-[#0F3DFF]">
                                StyleForge AI
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                            Pricing
                        </a>
                        <a href="#examples" className="text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                            Examples
                        </a>
                        <a href="#api" className="text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                            API
                        </a>
                        <a href="#blog" className="text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                            Blog
                        </a>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {firebaseUser ? (
                            <div className="flex items-center gap-3">
                                <Link href="/account" className="text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                                    {appUser?.email ?? 'Account'}
                                </Link>
                                <button onClick={signOutAsync} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/signin" className="text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                                    Sign in
                                </Link>
                                <Link href="/signup" className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e55a2b] transition-colors">
                                    Start Free Trial
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-[#0F3DFF] focus:outline-none focus:text-[#0F3DFF]"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
                            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                                Features
                            </a>
                            <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                                Pricing
                            </a>
                            <a href="#examples" className="block px-3 py-2 text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                                Examples
                            </a>
                            <a href="#api" className="block px-3 py-2 text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                                API
                            </a>
                            <a href="#blog" className="block px-3 py-2 text-gray-700 hover:text-[#0F3DFF] transition-colors font-medium">
                                Blog
                            </a>
                            <div className="pt-4 border-t border-gray-2 00">
                                {firebaseUser ? (
                                    <>
                                        <Link href="/account" className="block px-3 py-2 text-gray-700 hover:text-[#0F3DFF] font-medium">Account</Link>
                                        <button onClick={signOutAsync} className="w-full mt-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200">Sign out</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/signin" className="block px-3 py-2 text-gray-700 hover:text-[#0F3DFF] font-medium">Sign in</Link>
                                        <Link href="/signup" className="w-full mt-2 inline-block text-center bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e55a2b]">Start Free Trial</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

