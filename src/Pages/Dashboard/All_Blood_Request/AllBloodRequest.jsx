import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    MapPin,
    Calendar,
    Droplet,
    User,
    ChevronLeft,
    ChevronRight,
    Filter,
    Building2,
    X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import toast from 'react-hot-toast';
import useRole from '../../../Hooks/useRole';

const AllBloodRequest = () => {
    const axiousSecure = useAxiousSecure();
    const queryClient = useQueryClient();
    const { role } = useRole()

    // --- States ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRequestId, setDeleteRequestId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Edit Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    //  Queries
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

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            inprogress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
            done: { bg: 'bg-green-100', text: 'text-green-800', label: 'Done' },
            canceled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Canceled' }
        };
        const badge = badges[status] || badges.pending;
        return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>{badge.label}</span>;
    };

    const statusCounts = {
        all: My_BloodRequest.length,
        pending: My_BloodRequest.filter(r => r.status === 'pending').length,
        inprogress: My_BloodRequest.filter(r => r.status === 'inprogress').length,
        done: My_BloodRequest.filter(r => r.status === 'done').length,
        canceled: My_BloodRequest.filter(r => r.status === 'canceled').length
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Blood Donation Requests</h1>
                    <p className="text-gray-600 mt-1">Showing {filteredRequests.length} requests</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Filter by Status</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {Object.keys(statusCounts).map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${statusFilter === status ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {status} ({statusCounts[status]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {currentRequests.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recipient</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Hospital & Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blood Group</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4"><div className="flex items-center"><User className="w-5 h-5 text-gray-400 mr-2" /><span className="font-medium text-gray-800">{request.recipientName}</span></div></td>
                                        <td className="px-6 py-4"><div className="space-y-1"><div className="flex items-center text-sm text-gray-800"><Building2 className="w-4 h-4 mr-1 text-gray-500" /><span className="font-medium">{request.hospital}</span></div><div className="flex items-center text-sm text-gray-600"><MapPin className="w-4 h-4 mr-1" /><span>{request.upazila}</span></div></div></td>
                                        <td className="px-6 py-4"><div className="space-y-1 text-sm text-gray-600"><div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /><span>{request.donationDate}</span></div><div className="flex items-center"><Clock className="w-4 h-4 mr-1" /><span>{request.donationTime}</span></div></div></td>
                                        <td className="px-6 py-4"><span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold"><Droplet className="w-4 h-4 mr-1" />{request.bloodGroup}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                {getStatusBadge(request.status)}
                                                {request.status === 'inprogress' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleQuickStatusChange(request._id, 'done')} className="p-1 bg-green-500 text-white rounded hover:bg-green-600" title="Done"><CheckCircle className="w-4 h-4" /></button>
                                                        <button onClick={() => handleQuickStatusChange(request._id, 'canceled')} className="p-1 bg-red-500 text-white rounded hover:bg-red-600" title="Cancel"><XCircle className="w-4 h-4" /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link to={`/requests/${request._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-5 h-5" /></Link>
                                                <button onClick={() => { setSelectedRequest(request); setShowEditModal(true); }} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => { setDeleteRequestId(request._id); setShowDeleteModal(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Requests Found</h3>
                </div>
            )}

            {/* EDIT MODAL*/}
            {showEditModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Donation Request</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Name</label>
                                    <input
                                        name="recipientName"
                                        defaultValue={selectedRequest.recipientName}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital Name</label>
                                    <input
                                        name="hospital"
                                        defaultValue={selectedRequest.hospital}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                    <input
                                        type="date"
                                        name="donationDate"
                                        defaultValue={selectedRequest.donationDate}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select
                                        name="status"
                                        defaultValue={selectedRequest.status}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="done">Done</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donation Time</label>
                                    <div className="flex gap-2">
                                        <select
                                            name="hour"
                                            disabled={role !== 'admin'}
                                            className={`flex-1 p-2 border rounded-lg outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {[...Array(12)].map((_, i) => {
                                                const val = String(i + 1).padStart(2, '0');
                                                return <option key={i} value={val}>{val}</option>;
                                            })}
                                        </select>
                                        <select
                                            name="minute"
                                            disabled={role !== 'admin'}
                                            className={`flex-1 p-2 border rounded-lg outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {[...Array(60)].map((_, i) => {
                                                const val = String(i).padStart(2, '0');
                                                return <option key={i} value={val}>{val}</option>;
                                            })}
                                        </select>
                                        <select
                                            name="ampm"
                                            disabled={role !== 'admin'}
                                            className={`flex-1 p-2 border rounded-lg outline-none font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
                                <textarea
                                    name="address"
                                    defaultValue={selectedRequest.address}
                                    rows="2"
                                    disabled={role !== 'admin'}
                                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* DELETE MODAL */}
            {showDeleteModal && role == 'admin' && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Request?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this request? This action cannot be undone.</p>
                        <div className="flex gap-3"> <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg">Cancel</button>
                            <button onClick={() => deleteMutation.mutate(deleteRequestId)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">Delete Now</button>
                        </div> </div>
                </div>)}

        </div>
    );
};

export default AllBloodRequest;