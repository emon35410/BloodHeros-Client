import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router";

const PaymentCanceled = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-red-50 via-white to-pink-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
                <XCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Canceled</h2>
                <p className="text-gray-700 mb-4">
                    Your donation was <span className="font-semibold">not processed</span>.
                    Don't worry, you can try again anytime.
                </p>
                <p className="text-gray-600 mb-6">
                    If this was a mistake, you can go back and complete your donation.
                </p>
                <Link
                    to="/supportus"
                    className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Try Again
                </Link>
            </div>
        </div>
    );
};

export default PaymentCanceled;
