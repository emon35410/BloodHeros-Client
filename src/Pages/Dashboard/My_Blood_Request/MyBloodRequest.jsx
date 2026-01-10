import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
    Edit, Trash2, Eye, AlertCircle, Clock, MapPin, Calendar, 
    Droplet, User, ChevronLeft, ChevronRight, Filter, Building2, X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import toast from 'react-hot-toast';
import Aos from 'aos';
import 'aos/dist/aos.css';

const MyBloodRequest = () => {
    const axiousSecure = useAxiousSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const [modal, setModal] = useState({ type: null, data: null });
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => { Aos.init({ duration: 1000, once: true }); }, []);

    const { data: My_BloodRequest = [], isLoading } = useQuery({
        queryKey: ['myBloodRequest', user?.email],
        queryFn: async () => (await axiousSecure.get(`/donorRequest?email=${user.email}`)).data,
        enabled: !!user?.email
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['myBloodRequest', user?.email] });
    
    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const { _id, ...data } = updatedData;
            return axiousSecure.patch(`/donorRequest/${_id}`, data);
        },
        onSuccess: () => { invalidate(); toast.success('Updated successfully!'); setModal({ type: null }); },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axiousSecure.delete(`/donorRequest/${id}`),
        onSuccess: () => { invalidate(); toast.success('Request deleted!'); setModal({ type: null }); },
    });

    const filteredRequests = useMemo(() => 
        statusFilter === 'all' ? My_BloodRequest : My_BloodRequest.filter(req => req.status === statusFilter)
    , [My_BloodRequest, statusFilter]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
            inprogress: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800',
            done: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
            canceled: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${styles[status] || styles.pending}`}>{status}</span>;
    };

    if (isLoading) return <div className="flex justify-center min-h-screen items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div></div>;

    return (
        <div className="p-2 space-y-8 text-gray-800 dark:text-slate-200 transition-colors duration-300">
            {/* Header */}
            <div data-aos="fade-down" className="relative p-6 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold flex items-center gap-2">
                        <Droplet className="fill-current" /> My Donation Requests
                    </h1>
                    <p className="opacity-90 mt-1 font-medium italic">Manage your active blood donation requests effortlessly.</p>
                </div>
                <Droplet className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
            </div>

            {/* Filter Section */}
            <div data-aos="fade-up" className="bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4 text-rose-600 dark:text-rose-400">
                    <Filter className="w-5 h-5" /> <h3 className="font-bold text-lg">Filter Requests</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {['all', 'pending', 'inprogress', 'done', 'canceled'].map(s => (
                        <button key={s} onClick={() => {setStatusFilter(s); setCurrentPage(1)}} 
                        className={`px-5 py-2.5 rounded-xl capitalize font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm
                        ${statusFilter === s ? 'bg-rose-600 text-white' : 'bg-gray-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-600 dark:text-slate-300'}`}>
                            {s} <span className="ml-1 opacity-60 text-sm">({s === 'all' ? My_BloodRequest.length : My_BloodRequest.filter(r => r.status === s).length})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-slate-700/50 border-b dark:border-slate-700">
                            <tr>
                                {['Recipient', 'Location', 'Schedule', 'Blood Group', 'Status', 'Actions'].map(h => 
                                    <th key={h} className="px-6 py-5 text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {currentRequests.map(req => (
                                <tr key={req._id} className="group hover:bg-rose-50/30 dark:hover:bg-rose-900/5 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600"><User className="w-5 h-5" /></div>
                                            <span className="font-bold text-gray-900 dark:text-slate-100">{req.recipientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center text-sm font-semibold dark:text-slate-300"><Building2 className="w-4 h-4 mr-1 text-blue-500" />{req.hospital}</span>
                                            <span className="flex items-center text-xs text-gray-500 dark:text-slate-400"><MapPin className="w-3 h-3 mr-1" />{req.upazila}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm font-medium dark:text-slate-300"><Calendar className="w-4 h-4 mr-1 text-orange-500" />{req.donationDate}</div>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-slate-400"><Clock className="w-4 h-4 mr-1 text-sky-500" />{req.donationTime}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center justify-center w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600 font-black border border-rose-200 dark:border-rose-800">
                                            {req.bloodGroup}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link to={`/requests/${req._id}`} className="p-2 text-sky-600 bg-sky-50 dark:bg-sky-900/20 rounded-xl hover:bg-sky-100 transition-colors" title="View"><Eye className="w-5 h-5" /></Link>
                                            <button onClick={() => setModal({type: 'edit', data: req})} className="p-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 transition-colors" title="Edit"><Edit className="w-5 h-5" /></button>
                                            <button onClick={() => setModal({type: 'delete', data: req._id})} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded-xl hover:bg-rose-100 transition-colors" title="Delete"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border dark:border-slate-700 gap-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-30"><ChevronLeft/></button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)} 
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i+1 ? 'bg-rose-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/20 dark:text-slate-300'}`}>
                                {i+1}
                            </button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-30"><ChevronRight/></button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modal.type && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border dark:border-slate-700">
                        <div className={`p-6 border-b dark:border-slate-800 flex justify-between items-center text-white ${modal.type === 'edit' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                            <h3 className="text-xl font-black uppercase tracking-wide flex items-center gap-2">
                                {modal.type === 'edit' ? <Edit /> : <AlertCircle />} {modal.type === 'edit' ? 'Update Request' : 'Warning'}
                            </h3>
                            <button onClick={() => setModal({type: null})} className="hover:rotate-90 transition-transform"><X/></button>
                        </div>
                        
                        <div className="p-8">
                            {modal.type === 'delete' ? (
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-rose-50 dark:border-rose-900/50 animate-bounce text-rose-600">
                                        <Trash2 className="w-10 h-10" />
                                    </div>
                                    <p className="text-lg font-bold text-gray-800 dark:text-slate-100">Are you sure?</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 italic">This action will permanently remove the donation request.</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setModal({type: null})} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 font-bold rounded-2xl hover:bg-gray-200 dark:text-slate-300 transition-all">No, Keep it</button>
                                        <button onClick={() => deleteMutation.mutate(modal.data)} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-2xl shadow-lg hover:bg-rose-700 transition-all">Yes, Delete</button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const f = e.target;
                                    updateMutation.mutate({
                                        _id: modal.data._id,
                                        recipientName: f.recipientName.value,
                                        hospital: f.hospital.value,
                                        donationDate: f.donationDate.value,
                                        donationTime: `${f.hour.value}:${f.minute.value} ${f.ampm.value}`,
                                        address: f.address.value
                                    });
                                }} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-gray-400 dark:text-slate-500">Recipient Name</label>
                                        <input name="recipientName" defaultValue={modal.data.recipientName} className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-gray-400 dark:text-slate-500">Hospital</label>
                                        <input name="hospital" defaultValue={modal.data.hospital} className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none transition-all" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-gray-400 dark:text-slate-500">Date</label>
                                            <input type="date" name="donationDate" defaultValue={modal.data.donationDate} className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-gray-400 dark:text-slate-500">Time</label>
                                            <div className="flex gap-1">
                                                <select name="hour" defaultValue={modal.data.donationTime?.split(':')[0]} className="w-full p-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl outline-none">
                                                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>
                                                {/* Minute Field Added */}
                                                <select name="minute" defaultValue={modal.data.donationTime?.split(':')[1]?.split(' ')[0] || '00'} className="w-full p-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl outline-none">
                                                    {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select name="ampm" defaultValue={modal.data.donationTime?.split(' ')[1]} className="p-2 border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl outline-none">
                                                    <option value="AM">AM</option><option value="PM">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-gray-400 dark:text-slate-500">Detailed Address</label>
                                        <textarea name="address" defaultValue={modal.data.address} className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none transition-all" rows="2" />
                                    </div>
                                    <button type="submit" disabled={updateMutation.isPending} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50">
                                        {updateMutation.isPending ? 'Processing...' : 'SAVE CHANGES'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBloodRequest;