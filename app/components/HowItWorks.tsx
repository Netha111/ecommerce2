export default function HowItWorks() {
    const steps = [
        {
            icon: (
                <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
            ),
            title: "Upload Your Image",
            description: "Simply drag and drop your product photo or click to browse. We support all major image formats."
        },
        {
            icon: (
                <div className="w-16 h-16 bg-[#0F3DFF] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            ),
            title: "AI Processing",
            description: "Our advanced AI analyzes your image and creates 3 professional variations optimized for e-commerce success."
        },
        {
            icon: (
                <div className="w-16 h-16 bg-[#48BB78] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            ),
            title: "Download Results",
            description: "Get your transformed images in 30 seconds. Download all 3 versions in high resolution, ready for your store."
        }
    ];

    return (
        <section id="features" className="py-20 bg-[#F7FAFC] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F3DFF' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-[#2D3748] mb-6">
                        How It Works
                    </h2>
                    <p className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Transform your product photos in just three simple steps. Our AI-powered platform makes professional e-commerce photography accessible to everyone.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center group">
                            {/* Step Number */}
                            <div className="relative mb-6">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-gray-100">
                                    <span className="font-poppins font-bold text-lg text-[#0F3DFF]">{index + 1}</span>
                                </div>

                                {/* Icon */}
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="font-poppins font-semibold text-xl text-[#2D3748] mb-4">
                                {step.title}
                            </h3>
                            <p className="font-inter text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Process Flow Lines */}
                <div className="hidden md:block mt-16">
                    <div className="flex items-center justify-center">
                        {steps.map((_, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100">
                                    <span className="font-poppins font-bold text-lg text-[#0F3DFF]">{index + 1}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="w-24 h-1 bg-gradient-to-r from-[#0F3DFF] to-[#FF6B35] mx-4 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

