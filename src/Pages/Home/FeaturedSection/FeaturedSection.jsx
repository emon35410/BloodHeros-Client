import Aos from 'aos';
import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import featureData from '../../../../public/features.json';

const FeaturedSection = () => {
    useEffect(() => {
        Aos.init({ duration: 800, once: true });
    }, []);

    return (
        <section className="py-20 bg-[#FAFAFA] dark:bg-[#0B0F1A] transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-6">
                
                {/* Section Header */}
                <div data-aos="fade-up" className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 shadow-sm text-[10px] font-bold tracking-widest text-red-600 dark:text-red-400 uppercase">
                        Our Services
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-4">
                        Why Choose <span className="text-red-600">BloodHeroes</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                        We prioritize safety and speed to ensure every drop of blood reaches those who need it most.
                    </p>
                </div>

                {/* Grid with Image-style Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {featureData.map((feature, index) => (
                        <div
                            key={feature.id || index}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            className="group relative p-8 pt-10 bg-white dark:bg-[#11151F] rounded-2xl border border-gray-100 dark:border-gray-800/50 transition-all duration-300 shadow-sm hover:shadow-xl"
                        >
                            {/* Icon Box - Floating like the image */}
                            <div className={`absolute -top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center text-xl text-white bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300 z-10`}>
                                {feature.icon}
                            </div>

                            {/* Content - Left Aligned like the image */}
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-red-600 transition-colors">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;