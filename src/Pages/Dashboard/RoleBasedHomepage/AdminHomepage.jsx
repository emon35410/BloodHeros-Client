import { useQuery } from "@tanstack/react-query";
import { User, DollarSign, Droplet, Activity, BarChart3 } from "lucide-react";
import { Commet } from "react-loading-indicators";
import useAxiousSecure from "../../../Hooks/useAxiousSecure";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useMemo } from "react";
import Aos from "aos";
import 'aos/dist/aos.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminHomepage = () => {
    const axiosSecure = useAxiousSecure();
    const { user } = useAuth();

    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    const { data: donors = [], isLoading: donorsLoading } = useQuery({
        queryKey: ["donors"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donors");
            return res.data;
        },
    });

    const { data: donations = [], isLoading: donationsLoading } = useQuery({
        queryKey: ["donations"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donations");
            return res.data;
        },
    });

    const { data: bloodRequests = [], isLoading: requestsLoading } = useQuery({
        queryKey: ["donorRequests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donorRequest");
            return res.data;
        },
    });

    const weeklyData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dailySummary = { "Sun": 0, "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0 };

        if (donations?.length > 0) {
            donations.forEach(item => {
                const dateSource = item.created_at || item.date; 
                const d = new Date(dateSource);
                if (!isNaN(d.getTime())) {
                    const dayName = days[d.getDay()];
                    dailySummary[dayName] += parseFloat(item.amount) || 0;
                }
            });
        }
        return Object.keys(dailySummary).map(day => ({ name: day, amount: dailySummary[day] }));
    }, [donations]);

    if (donorsLoading || donationsLoading || requestsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Commet color="#E11D48" size="medium" />
            </div>
        );
    }

    const totalFunding = donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

    return (
        <div className="space-y-6 p-4 md:p-6 transition-all duration-500">
            {/* 🔴 Welcome Section (Back Again) */}
            <div data-aos="fade-down" className="bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-700 dark:to-pink-700 rounded-3xl shadow-xl p-8 text-white border border-red-500/20 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-8 h-8 animate-pulse text-white" />
                            <h1 className="text-2xl md:text-3xl font-black">
                                Welcome back, {user?.displayName}! 👋
                            </h1>
                        </div>
                        <p className="text-red-50 text-base md:text-lg font-medium">
                            Here's an overview of your blood donation platform today.
                        </p>
                    </div>
                    <div className="hidden lg:block">
                         <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30">
                            <BarChart3 className="w-10 h-10" />
                         </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: "Total Donors", value: donors.length, icon: <User />, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
                    { label: "Total Fund", value: `$${totalFunding.toFixed(0)}`, icon: <DollarSign />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                    { label: "Requests", value: bloodRequests.length, icon: <Droplet />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" }
                ].map((stat, i) => (
                    <div key={i} data-aos="zoom-in" data-aos-delay={i * 100} className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:scale-105 transition-all">
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-4`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div data-aos="fade-up" className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <span className="w-2 h-6 bg-rose-600 rounded-full"></span>
                    Weekly Donation Insights
                </h2>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#64748b', fontSize: 13, fontWeight: 700}}
                                dy={10}
                            />
                            <YAxis hide />
                            {/* 🎯 Improved Tooltip Color */}
                            <Tooltip 
                                cursor={{fill: 'rgba(225, 29, 72, 0.05)'}}
                                contentStyle={{ 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                                    backgroundColor: '#1E293B', // Darker slate for contrast
                                    color: '#F8FAFC' 
                                }}
                                itemStyle={{ color: '#FB7185', fontWeight: 'bold', fontSize: '14px' }}
                                labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                            />
                            <Bar 
                                dataKey="amount" 
                                radius={[10, 10, 10, 10]} 
                                barSize={45}
                            >
                                {weeklyData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.amount > 0 ? '#E11D48' : '#e2e8f0'} 
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminHomepage;