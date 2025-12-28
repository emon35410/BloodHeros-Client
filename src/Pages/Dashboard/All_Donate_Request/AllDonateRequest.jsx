import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    ChevronLeft,
    ChevronRight,
    Filter,
    Mail,
    Phone,
    MapPin,
    Droplet,
    Weight,
    Calendar,
    X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import toast from 'react-hot-toast';
import useRole from '../../../Hooks/useRole';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AllDonateRequest = () => {
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

    // Queries
    const { data: allDonateRequests = [], isLoading } = useQuery({
        queryKey: ['allDonateRequests'],
        queryFn: async () => {
            const res = await axiousSecure.get(`/blood-donate`);
            return res.data;
        }
    });

    // Mutations
    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const { _id, ...data } = updatedData;
            const res = await axiousSecure.patch(`/blood-donate/${_id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allDonateRequests'] });
            toast.success('Donor request updated successfully!');
            setShowEditModal(false);
        },
        onError: () => toast.error('Failed to update donor request')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiousSecure.delete(`/blood-donate/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allDonateRequests'] });
            toast.success('Donor request deleted successfully!');
            setShowDeleteModal(false);
        },
        onError: () => toast.error('Failed to delete donor request')
    });

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedInfo = {
            _id: selectedRequest._id,
            fullName: form.fullName.value,
            email: form.email.value,
            phone: form.phone.value,
            address: form.address.value,
            bloodGroup: form.bloodGroup.value,
            weight: form.weight.value,
            status: form.status.value,
        };
        updateMutation.mutate(updatedInfo);
    };

    const handleQuickStatusChange = (id, newStatus) => {
        updateMutation.mutate({ _id: id, status: newStatus });
    };

    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') return allDonateRequests;
        return allDonateRequests.filter(req => req.status === statusFilter);
    }, [allDonateRequests, statusFilter]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
        };
        const badge = badges[status] || badges.pending;
        return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>{badge.label}</span>;
    };

    const statusCounts = {
        all: allDonateRequests.length,
        pending: allDonateRequests.filter(r => r.status === 'pending').length,
        approved: allDonateRequests.filter(r => r.status === 'approved').length,
        rejected: allDonateRequests.filter(r => r.status === 'rejected').length
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

    return (
        <div className="space-y-6">
            <div data-aos="fade-down" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Blood Donor Registrations</h1>
                    <p className="text-gray-600 mt-1">Showing {filteredRequests.length} donor registrations</p>
                </div>
            </div>

            {/* Filter Section */}
            <div data-aos="zoom-in" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
                <div data-aos="fade-up" className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Donor Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blood Group</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Age & Weight</th>
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
                                                <span className="font-medium text-gray-800">{request.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-800">
                                                    <Mail className="w-4 h-4 mr-1 text-gray-500" />
                                                    <span className="truncate max-w-[200px]">{request.email}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 mr-1" />
                                                    <span>{request.phone}</span>
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
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>{calculateAge(request.dob)} years</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Weight className="w-4 h-4 mr-1" />
                                                    <span>{request.weight} kg</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                {getStatusBadge(request.status)}
                                                {request.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleQuickStatusChange(request._id, 'approved')} className="p-1 bg-green-500 text-white rounded hover:bg-green-600" title="Approve">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleQuickStatusChange(request._id, 'rejected')} className="p-1 bg-red-500 text-white rounded hover:bg-red-600" title="Reject">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link to={`/donateRequest/${request._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-5 h-5" /></Link>
                                                <button onClick={() => { setSelectedRequest(request); setShowEditModal(true); }} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => { setDeleteRequestId(request._id); setShowDeleteModal(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Donor Registrations Found</h3>
                    <p className="text-gray-600">No donors have registered yet with the selected status.</p>
                </div>
            )}

            {/* EDIT MODAL */}
            {showEditModal && selectedRequest && (
                <div data-aos="zoom-in" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Donor Details & Edit</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input
                                        name="fullName"
                                        defaultValue={selectedRequest.fullName}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        defaultValue={selectedRequest.dob}
                                        disabled
                                        className="w-full px-4 py-2 border rounded-lg outline-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Age: {calculateAge(selectedRequest.dob)} years</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={selectedRequest.email}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input
                                        name="phone"
                                        defaultValue={selectedRequest.phone}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                                    <select
                                        name="bloodGroup"
                                        defaultValue={selectedRequest.bloodGroup}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                                    <input
                                        name="weight"
                                        type="number"
                                        defaultValue={selectedRequest.weight}
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        defaultValue={selectedRequest.address}
                                        rows="2"
                                        disabled={role !== 'admin'}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Date</label>
                                    <input
                                        type="text"
                                        defaultValue={new Date(selectedRequest.created_at).toLocaleDateString()}
                                        disabled
                                        className="w-full px-4 py-2 border rounded-lg outline-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Health Declaration Status</p>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                    {selectedRequest.healthDeclaration ? '✓ Confirmed healthy and eligible to donate' : '✗ Health declaration not confirmed'}
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-red-300"
                                >
                                    Close
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
            {showDeleteModal && role === 'admin' && (
                <div data-aos="zoom-out" className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Donor Registration?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this donor registration? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg">
                                Cancel
                            </button>
                            <button onClick={() => deleteMutation.mutate(deleteRequestId)} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50">
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllDonateRequest;