import React, { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router';

const Banner = () => {
    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden ">

            <div
                className="absolute inset-0 rounded-3xl bg-cover bg-center"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1725857515127-eda91bda6035?q=80&w=2033&auto=format&fit=crop)",
                }}
            >
                {/* শুধু ব্রাইটনেস কমানোর জন্য এই নিচের লাইনটি যোগ করা হয়েছে */}
                <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
            </div>

            {/* Glowing Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            {/* Content: Centered perfectly using flex-col and h-full */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">

                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    {/* Badge */}
                    <div data-aos="fade-up" className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 animate-bounce">
                        <span className="text-xl">🩸</span>
                        <span className="text-white font-semibold text-xs uppercase tracking-widest">Be A Hero Today</span>
                    </div>

                    {/* Heading - Adjusted sizes for better fit */}
                    <div data-aos="fade-up" className="space-y-2 mb-6">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white tracking-tight">
                            Save Lives,
                            <span className="block text-red-400">Donate Blood</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-white max-w-2xl mx-auto leading-relaxed opacity-100 font-medium drop-shadow-sm">
                            Join our community of heroes and help save lives by donating blood.
                            Every drop counts, and your contribution can bring hope and health.
                        </p>
                    </div>

                    {/* Stats Grid - Compacted to prevent vertical overflow */}
                    <div data-aos="fade-down" className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 w-full max-w-3xl">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/20 hover:bg-white/15 transition-all">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-300">10k+</div>
                            <div className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-tighter">Saved</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/20 hover:bg-white/15 transition-all">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-300">5k+</div>
                            <div className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-tighter">Donors</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/20 hover:bg-white/15 transition-all">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-300">24/7</div>
                            <div className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-tighter">Support</div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div data-aos="fade-right" className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <Link to="/donateblood" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <span>❤️ Donate Now</span>
                        </Link>
                        <Link to="/searchDonor" className="w-full sm:w-auto px-8 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                            <span>🔍 Find Blood</span>
                        </Link>
                    </div>

                </div>
            </div>

            {/* Bottom Arrow Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce z-10 opacity-40">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
};

export default Banner;