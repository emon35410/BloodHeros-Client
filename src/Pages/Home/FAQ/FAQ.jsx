import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { faqData } from './FAQData'; 

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        AOS.init({ 
            duration: 1000, 
            once: true,
            offset: 100
        });
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
        
        setTimeout(() => {
            AOS.refresh();
        }, 500);
    };

    return (
        <section className="py-24 bg-slate-50 dark:bg-[#0C0F16] transition-colors duration-500 overflow-hidden">
            <div className="max-w-4xl mx-auto px-6">
                
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-rose-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-3">
                        Common Questions
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                        Frequently Asked <span className="text-rose-600 font-serif italic font-light">Questions</span>
                    </h3>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div 
                            key={item.id}
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                            className={`group border rounded-[2rem] transition-all duration-500 ${
                                activeIndex === index 
                                ? 'bg-white dark:bg-[#11151F] border-rose-500/30 shadow-xl' 
                                : 'bg-white/50 dark:bg-[#11151F]/40 border-slate-200 dark:border-slate-800'
                            }`}
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                            >
                                <span className={`text-sm md:text-base font-bold transition-colors duration-300 ${
                                    activeIndex === index ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    {item.question}
                                </span>
                                
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    activeIndex === index 
                                    ? 'bg-rose-600 text-white rotate-180 shadow-lg shadow-rose-500/20' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}>
                                    {activeIndex === index ? '−' : '+'}
                                </span>
                            </button>

                            <div 
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                    activeIndex === index 
                                    ? 'max-h-[500px] opacity-100 visible' 
                                    : 'max-h-0 opacity-0 invisible'
                                }`}
                            >
                                <div className="px-6 md:px-8 pb-6 text-[13px] md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center mt-12 text-xs text-slate-400 font-medium" data-aos="fade-up">
                    Still have more questions? <span className="text-rose-600 cursor-pointer hover:underline font-bold">Contact our support team</span>
                </p>
            </div>
        </section>
    );
};

export default FAQ;