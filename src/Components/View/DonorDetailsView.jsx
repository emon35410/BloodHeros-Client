import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, Mail, Phone, MapPin, Calendar,
    CheckCircle, Clock, Heart, Printer, ShieldCheck,
    Droplet, FileText, AlertCircle, User,
    Scale, Cake, Activity, Award
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useAxiousSecure from '../../Hooks/useAxiousSecure';

const DonorDetailsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiousSecure();

    // FRONTEND FIX: Defensive query function
    const { data: donor, isLoading, isError, error } = useQuery({
        queryKey: ['donorDetails', id],
        queryFn: async () => {
            if (!id) throw new Error("No Donor ID provided");
            // Ensure path is absolute with '/' and check your backend route name
            const res = await axiosSecure.get(`/blood-donate/${id}`);
            return res.data;
        },
        enabled: !!id,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-out-cubic', once: true });
    }, []);

    // Helper: Calculate Age
    const calculateAge = (dateString) => {
        if (!dateString) return null;
        const birthDate = new Date(dateString);
        if (isNaN(birthDate)) return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

   const getStatusConfig = (status) => {
        const configs = {
            approved: { bg: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', icon: ShieldCheck, label: 'Approved', dot: 'bg-emerald-500' },
            pending: { bg: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50', icon: Clock, label: 'Pending Review', dot: 'bg-amber-500' },
            rejected: { bg: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', icon: AlertCircle, label: 'Rejected', dot: 'bg-red-500' },
            done: { bg: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50', icon: CheckCircle, label: 'Completed', dot: 'bg-purple-500' }
        };
        return configs[status?.toLowerCase()] || configs.pending;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isLoading) return <LoadingSpinner />;

    if (isError || !donor) return <ErrorDisplay error={error} navigate={navigate} />;

    const statusConfig = getStatusConfig(donor.status);
    const donorName = donor.fullName || donor.requesterName || 'Anonymous Donor';
    const displayAge = donor.age || calculateAge(donor.dob) || 'N/A';

    return (
        <div className="min-h-screen bg-gray-50 print:bg-white pb-12">
            {/* Nav Header */}
            <div className="bg-white border-b border-gray-200 print:hidden mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition-all font-medium">
                        <Printer className="w-4 h-4" /> Print Report
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4">
                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-6" data-aos="fade-up">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-32 h-32 bg-red-50 rounded-3xl flex flex-col items-center justify-center border-2 border-red-100 shadow-inner">
                                <span className="text-4xl font-black text-red-600 leading-none">{donor.bloodGroup || 'O+'}</span>
                                <span className="text-[10px] font-bold text-red-400 uppercase mt-1 tracking-widest">Blood Group</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{donorName}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
                                        <Award className="w-4 h-4 text-amber-500" />
                                        <span className="text-sm font-medium">Verified Blood Donor</span>
                                    </div>
                                </div>
                                <div className={`${statusConfig.bgLight} px-4 py-2 rounded-2xl flex items-center gap-2 border border-gray-100 self-center md:self-start`}>
                                    <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot} animate-pulse`}></span>
                                    <span className={`text-sm font-bold uppercase tracking-wide ${statusConfig.textColor}`}>{statusConfig.label}</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <StatCard icon={Scale} label="Weight" value={donor.weight ? `${donor.weight} kg` : 'N/A'} />
                                <StatCard icon={Cake} label="Age" value={`${displayAge} yrs`} />
                                <StatCard icon={Heart} label="Health" value={donor.healthDeclaration ? 'Fit' : 'Pending'} color="text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sections */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-red-500" /> Contact Details
                        </h2>
                        <div className="space-y-1">
                            <InfoRow label="Email Address" value={donor.email} icon={Mail} />
                            <InfoRow label="Phone Number" value={donor.phone} icon={Phone} />
                            <InfoRow label="Current Address" value={donor.address} icon={MapPin} />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6" data-aos="fade-up" data-aos-delay="200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-red-500" /> Registration Info
                        </h2>
                        <div className="space-y-1">
                            <InfoRow label="Date of Birth" value={formatDate(donor.dob)} icon={Cake} />
                            <InfoRow label="Registered On" value={formatDate(donor.createdAt || donor.created_at)} icon={Calendar} />
                            <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Donor Remarks</p>
                                <p className="text-sm text-blue-800 italic">"{donor.note || 'No additional health remarks provided.'}"</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Appreciation */}
                <div className="mt-8 bg-gradient-to-br from-red-600 to-red-700 rounded-[2.5rem] p-10 text-center text-white shadow-xl shadow-red-100" data-aos="zoom-in">
                    <Heart className="w-12 h-12 text-white/30 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold mb-2">A True Life Saver</h3>
                    <p className="text-red-100 max-w-xl mx-auto opacity-90 leading-relaxed">
                        This donor is part of our verified community. Please ensure all medical protocols are strictly followed during the donation process.
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `@media print { .print\\:hidden { display: none !important; } body { background: white; } .shadow-sm { box-shadow: none !important; border: 1px solid #eee; } }` }} />
        </div>
    );
};

// Internal Components
const StatCard = ({ icon: Icon, label, value, color = "text-gray-900" }) => (
    <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-1">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
);

const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
            <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-gray-700 truncate">{value || 'Not provided'}</p>
        </div>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-bold text-gray-600 uppercase tracking-widest">Loading Hero Data...</p>
    </div>
);

const ErrorDisplay = ({ error, navigate }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md text-center border border-gray-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">404 - Not Found</h2>
            <p className="text-gray-500 text-sm mb-8">{error?.message || 'The donor record could not be found. It may have been deleted or the ID is invalid.'}</p>
            <button onClick={() => navigate(-1)} className="w-full bg-gray-900 text-white py-4 rounded-2xl hover:bg-black transition-all font-bold flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Return to Dashboard
            </button>
        </div>
    </div>
);

export default DonorDetailsView;