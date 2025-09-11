export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for small businesses and individual sellers",
      features: [
        "50 AI transformations per month",
        "3 style variations per image",
        "HD quality downloads",
        "Basic support",
        "Standard processing time"
      ],
      cta: "Start Free Trial",
      ctaColor: "bg-[#FF6B35] hover:bg-[#e55a2b]",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing e-commerce businesses",
      features: [
        "500 AI transformations per month",
        "5 style variations per image",
        "4K quality downloads",
        "Priority support",
        "Faster processing time",
        "Custom style presets",
        "Bulk processing"
      ],
      cta: "Start Free Trial",
      ctaColor: "bg-[#FF6B35] hover:bg-[#e55a2b]",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large-scale operations and agencies",
      features: [
        "Unlimited AI transformations",
        "Unlimited style variations",
        "8K quality downloads",
        "24/7 dedicated support",
        "Instant processing",
        "Custom AI training",
        "API access",
        "White-label solutions"
      ],
      cta: "Contact Sales",
      ctaColor: "bg-[#FF6B35] hover:bg-[#e55a2b]",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-[#F7FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-[#2D3748] mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core AI transformation technology with no hidden fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div key={index} className={`relative ${
              plan.popular 
                ? 'lg:scale-105 z-10' 
                : 'lg:scale-100'
            }`}>
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#FF6B35] text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`h-full rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-white border-2 border-[#FF6B35] shadow-2xl' 
                  : plan.name === 'Enterprise'
                    ? 'bg-[#2D3748] text-white'
                    : 'bg-white shadow-lg'
              } border-gray-100`}>
                
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className={`font-poppins font-semibold text-2xl mb-2 ${
                    plan.name === 'Enterprise' ? 'text-white' : 'text-[#2D3748]'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${
                    plan.name === 'Enterprise' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <span className={`font-poppins font-bold text-4xl ${
                      plan.name === 'Enterprise' ? 'text-white' : 'text-[#2D3748]'
                    }`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${
                      plan.name === 'Enterprise' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#48BB78] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={`text-sm ${
                        plan.name === 'Enterprise' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-colors ${plan.ctaColor}`}>
                  {plan.cta}
                </button>

                {/* Additional Info */}
                {plan.name === 'Starter' && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Free trial includes 5 transformations
                  </p>
                )}
                {plan.name === 'Professional' && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Free trial includes 25 transformations
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="font-poppins font-semibold text-2xl text-[#2D3748] mb-6">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-medium text-[#2D3748] mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#2D3748] mb-2">What image formats do you support?</h4>
                <p className="text-gray-600 text-sm">We support JPG, PNG, WEBP, and most common image formats up to 10MB.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#2D3748] mb-2">Do I own the transformed images?</h4>
                <p className="text-gray-600 text-sm">Absolutely! All transformed images are yours to use commercially with no restrictions.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#2D3748] mb-2">Is there a limit on image size?</h4>
                <p className="text-gray-600 text-sm">We can process images up to 4K resolution. Higher resolutions available on Professional and Enterprise plans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
