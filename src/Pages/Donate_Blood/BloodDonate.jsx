import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Heart, Droplet, User, Phone } from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiousSecure from '../../Hooks/useAxiousSecure';
import useAuth from '../../Hooks/useAuth';

const BloodDonate = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiousSecure();

    const birthDateValue = watch('dob');

    const calculateAge = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const currentAge = calculateAge(birthDateValue);

    const donateMutation = useMutation({
        mutationFn: async (donateData) => {
            const res = await axiosSecure.post('/blood-donate', donateData);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Registration Successful!',
                text: "You're a hero! We'll contact you soon.",
                icon: 'success',
                confirmButtonColor: '#ef4444',
            });
            reset();
        },
        onError: () => {
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Please try again.',
                icon: 'error'
            });
        }
    });

    const onSubmit = (data) => {
        // 3. MAP THE CALCULATED AGE TO THE PAYLOAD
        donateMutation.mutate({
            ...data,
            age: currentAge, // Send the number, not the date string
            dob: data.dob,   // Keep the DOB if needed
            status: 'pending',
            createdAt: new Date()
        });
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const inputStyle = `w-full px-4 py-2 rounded-lg border outline-none transition 
        bg-white dark:bg-slate-800 
        border-gray-300 dark:border-slate-700 
        text-gray-900 dark:text-gray-100 
        focus:ring-2 focus:ring-red-500 focus:border-transparent`;

    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Heart className="w-12 h-12 text-red-500 mr-2 animate-pulse" />
                        <h1 className="text-4xl font-bold text-red-500">
                            Blood<span className="text-green-500">Heros</span>
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Every drop counts. Donate your blood and save lives.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Personal Info */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <User className="w-6 h-6 mr-2 text-red-500" />
                                Personal Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Full Name 👤</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.displayName}
                                        {...register('fullName', { required: 'Name is required' })}
                                        className={`${inputStyle} cursor-not-allowed opacity-75 bg-gray-100 dark:bg-slate-700`}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>Date of Birth *</label>
                                    <input
                                        type="date"
                                        {...register('dob', { // Changed field name to 'dob'
                                            required: 'Date of birth is required',
                                            validate: value => calculateAge(value) >= 18 || 'You must be at least 18 years old'
                                        })}
                                        className={inputStyle}
                                    />
                                    {/* Real-time Age Feedback */}
                                    {currentAge !== null && !errors.dob && (
                                        <p className="text-sm font-medium text-emerald-600 mt-1">
                                            Age: {currentAge} years
                                        </p>
                                    )}
                                    {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Contact Info */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <Phone className="w-6 h-6 mr-2 text-red-500" />
                                Contact Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Email *</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email}
                                        {...register('email', { required: 'Email is required' })}
                                        className={`${inputStyle} cursor-not-allowed`}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className={labelStyle}>Phone *</label>
                                    <input
                                        {...register('phone', { required: 'Phone is required' })}
                                        className={inputStyle}
                                        placeholder="Your Phone Number"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className={labelStyle}>Address *</label>
                                <textarea
                                    {...register('address', { required: 'Address is required' })}
                                    rows="2"
                                    className={inputStyle}
                                    placeholder="Your Full address"
                                />
                            </div>
                        </section>

                        {/* Blood Info */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <Droplet className="w-6 h-6 mr-2 text-red-500" />
                                Blood Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Blood Group *</label>
                                    <select {...register('bloodGroup', { required: true })} className={inputStyle}>
                                        <option value="">Select</option>
                                        {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}>Weight (kg) *</label>
                                    <input
                                        type="number"
                                        {...register('weight', {
                                            required: true,
                                            min: { value: 50, message: 'Minimum weight is 50kg' }
                                        })}
                                        className={inputStyle}
                                        placeholder="Your Weight"
                                    />
                                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Health Declaration */}
                        <section className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('healthDeclaration', { required: true })}
                                    className="mr-3 mt-1 accent-red-500"
                                />
                                <span className="text-sm">I confirm that I am in good health *</span>
                            </label>
                            {errors.healthDeclaration && <p className="text-red-500 text-xs mt-1">You must confirm health status</p>}
                        </section>

                        <button
                            type="submit"
                            disabled={donateMutation.isPending}
                            className="w-full bg-red-500 text-white py-4 rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                        >
                            {donateMutation.isPending ? 'Submitting...' : 'Donate Blood'}
                        </button>
                    </form>
                </div>
                <p className="text-center text-gray-500 mt-6 text-sm">Every donation can save up to 3 lives.</p>
            </div>
        </div>
    );
};

export default BloodDonate;