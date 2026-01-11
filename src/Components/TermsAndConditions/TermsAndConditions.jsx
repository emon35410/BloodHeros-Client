import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TermsAndConditions = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing and using BloodHeroes, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services."
        },
        {
            title: "2. Eligibility",
            content: "Users must be at least 18 years old to register as a donor. Donors must meet the health and safety requirements specified by local medical authorities before donating blood."
        },
        {
            title: "3. User Responsibilities",
            content: "You are responsible for providing accurate and truthful information. Any misuse of the platform, including providing false medical data or harassing other users, will lead to immediate account termination."
        },
        {
            title: "4. Privacy & Data",
            content: "Your privacy is our priority. We only collect essential data to connect donors with recipients. Please review our Privacy Policy for details on how we handle your information."
        },
        {
            title: "5. Disclaimer",
            content: "BloodHeroes is a platform to connect donors and recipients. We do not provide medical advice or perform blood transfusions. Always consult with a certified medical professional."
        }
    ];

    return (
        <section className="py-20 bg-[#FDFDFD] dark:bg-[#0C0F16] transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="text-center mb-16" data-aos="fade-up">
                    <div className="inline-flex items-center px-4 py-1.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-full mb-6">
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Legal Information</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Terms & <span className="text-rose-600">Conditions</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Last updated: January 11, 2026
                    </p>
                </div>

                {/* Terms Content */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div 
                            key={index} 
                            data-aos="fade-up" 
                            data-aos-delay={index * 100}
                            className="p-8 bg-white dark:bg-[#11151F] rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all group"
                        >
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center bg-rose-600 text-white rounded-lg text-sm font-black shadow-lg shadow-rose-600/20">
                                    {index + 1}
                                </span>
                                {section.title}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default TermsAndConditions;