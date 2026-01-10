import React from 'react';
import { aboutData } from '../../Components/AboutUs/AboutData';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0C0F16] transition-colors duration-500 pb-20">
            {/* Simple Header */}
            <header className="pt-10 pb-12 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                        About <span className="text-rose-600">BloodHeroes</span>
                    </h1>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Helping people find blood donors quickly and easily. Our mission is to save lives through community support.
                    </p>
                </div>
            </header>

            {/* Simple Story Section */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <img 
                        src={aboutData.history.image} 
                        alt="Story" 
                        className="rounded-2xl shadow-md w-full h-64 object-cover border border-slate-100 dark:border-slate-800"
                    />
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{aboutData.history.title}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {aboutData.history.content}
                        </p>
                    </div>
                </div>
            </section>

            {/* Minimalist Cards */}
            <section className="py-12 px-6 bg-slate-50/50 dark:bg-slate-900/10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {aboutData.values.map((item) => (
                        <div key={item.id} className="p-6 bg-white dark:bg-[#11151F] border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm transition-hover hover:border-rose-500/30">
                            <div className="text-3xl mb-4">{item.icon}</div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default AboutUs;