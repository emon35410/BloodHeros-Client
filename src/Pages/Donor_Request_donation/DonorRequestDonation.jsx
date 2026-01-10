import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router'; 
import {
    Eye,
    AlertCircle,
    User,
    Filter,
    Droplet,
    Phone,
    Mail,
    Weight,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useAxiousSecure from '../../Hooks/useAxiousSecure';

const DonorRequestDonation = () => {
    const axiousSecure = useAxiousSecure();
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data: donorRequests = [], isLoading } = useQuery({
        queryKey: ['donorRequests'],
        queryFn: async () => {
            const res = await axiousSecure.get('/blood-donate');
            return res.data;
        }
    });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

   
    const counts = useMemo(() => {
        return {
            all: donorRequests.length,
            pending: donorRequests.filter(r => r.status === 'pending').length,
            approved: donorRequests.filter(r => r.status === 'approved').length,
            rejected: donorRequests.filter(r => r.status === 'rejected').length,
        };
    }, [donorRequests]);

    const filteredRequests = useMemo(() => {
        return statusFilter === 'all' 
            ? donorRequests 
            : donorRequests.filter(req => req.status === statusFilter);
    }, [donorRequests, statusFilter]);


    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusBadge = (status) => {
        const config = {
            pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config[status] || config.pending}`}>
                {status}
            </span>
        );
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Filter Section  */}
            <div data-aos="fade-down" className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <Filter size={18} className="text-red-500" />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Filter Requests</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2
                                ${statusFilter === status 
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100'}`}
                        >
                            <span className="capitalize">{status}</span>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                                {counts[status]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div data-aos="fade-up" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                            <tr>
                                {['Donor Info', 'Blood Group', 'Weight', 'Status', 'Action'].map((head) => (
                                    <th key={head} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{head}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {currentRequests.length > 0 ? currentRequests.map((request) => (
                                <tr key={request._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{request.fullName}</p>
                                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Mail size={10} /> {request.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center font-black text-red-500 dark:text-red-400 text-sm">
                                            <Droplet size={14} className="mr-1.5" /> {request.bloodGroup}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                            {request.weight} <span className="text-[10px] font-medium text-slate-400 uppercase ml-0.5">kg</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/donateRequest/${request._id}`}
                                            className="h-9 w-9 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl flex items-center justify-center transition-all"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <AlertCircle size={40} className="mb-2" />
                                            <p className="font-bold text-sm uppercase tracking-widest">No matching requests</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-5 bg-slate-50/30 dark:bg-slate-800/10 border-t border-slate-50 dark:border-slate-800">
                        <div className="hidden sm:block">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                Page {currentPage} <span className="mx-1 text-slate-300 dark:text-slate-700">/</span> {totalPages}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 disabled:opacity-30 hover:shadow-md transition-all active:scale-95"
                            >
                                <ChevronLeft size={18} className="text-slate-600 dark:text-slate-300" />
                            </button>
                            
                            {/* Page Numbers */}
                            <div className="flex gap-1 mx-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'w-6 bg-red-500' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 disabled:opacity-30 hover:shadow-md transition-all active:scale-95"
                            >
                                <ChevronRight size={18} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorRequestDonation;