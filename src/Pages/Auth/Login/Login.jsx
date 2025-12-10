import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const handleLogin = (data) => {
    console.log(data);
    signInUser(data.email, data.password)
      .then(result => {
        console.log(result.user)
        navigate(from, { replace: true });
      })
      .catch(error => {
        console.log(error)
      })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div data-aos="fade-right" className="w-full max-w-2xl">

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Login</h2>
          <p className="text-gray-700 text-center mb-8">Access your blood donation account</p>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition bg-gray-50 text-gray-800 placeholder-gray-400
                   ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition bg-gray-50 text-gray-800 placeholder-gray-400
                   ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
