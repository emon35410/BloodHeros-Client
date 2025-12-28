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
    MapPin,
    Calendar,
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
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') return donorRequests;
        return donorRequests.filter(req => req.status === statusFilter);
    }, [donorRequests, statusFilter]);

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
        all: donorRequests.length,
        pending: donorRequests.filter(r => r.status === 'pending').length,
        approved: donorRequests.filter(r => r.status === 'approved').length,
        rejected: donorRequests.filter(r => r.status === 'rejected').length
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
           

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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Donor Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blood Group</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Weight</th>
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
                                                    <Phone className="w-4 h-4 mr-1 text-gray-500" />
                                                    <span>{request.phone}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    <span>{request.email}</span>
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
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Weight className="w-4 h-4 mr-1 text-gray-500" />
                                                <span>{request.weight} kg</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(request.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/donateRequest/${request._id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                            <p className="text-sm text-gray-700">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} results
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="px-4 py-2 bg-red-600 text-white rounded-lg">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <p className="text-gray-600">There are no donor requests matching your filter.</p>
                </div>
            )}
        </div>
    );
};

export default DonorRequestDonation;