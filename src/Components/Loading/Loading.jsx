import React from 'react';
import { Heart } from 'lucide-react';

const Loading = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="text-center">
                {/* Animated Heart Icon with Ripple */}
                <div className="relative inline-block mb-8">
                    {/* Ripple Effect (Background) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-2 border-red-200 dark:border-red-900/30 animate-ping opacity-40"></div>
                        <div className="absolute w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/40 animate-pulse"></div>
                    </div>

                    {/* Main Heart Icon */}
                    <div className="relative z-10 animate-bounce">
                        <Heart className="w-16 h-16 text-red-600 fill-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                    </div>
                </div>

                {/* Brand Name with matched colors */}
                <h1 className="text-4xl font-black tracking-tighter mb-2">
                    <span className="text-red-600">Blood</span>
                    <span className="text-emerald-600 dark:text-emerald-500">Heroes</span>
                </h1>

                {/* Loading Status */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                        Preparing to save lives...
                    </p>
                    
                    {/* Advanced Loading Bar */}
                    <div className="w-48 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-red-500 to-emerald-500 rounded-full animate-loading-slide"></div>
                    </div>
                </div>
            </div>

            {/* Custom Tailwind Animations in CSS */}
            <style jsx>{`
                @keyframes loading-slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-loading-slide {
                    animation: loading-slide 2s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default Loading;