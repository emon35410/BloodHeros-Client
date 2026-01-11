import React, { useState, useEffect } from 'react';
import {
  User, Mail, Droplet, MapPin, Calendar,
  Edit3, Save, X, ShieldCheck, Heart
} from 'lucide-react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiousSecure';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
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

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const res = await axiosSecure.get('/donors');
        const matchedUser = res.data.find(donor => donor.email === user?.email);

        if (matchedUser) {
          const fetchedInfo = {
            ...profileData,
            name: matchedUser.name,
            bloodGroup: matchedUser.blood_group,
            district: matchedUser.district,
            upazila: matchedUser.upazila
          };
          setProfileData(fetchedInfo);
          setEditedData(fetchedInfo);
        }
      } catch (err) {
        console.error('Error fetching donor data:', err);
      }
    };
    if (user?.email) fetchDonorData();
  }, [user, axiosSecure]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosSecure.patch(`/donors/${user?.email}`, {
        name: editedData.name,
        blood_group: editedData.bloodGroup,
        district: editedData.district,
        upazila: editedData.upazila
      });
      setProfileData({ ...editedData });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-12 dark:bg-[#020617] min-h-screen transition-colors duration-500">

      {/* Header Section */}
      <div data-aos="fade-down" className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            My <span className="text-rose-600">Profile</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-500 font-medium mt-1 text-sm">Manage your account information</p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-3">
          {!isEditing ? (
            <button onClick={handleEdit} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20 active:scale-95 text-sm">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleCancel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-sm">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleSave} disabled={loading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm">
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div data-aos="fade-up" className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] md:rounded-[2.5rem] shadow-sm overflow-hidden backdrop-blur-sm">

        {/* Banner */}
        <div className="h-24 md:h-32 bg-gradient-to-r from-rose-500 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="px-5 md:px-12 pb-10 md:pb-12">
          {/* Avatar & Blood Badge */}
          <div className="relative -mt-12 md:-mt-16 mb-8 flex flex-col items-center md:items-end md:flex-row gap-4 md:gap-6">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] md:rounded-[2.5rem] border-4 md:border-8 border-white dark:border-[#0f172a] bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-3xl md:text-4xl font-black overflow-hidden relative z-10 shadow-xl">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profileData.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            <div className="pb-0 md:pb-2">
              <span className="inline-flex items-center px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-[11px] font-black uppercase tracking-wider border border-rose-100 dark:border-rose-500/20 shadow-sm">
                <Droplet className="w-3.5 h-3.5 mr-2 fill-current text-rose-500" />
                Blood Group: {profileData.bloodGroup || 'N/A'}
              </span>
            </div>
          </div>

          {/* Form / Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4">

            {/* Left Side: Personal Information */}
            <div className="space-y-6">
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-white/5 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-rose-500" /> Personal Information
              </h3>

              <div className="space-y-5">
                {/* Full Name */}
                <div className="group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block ml-1">Full Name</label>
                  {isEditing ? (
                    <input
                      value={editedData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold px-1 text-sm md:text-base">
                       {profileData.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block ml-1">Email Address</label>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold px-1 italic text-sm md:text-base break-all">
                    {profileData.email}
                  </div>
                </div>

                {/* Blood Group */}
                <div className="group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block ml-1">Blood Group</label>
                  {isEditing ? (
                    <select
                      value={editedData.bloodGroup}
                      onChange={e => handleInputChange('bloodGroup', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
                    >
                      <option value="" disabled>Select Blood Group</option>
                      {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold px-1 text-sm md:text-base">
                      {profileData.bloodGroup || 'Not Specified'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Location & Activity */}
            <div className="space-y-6">
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-white/5 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" /> Location & Activity
              </h3>

              <div className="space-y-5">
                {/* District */}
                <div className="group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block ml-1">District</label>
                  {isEditing ? (
                    <input
                      value={editedData.district}
                      onChange={e => handleInputChange('district', e.target.value)}
                      placeholder="Enter district"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold px-1 text-sm md:text-base">
                      {profileData.district || 'Not Specified'}
                    </div>
                  )}
                </div>

                {/* Upazila */}
                <div className="group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block ml-1">Upazila</label>
                  {isEditing ? (
                    <input
                      value={editedData.upazila}
                      onChange={e => handleInputChange('upazila', e.target.value)}
                      placeholder="Enter upazila"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold px-1 text-sm md:text-base">
                      {profileData.upazila || 'Not Specified'}
                    </div>
                  )}
                </div>

                {/* Member Since */}
                <div className="group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block ml-1">Member Since</label>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold px-1 text-sm md:text-base">
                    <Calendar className="w-5 h-5 text-slate-400" /> {memberSince}
                  </div>
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