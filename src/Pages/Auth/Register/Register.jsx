import React, { useEffect, useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, Droplet, MapPin, Image } from 'lucide-react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import axios from 'axios';
import useAxiousSecure from '../../../Hooks/useAxiousSecure';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const { registerUser, updateUserProfile, loading, setLoading } = useAuth();
  const axiousSecure = useAxiousSecure();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { districts, upazilas } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const selectedDistrictName = watch('district');
  const password = watch('password');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Filter upazilas based on selected district NAME
  useEffect(() => {
    if (selectedDistrictName && upazilas && districts) {
      const district = districts.find(d => d.name === selectedDistrictName);
      if (district) {
        const filtered = upazilas.filter(up => up.district_id === district.id);
        setFilteredUpazilas(filtered);
      } else {
        setFilteredUpazilas([]);
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrictName, upazilas, districts]);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const HandleRegistration = async (data) => {
    try {
      setLoading(true);

      // Create Firebase user
      const result = await registerUser(data.email, data.password);
      navigate(from, { replace: true });
      //  Upload profile image
      const formData = new FormData();
      formData.append('image', data.image[0]);
      const image_API_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host_KEY}`;
      const imgRes = await axios.post(image_API_url, formData);
      const photoURL = imgRes.data.data.url;

      // Update Firebase user profile

      await updateUserProfile({

        displayName: data.name,
        photoURL
      });


      // Save donor info to backend
      const donorInfo = {
        name: data.name,
        email: data.email,
        photoURL,
        blood_group: data.blood_group,
        district: data.district,
        upazila: data.upazila
      };
      await axiousSecure.post('/donors', donorInfo);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Register Form Card */}
        <div data-aos="fade-right" className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
          <p className="text-gray-700 text-center mb-8">Join our blood donation community</p>

          {/* Form */}
          <form onSubmit={handleSubmit(HandleRegistration)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 6, message: 'Name must be at least 3 characters' }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 text-gray-800 placeholder-gray-400`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 text-gray-800 placeholder-gray-400`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  {...register('image', { required: 'Profile picture is required' })}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 text-gray-800 placeholder-gray-400`}
                />
              </div>
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
            </div>

            {/* Blood Group and District */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    {...register('blood_group', { required: 'Blood group is required' })}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.blood_group ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition appearance-none bg-gray-50 text-gray-800`}
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                {errors.blood_group && <p className="text-red-500 text-sm mt-1">{errors.blood_group.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    {...register('district', { required: 'District is required' })}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition appearance-none bg-gray-50 text-gray-800`}
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>{district.name}</option>
                    ))}
                  </select>
                </div>
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
              </div>
            </div>

            {/* Upazila */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upazila</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  {...register('upazila', { required: 'Upazila is required' })}
                  disabled={!selectedDistrictName}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.upazila ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition appearance-none bg-gray-50 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">Select upazila</option>
                  {filteredUpazilas.map((up) => (
                    <option key={up.id} value={up.name}>{up.name}</option>
                  ))}
                </select>
              </div>
              {errors.upazila && <p className="text-red-500 text-sm mt-1">{errors.upazila.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])/, message: 'Password must contain at least one uppercase and one lowercase letter' }
                  })}
                  className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 text-gray-800 placeholder-gray-400`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirm_password', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`w-full pl-10 pr-12 py-3 border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 text-gray-800 placeholder-gray-400`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition shadow-lg hover:shadow-xl"
            >
              Register
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
