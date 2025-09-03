export default function Statistics() {
    const stats = [
        {
            number: "10,000+",
            label: "Products Transformed",
            color: "text-[#2D3748]"
        },
        {
            number: "500+",
            label: "Happy Merchants",
            color: "text-[#FF6B35]"
        },
        {
            number: "15%",
            label: "Average Sales Increase",
            color: "text-[#48BB78]"
        },
        {
            number: "99.2%",
            label: "Satisfaction Rate",
            color: "text-[#0F3DFF]"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-[#2D3748] mb-6">
                        Trusted by E-commerce Leaders
                    </h2>
                    <p className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Join thousands of successful merchants who have transformed their product photography and increased their sales with our AI platform.
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="mb-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#0F3DFF]/10 to-[#FF6B35]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#0F3DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className={`font-poppins font-bold text-4xl md:text-5xl lg:text-6xl mb-3 ${stat.color}`}>
                                {stat.number}
                            </div>
                            <p className="font-inter text-gray-600 text-lg">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-20 text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-8 bg-gray-50 rounded-2xl px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#48BB78] rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">SSL Secured</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#48BB78] rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">SOC2 Compliant</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#48BB78] rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">GDPR Ready</span>
                        </div>
                    </div>
                </div>

                {/* ROI Calculator Preview */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-[#0F3DFF]/5 to-[#FF6B35]/5 rounded-2xl p-8 border border-[#0F3DFF]/10">
                        <h3 className="font-poppins font-semibold text-2xl text-[#2D3748] mb-4">
                            Calculate Your Potential ROI
                        </h3>
                        <p className="font-inter text-gray-600 mb-6 max-w-2xl mx-auto">
                            See how much you could save and earn by transforming your product photography with our AI platform.
                        </p>
                        <button className="bg-[#0F3DFF] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0d2fd8] transition-colors">
                            Try ROI Calculator
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

