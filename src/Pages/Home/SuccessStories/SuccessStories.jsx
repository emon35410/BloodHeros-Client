import React, { useEffect } from 'react';
import { successStories } from './SuccessStoriesData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SuccessStories = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const doubleStories = [...successStories, ...successStories];

    return (
        <section className="py-24 bg-white dark:bg-[#0C0F16] transition-colors duration-500 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 mb-16">
                <div className="text-center max-w-2xl mx-auto" data-aos="fade-up">
                    <h2 className="text-rose-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">Success Stories</h2>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                        Real Stories from Our <br /> <span className="text-rose-600 font-serif italic font-light">Community</span>
                    </h3>
                </div>
            </div>

            {/* Infinite Marquee Wrapper */}
            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap py-10 group-hover:pause">
                    {doubleStories.map((item, index) => (
                        <div 
                            key={`${item.id}-${index}`} 
                            className="inline-block w-[350px] mx-4 p-8 bg-slate-50 dark:bg-[#11151F] rounded-[2rem] border border-transparent hover:border-rose-500/20 transition-all duration-500 whitespace-normal relative"
                        >
                            <div className="absolute top-6 right-8 text-rose-600/10 text-5xl font-serif">“</div>
                            
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 italic relative z-10">
                                "{item.story}"
                            </p>

                            <div className="flex items-center gap-4">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-sm"
                                />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Tailwind Animation CSS */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 40s linear infinite;
                }
                .group-hover\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default SuccessStories;