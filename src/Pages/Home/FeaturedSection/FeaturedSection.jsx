import Aos from 'aos';
import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import featureData from '../../../../public/features.json';

const FeaturedSection = () => {
    useEffect(() => {
        Aos.init({ duration: 800, once: true });
    }, []);

    return (
        <section className="py-16 bg-[#FAFAFA] dark:bg-[#0B0F1A] transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-6">
                
                {/* Section Header */}
                <div data-aos="fade-up" className="text-center mb-12">
                    <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md mb-3 uppercase">
                        Our Services
                    </span>
                    <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100 mb-3">
                        Why Choose <span className="text-red-600">BloodHeroes</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                        We prioritize safety and speed to ensure every drop of blood reaches those who need it most.
                    </p>
                </div>

                {/* Compact Grid with Small Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featureData.map((feature, index) => (
                        <div
                            key={feature.id || index}
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                            className="group p-5 bg-white dark:bg-[#161B27] rounded-xl border border-gray-100 dark:border-gray-800/50 hover:border-red-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            {/* Small & Soft Icon Box */}
                            <div className={`w-10 h-10 mb-4 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br ${feature.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {feature.title}
                            </h3>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;