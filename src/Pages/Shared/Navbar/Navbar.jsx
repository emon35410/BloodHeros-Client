import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import logo from "../../../assets/bloodheros_logo.png"
import useAuth from '../../../Hooks/useAuth';
import { LayoutDashboard, LogOut, UserPen, Heart, Menu, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const handleLogout = () => {
        logOut().catch(error => console.error(error));
    }

    const navLinkStyles = ({ isActive }) =>
        `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive
            ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
            : 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`;

    const links = (
        <>
            <li><NavLink to="/" className={navLinkStyles}>Home</NavLink></li>
            <li><NavLink to="/searchDonor" className={navLinkStyles}>Search Donors</NavLink></li>
            <li><NavLink to="/donorBloodRequest" className={navLinkStyles}>Donor Requests</NavLink></li>
            <li><NavLink to="/bloodDonationRequest" className={navLinkStyles}>All Blood Requests</NavLink></li>
            {/* মোবাইল মেনুর জন্য সাপোর্ট লিঙ্ক */}
            <li className="lg:hidden"><NavLink to="/supportus" className={navLinkStyles}>Support Us</NavLink></li>
        </>
    );

    return (
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="navbar max-w-7xl mx-auto px-4">

                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-1">
                            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white dark:bg-gray-800 rounded-2xl z-50 mt-3 w-64 p-4 shadow-2xl border border-gray-100 dark:border-gray-700">
                            {links}
                        </ul>
                    </div>

                    {/* Desktop Logo */}
                    <Link to="/" className="hidden lg:flex group items-center gap-2 transition-all duration-500">
                        <div className="relative">
                            <img src={logo} alt="Logo" className="h-12 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <span className="text-2xl font-black tracking-tighter">
                            <span className="text-red-600">Blood</span>
                            <span className="text-emerald-600 dark:text-emerald-500">Heroes</span>
                        </span>
                    </Link>
                </div>

                <div className="navbar-center">
                    {/* Mobile Logo Centered */}
                    <Link to="/" className="lg:hidden flex items-center gap-1">
                        <img src={logo} alt="Logo" className="h-9 object-contain" />
                        <span className="text-lg font-black tracking-tighter">
                            <span className="text-red-600">Blood</span>
                            <span className="text-emerald-600 dark:text-emerald-500">Heroes</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex">
                        <ul className="menu menu-horizontal gap-1 px-1">
                            {links}
                        </ul>
                    </div>
                </div>

                <div className="navbar-end gap-2 md:gap-4">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-yellow-400"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Desktop Support Us Button */}
                    <Link to="/supportus" className="hidden sm:flex btn btn-sm h-10 bg-gradient-to-r from-red-600 to-rose-500 text-white border-none hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all">
                        <Heart className="w-4 h-4 fill-current" />
                        Support Us
                    </Link>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="avatar hover:ring-2 ring-red-500 ring-offset-2 rounded-full transition-all duration-300">
                                <div className="w-10 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="User" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-64 mt-4 p-3 border border-gray-50 dark:border-gray-700 space-y-1">
                                <div className="px-4 py-2 border-b dark:border-gray-700 mb-2">
                                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{user?.displayName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                </div>

                                {/* Mobile view dropdown items */}


                                <li>
                                    <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-200 rounded-xl">
                                        <LayoutDashboard className="w-5 h-5 text-red-500" /> Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/myprofile" className="flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-200 rounded-xl">
                                        <UserPen className="w-5 h-5 text-red-500" /> My Profile
                                    </Link>
                                </li>
                                <li className="sm:hidden">
                                    <Link to="/supportus" className="flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl font-bold">
                                        <Heart className="w-5 h-5 fill-current" /> Support Us
                                    </Link>
                                </li>
                                <div className="border-t dark:border-gray-700 my-1"></div>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full text-left font-semibold">
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-sm h-10 px-6 bg-gray-900 dark:bg-red-600 text-white border-none rounded-full transition-all">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;