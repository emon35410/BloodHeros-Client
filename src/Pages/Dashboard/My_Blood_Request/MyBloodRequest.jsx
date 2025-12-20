import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
    Edit,
    Trash2,
    Eye,
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
import useAuth from '../../../Hooks/useAuth';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import toast from 'react-hot-toast';
import Aos from 'aos';
import 'aos/dist/aos.css';

const MyBloodRequest = () => {
    const axiousSecure = useAxiousSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRequestId, setDeleteRequestId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch blood requests
    const { data: My_BloodRequest = [], isLoading } = useQuery({
        queryKey: ['myBloodRequest', user?.email],
        queryFn: async () => {
            const res = await axiousSecure.get(`/donorRequest?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const { _id, ...data } = updatedData;
            const res = await axiousSecure.patch(`/donorRequest/${_id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myBloodRequest', user?.email] });
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
            queryClient.invalidateQueries({ queryKey: ['myBloodRequest', user?.email] });
            toast.success('Request deleted successfully!');
            setShowDeleteModal(false);
            setDeleteRequestId(null);
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
        };
        updateMutation.mutate(updatedInfo);
    };

    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') return My_BloodRequest;
        return My_BloodRequest.filter(req => req.status === statusFilter);
    }, [My_BloodRequest, statusFilter]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentRequests = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(start, start + itemsPerPage);
    }, [filteredRequests, currentPage]);

    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
        setCurrentPage(1);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            inprogress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
            done: { bg: 'bg-green-100', text: 'text-green-800', label: 'Done' },
            canceled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Canceled' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const statusCounts = {
        all: My_BloodRequest.length,
        pending: My_BloodRequest.filter(r => r.status === 'pending').length,
        inprogress: My_BloodRequest.filter(r => r.status === 'inprogress').length,
        done: My_BloodRequest.filter(r => r.status === 'done').length,
        canceled: My_BloodRequest.filter(r => r.status === 'canceled').length
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div data-aos="fade-right" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Donation Requests</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {filteredRequests.length} {statusFilter !== 'all' ? statusFilter : 'total'} requests
                    </p>
                </div>
            </div>

            <div data-aos="fade-left" className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Filter by Status</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {Object.keys(statusCounts).map((key) => (
                        <button
                            key={key}
                            onClick={() => handleFilterChange(key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${statusFilter === key
                                ? (key === 'all' ? 'bg-red-600 text-white' :
                                    key === 'pending' ? 'bg-yellow-500 text-white' :
                                        key === 'inprogress' ? 'bg-blue-500 text-white' :
                                            key === 'done' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {key === 'inprogress' ? 'In Progress' : key} ({statusCounts[key]})
                        </button>
                    ))}
                </div>
            </div>

            {currentRequests.length > 0 ? (
                <div data-aos="fade-down" className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <User className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="font-medium text-gray-800">{request.recipientName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-800">
                                                    <Building2 className="w-4 h-4 mr-1 text-gray-500" />
                                                    <span className="font-medium">{request.hospital}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span>{request.upazila}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>{request.donationDate}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span>{request.donationTime}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                                <Droplet className="w-4 h-4 mr-1" />
                                                {request.bloodGroup}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(request.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link to={`/requests/${request._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                                    <Eye className="w-5 h-5" />
                                                </Link>

                                                <button onClick={() => { setSelectedRequest(request); setShowEditModal(true); }} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit className="w-5 h-5" />
                                                </button>

                                                <button onClick={() => { setDeleteRequestId(request._id); setShowDeleteModal(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                            <div className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}><ChevronLeft className="w-5 h-5" /></button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded-lg font-medium ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>{i + 1}</button>
                                ))}
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Requests Found</h3>
                    <p className="text-gray-600">{statusFilter !== 'all' ? `You don't have any ${statusFilter} donation requests.` : "You haven't created any donation requests yet."}</p>
                </div>
            )}

            {/*  EDIT MODAL */}
            {showEditModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-xl w-full">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                Edit Donation Request
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Recipient Name
                                    </label>
                                    <input
                                        name="recipientName"
                                        defaultValue={selectedRequest.recipientName}
                                        className="w-full px-4 py-2 border rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Hospital Name
                                    </label>
                                    <input
                                        name="hospital"
                                        defaultValue={selectedRequest.hospital}
                                        className="w-full px-4 py-2 border rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="donationDate"
                                        defaultValue={selectedRequest.donationDate}
                                        className="w-full px-4 py-2 border rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Donation Time
                                    </label>
                                    <div className="flex gap-1">
                                        <select className="w-full p-2 border rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            {[...Array(12)].map((_, i) => {
                                                const val = String(i + 1).padStart(2, '0');
                                                return <option key={i}>{val}</option>;
                                            })}
                                        </select>

                                        <select className="w-full p-2 border rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            {[...Array(60)].map((_, i) => {
                                                const val = String(i).padStart(2, '0');
                                                return <option key={i}>{val}</option>;
                                            })}
                                        </select>

                                        <select className="w-full p-2 border rounded-lg outline-none font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                                            <option>AM</option>
                                            <option>PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Address
                                </label>
                                <textarea
                                    rows="2"
                                    defaultValue={selectedRequest.address}
                                    className="w-full px-4 py-2 border rounded-lg outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-lg"
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

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Donation Request</h3>
                        <p className="text-gray-600 text-center mb-6">Are you sure? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg">Cancel</button>
                            <button onClick={() => deleteMutation.mutate(deleteRequestId)} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50">
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBloodRequest;