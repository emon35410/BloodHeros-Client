import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'aos/dist/aos.css';
import Aos from 'aos';
import Swal from 'sweetalert2';
import contactData from '../../../../public/contactData.json';

const ContactUs = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        Aos.init({ duration: 800, once: true });
    }, []);

    const onSubmit = (data) => {
        console.log('Form data:', data);
        
        Swal.fire({
            icon: 'success',
            title: 'Message Received',
            text: 'Thank you for reaching out! We will get back to you soon.',
            confirmButtonColor: '#E11D48',
            background: document.documentElement.classList.contains('dark') ? '#161B27' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
        });
        reset();
    };

    return (
        <section className="py-16 bg-[#FDFDFD] dark:bg-[#0C0F16] transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Section Header */}
                <div data-aos="fade-up" className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-full mb-4 uppercase">
                        Contact Us
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                        How Can We <span className="text-rose-600">Help You?</span>
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Whether you are a donor or in need of blood, our team is ready to assist you. Reach out through any of the channels below.
                    </p>
                </div>

                {/* Info Cards from JSON */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {contactData.map((contact, index) => (
                        <div key={contact.id || index} data-aos="zoom-in" data-aos-delay={index * 100}
                            className="bg-white dark:bg-[#151923] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50 hover:border-rose-500/30 transition-all duration-300 text-center group"
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${contact.color} rounded-xl mb-4 text-xl shadow-md group-hover:rotate-6 transition-transform`}>
                                {contact.icon}
                            </div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{contact.title}</h3>
                            <p className="text-sm text-slate-900 dark:text-slate-200 font-bold mb-1">{contact.info}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{contact.subInfo}</p>
                        </div>
                    ))}
                </div>

                {/* Form and Side Info Grid */}
                <div className="grid lg:grid-cols-12 gap-10">
                    
                    {/* Contact Form */}
                    <div data-aos="fade-right" className="lg:col-span-7 bg-white dark:bg-[#151923] rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800/50">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Send a Message</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">Fill out the form below and we'll respond shortly.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <input type="text" {...register("name", { required: "Name is required" })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1C222D] border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 focus:border-rose-500/50 focus:outline-none transition-all text-sm"
                                        placeholder="Enter your name" />
                                    {errors.name && <span className="text-[10px] text-rose-500 font-bold ml-1">{errors.name.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                    <input type="email" {...register("email", { required: "Email is required" })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1C222D] border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 focus:border-rose-500/50 focus:outline-none transition-all text-sm"
                                        placeholder="Enter your email" />
                                    {errors.email && <span className="text-[10px] text-rose-500 font-bold ml-1">{errors.email.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Subject</label>
                                <select {...register("subject", { required: "Please select a subject" })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1C222D] border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 focus:border-rose-500/50 focus:outline-none transition-all text-sm appearance-none cursor-pointer">
                                    <option value="">Select a subject</option>
                                    <option value="donation">Blood Donation Inquiry</option>
                                    <option value="request">Blood Request</option>
                                    <option value="emergency">Emergency Assistance</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.subject && <span className="text-[10px] text-rose-500 font-bold ml-1">{errors.subject.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Message</label>
                                <textarea rows="4" {...register("message", { required: "Message cannot be empty" })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1C222D] border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 focus:border-rose-500/50 focus:outline-none transition-all text-sm resize-none"
                                    placeholder="Write your message here..."></textarea>
                                {errors.message && <span className="text-[10px] text-rose-500 font-bold ml-1">{errors.message.message}</span>}
                            </div>

                            <button type="submit" 
                                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Side Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Emergency Hotline Banner */}
                        <div data-aos="fade-left" className="bg-gradient-to-br from-rose-600 to-red-700 rounded-3xl p-8 text-white shadow-lg shadow-rose-900/20 relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                <span className="text-[120px]">🩸</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 relative z-10">Emergency?</h3>
                            <p className="text-rose-50 mb-8 text-sm font-medium relative z-10 leading-relaxed max-w-[280px]">
                                Our emergency coordinators are available 24 hours a day to assist with urgent blood requirements.
                            </p>
                            <a href="tel:+15559112663" 
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white text-rose-600 font-bold rounded-xl text-sm transition-all hover:bg-rose-50 relative z-10 active:scale-95 shadow-lg">
                                <span>📞 Call: +1 (555) 911-BLOOD</span>
                            </a>
                        </div>

                        {/* Working Hours Card */}
                        <div data-aos="fade-left" data-aos-delay="200" className="bg-white dark:bg-[#151923] rounded-3xl p-8 border border-slate-100 dark:border-slate-800/50 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <span className="text-xl">🕐</span> Office Hours
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { day: "Mon - Fri", time: "9:00 AM - 6:00 PM" },
                                    { day: "Saturday", time: "10:00 AM - 4:00 PM" },
                                    { day: "Sunday", time: "Closed", color: "text-rose-500" }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/50 pb-3">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">{item.day}</span>
                                        <span className={`font-bold ${item.color || 'text-slate-800 dark:text-slate-200'}`}>{item.time}</span>
                                    </div>
                                ))}
                                <div className="pt-2">
                                    <p className="text-[11px] text-center text-slate-400 font-medium italic">
                                        * Emergency line is available 24/7
                                    </p>
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