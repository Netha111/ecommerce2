'use client';

import Image from 'next/image';

export default function BeforeAfterGallery() {
    const items = [
        { before: '/images/before1.jpeg', after: '/images/after1.png' },
        { before: '/images/before2.jpeg', after: '/images/after2.png' },
        { before: '/images/before3.webp', after: '/images/after3.png' }
    ];

    return (
        <section id="examples" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-[#2D3748] mb-6">
                        See The Transformation
                    </h2>
                    <p className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        From ordinary product shots to conversion-ready e‑commerce visuals. No uploads here — just a preview of the results you can expect for clothing stores.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((img, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="relative aspect-[4/5]">
                                {/* Before image */}
                                <Image src={img.before} alt={`Before ${index + 1}`} fill className="object-cover" sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" />
                                {/* After image with crossfade on hover */}
                                <Image src={img.after} alt={`After ${index + 1}`} fill className="object-cover opacity-0 transition-opacity duration-500 ease-out hover:opacity-100" sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" />

                                {/* Labels */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="text-[11px] tracking-wider px-2 py-1 rounded-md bg-white/85 text-gray-700 border border-gray-200">BEFORE</span>
                                </div>
                                <div className="pointer-events-none absolute top-3 right-3 z-10 opacity-0 transition-opacity duration-500 ease-out hover:opacity-100">
                                    <span className="text-[11px] tracking-wider px-2 py-1 rounded-md bg-[#48BB78] text-white">AFTER</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-poppins font-semibold text-base text-[#2D3748]">Clothing product enhancement</h3>
                                <p className="text-sm text-gray-600 mt-1">Hover to reveal the improved image.</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <p className="text-gray-600 mb-6 font-inter">Ready to give your catalogue the same upgrade?</p>
                    <a href="#pricing" className="inline-block bg-gradient-to-r from-[#0F3DFF] to-[#FF6B35] text-white px-8 py-4 rounded-xl font-medium text-lg hover:shadow-lg hover:shadow-[#0F3DFF]/25 transition-all duration-200 hover:scale-105">Start your transformation</a>
                </div>
            </div>
        </section>
    );
}

