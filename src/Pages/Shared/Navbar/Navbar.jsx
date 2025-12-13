import React from 'react';
import { Link, NavLink } from 'react-router';
import logo from "../../../assets/bloodheros_logo.png"
import useAuth from '../../../Hooks/useAuth';
import { LayoutDashboard, LogOut, UserPen } from 'lucide-react';

const Navbar = () => {
    const links = <>
        <li>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `font-medium transition-all duration-300 ${isActive ? 'text-red-500 bg-red-50' : 'hover:text-red-500 hover:bg-red-50'}`
                }
            >
                Home
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/searchDonor"
                className={({ isActive }) =>
                    `font-medium transition-all duration-300 ${isActive ? 'text-red-500 bg-red-50' : 'hover:text-red-500 hover:bg-red-50'}`
                }
            >
                Search Donors
            </NavLink>
        </li>

        <li>
            <NavLink
                to="/requestDetails"
                className={({ isActive }) =>
                    `font-medium transition-all duration-300 ${isActive ? 'text-red-500 bg-red-50' : 'hover:text-red-500 hover:bg-red-50'}`
                }
            >
                Request Details
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/bloodDonationRequest"
                className={({ isActive }) =>
                    `font-medium transition-all duration-300 ${isActive ? 'text-red-500 bg-red-50' : 'hover:text-red-500 hover:bg-red-50'}`
                }
            >
               All Blood Donation Requests
            </NavLink>
        </li>
    </>;
    const { user, logOut } = useAuth();
    const handleLogout = () => {
        logOut()
            .then()
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 shadow-lg">
            <div className="navbar max-w-7xl mx-auto text-white">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white hover:bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-black rounded-box z-50 mt-3 w-64 p-2 shadow-xl border-2 border-red-200">
                            {links}
                        </ul>
                    </div>
                    <Link className="btn btn-ghost  flex items-center gap-2 h-auto py-2">

                        <img
                            src={logo}
                            alt="BloodHeroes Logo"
                            className="h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-md"
                        />

                        <span className="text-xl lg:text-4xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-red-500  sm:inline">
                            Blood<span className='text-green-500'>Heroes</span>
                        </span>

                    </Link>

                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        {links}

                    </ul>
                </div>
                <div className="navbar-end gap-2">

                    {
                        user ?
                            <>
                                <Link className="btn bg-yellow-400 text-gray-800 hover:bg-yellow-300 border-none font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hidden sm:flex">
                                    <span className="text-xl">❤️</span>
                                    Donate Now
                                </Link>
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="cursor-pointer flex items-center"
                                    >
                                        <img
                                            className="h-12 w-12 rounded-full border-2 border-red-500 shadow-md hover:scale-105 transition"
                                            src={user?.photoURL}
                                            alt="User"
                                        />
                                    </div>

                                    {/* BLOOD THEME DROPDOWN MENU */}
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content menu bg-white rounded-xl shadow-xl w-60 mt-3 p-3 border border-red-200"
                                    >
                                        {/* DASHBOARD */}
                                        <li>
                                            <Link
                                                to="/dashboard"
                                                className="py-3 px-3 font-semibold rounded-lg bg-red-50 text-red-600 
               hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-[1.02]
               shadow-sm hover:shadow-md"
                                            >
                                                <LayoutDashboard /> Dashboard
                                            </Link>
                                        </li>

                                        {/* PROFILE */}
                                        <li className="mt-2">
                                            <Link
                                                to="/myprofile"
                                                className="py-3 px-3 font-semibold rounded-lg bg-red-50 text-red-600 
               hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-[1.02]
               shadow-sm hover:shadow-md"
                                            >
                                                <UserPen /> My Profile
                                            </Link>
                                        </li>

                                        {/* LOGOUT */}
                                        <li className="mt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="py-3 px-3 font-semibold rounded-lg bg-red-100 text-red-700 
               hover:bg-red-700 hover:text-white transition-all duration-300 hover:scale-[1.02]
               shadow-lg border border-red-300"
                                            >
                                                <LogOut /> Logout
                                            </button>
                                            <Link className="btn mt-2 bg-red-600 text-white border-none font-semibold shadow-lg hover:bg-red-700 hover:shadow-red-300/50 transition-all duration-300 hover:scale-110 md:hidden sm:flex items-center gap-2 px-5 py-3 rounded-xl">
                                                <span className="text-xl animate-pulse">❤️</span>Donate Now</Link>

                                        </li>
                                    </ul>
                                </div>


                            </>

                            :
                            <>
                                <Link to="/login" className="btn bg-white text-red-600 hover:bg-red-50 border-none font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Login
                                </Link>
                                <Link className="btn bg-yellow-400 text-gray-800 hover:bg-yellow-300 border-none font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hidden sm:flex">
                                    <span className="text-xl">❤️</span>
                                    Donate Now
                                </Link>
                            </>


                    }


                </div>
            </div>
        </div>
    );
};

export default Navbar;