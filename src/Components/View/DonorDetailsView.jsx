import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, Mail, Phone, MapPin, Calendar,
    Printer, Clock, Heart, AlertCircle, 
    Scale, Cake, Award, Droplet
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useAxiousSecure from '../../Hooks/useAxiousSecure';

const DonorDetailsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiousSecure();

    // Data Fetching
    const { data: donor, isLoading, isError, error } = useQuery({
        queryKey: ['donorDetails', id],
        queryFn: async () => {
            if (!id) throw new Error("No Donor ID provided");
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

    const calculateAge = (dateString) => {
        if (!dateString) return null;
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const getStatusConfig = (status) => {
        const configs = {
            approved: { 
                bgDark: 'dark:bg-emerald-950/30', bgLight: 'bg-emerald-50', 
                textDark: 'dark:text-emerald-400', textLight: 'text-emerald-700',
                dot: 'bg-emerald-500', label: 'Approved' 
            },
            pending: { 
                bgDark: 'dark:bg-amber-950/30', bgLight: 'bg-amber-50', 
                textDark: 'dark:text-amber-400', textLight: 'text-amber-700',
                dot: 'bg-amber-500', label: 'Pending Review' 
            },
            rejected: { 
                bgDark: 'dark:bg-red-950/30', bgLight: 'bg-red-50', 
                textDark: 'dark:text-red-400', textLight: 'text-red-700',
                dot: 'bg-red-500', label: 'Rejected' 
            },
            done: { 
                bgDark: 'dark:bg-purple-950/30', bgLight: 'bg-purple-50', 
                textDark: 'dark:text-purple-400', textLight: 'text-purple-700',
                dot: 'bg-purple-500', label: 'Completed' 
            }
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
        <div className="min-h-screen pb-12 transition-colors duration-300 bg-gray-50 dark:bg-gray-950">
            {/* Header / Navbar Sync */}
            <div className="border-b transition-colors bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-sm font-bold transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                    <button 
                        onClick={() => window.print()} 
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all bg-gray-900 dark:bg-red-600 text-white hover:bg-black dark:hover:bg-red-700 print:hidden"
                    >
                        <Printer className="w-4 h-4" /> Print Application
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-8">
                {/* Main Profile Info */}
                <div data-aos="fade-up" className="rounded-3xl border p-6 md:p-8 mb-6 transition-colors bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        {/* Blood Group Icon */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-28 h-28 rounded-[2rem] flex flex-col items-center justify-center border-4 transition-colors bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30">
                                <span className="text-4xl font-black text-red-600 dark:text-red-500">{donor.bloodGroup}</span>
                                <Droplet className="w-4 h-4 text-red-400 mt-1" fill="currentColor" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-black mb-1 text-gray-900 dark:text-white tracking-tight">{donorName}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400">
                                        <Award className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Verified Blood Hero</span>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border self-center md:self-start transition-colors ${statusConfig.bgLight} ${statusConfig.bgDark} border-transparent shadow-sm`}>
                                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></span>
                                    <span className={`text-xs font-black uppercase tracking-wider ${statusConfig.textLight} ${statusConfig.textDark}`}>{statusConfig.label}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <StatCard icon={Scale} label="Weight" value={donor.weight ? `${donor.weight} kg` : 'N/A'} />
                                <StatCard icon={Cake} label="Age" value={`${displayAge} yrs`} />
                                <StatCard icon={Heart} label="Status" value={donor.healthDeclaration ? 'Fit' : 'Healthy'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Contact Info */}
                    <div data-aos="fade-up" data-aos-delay="100" className="rounded-3xl border p-6 transition-colors bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2 text-gray-400 dark:text-gray-500">
                            <Phone className="w-4 h-4 text-red-500" /> Contact Info
                        </h2>
                        <div className="space-y-1">
                            <InfoRow label="Email Address" value={donor.email} icon={Mail} />
                            <InfoRow label="Phone Number" value={donor.phone} icon={Phone} />
                            <InfoRow label="Current Location" value={donor.address} icon={MapPin} />
                        </div>
                    </div>

                    {/* Right: Timeline Info */}
                    <div data-aos="fade-up" data-aos-delay="200" className="rounded-3xl border p-6 transition-colors bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2 text-gray-400 dark:text-gray-500">
                            <Clock className="w-4 h-4 text-red-500" /> Request Timeline
                        </h2>
                        <div className="space-y-1">
                            <InfoRow label="Date of Birth" value={formatDate(donor.dob)} icon={Cake} />
                            <InfoRow label="Application Sent" value={formatDate(donor.createdAt || donor.created_at)} icon={Calendar} />
                        </div>
                        
                        {/* Health Note */}
                        <div className="mt-5 p-4 rounded-2xl border border-dashed transition-colors bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2">Message from Donor</p>
                            <p className="text-sm font-medium italic leading-relaxed text-blue-800 dark:text-blue-300">
                                "{donor.note || 'No additional remarks provided by the donor.'}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div data-aos="zoom-in" className="mt-8 rounded-3xl p-8 text-center transition-colors bg-gradient-to-br from-gray-900 to-black dark:from-red-950/40 dark:to-gray-900 border border-transparent dark:border-red-900/20">
                    <Heart className="w-10 h-10 mx-auto mb-4 text-red-500" fill="currentColor" />
                    <h3 className="text-xl font-black mb-2 text-white uppercase tracking-tight">Support This Hero</h3>
                    <p className="text-sm max-w-lg mx-auto leading-relaxed text-gray-400">
                        This application has been verified. Please follow all medical protocols and ensure a safe environment for the donation process.
                    </p>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `@media print { .print\\:hidden { display: none !important; } body { background: white; } .shadow-sm { box-shadow: none !important; } }` }} />
        </div>
    );
};

// --- Sub-components (Optimized) ---

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="rounded-2xl px-4 py-4 border transition-all bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:border-red-100 dark:hover:border-red-900/30">
        <div className="flex items-center gap-2 mb-1.5 text-gray-400 dark:text-gray-500">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-lg font-black text-gray-900 dark:text-gray-200">{value}</p>
    </div>
);

const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors bg-gray-100 dark:bg-gray-800 group-hover:bg-red-50 dark:group-hover:bg-red-500 group-hover:text-red-600 dark:group-hover:text-white">
            <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] leading-none mb-1.5 text-gray-400 dark:text-gray-500">{label}</p>
            <p className="text-sm font-bold truncate text-gray-700 dark:text-gray-300">{value || 'Not provided'}</p>
        </div>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-red-100 dark:border-red-900/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] animate-pulse">Fetching Hero Profile</p>
    </div>
);

const ErrorDisplay = ({ error, navigate }) => (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
        <div className="rounded-[2.5rem] shadow-2xl p-10 max-w-md text-center border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-gray-900 dark:text-white uppercase">Request Error</h2>
            <p className="text-sm mb-10 text-gray-500 dark:text-gray-400 leading-relaxed">{error?.message || 'We could not find the donation details you are looking for.'}</p>
            <button onClick={() => navigate(-1)} className="w-full py-4 rounded-2xl transition-all font-black uppercase text-xs tracking-widest bg-gray-900 dark:bg-red-600 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none">
                Return to Safety
            </button>
        </div>
    </div>
);

export default DonorDetailsView;