import React from 'react';
import { Heart } from 'lucide-react';

const Loading = () => {
    return (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
                <div className="text-center">
                    {/* Animated Heart Icon */}
                    <div className="relative inline-block mb-8">
                        <div className="animate-pulse">
                            <Heart className="w-20 h-20 text-red-600 fill-red-600" />
                        </div>

                        {/* Ripple Effect */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-4 border-red-300 animate-ping opacity-75"></div>
                        </div>
                    </div>

                    {/* Brand Name */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">BloodHeros</h1>

                    {/* Loading Text */}
                    <p className="text-gray-600 text-lg mb-8">Loading...</p>

                    {/* Loading Bar */}
                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
                    </div>

                    {/* Optional Loading Message */}
                    <p className="text-gray-500 text-sm mt-6">Preparing to save lives</p>
                </div>

                <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
            </div>
        </div>
    );
};

export default Loading;