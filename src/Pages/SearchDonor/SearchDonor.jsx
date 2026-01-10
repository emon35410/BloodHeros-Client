import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import districtsData from "../../../public/districts.json";
import upazilasData from '../../../public/upazilas.json';
import useAxiousSecure from '../../Hooks/useAxiousSecure';
import 'aos/dist/aos.css';
import Aos from 'aos';

const SearchDonor = () => {
    const axiosSecure = useAxiousSecure();
    const [searchParams, setSearchParams] = useState({
        blood_group: '',
        district: '',
        upazila: ''
    });
    const [shouldSearch, setShouldSearch] = useState(false);

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        Aos.init({ duration: 800, once: true });
    }, []);

    const filteredUpazilas = useMemo(() => {
        if (!searchParams.district) return [];
        const selectedDistrict = districtsData.find(d => d.name === searchParams.district);
        return selectedDistrict ? upazilasData.filter(u => u.district_id === selectedDistrict.id) : [];
    }, [searchParams.district]);

    const { data: donors = [], isLoading, refetch } = useQuery({
        queryKey: ['searchDonors', searchParams],
        queryFn: async () => {
            const params = new URLSearchParams(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v)));
            const response = await axiosSecure.get(`/donors?${params.toString()}`);
            return response.data;
        },
        enabled: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'district' ? { upazila: '' } : {})
        }));
    };

    const handleSearch = () => {
        setShouldSearch(true);
        refetch();
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F1A] py-12 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div data-aos="fade-down" className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
                        Find <span className="text-red-500">Blood</span> Heroes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Search for life-savers in your community</p>
                </div>

                {/* Refined Search Box */}
                <div data-aos="fade-up" className="bg-white dark:bg-[#161B28] border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none p-6 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Blood Group</label>
                            <select name="blood_group" value={searchParams.blood_group} onChange={handleInputChange} className="w-full h-11 px-4 bg-slate-50 dark:bg-[#1E2533] border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-red-500/20 outline-none">
                                <option value="">Select Group</option>
                                {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">District</label>
                            <select name="district" value={searchParams.district} onChange={handleInputChange} className="w-full h-11 px-4 bg-slate-50 dark:bg-[#1E2533] border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-red-500/20 outline-none">
                                <option value="">Select District</option>
                                {districtsData.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Upazila</label>
                            <select name="upazila" value={searchParams.upazila} onChange={handleInputChange} disabled={!searchParams.district} className="w-full h-11 px-4 bg-slate-50 dark:bg-[#1E2533] border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 outline-none">
                                <option value="">Select Upazila</option>
                                {filteredUpazilas.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                            </select>
                        </div>

                        <button onClick={handleSearch} disabled={isLoading} className="h-11 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-slate-800 shadow-lg shadow-red-500/20 dark:shadow-none">
                            {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <Search size={18} />}
                            Find Donors
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="min-h-[200px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-[3px] border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                        </div>
                    ) : donors.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {donors.map((donor) => (
                                <div key={donor._id} className="bg-white dark:bg-[#161B28] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-3">
                                            {/* Simplified Image Loading: No complex states */}
                                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 ring-4 ring-slate-50 dark:ring-slate-900 overflow-hidden">
                                                <img
                                                    src={donor.image || donor.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                                                    alt={donor.name}
                                                    loading="eager" // Forced to load faster
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                                                {donor.blood_group}
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate w-full px-2">{donor.name}</h3>
                                        
                                        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[11px] mt-1 mb-4">
                                            <MapPin size={10} />
                                            <span>{donor.upazila}, {donor.district}</span>
                                        </div>

                                        <div className="w-full flex items-center gap-2 bg-slate-50 dark:bg-[#1E2533] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50 mb-4 group transition-colors">
                                            <Mail size={12} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate flex-1 text-left">{donor.email}</span>
                                        </div>

                                        <div className="w-full pt-3 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-between px-1">
                                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Status</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${donor.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></div>
                                                <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase">{donor.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        shouldSearch && (
                            <div className="text-center py-16 bg-white dark:bg-[#161B28] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-400 dark:text-slate-500 font-medium">No blood heroes found in this area.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchDonor;