import React, { useState } from 'react';
import { Link } from 'react-router';
import { 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  Droplet,
  User,
  Mail
} from 'lucide-react';
import useAuth from '../../../Hooks/useAuth';

const HomePage = () => {
  // Mock user data - replace with actual user data from auth context
  const {user} = useAuth();

  // Mock donation requests data - replace with actual API data
  const [donationRequests, setDonationRequests] = useState([
    {
      id: 1,
      recipientName: "Sarah Ahmed",
      recipientDistrict: "Dhaka",
      recipientUpazila: "Mohammadpur",
      donationDate: "2024-12-20",
      donationTime: "10:00 AM",
      bloodGroup: "A+",
      status: "inprogress",
      donorInfo: {
        name: "Mike Wilson",
        email: "mike@example.com"
      }
    },
    {
      id: 2,
      recipientName: "Karim Rahman",
      recipientDistrict: "Sylhet",
      recipientUpazila: "Companiganj",
      donationDate: "2024-12-18",
      donationTime: "2:30 PM",
      bloodGroup: "B+",
      status: "pending",
      donorInfo: null
    },
    {
      id: 3,
      recipientName: "Fatima Begum",
      recipientDistrict: "Chittagong",
      recipientUpazila: "Hathazari",
      donationDate: "2024-12-15",
      donationTime: "11:00 AM",
      bloodGroup: "O+",
      status: "done",
      donorInfo: {
        name: "Ahmed Khan",
        email: "ahmed@example.com"
      }
    }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      inprogress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
      done: { bg: 'bg-green-100', text: 'text-green-800', label: 'Done' },
      canceled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Canceled' }
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const handleStatusChange = (id, newStatus) => {
    setDonationRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleDeleteClick = (id) => {
    setDeleteRequestId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setDonationRequests(prev => prev.filter(req => req.id !== deleteRequestId));
    setShowDeleteModal(false);
    setDeleteRequestId(null);
  };

  // Only show first 3 requests
  const recentRequests = donationRequests.slice(0, 3);
  const hasRequests = recentRequests.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.displayName}! 👋</h1>
        <p className="text-red-50">Thank you for being a life saver.</p>
      </div>

      {/* Recent Donation Requests Section */}
      {hasRequests && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">My Recent Donation Requests</h2>
            <p className="text-gray-600 mt-1">Your 3 most recent donation requests</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Donor Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-800">{request.recipientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{request.recipientUpazila}, {request.recipientDistrict}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{request.donationDate}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{request.donationTime}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        <Droplet className="w-4 h-4 mr-1" />
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {getStatusBadge(request.status)}
                        {request.status === 'inprogress' && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleStatusChange(request.id, 'done')}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Done
                            </button>
                            <button
                              onClick={() => handleStatusChange(request.id, 'canceled')}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {request.status === 'inprogress' && request.donorInfo ? (
                        <div className="text-sm">
                          <div className="flex items-center text-gray-800 mb-1">
                            <User className="w-4 h-4 mr-1 text-gray-500" />
                            <span className="font-medium">{request.donorInfo.name}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-1 text-gray-500" />
                            <span className="text-xs">{request.donorInfo.email}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/requests/${request.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/dashboard/requests/${request.id}/edit`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All Button */}
          <div className="p-6 border-t bg-gray-50">
            <Link
              to="/dashboard/my-requests"
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
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