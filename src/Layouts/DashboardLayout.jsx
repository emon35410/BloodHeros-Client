import React, { useState } from 'react';
import logo from "../assets/bloodheros_logo.png"
import {
    Home,
    Droplet,
    Users,
    MapPin,
    Menu,
    X
} from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();
    console.log(user)

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
        { id: 'donate', label: 'Donate Blood', icon: Droplet, path: '/dashboard/donate' },
        { id: 'requests', label: 'Blood Requests', icon: Users, path: '/dashboard/bloodrequest' },
        { id: 'myrequests', label: 'My Blood Requests', icon: Users, path: '/dashboard/myrequests/' },
        { id: 'locations', label: 'Find Centers', icon: MapPin, path: '/dashboard/locations' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <Link to="/" className="flex items-center space-x-2">
                            <img className='h-15' src={logo} alt="" />
                            <h1 className="text-xl text-red-500 font-bold text-gray-800">Blood<span className='text-green-600'>Heros</span></h1>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.id}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-red-50 text-red-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">

                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                {user && (
                                    <img
                                        className="w-full h-full object-cover"
                                        src={user.photoURL}
                                        alt="User Avatar"
                                    />
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                {user && (
                                    <p className="text-sm font-semibold text-green-500">
                                        {user.displayName}
                                    </p>
                                )}

                                {/* Blood Group — Dynamic Later */}
                                <p className="text-xs text-gray-500">
                                    Blood Group: <span className='text-red-500 font-bold'>{user?.blood_group || "A+"}</span>
                                </p>
                            </div>

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