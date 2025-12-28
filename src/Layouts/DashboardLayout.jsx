import React, { useState, useEffect } from 'react';
import logo from "../assets/bloodheros_logo.png";
import { Home, Droplet, Users, MapPin, Menu, X, User, HeartPulse } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';
import useAxiosSecure from '../Hooks/useAxiousSecure';
import useRole from '../Hooks/useRole';

const DashboardLayout = () => {
    const { role } = useRole();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);

    console.log(role);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) return;
            try {
                const res = await axiosSecure.get('/donors'); // fetch all donors
                const matchedUser = res.data.find(donor => donor.email === user.email);
                if (matchedUser) {
                    setUserData(matchedUser);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, [user, axiosSecure]);

    return (
        <div className="min-h-screen bg-gray-50">

            <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <Link to="/" className="flex items-center space-x-2">
                            <img className='h-15' src={logo} alt="Logo" />
                            <h1 className="text-xl text-red-500 font-bold text-gray-800">Blood<span className='text-green-600'>Heros</span></h1>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setSidebarOpen(false)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard'
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Home className="w-5 h-5" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard/bloodrequest"
                                    onClick={() => setSidebarOpen(false)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/bloodrequest'
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Droplet className="w-5 h-5" />
                                    <span className="font-medium">Blood Requests</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard/myrequests"
                                    onClick={() => setSidebarOpen(false)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/myrequests'
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">My Blood Requests</span>
                                </Link>
                            </li>

                            {(role === 'admin' || role === 'volunteer') && (
                                <li>
                                    <Link
                                        to="/dashboard/alldonaterequest"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/alldonaterequest'
                                            ? 'bg-red-50 text-red-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="font-medium">🦸‍♀️ All Donate Request</span>
                                    </Link>
                                </li>
                            )}
                            {/* All Users only for admin */}
                            {role === 'admin' && (
                                <li>
                                    <Link
                                        to="/dashboard/allusers"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/allusers'
                                            ? 'bg-red-50 text-red-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Users className="w-5 h-5" />
                                        <span className="font-medium">All Users</span>
                                    </Link>
                                </li>
                            )}

                            {/* All Blood Request for admin and volunteer */}
                            {(role === 'admin' || role === 'volunteer') && (
                                <li>
                                    <Link
                                        to="/dashboard/allrequest"
                                        onClick={() => setSidebarOpen(false)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/allrequest'
                                            ? 'bg-red-50 text-red-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <HeartPulse className="w-5 h-5" />
                                        <span className="font-medium">All Blood Request</span>
                                    </Link>
                                </li>
                            )}


                        </ul>
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">

                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                {userData?.photoURL ? (
                                    <img
                                        className="w-full h-full object-cover"
                                        src={userData.photoURL}
                                        alt="User Avatar"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                        {userData?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <Link to="/myprofile" className="flex-1 cursor-pointer">
                                <p className="text-sm font-semibold text-green-500">
                                    {userData?.name || "Unknown User"}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Blood Group:{" "}
                                    <span className="text-red-500 font-bold">
                                        {userData?.blood_group || "B+"}
                                    </span>
                                </p>
                            </Link>

                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
