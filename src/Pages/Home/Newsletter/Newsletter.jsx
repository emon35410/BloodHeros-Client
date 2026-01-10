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

        // SweetAlert2 Toast Configuration
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
            <div className="max-w-6xl mx-auto px-6">
                <div 
                    data-aos="fade-up"
                    className="relative p-8 md:p-16 bg-slate-50 dark:bg-[#11151F] rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                    {/* Background Glows */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-600/5 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        
                        <div className="text-center lg:text-left max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 mb-6">
                                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Newsletter</span>
                            </div>
                            
                            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1]">
                                Join the <span className="text-rose-600 font-serif italic font-light">Hero</span> Network
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed">
                                Get real-time alerts for urgent blood needs in your area and discover how your contribution saves lives.
                            </p>
                        </div>

                        <div className="w-full max-w-md">
                            <form 
                                onSubmit={handleSubmit}
                                className="relative flex flex-col sm:flex-row items-center gap-3 p-2 bg-white dark:bg-[#0C0F16] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-inner group transition-all focus-within:border-rose-600/50"
                            >
                                <div className="flex-1 w-full flex items-center gap-3 px-4">
                                    <span className="text-lg">✉️</span>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required
                                        className="w-full py-3 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm font-medium"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all shadow-lg shadow-rose-600/20 active:scale-95"
                                >
                                    Subscribe
                                </button>
                            </form>
                            <p className="mt-4 text-center lg:text-left text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                ✨ No spam, just life-saving updates
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;