import React, { useEffect } from 'react';
import { statisticsData } from './StatisticsData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const StatisticsSection = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <section className="py-10 bg-[#FDFDFD] dark:bg-[#0C0F16] transition-colors duration-500 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">

                {/* Centered Header */}
                {/* Centered Header */}
                <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">

                    {/* Updated Badge to work on both Light & Dark Mode */}
                    <div className="inline-flex items-center px-4 py-1.5 bg-slate-100 dark:bg-white/10 backdrop-blur-md rounded-full border border-slate-200 dark:border-white/20 mb-6 shadow-sm">
                        <h2 className="text-rose-600 dark:text-rose-500 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs">
                            Statistics & Impact
                        </h2>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                        The numbers behind every <span className="text-rose-600">heartbeat.</span>
                    </h3>
                    <div className="w-12 h-1 bg-rose-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                        Understanding the urgent need for blood donation helps us build a stronger community.
                    </p>
                </div>

                {/* Compact Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statisticsData.map((stat, index) => (
                        <div
                            key={stat.id}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            className="group relative p-6 bg-white dark:bg-[#11151F] rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center"
                        >
                            {/* Smaller Icon Container */}
                            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                                {stat.icon}
                            </div>

                            <div className="space-y-1 mb-4">
                                <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {stat.value}
                                </h4>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 dark:bg-rose-600/10 px-2 py-0.5 rounded-full inline-block">
                                    {stat.highlight}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                                    {stat.label}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[180px]">
                                    {stat.desc}
                                </p>
                            </div>

                            {/* Decorative Corner Index */}
                            <span className="absolute top-4 right-5 text-[10px] font-black text-slate-100 dark:text-slate-800/30 group-hover:text-rose-600/20 transition-colors">
                                0{index + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;