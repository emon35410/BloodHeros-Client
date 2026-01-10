import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
    Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle,
    Clock, MapPin, Calendar, Droplet, User, Filter, Building2, X,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import toast from 'react-hot-toast';
import useRole from '../../../Hooks/useRole';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AllBloodRequest = () => {
    const axiousSecure = useAxiousSecure();
    const queryClient = useQueryClient();
    const { role } = useRole();

    // States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRequestId, setDeleteRequestId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Edit Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Fetch Data
    const { data: My_BloodRequest = [], isLoading } = useQuery({
        queryKey: ['allBloodRequest'],
        queryFn: async () => {
            const res = await axiousSecure.get(`/donorRequest`);
            return res.data;
        }
    });

    // Mutations
    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const { _id, ...data } = updatedData;
            const res = await axiousSecure.patch(`/donorRequest/${_id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allBloodRequest'] });
            toast.success('Request updated successfully!');
            setShowEditModal(false);
        },
        onError: () => toast.error('Failed to update request')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiousSecure.delete(`/donorRequest/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allBloodRequest'] });
            toast.success('Request deleted successfully!');
            setShowDeleteModal(false);
        },
        onError: () => toast.error('Failed to delete request')
    });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // Handlers
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const time = `${form.hour.value}:${form.minute.value} ${form.ampm.value}`;

        const updatedInfo = {
            _id: selectedRequest._id,
            recipientName: form.recipientName.value,
            hospital: form.hospital.value,
            donationDate: form.donationDate.value,
            donationTime: time,
            address: form.address.value,
            status: form.status.value,
        };
        updateMutation.mutate(updatedInfo);
    };

    const handleQuickStatusChange = (id, newStatus) => {
        updateMutation.mutate({ _id: id, status: newStatus });
    };

    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') return My_BloodRequest;
        return My_BloodRequest.filter(req => req.status === statusFilter);
    }, [My_BloodRequest, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusBadge = (status) => {
        const badges = {
            pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            inprogress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            canceled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${badges[status] || badges.pending}`}>
                {status}
            </span>
        );
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">Loading requests...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-50 dark:bg-transparent min-h-screen transition-colors duration-300">
            
            {/* Header Section */}
            <div data-aos="fade-down" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Blood Donation <span className="text-red-600">Requests</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 italic font-medium">Manage and monitor all emergency requirements efficiently.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Active: </span>
                    <span className="text-2xl font-black text-red-600 leading-none">{filteredRequests.length}</span>
                </div>
            </div>

            {/* Filter Section */}
            <div data-aos="fade-up" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
                <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200">
                    <Filter className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-lg">Quick Filter</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {['all', 'pending', 'inprogress', 'done', 'canceled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                            className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all transform active:scale-95 ${
                                statusFilter === status 
                                ? 'bg-red-600 text-white shadow-lg shadow-red-200 dark:shadow-none' 
                                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                            }`}
                        >
                            <span className="capitalize">{status}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div data-aos="fade-up" className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hospital</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Group</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {currentRequests.map((request) => (
                                <tr key={request._id} className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                                <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{request.recipientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-1">
                                                <Building2 className="w-3.5 h-3.5 text-gray-400" /> {request.hospital}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" /> {request.upazila}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm space-y-1">
                                            <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-red-400" /> {request.donationDate}</p>
                                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {request.donationTime}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-black text-sm border border-red-100 dark:border-red-900/30">
                                            <Droplet className="w-3.5 h-3.5 fill-current" /> {request.bloodGroup}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2 items-start">
                                            {getStatusBadge(request.status)}
                                            {request.status === 'inprogress' && (
                                                <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    <button onClick={() => handleQuickStatusChange(request._id, 'done')} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-all shadow-sm" title="Mark as Done"><CheckCircle className="w-4 h-4" /></button>
                                                    <button onClick={() => handleQuickStatusChange(request._id, 'canceled')} className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-all shadow-sm" title="Cancel Request"><XCircle className="w-4 h-4" /></button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Link to={`/requests/${request._id}`} className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all" title="View Details"><Eye className="w-5 h-5" /></Link>
                                            <button onClick={() => { setSelectedRequest(request); setShowEditModal(true); }} className="p-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all" title="Edit"><Edit className="w-5 h-5" /></button>
                                            <button onClick={() => { setDeleteRequestId(request._id); setShowDeleteModal(true); }} className="p-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all" title="Delete"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-sm shadow-sm disabled:opacity-30 transition-all border border-gray-200 dark:border-gray-700"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-1.5 rounded-full">
                            {currentPage} / {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-sm shadow-sm disabled:opacity-30 transition-all border border-gray-200 dark:border-gray-700"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {currentRequests.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center border border-dashed border-gray-300 dark:border-gray-600">
                    <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">No requests found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">It looks like there are no blood requests matching this filter right now.</p>
                </div>
            )}

            {/* EDIT MODAL */}
            {showEditModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-all animate-in fade-in">
                    <div data-aos="zoom-in" className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update Request</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {selectedRequest._id}</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Recipient Name</label>
                                    <input
                                        name="recipientName"
                                        defaultValue={selectedRequest.recipientName}
                                        disabled={role !== 'admin'}
                                        className="w-full px-5 py-3 border-2 rounded-2xl outline-none focus:border-red-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border-transparent transition-all disabled:opacity-50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Hospital</label>
                                    <input
                                        name="hospital"
                                        defaultValue={selectedRequest.hospital}
                                        disabled={role !== 'admin'}
                                        className="w-full px-5 py-3 border-2 rounded-2xl outline-none focus:border-red-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border-transparent transition-all disabled:opacity-50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Donation Date</label>
                                    <input
                                        type="date"
                                        name="donationDate"
                                        defaultValue={selectedRequest.donationDate}
                                        disabled={role !== 'admin'}
                                        className="w-full px-5 py-3 border-2 rounded-2xl outline-none focus:border-red-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border-transparent transition-all disabled:opacity-50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Status</label>
                                    <select
                                        name="status"
                                        defaultValue={selectedRequest.status}
                                        className="w-full px-5 py-3 border-2 rounded-2xl outline-none focus:border-red-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border-transparent transition-all"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="done">Done</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Time Selection</label>
                                    <div className="flex gap-4">
                                        <select name="hour" disabled={role !== 'admin'} className="flex-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-red-500 text-gray-900 dark:text-white transition-all">
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                        <select name="minute" disabled={role !== 'admin'} className="flex-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-red-500 text-gray-900 dark:text-white transition-all">
                                            {[...Array(60)].map((_, i) => (
                                                <option key={i} value={String(i).padStart(2, '0')}>{String(i).padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                        <select name="ampm" disabled={role !== 'admin'} className="flex-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-red-500 text-gray-900 dark:text-white transition-all font-bold">
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Detailed Address</label>
                                <textarea
                                    name="address"
                                    defaultValue={selectedRequest.address}
                                    rows="3"
                                    disabled={role !== 'admin'}
                                    className="w-full px-5 py-3 border-2 rounded-2xl outline-none focus:border-red-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border-transparent transition-all resize-none disabled:opacity-50"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 px-6 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none disabled:opacity-50 transition-all transform active:scale-95"
                                >
                                    {updateMutation.isPending ? 'Processing...' : 'Save Updates'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {showDeleteModal && role === 'admin' && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4 backdrop-blur-md transition-all">
                    <div data-aos="zoom-out" className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 text-center border border-gray-100 dark:border-gray-700">
                        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-10 h-10 text-rose-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Permanent Delete?</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">This action will remove the record forever. Are you absolutely sure you want to proceed?</p>
                        <div className="flex gap-4"> 
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all">No, Keep it</button>
                            <button onClick={() => deleteMutation.mutate(deleteRequestId)} className="flex-1 px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none transition-all transform active:scale-95">Yes, Delete</button>
                        </div> 
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllBloodRequest;