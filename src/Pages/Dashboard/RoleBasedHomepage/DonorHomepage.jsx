import React, { useState } from 'react';
import { Link } from 'react-router';
import { Trash2, Eye, AlertCircle, MapPin, Hospital, Calendar, Clock } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Commet } from 'react-loading-indicators';
import useAuth from '../../../Hooks/useAuth';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';

const DonorHomepage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiousSecure();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  const { data: recent3BloodRequest = [], isLoading } = useQuery({
    queryKey: ['recent3BloodRequest', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donorRequest?email=${user.email}&limit=3`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const handleDeleteConfirm = async () => {
    try {
      await axiosSecure.delete(`/donorRequest/${deleteRequestId}`);
      queryClient.setQueryData(['recent3BloodRequest', user?.email], oldData =>
        oldData.filter(req => req._id !== deleteRequestId)
      );
      setShowDeleteModal(false);
      setDeleteRequestId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteRequestId(id);
    setShowDeleteModal(true);
  };

  if (isLoading) return (
    <div className='min-h-[400px] flex justify-center items-center'>
      <Commet color="#ef4444" size="medium" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-900 rounded-3xl shadow-xl p-8 md:p-10 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
            Welcome back, {user?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-rose-100 text-lg font-medium max-w-md opacity-90">
            You are doing a great job saving lives. Here is a quick look at your activity.
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Recent Donation Requests
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Your 3 most recent activities</p>
          </div>
          <Link
            to="/dashboard/myrequests"
            className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition-all duration-300 shadow-sm"
          >
            View All History
          </Link>
        </div>

        {recent3BloodRequest.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Recipient</th>
                  <th className="px-6 py-5">Hospital & Area</th>
                  <th className="px-6 py-5">Schedule</th>
                  <th className="px-6 py-5 text-center">Group</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {recent3BloodRequest.map((request) => (
                  <tr key={request._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/20 transition-all duration-200">
                    <td className="px-8 py-6">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block">{request.recipientName}</span>
                    </td>
                    
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Hospital size={14} className="text-rose-500" /> {request.hospital}
                        </span>
                        <span className="text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
                          <MapPin size={14} /> {request.upazila}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                          <Calendar size={14} className="text-blue-500" /> {request.donationDate}
                        </span>
                        <span className="text-slate-500 dark:text-slate-500 flex items-center gap-1.5 font-medium">
                          <Clock size={14} /> {request.donationTime}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-center">
                      <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-black ring-1 ring-rose-100 dark:ring-rose-500/20">
                        {request.bloodGroup}
                      </span>
                    </td>

                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          request.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500' :
                          request.status === 'inprogress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500' :
                          request.status === 'done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        
                        <Link 
                          to={`/requests/${request._id}`}
                          className="p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-300"
                        >
                          <Eye size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(request._id)}
                          className="p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition-all duration-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-4">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No requests found</h3>
            <p className="text-slate-500 dark:text-slate-500 mt-2">When you create a request, it will appear here.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-slate-100 dark:border-slate-700 transform animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white text-center mb-2 tracking-tight">Confirm Delete</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm font-medium leading-relaxed">
              Are you sure you want to delete this request? This action will remove the record permanently.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorHomepage;