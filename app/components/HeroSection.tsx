'use client';

import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center bg-gradient-to-br from-[#F7FAFC] to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="font-inter font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-[#2D3748]">
                                Transform Your Product Photos Into{' '}
                                <span className="text-gradient">Sales-Driving Visuals</span>
                            </h1>

                            <p className="font-inter text-lg md:text-xl text-gray-600 leading-relaxed">
                                Instantly showcase how our AI upgrades clothing product shots — see the transformation right away below.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#pricing" className="bg-[#FF6B35] text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#e55a2b] transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6B35]/25 hover:scale-105">
                                Try Free Transformation
                            </a>
                            <a href="#examples" className="border-2 border-[#FF6B35] text-[#FF6B35] px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#FF6B35] hover:text-white transition-all duration-200">
                                View More Results
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="text-[#48BB78] text-lg">✓</span>
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#48BB78] text-lg">✓</span>
                                <span>30-Second Results</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#48BB78] text-lg">✓</span>
                                <span>Built for Fashion/E‑commerce</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Immediate Before/After Showcase */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100">
                            <div className="text-center mb-3 sm:mb-4">
                                <h3 className="font-poppins font-semibold text-lg text-gray-800">Before → After (Live Preview)</h3>
                            </div>

                            {/* Comparison */}
                            <div className="relative rounded-xl overflow-hidden">
                                <div className="grid grid-cols-2">
                                    {/* Before */}
                                    <div className="relative aspect-[4/5]">
                                        <Image src="/images/before1.jpeg" alt="Before product" fill className="object-cover" sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 540px" />
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[11px] tracking-wider px-2 py-1 rounded-md bg-white/85 text-gray-700 border border-gray-200">BEFORE</span>
                                        </div>
                                    </div>
                                    {/* After */}
                                    <div className="relative aspect-[4/5]">
                                        <Image src="/images/after1.png" alt="After product" fill className="object-cover" sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 540px" />
                                        <div className="absolute top-3 right-3">
                                            <span className="text-[11px] tracking-wider px-2 py-1 rounded-md bg-[#48BB78] text-white">AFTER</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Arrow Indicator */}
                                <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M8 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-[#FF6B35] to-[#FF6B35]"></div>
                            </div>

                            <p className="text-center text-sm text-gray-600 mt-3">Optimized for apparel — clean backgrounds, sharp details, catalogue‑ready.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

