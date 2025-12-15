import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle } from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import useAxiousSecure from "../../Hooks/useAxiousSecure";

const PaymentSuccess = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiousSecure();
    const [searchParams] = useSearchParams();
    const sessionID = searchParams.get('session_id');
    console.log(sessionID)

    useEffect(()=>{
        if(sessionID){
            axiosSecure.patch(`/payment-success?session_id=${sessionID}`)
            .then(res=>{
                console.log(res.data)
            })
        }
    },[sessionID,axiosSecure])

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center py-10">
            <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200 text-center">
                <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-red-600 mb-2">Thank You!</h2>
                <p className="text-gray-700 mb-4">
                    Your donation has been received successfully.
                </p>
                <p className="text-gray-600 mb-6">
                    Donor: <span className="font-semibold">{user?.displayName}</span> <br />
                    Email: <span className="font-semibold">{user?.email}</span>
                </p>
                <Link
                    to="/"
                    className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
