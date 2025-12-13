import React, { useState } from 'react';
import { Link } from 'react-router';
import { Trash2, Eye, AlertCircle } from 'lucide-react';
import useAuth from '../../../Hooks/useAuth';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const HomePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiousSecure();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  // Fetch recent 3 requests
  const { data: recent3BloodRequest = [], isLoading } = useQuery({
    queryKey: ['recent3BloodRequest', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donorRequest?email=${user.email}&limit=3`);
      return res.data;
    },
    enabled: !!user?.email
  });

  // DELETE request function
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName}! 👋
        </h1>
        <p className="text-red-50">Thank you for being a life saver.</p>
      </div>

      {/* Recent Donation Requests */}
      {recent3BloodRequest.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              My Recent Donation Requests
            </h2>
            <p className="text-gray-600 mt-1">Your 3 most recent donation requests</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Hospital</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Blood Group</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recent3BloodRequest.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{request.recipientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.hospitalName}, {request.upazila}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.donationDate} <br /> {request.donationTime}</td>
                    <td className="px-6 py-4 text-sm text-red-800">{request.bloodGroup}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                              request.status === 'done' ? 'bg-green-100 text-green-800' :
                                request.status === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <Link to={`/requests/${request._id}`}>
                        <Eye className="w-5 h-5 text-blue-600" />
                      </Link>
                      <button onClick={() => handleDeleteClick(request._id)}>
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t bg-gray-50">
            <Link
              to="/dashboard/myrequests"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              View My All Requests
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Donation Request</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this donation request? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
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

export default HomePage;
