import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';

const Newsletter = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: 'Welcome to the Hero Network!',
            background: document.documentElement.classList.contains('dark') ? '#11151F' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
            iconColor: '#E11D48', 
        });

        e.target.reset(); 
    };

    return (
        <section className="py-24 bg-white dark:bg-[#0C0F16] transition-colors duration-500 overflow-hidden">
            {/* Max width increased to 7xl for a wider, more professional feel */}
            <div className="max-w-7xl mx-auto px-6">
                <div 
                    data-aos="fade-up"
                    className="relative p-10 md:p-20 bg-slate-50 dark:bg-[#11151F] rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                    {/* Enhanced Background Glows */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        
                        <div className="text-center lg:text-left max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 mb-8">
                                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Newsletter</span>
                            </div>
                            
                            <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1.05] tracking-tight">
                                Join the <span className="text-rose-600 font-serif italic font-light">Hero</span> Network
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed max-w-lg">
                                Get real-time alerts for urgent blood needs in your area and discover how your contribution saves lives.
                            </p>
                        </div>

                        {/* Wider Form Container */}
                        <div className="w-full max-w-lg">
                            <form 
                                onSubmit={handleSubmit}
                                className="relative flex flex-col sm:flex-row items-center gap-3 p-2.5 bg-white dark:bg-[#0C0F16] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group transition-all focus-within:border-rose-600/50"
                            >
                                <div className="flex-1 w-full flex items-center gap-4 px-5">
                                    <span className="text-xl opacity-70">✉️</span>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email address" 
                                        required
                                        className="w-full py-4 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm md:text-base font-medium"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white text-xs md:text-sm font-black uppercase tracking-widest rounded-[2rem] transition-all shadow-lg shadow-rose-600/30 active:scale-95 whitespace-nowrap"
                                >
                                    Subscribe Now
                                </button>
                            </form>
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-1.5">
                                    <span className="text-rose-500">✨</span> No spam
                                </span>
                                <span className="hidden sm:block opacity-30">|</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="text-rose-500">🚀</span> Life-saving updates
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;