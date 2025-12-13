import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
    Eye,
    Calendar,
    Clock,
    MapPin,
    Droplet,
    User,
    Mail,
    Building2,
    AlertCircle,
    Filter,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxiousSecure from '../../Hooks/useAxiousSecure';


const BloodDonationRequest = () => {
    const axiousSecure = useAxiousSecure();

    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch all blood requests
    const { data: bloodRequests = [], isLoading } = useQuery({
        queryKey: ['allBloodRequests'],
        queryFn: async () => {
            const res = await axiousSecure.get('/donorRequest');
            return res.data;
        }
    });

    // Filter requests based on status
    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') {
            return bloodRequests;
        }
        return bloodRequests.filter(req => req.status === statusFilter);
    }, [bloodRequests, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, endIndex);

    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

    // Status count for filter buttons
    const statusCounts = {
        all: bloodRequests.length,
        pending: bloodRequests.filter(r => r.status === 'pending').length,
        inprogress: bloodRequests.filter(r => r.status === 'inprogress').length,
        done: bloodRequests.filter(r => r.status === 'done').length,
        canceled: bloodRequests.filter(r => r.status === 'canceled').length
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
            <div className='my-3'>
                <h1 className="text-3xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-600">
                    All Blood Donation Requests
                </h1>
                <p className="text-center mt-1 text-gray-700 font-medium">
                    Showing <span className="text-red-500 font-semibold">{filteredRequests.length}</span>
                    {statusFilter !== 'all' ? (
                        <span className="text-blue-500 font-semibold"> {statusFilter}</span>
                    ) : (
                        <span className="text-green-500 font-semibold"> total</span>
                    )} requests
                </p>
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
                                            {getStatusBadge(request.status)}
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/requests/${request._id}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                                <span className="text-sm font-medium">View</span>
                                            </Link>
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
                            ? `No ${statusFilter} donation requests found.`
                            : "No donation requests available yet."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BloodDonationRequest;
