import React, { useEffect } from 'react';
import { donationSteps } from './HowItWorksData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HowItWorks = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0C0F16] transition-colors duration-500 pb-20 overflow-hidden">
            {/* Page Header */}
            <header className="pt-10 pb-16 px-6 text-center" data-aos="fade-left">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-rose-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                        Step by Step Process
                    </h2>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        How It <span className="text-rose-600 font-serif  font-light">Works</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed">
                        The blood donation process is simple, safe, and saves lives. 
                        Here is what you can expect during your journey as a hero.
                    </p>
                </div>
            </header>

            {/* Steps Section */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>

                    {donationSteps.map((item, index) => (
                        <div 
                            key={item.id} 
                            data-aos="fade-up" 
                            data-aos-delay={index * 150}
                            className="relative z-10 group"
                        >
                            <div className="bg-white dark:bg-[#11151F] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-rose-500/20 transition-all duration-500 h-full">
                                
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg shadow-rose-600/30">
                                    STEP {item.step}
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <div className="text-center">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preparation Info (Extra Value) */}
            <section className="mt-24 max-w-4xl mx-auto px-6" data-aos="zoom-in">
                <div className="p-8 bg-rose-50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/10 text-center">
                    <h4 className="text-rose-600 font-bold text-sm mb-4 tracking-widest uppercase">Quick Tips</h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                        "Drink plenty of water and have a healthy meal before donating. Avoid heavy exercise immediately after the process. You're making a huge difference!"
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;