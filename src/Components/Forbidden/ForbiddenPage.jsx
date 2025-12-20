import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';

const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Visual Icon Section */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                        <div className="w-32 h-32 bg-red-100 rounded-full"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="bg-white p-6 rounded-2xl shadow-xl">
                            <ShieldAlert className="w-16 h-16 text-red-500" />
                        </div>
                    </div>
                    {/* Floating Lock Icon */}
                    <div className="absolute -top-2 right-1/3 bg-yellow-400 p-2 rounded-lg shadow-lg rotate-12">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-6xl font-black text-gray-900 mb-4">403</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Access Denied
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Oops! It looks like you've reached a restricted area.
                    You don't have the permissions required to view this page.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all duration-200"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>

                {/* Friendly Support Note */}
                <p className="mt-12 text-sm text-gray-400">
                    If you believe this is an error, please contact your administrator.
                </p>
            </div>
        </div>
    );
};

export default ForbiddenPage;