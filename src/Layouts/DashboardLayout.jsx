import React, { useState, useEffect } from 'react';
import logo from "../assets/bloodheros_logo.png";
import { 
  Home, Droplet, Users, Menu, X, User, HeartPulse, 
  LayoutDashboard, ClipboardList, Moon, Sun 
} from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';
import useAxiosSecure from '../Hooks/useAxiousSecure';
import useRole from '../Hooks/useRole';

const DashboardLayout = () => {
    const { role } = useRole();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const location = useLocation();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state added

    // Dark Mode Toggle Logic
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }
            try {
                const res = await axiosSecure.get('/donors');
                const matchedUser = res.data.find(donor => donor.email === user.email);
                if (matchedUser) setUserData(matchedUser);
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false); // Data fetch complete
            }
        };
        fetchUserData();
    }, [user, axiosSecure]);

    const isActive = (path) => location.pathname === path;

    // Loading Screen (Eye Comfort & Theme aware)
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin"></div>
                    </div>
                    <p className={`text-sm font-bold tracking-widest uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Loading Dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] text-slate-200' : 'bg-[#F8FAFC] text-slate-900'}`}>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-72 transform transition-all duration-300 
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
                ${darkMode ? 'bg-[#1E293B] border-slate-800 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'} border-r`}>
                
                <div className="flex flex-col h-full">
                    {/* Brand Logo */}
                    <div className="flex items-center justify-between p-6 mb-2">
                        <Link to="/" className="flex items-center space-x-3">
                            <img className='h-10 w-auto' src={logo} alt="Logo" />
                            <h1 className={`text-xl font-black tracking-tight text-red-500`}>
                                Blood<span className='text-green-600'>Heros</span>
                            </h1>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-rose-500/10 rounded-full">
                            <X className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto px-4 space-y-6">
                        <div>   
                            <ul className="space-y-1">
                                {[
                                    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                                    { to: '/dashboard/bloodrequest', icon: Droplet, label: 'Blood Requests', iconColor: 'text-orange-500' },
                                    { to: '/dashboard/myrequests', icon: ClipboardList, label: 'My Requests', iconColor: 'text-blue-500' },
                                ].map((item) => (
                                    <li key={item.to}>
                                        <Link to={item.to} onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all 
                                            ${isActive(item.to) 
                                                ? (darkMode ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20' : 'bg-rose-50 text-rose-600 ring-1 ring-rose-100 shadow-sm') 
                                                : (darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-gray-600 hover:bg-gray-50')}`}>
                                            <item.icon className={`w-5 h-5 ${item.iconColor || ''}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Admin/Volunteer Section */}
                        {(role === 'admin' || role === 'volunteer') && (
                            <div className={`pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-gray-50'}`}>
                                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Management</p>
                                <ul className="space-y-1">
                                    <li>
                                        <Link to="/dashboard/alldonaterequest" onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive('/dashboard/alldonaterequest') ? 'bg-emerald-500/10 text-emerald-400' : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-50')}`}>
                                            <HeartPulse className="w-5 h-5 text-emerald-500" />
                                            <span>Manage Donations</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/allrequest" onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive('/dashboard/allrequest') ? (darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600') : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-50')}`}>
                                            <Droplet className="w-5 h-5 text-rose-500" />
                                            <span>All Blood Request</span>
                                        </Link>
                                    </li>
                                    {role === 'admin' && (
                                        <li>
                                            <Link to="/dashboard/allusers" onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive('/dashboard/allusers') ? (darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700') : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-50')}`}>
                                                <Users className="w-5 h-5 text-blue-500" />
                                                <span>Users List</span>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </nav>

                    {/* Profile & Theme Toggle */}
                    <div className={`p-4 border-t ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
                        <div className="flex items-center justify-between mb-4 px-2">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Theme</span>
                             <button 
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white shadow-sm text-slate-600 border border-gray-200'}`}
                             >
                                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                             </button>
                        </div>
                        
                        <Link to="/dashboard/myprofile" className={`flex items-center gap-3 p-3 rounded-2xl border transition-all group ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm">
                                {userData?.photoURL ? (
                                    <img className="w-full h-full object-cover" src={userData.photoURL} alt="User" />
                                ) : (
                                    <div className="w-full h-full bg-rose-500 flex items-center justify-center text-white font-bold">
                                        {userData?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className={`text-sm font-bold truncate group-hover:text-rose-500 transition-colors ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {userData?.name || "User Name"}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded">
                                        {userData?.blood_group || "N/A"}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{role}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <header className={`backdrop-blur-md sticky top-0 z-30 border-b px-6 py-4 transition-colors ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'}`}>
                    <div className="flex items-center justify-between">
                        <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <main className="p-6 md:p-10 flex-1">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default DashboardLayout;