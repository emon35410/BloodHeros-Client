import React, { useEffect, useState } from 'react';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import { Search, UserCheck, UserX, Shield, Users } from 'lucide-react';
import Swal from 'sweetalert2';

const AllUsers = () => {
    const axiosSecure = useAxiousSecure();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchUsers = async () => {
        try {
            const res = await axiosSecure.get('/donors');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (email, role, userName) => {
        const result = await Swal.fire({
            title: 'Confirm Role Change',
            html: `Are you sure you want to make <strong>${userName}</strong> a <strong>${role}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, update role',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/donors/role/${email}`, { role });
                await fetchUsers();
                Swal.fire({
                    title: 'Success!',
                    text: `${userName} is now a ${role}`,
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update role. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    const updateStatus = async (email, status, userName) => {
        const action = status === 'blocked' ? 'block' : 'unblock';
        const result = await Swal.fire({
            title: `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`,
            html: `Are you sure you want to <strong>${action}</strong> <strong>${userName}</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'blocked' ? '#ef4444' : '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${action}`,
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/donors/status/${email}`, { status });
                await fetchUsers();
                Swal.fire({
                    title: 'Success!',
                    text: `${userName} has been ${action}ed`,
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update status. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    User Management
                </h2>
                <p className="text-gray-600">Manage user roles and account statuses</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-blue-700">{users.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Admins</p>
                    <p className="text-2xl font-bold text-purple-700">
                        {users.filter(u => u.role === 'admin').length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Volunteers</p>
                    <p className="text-2xl font-bold text-green-700">
                        {users.filter(u => u.role === 'volunteer').length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-2xl font-bold text-emerald-700">
                        {users.filter(u => u.status === 'active').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500 bg-white font-medium"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium bg-white"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="donor">Donor</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium bg-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No users found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        {/* User Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500 shadow-md ring-2 ring-red-100">
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={user?.photoURL}
                                                        alt="User Profile"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role Badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : user.role === 'volunteer'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                {user.role === 'volunteer' && <UserCheck className="w-3 h-3" />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${user.status === 'blocked'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {user.status === 'blocked' ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                {/* Block / Unblock */}
                                                {user.status === 'active' ? (
                                                    <button
                                                        onClick={() => updateStatus(user.email, 'blocked', user.name)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                    >
                                                        <UserX className="w-3 h-3" />
                                                        Block
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => updateStatus(user.email, 'active', user.name)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                                    >
                                                        <UserCheck className="w-3 h-3" />
                                                        Unblock
                                                    </button>
                                                )}

                                                {/* Volunteer Toggle */}
                                                {user.role === 'volunteer' ? (
                                                    <button
                                                        onClick={() => updateRole(user.email, 'donor', user.name)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                                    >
                                                        <UserX className="w-3 h-3" />
                                                        Remove Volunteer
                                                    </button>
                                                ) : user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => updateRole(user.email, 'volunteer', user.name)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                    >
                                                        <UserCheck className="w-3 h-3" />
                                                        Make Volunteer
                                                    </button>
                                                )}

                                                {/* Admin Toggle */}
                                                {user.role === 'admin' ? (
                                                    <button
                                                        onClick={() => updateRole(user.email, 'donor', user.name)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                                    >
                                                        <UserX className="w-3 h-3" />
                                                        Remove Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => updateRole(user.email, 'admin', user.name)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                                    >
                                                        <Shield className="w-3 h-3" />
                                                        Make Admin
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Results count */}
            {filteredUsers.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            )}
        </div>
    );
};

export default AllUsers;