import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
    Eye, Calendar, Clock, MapPin, Droplet, User, 
    Building2, AlertCircle, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxiousSecure from '../../Hooks/useAxiousSecure';
import Aos from 'aos';
import 'aos/dist/aos.css';

const BloodDonationRequest = () => {
    const axiousSecure = useAxiousSecure();
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // AOS Initialization
    useEffect(() => {
        Aos.init({ 
            duration: 800, 
            once: true,
            offset: 50 
        });
    }, []);

    // Data Fetching
    const { data: bloodRequests = [], isLoading } = useQuery({
        queryKey: ['allBloodRequests'],
        queryFn: async () => {
            const res = await axiousSecure.get('/donorRequest');
            return res.data;
        }
    });

    // Filtering & Pagination Logic Combined
    const { currentRequests, totalPages, statusCounts, filteredLength } = useMemo(() => {
        const counts = {
            all: bloodRequests.length,
            pending: 0, inprogress: 0, done: 0, canceled: 0
        };

        const filtered = bloodRequests.filter(req => {
            if (req.status in counts) counts[req.status]++;
            return statusFilter === 'all' || req.status === statusFilter;
        });

        const pages = Math.ceil(filtered.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        
        return {
            currentRequests: filtered.slice(start, start + itemsPerPage),
            totalPages: pages,
            statusCounts: counts,
            filteredLength: filtered.length
        };
    }, [bloodRequests, statusFilter, currentPage]);

    const getStatusBadge = (status) => {
        const themes = {
            pending: 'bg-amber-100/60 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50',
            inprogress: 'bg-indigo-100/60 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200/50',
            done: 'bg-emerald-100/60 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50',
            canceled: 'bg-rose-100/60 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200/50'
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${themes[status] || themes.pending}`}>
                {status}
            </span>
        );
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 animate-pulse font-medium">Loading requests...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 transition-colors duration-500">
            
            {/* Header Section - Fix for Visibility on Reload */}
            <div data-aos="fade-down" className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                    Blood <span className="text-rose-600 dark:text-rose-500">Requests</span>
                </h1>
                <div className="flex items-center justify-center gap-3">
                    <span className="h-[1px] w-12 bg-slate-200 dark:bg-slate-700"></span>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Showing <span className="text-slate-900 dark:text-slate-200 font-bold">{filteredLength}</span> cases
                    </p>
                    <span className="h-[1px] w-12 bg-slate-200 dark:bg-slate-700"></span>
                </div>
            </div>

            {/* Filter Bar */}
            <div data-aos="fade-up" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-sm flex flex-wrap justify-center gap-2">
                {Object.entries(statusCounts).map(([key, count]) => (
                    <button
                        key={key}
                        onClick={() => { setStatusFilter(key); setCurrentPage(1); }}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                            statusFilter === key 
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        <span className={`ml-2 opacity-60 text-xs`}>{count}</span>
                    </button>
                ))}
            </div>

            {/* Content Table */}
            {currentRequests.length > 0 ? (
                <div data-aos="zoom-in-up" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-[0.15em] font-black">
                                    <th className="px-6 py-5">Recipient</th>
                                    <th className="px-6 py-5">Location</th>
                                    <th className="px-6 py-5">Schedule</th>
                                    <th className="px-6 py-5">Group</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentRequests.map((request) => (
                                    <tr key={request._id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-5 font-bold text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 group-hover:text-rose-500 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                {request.recipientName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1 text-sm font-medium">
                                                <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase text-[12px]">
                                                    <Building2 size={14} className="opacity-50" /> {request.hospital}
                                                </p>
                                                <p className="text-slate-500 dark:text-slate-500 text-xs flex items-center gap-1.5">
                                                    <MapPin size={14} /> {request.upazila}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 space-y-1.5">
                                                <p className="flex items-center gap-2"><Calendar size={14} className="text-rose-500" /> {request.donationDate}</p>
                                                <p className="flex items-center gap-2 opacity-70"><Clock size={14} /> {request.donationTime}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg font-black text-sm border border-rose-100 dark:border-rose-500/20">
                                                <Droplet size={14} fill="currentColor" />
                                                {request.bloodGroup}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">{getStatusBadge(request.status)}</td>
                                        <td className="px-6 py-5 text-center">
                                            <Link to={`/requests/${request._id}`} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all duration-300 inline-block shadow-sm">
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="px-6 py-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-3">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={18} className="dark:text-slate-300" />
                            </button>
                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all duration-300 ${
                                            currentPage === i + 1 
                                            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl scale-110' 
                                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight size={18} className="dark:text-slate-300" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-32 text-center bg-slate-50 dark:bg-slate-900/40 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <AlertCircle className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No requests found</h3>
                    <p className="text-slate-500 dark:text-slate-500 mt-2">Try changing your filter settings</p>
                </div>
            )}
        </div>
    );
};

export default BloodDonationRequest;