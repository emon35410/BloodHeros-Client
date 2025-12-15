import React, { useEffect, useState } from "react";
import useAxiousSecure from "../../Hooks/useAxiousSecure";

const AllSupportDonation = () => {
    const axiosSecure = useAxiousSecure();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosSecure.get("/donations")
            .then(res => {
                setDonations(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching donations:", err);
                setLoading(false);
            });
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-rose-600"></span>
                    <p className="mt-4 text-gray-600 font-medium">Loading donations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-6 flex justify-center items-center md:mb-8">
                    <div className="flex items-center gap-3 mb-2 ">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl md:text-2xl">💖</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            Support Donations
                        </h2>
                    </div>

                </div>

                {/* Stats Cards */}
                <div className="flex justify-center items-center mb-6 md:mb-8">
                    <div className="w-full max-w-sm bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">
                                    Total Donations
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                                    {donations.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                <span className="text-xl md:text-2xl">📊</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">#</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Donor</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Contact</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Amount</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Status</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">IDs</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Date</th>
                                </tr>
                            </thead>

                            <tbody className="text-gray-800">
                                {donations.map((donation, index) => (
                                    <tr
                                        key={donation._id}
                                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-colors"
                                    >
                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <span className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-gray-100 rounded-lg text-xs md:text-sm font-semibold text-gray-600">
                                                {index + 1}
                                            </span>
                                        </td>

                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {donation.name?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <span className="font-semibold text-gray-800 text-sm md:text-base">
                                                    {donation.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <div className="text-xs md:text-sm text-gray-600">
                                                <div className="break-all">{donation.email}</div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <span className="inline-flex items-center px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold text-xs md:text-sm">
                                                ${donation.amount}
                                            </span>
                                        </td>

                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <span
                                                className={`inline-flex items-center px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                                                ${donation.payment_status === "paid"
                                                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                                        : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"}`}
                                            >
                                                {donation.payment_status}
                                            </span>
                                        </td>

                                        {/* 🔥 Tracking ID REMOVED — ONLY Transaction ID KEPT */}
                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-500">Transaction:</div>
                                                <code className="block px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600 break-all">
                                                    {donation.transactionId}
                                                </code>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                                            <div className="whitespace-nowrap">
                                                {new Date(donation.created_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {donations.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">📭</span>
                                </div>
                                <p className="text-gray-500 font-medium text-lg">No donations yet</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Donations will appear here once received
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllSupportDonation;
