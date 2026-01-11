import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { benefitsData } from './BenefitsData'; 

const Benefits = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <section className="py-14 bg-white dark:bg-[#0C0F16] transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
                    <h2 className="text-rose-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-3">
                        Donor Benefits
                    </h2>
                    <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                        Good for your <span className="text-rose-600 font-serif italic font-light">Health</span>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm">
                        Beyond saving others, blood donation has significant personal health advantages.
                    </p>
                </div>

                {/* Benefits Grid - Mapping from JS Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefitsData.map((item, i) => (
                        <div 
                            key={item.id} 
                            data-aos="fade-up"
                            data-aos-delay={i * 100}
                            className="group relative p-6 bg-slate-50 dark:bg-[#11151F] rounded-[2rem] border border-transparent hover:border-rose-500/20 hover:bg-white dark:hover:bg-[#161B27] transition-all duration-500 shadow-sm hover:shadow-xl"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 bg-white dark:bg-[#0C0F16] rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>

                            {/* Tag */}
                            <div className="mb-3">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 dark:bg-rose-600/10 px-2 py-0.5 rounded-md">
                                    {item.tag}
                                </span>
                            </div>

                            {/* Content */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-rose-600 transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Animated Indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;