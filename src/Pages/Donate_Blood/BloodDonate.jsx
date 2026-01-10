import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
    Calendar, Clock, MapPin, Building2, User, 
    MessageSquare, Droplet, Send, Info, AlertCircle 
} from "lucide-react";
import Swal from "sweetalert2";
import Aos from "aos";
import 'aos/dist/aos.css';
import useAuth from "../../Hooks/useAuth";
import useAxiousSecure from "../../Hooks/useAxiousSecure";

const BloodRequest = () => {
    const { user } = useAuth();
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazila, setFilteredUpazila] = useState([]);
    const axiousSecure = useAxiousSecure();

    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
        const loadData = async () => {
            try {
                const [distRes, upaRes] = await Promise.all([
                    fetch("/districts.json").then(r => r.json()),
                    fetch("/upazilas.json").then(r => r.json())
                ]);
                setDistricts(distRes);
                setUpazilas(upaRes);
            } catch (err) {
                console.error("Failed to load location data", err);
            }
        };
        loadData();
    }, []);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const selectedDistrict = watch("district");

    useEffect(() => {
        if (selectedDistrict) {
            const filtered = upazilas.filter((item) => item.district_id == selectedDistrict);
            setFilteredUpazila(filtered);
        } else {
            setFilteredUpazila([]);
        }
    }, [selectedDistrict, upazilas]);

    const onSubmit = (data) => {
        const finalTime = `${data.hour}:${data.minute} ${data.ampm}`;
        const finalData = { 
            ...data, 
            donationTime: finalTime, 
            requesterName: user?.displayName, 
            requesterEmail: user?.email, 
            status: "pending",
            createdAt: new Date().toISOString()
        };

        const isDark = document.documentElement.classList.contains('dark');

        Swal.fire({
            title: "Post Emergency Request?",
            text: "Please double check the patient's location and time.",
            icon: "question",
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#1e293b',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: isDark ? '#334155' : '#94a3b8',
            confirmButtonText: "Confirm & Post",
            customClass: { popup: 'rounded-3xl border border-slate-200 dark:border-slate-800' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiousSecure.post("/donorRequest", finalData);
                    Swal.fire({ 
                        title: "Live Now!", 
                        icon: "success", 
                        timer: 2000, 
                        showConfirmButton: false,
                        background: isDark ? '#0f172a' : '#ffffff',
                        color: isDark ? '#f1f5f9' : '#1e293b'
                    });
                    setTimeout(() => window.location.reload(), 2100);
                } catch (error) {
                    Swal.fire("Error!", "Could not post request.", "error");
                }
            }
        });
    };

    // Eye Comfort Focus: Soft borders and balanced contrast
    const inputClasses = "w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-4 py-3.5 rounded-2xl text-slate-800 dark:text-slate-100 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600";
    const labelClasses = "flex items-center gap-2 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-2 ml-1 tracking-widest";

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] py-12 px-4 transition-colors duration-500">
            <div className="max-w-4xl mx-auto" data-aos="fade-up">
                
                {/* Header Section */}
                <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-rose-600 via-rose-600 to-orange-500 text-white shadow-2xl shadow-rose-500/20 overflow-hidden mb-10">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-tighter mb-4">
                            <AlertCircle size={14} /> Emergency Service
                        </div>
                        <h1 className="text-4xl font-black flex items-center gap-4">
                            Request Blood <Droplet className="animate-pulse fill-white" size={32} />
                        </h1>
                        <p className="opacity-80 mt-3 font-medium text-lg max-w-lg leading-relaxed">
                            Connecting you with nearby donors instantly. Please provide accurate details.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Droplet size={200} strokeWidth={1} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-10">
                        
                        {/* Requester Summary */}
                        <div className="flex flex-wrap items-center gap-6 p-6 bg-rose-50/50 dark:bg-rose-950/10 rounded-3xl border border-rose-100/50 dark:border-rose-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-rose-500">
                                    <User size={24}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Requester</p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{user?.displayName}</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-blue-500">
                                    <MessageSquare size={24}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Contact Email</p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Body */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            
                            {/* Input: Recipient */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Recipient Name</label>
                                <div className="relative group">
                                    <input {...register("recipientName", { required: true })} placeholder="Patient's Full Name" className={inputClasses} />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                                </div>
                            </div>

                            {/* Input: Blood Group */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Required Group</label>
                                <select {...register("bloodGroup", { required: true })} className={`${inputClasses} appearance-none cursor-pointer`}>
                                    <option value="">Select Blood Group</option>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>

                            {/* Input: District */}
                            <div className="space-y-1">
                                <label className={labelClasses}><MapPin size={14} className="text-rose-500"/> District</label>
                                <select {...register("district", { required: true })} className={`${inputClasses} appearance-none cursor-pointer`}>
                                    <option value="">Select District</option>
                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>

                            {/* Input: Upazila */}
                            <div className="space-y-1">
                                <label className={labelClasses}><MapPin size={14} className="text-rose-500"/> Upazila</label>
                                <select {...register("upazila", { required: true })} className={`${inputClasses} appearance-none cursor-pointer`}>
                                    <option value="">Select Upazila</option>
                                    {filteredUpazila.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                </select>
                            </div>

                            {/* Input: Hospital */}
                            <div className="md:col-span-2 space-y-1">
                                <label className={labelClasses}><Building2 size={14} className="text-rose-500"/> Hospital & Point of Interest</label>
                                <input {...register("hospital", { required: true })} placeholder="e.g. Apollo Hospital, Gate 2" className={inputClasses} />
                            </div>

                            {/* Input: Address */}
                            <div className="md:col-span-2 space-y-1">
                                <label className={labelClasses}><Info size={14} className="text-rose-500"/> Full Address</label>
                                <textarea {...register("address", { required: true })} rows="2" placeholder="e.g. Ward 4, Bed 20, Level 5, Medical Road" className={`${inputClasses} resize-none`}></textarea>
                            </div>

                            {/* Input: Date */}
                            <div className="space-y-1">
                                <label className={labelClasses}><Calendar size={14} className="text-rose-500"/> Donation Date</label>
                                <input {...register("donationDate", { required: true })} type="date" className={`${inputClasses} cursor-pointer`} />
                            </div>

                            {/* Input: Time */}
                            <div className="space-y-1">
                                <label className={labelClasses}><Clock size={14} className="text-rose-500"/> Preferred Time</label>
                                <div className="flex gap-3">
                                    <select {...register("hour")} className={`${inputClasses} text-center`}>
                                        {[...Array(12)].map((_, i) => <option key={i+1} value={String(i+1).padStart(2, '0')}>{String(i+1).padStart(2, '0')}</option>)}
                                    </select>
                                    <select {...register("minute")} className={`${inputClasses} text-center`}>
                                        {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select {...register("ampm")} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 rounded-2xl font-black text-slate-600 dark:text-slate-400">
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>

                            {/* Input: Message */}
                            <div className="md:col-span-2 space-y-1">
                                <label className={labelClasses}>Urgency Message</label>
                                <textarea {...register("message", { required: true })} rows="3" placeholder="Explain the situation (e.g. Emergency surgery at 10 AM)" className={`${inputClasses} resize-none`}></textarea>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-6">
                            <button type="submit" className="group w-full bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-[2rem] font-black text-xl transition-all duration-500 flex items-center justify-center gap-4 active:scale-[0.97] shadow-2xl shadow-rose-600/30 dark:shadow-rose-900/20 uppercase tracking-[0.2em]">
                                <span>Broadcast Request</span>
                                <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                            </button>
                            <p className="text-center text-slate-400 dark:text-slate-600 text-[10px] mt-6 font-bold uppercase tracking-widest italic">
                                * Your request will be visible to all registered donors.
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default BloodRequest;