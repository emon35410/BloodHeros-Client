import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Droplet, 
  MapPin, 
  Calendar,
  Award,
  Heart,
  Activity,
  Edit,
  Save,
  X,
  Camera,
  Phone,
  Shield
} from 'lucide-react';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1712-345678",
    bloodGroup: "A+",
    district: "Dhaka",
    upazila: "Mohammadpur",
    avatar: null,
    joinDate: "January 15, 2023",
    lastDonation: "November 20, 2024",
    totalDonations: 12,
    livesSaved: 36,
    badges: ["Life Saver", "Regular Donor", "Hero Badge"]
  });

  const [editedData, setEditedData] = useState({ ...profileData });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
    console.log('Profile updated:', editedData);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Total Donations', value: profileData.totalDonations, icon: Droplet, color: 'bg-red-500' },
    { label: 'Lives Saved', value: profileData.livesSaved, icon: Heart, color: 'bg-pink-500' },
    { label: 'Badges Earned', value: profileData.badges.length, icon: Award, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information</p>
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
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-red-500 to-pink-600"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-16 mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {editedData.avatar ? (
                  <img src={editedData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profileData.name.charAt(0).toUpperCase()
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="ml-4 inline-block align-bottom">
              <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                <Droplet className="w-4 h-4 mr-2" />
                Blood Type: {profileData.bloodGroup}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{profileData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                {isEditing ? (
                  <select
                    value={editedData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <Droplet className="w-5 h-5 text-gray-400" />
                    <span>{profileData.bloodGroup}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Activity */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Location & Activity</h3>
              
              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{profileData.district}</span>
                  </div>
                )}
              </div>

              {/* Upazila */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upazila</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.upazila}
                    onChange={(e) => handleInputChange('upazila', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{profileData.upazila}</span>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>{profileData.joinDate}</span>
                </div>
              </div>

              {/* Last Donation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Donation</label>
                <div className="flex items-center gap-2 text-gray-800">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <span>{profileData.lastDonation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profileData.badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{badge}</p>
                <p className="text-sm text-gray-600">Earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" />
          Security Settings
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
            <span className="text-gray-800 font-medium">Change Password</span>
            <Edit className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
            <span className="text-gray-800 font-medium">Two-Factor Authentication</span>
            <Edit className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;