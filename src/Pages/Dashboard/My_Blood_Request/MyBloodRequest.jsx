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
    Mail,
    ChevronLeft,
    ChevronRight,
    Filter,
    Building2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import toast from 'react-hot-toast';

const MyBloodRequest = () => {
    const axiousSecure = useAxiousSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch blood requests
    const { data: My_BloodRequest = [], isLoading } = useQuery({
        queryKey: ['myBloodRequest', user?.email],
        queryFn: async () => {
            const res = await axiousSecure.get(`/donorRequest?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRequestId, setDeleteRequestId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Update status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiousSecure.patch(`/donorRequest/${id}`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myBloodRequest']);
            toast.success('Status updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiousSecure.delete(`/donorRequest/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myBloodRequest']);
            toast.success('Request deleted successfully!');
            setShowDeleteModal(false);
            setDeleteRequestId(null);
        },
        onError: () => {
            toast.error('Failed to delete request');
        }
    });

    // Filter requests based on status
    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') {
            return My_BloodRequest;
        }
        return My_BloodRequest.filter(req => req.status === statusFilter);
    }, [My_BloodRequest, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, endIndex);

    // Reset to page 1 when filter changes
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

    const handleStatusChange = (id, newStatus) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const handleDeleteClick = (id) => {
        setDeleteRequestId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(deleteRequestId);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Status count for filter buttons
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Donation Requests</h1>
                    <p className="text-gray-600 mt-1">
                        Showing {filteredRequests.length} {statusFilter !== 'all' ? statusFilter : 'total'} requests
                    </p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Filter by Status</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'all'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({statusCounts.all})
                    </button>
                    <button
                        onClick={() => handleFilterChange('pending')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'pending'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pending ({statusCounts.pending})
                    </button>
                    <button
                        onClick={() => handleFilterChange('inprogress')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'inprogress'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        In Progress ({statusCounts.inprogress})
                    </button>
                    <button
                        onClick={() => handleFilterChange('done')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'done'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Done ({statusCounts.done})
                    </button>
                    <button
                        onClick={() => handleFilterChange('canceled')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'canceled'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Canceled ({statusCounts.canceled})
                    </button>
                </div>
            </div>

            {/* Requests Table */}
            {currentRequests.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recipient</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Hospital & Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blood Group</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Donor Info</th>
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
                                                    <span>{request.upazila}, District: {request.district}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>{request.donationDate}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
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
                                            <div className="space-y-2">
                                                {getStatusBadge(request.status)}
                                                {request.status === 'inprogress' && (
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleStatusChange(request._id, 'done')}
                                                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors"
                                                        >
                                                            <CheckCircle className="w-3 h-3" />
                                                            Done
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(request._id, 'canceled')}
                                                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition-colors"
                                                        >
                                                            <XCircle className="w-3 h-3" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.status === 'inprogress' && request.donorInfo ? (
                                                <div className="text-sm">
                                                    <div className="flex items-center text-gray-800 mb-1">
                                                        <User className="w-4 h-4 mr-1 text-gray-500" />
                                                        <span className="font-medium">{request.donorInfo.name}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Mail className="w-4 h-4 mr-1 text-gray-500" />
                                                        <span className="text-xs">{request.donorInfo.email}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/requests/${request._id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    to={`/dashboard/requests/${request._id}/edit`}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(request._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
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
                        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg transition-colors ${currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === page
                                                    ? 'bg-red-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Requests Found</h3>
                    <p className="text-gray-600">
                        {statusFilter !== 'all'
                            ? `You don't have any ${statusFilter} donation requests.`
                            : "You haven't created any donation requests yet."}
                    </p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Donation Request</h3>
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete this donation request? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteMutation.isPending}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
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