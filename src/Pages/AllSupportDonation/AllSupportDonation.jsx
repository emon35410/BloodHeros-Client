import React, { useEffect, useState } from "react";
import useAxiousSecure from "../../Hooks/useAxiousSecure";
import Aos from "aos";
import 'aos/dist/aos.css';
import { Heart, Mail, Hash, Calendar, DollarSign, Inbox, ArrowUpRight, Clock } from "lucide-react";

const AllSupportDonation = () => {
    const axiosSecure = useAxiousSecure();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Animation duration optimized for better feel
        Aos.init({ duration: 500, once: true });
    }, []);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axiosSecure.get("/donations");
                setDonations(res.data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center dark:bg-[#020617]">
                <div className="w-10 h-10 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-4 md:p-8 transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header & Stats - Compact UI */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group hover:rotate-12 transition-transform">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Support History</h2>
                            <p className="text-slate-500 dark:text-slate-500 text-[11px] font-bold uppercase tracking-[0.1em]">Verified Contributions: {donations.length}</p>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300">Public Support</span>
                    </div>
                </div>

                {/* Table Container */}
                <div data-aos="fade-up" className="bg-white dark:bg-slate-900/20 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                                <tr className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                    <th className="px-8 py-5">Donor Profile</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Reference</th>
                                    <th className="px-8 py-5 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                {donations.map((donation) => (
                                    <tr key={donation._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all duration-200">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                                    {donation.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-tight">{donation.name}</span>
                                                    <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                                                        <Mail size={12} className="opacity-70" /> {donation.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-8 py-5">
                                            <span className="font-black text-slate-900 dark:text-white text-base">
                                                ${donation.amount}
                                            </span>
                                        </td>

                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                donation.payment_status === "paid" 
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            }`}>
                                                {donation.payment_status}
                                            </span>
                                        </td>

                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg w-fit border border-slate-100 dark:border-white/5">
                                                <Hash size={10} /> {donation.transactionId}
                                            </div>
                                        </td>

                                        <td className="px-8 py-5 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5">
                                                    {new Date(donation.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    <ArrowUpRight size={12} className="text-rose-500/50" />
                                                </span>
                                                <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {/* FIXED: 12-Hour Format (AM/PM) */}
                                                    {new Date(donation.created_at).toLocaleTimeString('en-US', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit', 
                                                        hour12: true 
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {donations.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-full mb-4">
                                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                            </div>
                            <h4 className="text-slate-800 dark:text-slate-200 font-bold">No Transactions Found</h4>
                            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Archive is empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllSupportDonation;