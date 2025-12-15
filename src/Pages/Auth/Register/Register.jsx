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

  // Filter upazilas
  useEffect(() => {
    if (selectedDistrictName) {
      const district = districts.find(d => d.name === selectedDistrictName);
      if (district) {
        setFilteredUpazilas(
          upazilas.filter(up => up.district_id === district.id)
        );
      } else {
        setFilteredUpazilas([]);
      }
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrictName, districts, upazilas]);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  // ✅ FINAL REGISTRATION HANDLER
  const HandleRegistration = async (data) => {
    try {
      setLoading(true);

      // 1️⃣ Register user
      await registerUser(data.email, data.password);

      // 2️⃣ Upload image
      const formData = new FormData();
      formData.append('image', data.image[0]);

      const image_API_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host_KEY}`;
      const imgRes = await axios.post(image_API_url, formData);
      const photoURL = imgRes.data.data.url;

      // 3️⃣ Update user profile
      await updateUserProfile({
        displayName: data.name,
        photoURL
      });

      // 4️⃣ Save donor to database
      const donorInfo = {
        name: data.name,
        email: data.email,
        photoURL,
        blood_group: data.blood_group,
        district: data.district,
        upazila: data.upazila,
        role: 'donor'
      };
      navigate(from, { replace: true });
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
        <div data-aos="fade-right" className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-700 text-center mb-8">
            Join our blood donation community
          </p>

          <form onSubmit={handleSubmit(HandleRegistration)} className="space-y-6">

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              {...register('name', { required: true, minLength: 3 })}
              className="w-full p-3 border rounded-lg"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: true })}
              className="w-full p-3 border rounded-lg"
            />

            {/* Image */}
            <input
              type="file"
              accept="image/*"
              {...register('image', { required: true })}
              className="w-full p-3 border rounded-lg"
            />

            {/* Blood Group */}
            <select {...register('blood_group', { required: true })} className="w-full p-3 border rounded-lg">
              <option value="">Select Blood Group</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>

            {/* District */}
            <select {...register('district', { required: true })} className="w-full p-3 border rounded-lg">
              <option value="">Select District</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Upazila */}
            <select
              {...register('upazila', { required: true })}
              disabled={!selectedDistrictName}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: true, minLength: 6 })}
              className="w-full p-3 border rounded-lg"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              {...register('confirm_password', {
                required: true,
                validate: value => value === password
              })}
              className="w-full p-3 border rounded-lg"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
              `}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

          </form>

          <p className="text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
