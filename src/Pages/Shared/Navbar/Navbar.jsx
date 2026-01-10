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
        `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive 
            ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' 
            : 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`;

    const links = (
        <>
            <li><NavLink to="/" className={navLinkStyles}>Home</NavLink></li>
            <li><NavLink to="/searchDonor" className={navLinkStyles}>Search Donors</NavLink></li>
            <li><NavLink to="/donorBloodRequest" className={navLinkStyles}>Donor Requests</NavLink></li>
            <li><NavLink to="/bloodDonationRequest" className={navLinkStyles}>All Requests</NavLink></li>
            <li><NavLink to="/supportDonation" className={navLinkStyles}>Support</NavLink></li>
        </>
    );

    return (
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="navbar max-w-7xl mx-auto px-4">
                
                {/* Navbar Start */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-1">
                            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white dark:bg-gray-800 rounded-2xl z-50 mt-3 w-64 p-4 shadow-2xl border border-gray-100 dark:border-gray-700">
                            {links}
                        </ul>
                    </div>
                    
                    {/* Logo with Hover Gradient Effect */}
                    <Link to="/" className="group flex items-center gap-2 transition-all duration-500">
                        <div className="relative">
                            <img src={logo} alt="Logo" className="h-10 md:h-12 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
                            
                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <span className="text-xl md:text-2xl font-black tracking-tighter transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-rose-400 group-hover:bg-clip-text group-hover:text-transparent">
                            <span className="text-red-600 group-hover:text-inherit transition-colors">Blood</span>
                            <span className="text-gray-800 dark:text-gray-100 group-hover:text-inherit transition-colors">Heroes</span>
                        </span>
                    </Link>
                </div>

                {/* Navbar Center */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-1 px-1">
                        {links}
                    </ul>
                </div>

                {/* Navbar End */}
                <div className="navbar-end gap-2 md:gap-4">
                    
                    {/* Dark Mode Toggle Button */}
                    <button 
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-yellow-400"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {user ? (
                        <>
                            <Link to="/supportus" className="hidden sm:flex btn btn-sm h-10 bg-gradient-to-r from-red-600 to-rose-500 text-white border-none hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all">
                                <Heart className="w-4 h-4 fill-current" />
                                Support
                            </Link>

                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="avatar hover:ring-2 ring-red-500 ring-offset-2 rounded-full transition-all duration-300">
                                    <div className="w-10 rounded-full border border-gray-200 dark:border-gray-700">
                                        <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="User" />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-64 mt-4 p-3 border border-gray-50 dark:border-gray-700 space-y-1">
                                    <div className="px-4 py-2 border-b dark:border-gray-700 mb-2">
                                        <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{user?.displayName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                    </div>
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
                                    <div className="border-t dark:border-gray-700 my-1"></div>
                                    <li>
                                        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-sm h-10 px-6 bg-gray-900 dark:bg-red-600 text-white hover:bg-gray-800 dark:hover:bg-red-700 border-none rounded-full shadow-lg transition-all">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;