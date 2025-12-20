import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'aos/dist/aos.css';
import Aos from 'aos';
import Swal from 'sweetalert2';

const ContactUs = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        console.log('Form submitted:', data);

        Swal.fire({
            icon: 'success',
            title: 'Thank You!',
            text: 'Thank you for contacting us! We will get back to you soon.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#16a34a', 
        });

        reset();
    };
    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);


    const contactInfo = [
        {
            icon: "📞",
            title: "Emergency Hotline",
            info: "+1 (555) 911-BLOOD",
            subInfo: "24/7 Available",
            color: "from-red-500 to-pink-500"
        },
        {
            icon: "☎️",
            title: "General Inquiries",
            info: "+1 (555) 123-4567",
            subInfo: "Mon-Fri, 9AM-6PM",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: "✉️",
            title: "Email Support",
            info: "info@bloodheroes.org",
            subInfo: "Response within 24hrs",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: "📍",
            title: "Visit Us",
            info: "123 Hero Lane, City",
            subInfo: "State, ZIP 12345",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <section className="py-7 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div data-aos="fade-left" className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200 mb-4">
                        <span className="text-2xl">💬</span>
                        <span className="text-red-600 font-semibold text-sm">We're Here to Help</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Get In Touch
                        <span className="block mt-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                            With BloodHeroes
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Have questions or need assistance? We're available 24/7 for emergencies and happy to help with any inquiries.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div data-aos="fade-right" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((contact, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${contact.color} rounded-xl mb-4 text-3xl shadow-lg`}>
                                {contact.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {contact.title}
                            </h3>
                            <p className="text-gray-900 font-semibold mb-1">
                                {contact.info}
                            </p>
                            <p className="text-sm text-gray-500">
                                {contact.subInfo}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact Form and Info */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    <div data-aos="fade-up" className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            Send Us a Message
                        </h3>
                        <p className="text-gray-600 mb-8">
                            Fill out the form below and we'll get back to you as soon as possible.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                                    })}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-colors duration-300`}
                                    placeholder="Name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-colors duration-300`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        {...register("phone", {
                                            pattern: {
                                                value: /^[0-9+\-\s()]{10,}$/,
                                                message: "Invalid phone number"
                                            }
                                        })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:outline-none transition-colors duration-300`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <select
                                    id="subject"
                                    {...register("subject", { required: "Please select a subject" })}
                                    className={`w-full px-4 py-3 rounded-xl border-2 bg-transparent text-gray-800 placeholder-white ${errors.subject ? 'border-red-500' : 'border-gray-300'} focus:border-red-500 focus:outline-none transition-colors duration-300`}
                                >
                                    <option value="" className="text-gray-400 bg-black">Select a subject</option>
                                    <option value="donation" className="text-black">Blood Donation Inquiry</option>
                                    <option value="request" className="text-black">Blood Request</option>
                                    <option value="emergency" className="text-black">Emergency Assistance</option>
                                    <option value="partnership" className="text-black">Partnership Opportunity</option>
                                    <option value="other" className="text-black">Other</option>
                                </select>
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    {...register("message", {
                                        required: "Message is required",
                                        minLength: { value: 10, message: "Message must be at least 10 characters" }
                                    })}
                                    rows="5"
                                    className={`w-full px-4 py-3 rounded-xl border-2 bg-transparent text-gray-800 placeholder-white/70 ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:border-red-500 focus:outline-none transition-colors duration-300 resize-none`}
                                    placeholder="Tell us how we can help you..."
                                ></textarea>
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                                )}
                            </div>


                            <button
                                onClick={handleSubmit(onSubmit)}
                                className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Send Message</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">

                        <div data-aos="fade-down" className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="text-5xl">🚨</div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Need Blood Urgently?
                                    </h3>
                                    <p className="text-white/90 mb-4 leading-relaxed">
                                        Call our 24/7 emergency hotline immediately. We'll connect you with nearby donors right away.
                                    </p>
                                    <a
                                        href="tel:+15559112663"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105"
                                    >
                                        <span className="text-xl">📞</span>
                                        <span>Call Now: +1 (555) 911-BLOOD</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div data-aos="flip-up" className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="text-3xl">🕐</span>
                                Office Hours
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700">Monday - Friday</span>
                                    <span className="text-gray-900 font-bold">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700">Saturday</span>
                                    <span className="text-gray-900 font-bold">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span className="font-semibold text-gray-700">Sunday</span>
                                    <span className="text-gray-900 font-bold">Closed</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Emergency Line</span>
                                    <span className="text-red-600 font-bold">24/7 Available</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;