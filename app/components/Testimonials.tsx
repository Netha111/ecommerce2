export default function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Founder & CEO",
            company: "StyleCraft Boutique",
            photo: "SC",
            quote: "StyleForge AI transformed our product photography game. We went from basic product shots to professional lifestyle images that increased our conversion rate by 23% in just 2 months.",
            rating: 5,
            image: "Fashion & Apparel"
        },
        {
            name: "Marcus Rodriguez",
            role: "E-commerce Manager",
            company: "TechFlow Electronics",
            photo: "MR",
            quote: "The speed and quality of transformations are incredible. We process hundreds of product images weekly, and the AI consistently delivers studio-quality results that our customers love.",
            rating: 5,
            image: "Electronics"
        },
        {
            name: "Emma Thompson",
            role: "Marketing Director",
            company: "GreenHome Living",
            photo: "ET",
            quote: "Our home decor products now look like they belong in a luxury magazine. The AI understands our brand aesthetic perfectly and creates variations that drive sales.",
            rating: 5,
            image: "Home & Garden"
        }
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-[#FF6B35]' : 'text-gray-300'
                    }`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-[#2D3748] mb-6">
                        What Our Customers Say
                    </h2>
                    <p className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Here's what e-commerce leaders are saying about StyleForge AI.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="group">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover-lift">
                                {/* Customer Photo and Info */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#0F3DFF] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {testimonial.photo}
                                    </div>
                                    <div>
                                        <h4 className="font-poppins font-semibold text-lg text-[#2D3748]">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        <p className="text-sm text-[#0F3DFF] font-medium">{testimonial.company}</p>
                                    </div>
                                </div>

                                {/* Quote */}
                                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                                    "{testimonial.quote}"
                                </blockquote>

                                {/* Star Rating */}
                                <div className="flex items-center gap-1 mb-6">
                                    {renderStars(testimonial.rating)}
                                    <span className="ml-2 text-sm text-gray-600">
                                        {testimonial.rating}.0 rating
                                    </span>
                                </div>

                                {/* Sample Image Category */}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-[#0F3DFF]/10 to-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-[#0F3DFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            Transformed {testimonial.image} products
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Proof Section */}
                <div className="mt-20 text-center">
                    <div className="bg-gradient-to-r from-[#0F3DFF]/5 to-[#FF6B35]/5 rounded-2xl p-8 border border-[#0F3DFF]/10">
                        <h3 className="font-poppins font-semibold text-2xl text-[#2D3748] mb-6">
                            Join 500+ Successful Merchants
                        </h3>
                        <p className="font-inter text-gray-600 mb-8 max-w-2xl mx-auto">
                            Transform your product photography and join the ranks of successful e-commerce businesses that have increased their sales with StyleForge AI.
                        </p>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#48BB78] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 font-medium">No Setup Fees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#48BB78] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 font-medium">Instant Results</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#48BB78] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 font-medium">Money-Back Guarantee</span>
                            </div>
                        </div>

                        <button className="bg-gradient-to-r from-[#0F3DFF] to-[#FF6B35] text-white px-8 py-4 rounded-xl font-medium text-lg hover:shadow-lg hover:shadow-[#0F3DFF]/25 transition-all duration-200 hover:scale-105">
                            Start Your Free Trial Today
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

