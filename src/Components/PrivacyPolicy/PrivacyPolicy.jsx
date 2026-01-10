import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PrivacyPolicy = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0C0F16] transition-colors duration-500 pb-24 overflow-hidden">
            <div className="max-w-3xl mx-auto px-6 pt-10">
                <header className="mb-16 border-b border-slate-100 dark:border-slate-800 pb-10" data-aos="fade-down">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                        Privacy <span className="text-rose-600">Policy</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        At BloodHeroes, we are committed to protecting your personal information and your right to privacy.
                    </p>
                </header>

                <div className="space-y-12">
                    <section data-aos="fade-up">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                            Information Collection
                        </h2>
                        <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                            <p>
                                We collect personal information that you voluntarily provide to us when you register on the platform. This includes:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium">
                                <li className="flex items-center gap-2">• Name and Contact Data</li>
                                <li className="flex items-center gap-2">• Blood Group Type</li>
                                <li className="flex items-center gap-2">• Location (City/Area)</li>
                                <li className="flex items-center gap-2">• Donation Availability</li>
                            </ul>
                        </div>
                    </section>

                    <section data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                            How We Use Data
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            The primary purpose of collecting your data is to facilitate the blood donation process. Your information allows seekers to find and contact you during urgent needs.
                        </p>
                        <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm italic text-slate-500 dark:text-slate-400">
                            "We do not share, sell, or trade your personal information with third-party advertisers or marketing companies."
                        </div>
                    </section>

                    <section data-aos="fade-up" data-aos-delay="200">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                            Data Security
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We implement a variety of security measures to maintain the safety of your personal information. Your data is stored in secured networks and is only accessible by a limited number of persons who have special access rights.
                        </p>
                    </section>

                    <section data-aos="fade-up" data-aos-delay="300">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                            Your Rights
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            You have the right to review, change, or terminate your account at any time. If you wish to delete your data from our servers, you can do so through your profile settings or by contacting our support.
                        </p>
                    </section>
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 text-center" data-aos="zoom-in">
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        Have questions? Email us at <span className="text-rose-600 font-bold">privacy@bloodheroes.org</span>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default PrivacyPolicy;