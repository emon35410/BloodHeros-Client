import { useQuery } from "@tanstack/react-query";
import { User, DollarSign, Droplet, TrendingUp, Activity } from "lucide-react";
import { Commet } from "react-loading-indicators";
import useAxiousSecure from "../../../Hooks/useAxiousSecure";
import useAuth from "../../../Hooks/useAuth";
import { useEffect } from "react";
import Aos from "aos";
import 'aos/dist/aos.css';

const AdminHomepage = () => {
    const axiosSecure = useAxiousSecure();
    const { user } = useAuth();

    // Fetch total donors
    const { data: donors = [], isLoading: donorsLoading } = useQuery({
        queryKey: ["donors"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donors");
            return res.data;
        },
    });
        useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);
    // Fetch total donations
    const { data: donations = [], isLoading: donationsLoading } = useQuery({
        queryKey: ["donations"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donations");
            return res.data;
        },
    });

    // Fetch total blood donation requests
    const { data: bloodRequests = [], isLoading: requestsLoading } = useQuery({
        queryKey: ["donorRequests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donorRequest");
            return res.data;
        },
    });

    if (donorsLoading || donationsLoading || requestsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Commet color="#32cd32" size="medium" />
            </div>
        );
    }

    const totalFunding = donations.reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Welcome Section with better contrast */}
            <div data-aos="fade-up" className="bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-700 dark:to-pink-700 rounded-2xl shadow-xl p-6 md:p-8 text-white border border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-8 h-8 animate-pulse" />
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Welcome back, {user.displayName}! 👋
                    </h1>
                </div>
                <p className="text-red-50 text-base md:text-lg">
                    Here's an overview of your blood donation platform
                </p>
            </div>

        
            {/* Enhanced Stats Cards with better visibility */}
            <div data-aos="fade-down" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Total Donors Card */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border-2 border-red-100 dark:border-red-900 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <User className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>

                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {donors.length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Total Donors
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Registered users who can donate blood
                        </p>
                    </div>
                </div>

                {/* Total Funding Card */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border-2 border-green-100 dark:border-green-900 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                            Total
                        </span>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        ${totalFunding.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Total Funding
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {donations.length} donation{donations.length !== 1 ? 's' : ''} received
                        </p>
                    </div>
                </div>

                {/* Blood Donation Requests Card */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-900 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Droplet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                            Requests
                        </span>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {bloodRequests.length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Blood Requests
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Active donation requests in system
                        </p>
                    </div>
                </div>
            </div>

          
        </div>
    );
};

export default AdminHomepage;