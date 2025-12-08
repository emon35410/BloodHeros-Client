import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import logo from "../../assets/bloodheros_logo.png"

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Logo/Brand Section */}
                <div className="flex justify-center items-center mb-2">
                        <img
                            src={logo}
                            alt="BloodHeroes Logo"
                            className="h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-md"
                        />

                        <span className="text-xl lg:text-4xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-red-400 sm:inline">
                            Blood<span className='text-green-500'>Heroes</span>
                        </span>
                </div>

                {/* Error Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                    {/* Error Icon */}
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="w-24 h-24 text-red-500" />
                    </div>

                    {/* Error Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        404 - Page Not Found
                    </h2>

                    {/* Error Message */}
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        We couldn't find the page you're looking for. The donation you seek may have moved or no longer exists.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="inline-flex hover:cursor-pointer items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
                        >
                            <Home className="w-5 h-5" />
                            Go to Homepage
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex hover:cursor-pointer items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>
                    </div>
                </div>

                {/* Support Text */}
                <div className="text-center mt-8 text-gray-600">
                    <p>
                        Need help?{' '}
                        <a href="/contact" className="text-red-600 hover:text-red-700 font-semibold underline">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
