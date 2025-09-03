export default function WhyChooseUs() {
    const benefits = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "3 Variations in 30 Seconds",
            description: "Get three professional variations of your product photo in under 30 seconds. No waiting, no delays."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Professional Studio Results",
            description: "AI-powered transformations that rival professional photography studios. Perfect lighting, composition, and styling."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            title: "90% Less Than Hiring Photographers",
            description: "Save thousands on professional photography. Our AI delivers studio-quality results at a fraction of the cost."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            title: "Process Hundreds of Products Daily",
            description: "Scale your e-commerce business efficiently. Transform entire product catalogs in minutes, not days."
        }
    ];

    return (
        <section className="py-20 gradient-bg relative overflow-hidden">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2L74 40h-2zm4 0l4-4v2L78 40h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                        Why Choose Our Platform
                    </h2>
                    <p className="font-inter text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                        Experience the future of e-commerce photography with our AI-powered platform designed to maximize your sales potential.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="group">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover-lift">
                                {/* Icon */}
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#FF6B35] transition-colors duration-300">
                                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                                        {benefit.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="font-poppins font-semibold text-xl text-white mb-4">
                                    {benefit.title}
                                </h3>
                                <p className="font-inter text-white/80 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Benefits */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-8 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#48BB78] rounded-full"></div>
                            <span className="text-white font-medium">No Watermarks</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#48BB78] rounded-full"></div>
                            <span className="text-white font-medium">Commercial License</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#48BB78] rounded-full"></div>
                            <span className="text-white font-medium">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

