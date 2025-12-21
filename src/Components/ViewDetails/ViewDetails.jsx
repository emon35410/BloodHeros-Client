import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiousSecure from '../../Hooks/useAxiousSecure';
import {
    ArrowLeft,
    User,
    Mail,
    MapPin,
    Building2,
    Calendar,
    Clock,
    Droplet,
    MessageSquare,
    CheckCircle,
    XCircle,
    AlertCircle,
    Home
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
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    useEffect(() => {
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

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Not Found</h2>
                    <p className="text-gray-600 mb-6">The donation request you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                icon: Clock,
                label: 'Pending'
            },
            inprogress: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-300',
                icon: AlertCircle,
                label: 'In Progress'
            },
            done: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                icon: CheckCircle,
                label: 'Completed'
            },
            canceled: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                icon: XCircle,
                label: 'Canceled'
            }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${badge.bg} ${badge.text} ${badge.border}`}>
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{badge.label}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header Card */}
                <div data-aos="fade-down" className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Blood Donation Request</h1>
                            <p className="text-red-100">Request ID: {request._id}</p>
                        </div>
                        {getStatusBadge(request.status)}
                    </div>

                    {/* Blood Group Highlight */}
                    <div className="bg-red-50 border-b-2 border-red-200 px-8 py-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                            <Droplet className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Required Blood Type</p>
                            <p className="text-3xl font-bold text-red-600">{request.bloodGroup}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div data-aos="zoom-in" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recipient Information */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                            <User className="w-6 h-6 text-red-600" />
                            <h2 className="text-xl font-bold text-gray-800">Recipient Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <span className="font-semibold text-lg">{request.recipientName}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Hospital</label>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">{request.hospital}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Address</label>
                                <div className="flex items-start gap-2 text-gray-800">
                                    <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <span className="font-medium">{request.address}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">{request.upazila}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requester Information */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                            <Mail className="w-6 h-6 text-red-600" />
                            <h2 className="text-xl font-bold text-gray-800">Requester Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <span className="font-semibold text-lg">{request.requesterName}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <a
                                        href={`mailto:${request.requesterEmail}`}
                                        className="font-medium text-red-600 hover:underline"
                                    >
                                        {request.requesterEmail}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donation Schedule */}
                <div data-aos="zoom-out" className="bg-white rounded-xl shadow-lg p-6 mt-6">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                        <Calendar className="w-6 h-6 text-red-600" />
                        <h2 className="text-xl font-bold text-gray-800">Donation Schedule</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                            <div className="flex items-center gap-2 text-gray-800">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-lg">{request.donationDate}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Time</label>
                            <div className="flex items-center gap-2 text-gray-800">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-lg">{request.donationTime}</span>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-800">
                                    Please arrive 15 minutes before the scheduled time. Remember to bring a valid ID.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div data-aos="fade-right" className="bg-white rounded-xl shadow-lg p-6 mt-6">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                        <MessageSquare className="w-6 h-6 text-red-600" />
                        <h2 className="text-xl font-bold text-gray-800">Additional Message</h2>
                    </div>

                    {request.message ? (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800 leading-relaxed">{request.message}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No additional message provided</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div  data-aos="flip-left" className="mt-6 bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={`mailto:${request.requesterEmail}?subject=Blood Donation Request - ${request.bloodGroup}&body=Hi ${request.requesterName}, I am interested in donating blood for your request.`}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                    >
                        Contact Requester
                    </a>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDetails;