import React, { useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import Aos from 'aos';
import 'aos/dist/aos.css';
// JSON ডেটা ইমপোর্ট করুন
import collabData from '../../../../public/collaboratorsData.json';

const Collaborators = () => {
    useEffect(() => {
        Aos.init({ duration: 800, once: true });
    }, []);

    return (
        <section className="py-20 bg-[#FDFDFD] dark:bg-[#0B0F16] transition-colors duration-500 relative overflow-hidden">
            {/* Soft Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-400 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div data-aos="fade-up" className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-full mb-4 uppercase">
                        Our Network
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                        Our Trusted <span className="text-rose-600">Collaborators</span>
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Building a robust network with global partners to ensure life-saving blood is available whenever it's needed.
                    </p>
                </div>

                {/* Stats Section - More Compact */}
                <div data-aos="fade-up" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {collabData.stats.map((stat) => (
                        <div key={stat.id} className="bg-white dark:bg-[#151923] rounded-2xl p-5 text-center shadow-sm border border-slate-100 dark:border-slate-800/50">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-2xl font-black text-rose-600 dark:text-rose-500 mb-1">{stat.number}</div>
                            <div className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-500 font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Partners Marquee - Resized Cards */}
                <Marquee pauseOnHover={true} gradient={true} gradientColor={document.documentElement.classList.contains('dark') ? [11, 15, 22] : [253, 253, 253]} gradientWidth={50} speed={60}>
                    <div className="flex py-6 gap-6 px-4">
                        {collabData.partners.map((partner) => (
                            <div
                                key={partner.id}
                                className="group bg-white dark:bg-[#151923] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 dark:border-slate-800/50 relative overflow-hidden w-[280px]"
                            >
                                {/* Mini Icon & Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${partner.color} rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                                        {partner.icon}
                                    </div>
                                    <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${partner.color} text-white uppercase tracking-tighter`}>
                                    {partner.type}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2 mb-2 group-hover:text-rose-600 transition-colors">
                                    {partner.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {partner.desc}
                                </p>

                                {/* Aesthetic Background Blur in card */}
                                <div className={`absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br ${partner.color} opacity-5 group-hover:opacity-20 rounded-full transition-all duration-700`}></div>
                            </div>
                        ))}
                    </div>
                </Marquee>

            </div>
        </section>
    );
};

export default Collaborators;