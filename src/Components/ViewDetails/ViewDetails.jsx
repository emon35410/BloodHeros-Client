import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiousSecure from '../../Hooks/useAxiousSecure';
import {
    ArrowLeft,
    User,
    MapPin,
    Building2,
    Calendar,
    Clock,
    Droplet,
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ViewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiousSecure();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
        axiosSecure.get(`/donorRequest/${id}`)
            .then(res => {
                setRequest(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id, axiosSecure]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!request) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3 opacity-50" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Request Not Found</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-rose-500 font-bold">Go Back</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-6">
                
                {/* Back Link */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors mb-6 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Back to Dashboard</span>
                </button>

                {/* Main Compact Card */}
                <div data-aos="fade-up" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    
                    {/* Header: Blood Group & Status */}
                    <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <Droplet className="text-white" size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{request.bloodGroup}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Required Blood</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ring-1 ${
                            request.status === 'pending' ? 'bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-500/10' :
                            request.status === 'inprogress' ? 'bg-blue-50 text-blue-600 ring-blue-200 dark:bg-blue-500/10' :
                            'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10'
                        }`}>
                            {request.status}
                        </span>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-6">
                        
                        {/* Recipient & Hospital Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <User size={12}/> Recipient Name
                                </p>
                                <p className="text-slate-700 dark:text-slate-200 font-bold">{request.recipientName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Building2 size={12}/> Hospital
                                </p>
                                <p className="text-slate-700 dark:text-slate-200 font-bold">{request.hospital}</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-1 pt-4 border-t dark:border-slate-800">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin size={12}/> Full Location
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                {request.address}, {request.upazila}
                            </p>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Date</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{request.donationDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-l dark:border-slate-800 pl-4">
                                <Clock size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Time</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{request.donationTime}</p>
                                </div>
                            </div>
                        </div>

                        {/* Message Note (Conditional) */}
                        {request.message && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                                    <MessageSquare size={12}/> Note
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{request.message}"</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-800 flex justify-between items-center">
                        <div className="text-[10px] text-slate-400 font-medium">
                            Request ID: <span className="font-mono text-slate-500 uppercase">{request._id.slice(-8)}</span>
                        </div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetails;