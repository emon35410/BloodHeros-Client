import React, { useState, useMemo, useEffect } from 'react';
import { Search, Droplet, MapPin, Mail, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import districtsData from "../../../public/districts.json"
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

    // Filter upazilas based on selected district
    const filteredUpazilas = useMemo(() => {
        if (!searchParams.district) return [];
        const selectedDistrict = districtsData.find(d => d.name === searchParams.district);
        if (!selectedDistrict) return [];
        return upazilasData.filter(u => u.district_id === selectedDistrict.id);
    }, [searchParams.district]);

    // Fetch donors using TanStack Query
    const { data: donors = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['searchDonors', searchParams],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (searchParams.blood_group) params.append('blood_group', searchParams.blood_group);
            if (searchParams.district) params.append('district', searchParams.district);
            if (searchParams.upazila) params.append('upazila', searchParams.upazila);

            const response = await axiosSecure.get(`/donors?${params.toString()}`);
            return response.data;
        },
        enabled: false, // Don't fetch automatically
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => {
            const updated = { ...prev, [name]: value };
            // Reset upazila when district changes
            if (name === 'district') {
                updated.upazila = '';
            }
            return updated;
        });
    };

    const handleSearch = () => {
        setShouldSearch(true);
        refetch(); // Manually trigger the query
    };
    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div data-aos="fade-up" className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-red-600 mb-2">Find Blood Donors</h1>
                    <p className="text-gray-600">Search for donors by blood group and location</p>
                </div>

                {/* Search Form */}
                <div data-aos="fade-right" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                                <Droplet className="inline w-5 h-5 mr-2 text-red-500" />
                                Blood Group
                            </label>

                            <select
                                name="blood_group"
                                value={searchParams.blood_group}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3.5 text-base font-medium border-2 rounded-lg
        focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition bg-white
        ${searchParams.blood_group ? 'text-gray-900' : 'text-gray-400'}
      `}
                            >
                                <option value="" disabled hidden>
                                    Select Blood Group
                                </option>
                                {bloodGroups.map(group => (
                                    <option key={group} value={group} className="text-gray-900">
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                                <MapPin className="inline w-5 h-5 mr-2 text-red-500" />
                                District
                            </label>

                            <select
                                name="district"
                                value={searchParams.district}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3.5 text-base font-medium border-2 rounded-lg
        focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition bg-white
        ${searchParams.district ? 'text-gray-900' : 'text-gray-400'}
      `}
                            >
                                <option value="" disabled hidden>
                                    Select District
                                </option>
                                {districtsData.map(district => (
                                    <option key={district.id} value={district.name} className="text-gray-900">
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Upazila */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                                <MapPin className="inline w-5 h-5 mr-2 text-red-500" />
                                Upazila
                            </label>

                            <select
                                name="upazila"
                                value={searchParams.upazila}
                                onChange={handleInputChange}
                                disabled={!searchParams.district}
                                className={`w-full px-4 py-3.5 text-base font-medium border-2 rounded-lg
        focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition bg-white
        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200
        ${searchParams.upazila ? 'text-gray-900' : 'text-gray-400'}
      `}
                            >
                                <option value="" disabled hidden>
                                    {searchParams.district ? 'Select Upazila' : 'Select District First'}
                                </option>
                                {filteredUpazilas.map(upazila => (
                                    <option key={upazila.id} value={upazila.name} className="text-gray-900">
                                        {upazila.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>


                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        <Search className="w-6 h-6" />
                        {isLoading ? 'Searching...' : 'Search Donors'}
                    </button>
                </div>

                {/* Results Section */}
                {shouldSearch && (
                    <div data-aos="fade-down">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                                <p className="mt-4 text-gray-600 font-medium">Searching for donors...</p>
                            </div>
                        ) : isError ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Donors</h3>
                                <p className="text-gray-600">Please try again later</p>
                            </div>
                        ) : donors.length > 0 ? (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Found {donors.length} Donor{donors.length !== 1 ? 's' : ''}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {donors.map((donor) => (
                                        <div
                                            key={donor._id}
                                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                                        >
                                            <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2"></div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-4 mb-4">
                                                    {donor.photoURL ? (
                                                        <img
                                                            src={donor.photoURL}
                                                            alt={donor.name}
                                                            className="w-16 h-16 rounded-full object-cover border-4 border-red-100"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                                            <User className="w-8 h-8 text-red-500" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-800">{donor.name}</h3>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${donor.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {donor.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Droplet className="w-4 h-4 text-red-500" />
                                                        <span className="font-semibold text-red-600">{donor.blood_group}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <MapPin className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm">{donor.upazila}, {donor.district}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm">{donor.email}</span>
                                                    </div>
                                                </div>

                                                <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200">
                                                    Contact Donor
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Donors Found</h3>
                                <p className="text-gray-600">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Initial State */}
                {!shouldSearch && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Droplet className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Search</h3>
                        <p className="text-gray-600">Fill in the search criteria above to find blood donors</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDonor;