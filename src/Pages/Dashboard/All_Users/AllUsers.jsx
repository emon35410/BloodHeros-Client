import React, { useEffect, useState } from 'react';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import { Search, UserCheck, UserX, Shield, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AllUsers = () => {
    const axiosSecure = useAxiousSecure();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
        fetchUsers();
    }, []);

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

    const updateRole = async (email, role, userName) => {
        const result = await Swal.fire({
            title: 'Confirm Role Change',
            html: `Are you sure you want to make <strong>${userName}</strong> a <strong>${role}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, update role'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/donors/role/${email}`, { role });
                await fetchUsers();
                Swal.fire({ title: 'Success!', text: `${userName} is now a ${role}`, icon: 'success', timer: 2000 });
            } catch (error) {
                Swal.fire({ title: 'Error!', text: 'Failed to update role.', icon: 'error' });
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
            cancelButtonColor: '#64748b',
            confirmButtonText: `Yes, ${action}`
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/donors/status/${email}`, { status });
                await fetchUsers();
                Swal.fire({ title: 'Success!', text: `${userName} has been ${action}ed`, icon: 'success', timer: 2000 });
            } catch (error) {
                Swal.fire({ title: 'Error!', text: 'Failed to update status.', icon: 'error' });
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
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div data-aos="fade-down" className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    User Management
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage permissions and account status securely.</p>
            </div>

            {/* Filters */}
            <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-200"
                    />
                </div>
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 outline-none cursor-pointer">
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="donor">Donor</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 outline-none cursor-pointer">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            {/* Table */}
            <div data-aos="fade-up" className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {['User', 'Role', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" src={user?.photoURL} alt="" />
                                            <div>
                                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                            user.role === 'volunteer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            user.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Action Part - Adaptive Colors */}
                                            {user.status === 'active' ? (
                                                <button onClick={() => updateStatus(user.email, 'blocked', user.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all">
                                                    <UserX className="w-3.5 h-3.5" /> Block
                                                </button>
                                            ) : (
                                                <button onClick={() => updateStatus(user.email, 'active', user.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">
                                                    <UserCheck className="w-3.5 h-3.5" /> Unblock
                                                </button>
                                            )}

                                            {user.role === 'volunteer' ? (
                                                <button onClick={() => updateRole(user.email, 'donor', user.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                                    <UserX className="w-3.5 h-3.5" /> Remove Volunteer
                                                </button>
                                            ) : user.role !== 'admin' && (
                                                <button onClick={() => updateRole(user.email, 'volunteer', user.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
                                                    <UserCheck className="w-3.5 h-3.5" /> Make Volunteer
                                                </button>
                                            )}

                                            <button onClick={() => updateRole(user.email, user.role === 'admin' ? 'donor' : 'admin', user.name)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                                user.role === 'admin' 
                                                ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700' 
                                                : 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/40'
                                            }`}>
                                                <Shield className="w-3.5 h-3.5" /> {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;