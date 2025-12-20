import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Droplet,
  MapPin,
  Calendar,
  Activity,
  Edit,
  Save,
  X
} from 'lucide-react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiousSecure';

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  /* 🔒 READ-ONLY MEMBER SINCE (AUTH METADATA ONLY) */
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : 'N/A';

  const [profileData, setProfileData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    avatar: user?.photoURL || null,
    bloodGroup: '',
    district: '',
    upazila: '',
  });

  const [editedData, setEditedData] = useState({ ...profileData });

  /* Fetch donor data (NO JOIN DATE, NO AVATAR UPDATE) */
  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const res = await axiosSecure.get('/donors');
        const matchedUser = res.data.find(
          donor => donor.email === user?.email
        );

        if (matchedUser) {
          setProfileData(prev => ({
            ...prev,
            name: matchedUser.name,
            bloodGroup: matchedUser.blood_group,
            district: matchedUser.district,
            upazila: matchedUser.upazila
          }));

          setEditedData(prev => ({
            ...prev,
            name: matchedUser.name,
            bloodGroup: matchedUser.blood_group,
            district: matchedUser.district,
            upazila: matchedUser.upazila
          }));
        }
      } catch (err) {
        console.error('Error fetching donor data:', err);
      }
    };

    if (user?.email) {
      fetchDonorData();
    }
  }, [user, axiosSecure]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  /* PATCH ONLY EDITABLE FIELDS */
  const handleSave = async () => {
    try {
      await axiosSecure.patch(`/donors/${user?.email}`, {
        name: editedData.name,
        blood_group: editedData.bloodGroup,
        district: editedData.district,
        upazila: editedData.upazila
      });

      setProfileData({ ...profileData, ...editedData });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="my-6 ml-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="mt-1 text-gray-500">Manage your account information</p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-red-500 to-pink-600"></div>

        <div className="px-8 pb-8">
    \
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profileData.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            <div className="ml-4 inline-block align-bottom">
              <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                <Droplet className="w-4 h-4 mr-2" />
                Blood Type: {profileData.bloodGroup}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Personal Information
              </h3>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    value={editedData.name}
                    onChange={e =>
                      handleInputChange('name', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <User className="w-5 h-5 text-gray-400" />
                    {profileData.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2 text-gray-800">
                  <Mail className="w-5 h-5 text-gray-400" />
                  {profileData.email}
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                {isEditing ? (
                  <select
                    value={editedData.bloodGroup}
                    onChange={e =>
                      handleInputChange('bloodGroup', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Droplet className="w-5 h-5 text-gray-400" />
                    {profileData.bloodGroup}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Location & Activity
              </h3>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                {isEditing ? (
                  <input
                    value={editedData.district}
                    onChange={e =>
                      handleInputChange('district', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    {profileData.district}
                  </div>
                )}
              </div>

              {/* Upazila */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upazila
                </label>
                {isEditing ? (
                  <input
                    value={editedData.upazila}
                    onChange={e =>
                      handleInputChange('upazila', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    {profileData.upazila}
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  {memberSince}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
