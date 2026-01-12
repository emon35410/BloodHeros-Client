import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
    Calendar, MapPin, User, Phone, 
    Droplet, Weight, Send, CheckCircle, ShieldCheck
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

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user?.displayName || "",
            email: user?.email || ""
        }
    });

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
        
        const finalData = { 
            fullName: user?.displayName,
            dob: data.dob,
            email: user?.email,
            phone: data.phone,
            address: data.address,
            bloodGroup: data.bloodGroup,
            weight: data.weight,
            healthDeclaration: data.healthDeclaration,
            status: "pending", 
            created_at: new Date().toISOString()
        };

        const isDark = document.documentElement.classList.contains('dark');

        Swal.fire({
            title: "Confirm Submission?",
            text: "You are about to become a beacon of hope for someone in need.",
            icon: "question",
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#1e293b',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            confirmButtonText: "Submit Profile",
            customClass: { popup: 'rounded-3xl border border-slate-200 dark:border-slate-800' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiousSecure.post("/blood-donate", finalData);
                    Swal.fire({ 
                        title: "Submitted!", 
                        text: "Data saved successfully.",
                        icon: "success", 
                        timer: 2000, 
                        showConfirmButton: false,
                        background: isDark ? '#0f172a' : '#ffffff'
                    }).then(() => {
                        window.location.reload(); 
                    });
                } catch (error) {
                    Swal.fire("Error!", "Failed to save data.", "error");
                }
            }
        });
    };

    const inputClasses = "w-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm";
    const labelClasses = "flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 mb-1.5 ml-1 tracking-widest";

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] py-10 px-4 transition-colors duration-500">
            <div className="max-w-2xl mx-auto" data-aos="fade-up">
                
                {/* Minimalist Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-rose-500/10 rounded-2xl mb-4">
                        <ShieldCheck className="text-rose-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Donor Your Blood</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Please provide your accurate health information.</p>
                </div>

                <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Read Only Name */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Full Name</label>
                                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900/50 rounded-xl text-slate-500 dark:text-slate-500 text-sm font-bold border border-slate-200/50 dark:border-slate-800">
                                    {user?.displayName}
                                </div>
                            </div>

                            {/* Read Only Email */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Email Address</label>
                                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900/50 rounded-xl text-slate-500 dark:text-slate-500 text-sm font-bold border border-slate-200/50 dark:border-slate-800">
                                    {user?.email}
                                </div>
                            </div>

                            {/* DOB */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Date of Birth</label>
                                <input {...register("dob", { required: true })} type="date" className={inputClasses} />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Phone Number</label>
                                <input {...register("phone", { required: true })} placeholder="01XXX-XXXXXX" className={inputClasses} />
                            </div>

                            {/* Weight */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Weight (KG)</label>
                                <input {...register("weight", { required: true })} placeholder="e.g. 65" className={inputClasses} />
                            </div>

                            {/* Blood Group */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Blood Group</label>
                                <select {...register("bloodGroup", { required: true })} className={inputClasses}>
                                    <option value="">Select Group</option>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>

                            {/* District */}
                            <div className="space-y-1">
                                <label className={labelClasses}>District</label>
                                <select {...register("district", { required: true })} className={inputClasses}>
                                    <option value="">Select District</option>
                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>

                            {/* Upazila */}
                            <div className="space-y-1">
                                <label className={labelClasses}>Upazila</label>
                                <select {...register("upazila", { required: true })} className={inputClasses}>
                                    <option value="">Select Upazila</option>
                                    {filteredUpazila.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                </select>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2 space-y-1">
                                <label className={labelClasses}>Address Details</label>
                                <textarea {...register("address", { required: true })} rows="2" placeholder="Street, House No, Area..." className={`${inputClasses} resize-none`}></textarea>
                            </div>
                        </div>

                        {/* Health Declaration */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input {...register("healthDeclaration", { required: true })} type="checkbox" className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-rose-500 bg-white dark:bg-slate-800" />
                                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tight">
                                    I confirm that I am fit to donate blood.
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <button type="submit" className="group px-10 py-3 bg-slate-900 dark:bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-700 text-white rounded-2xl font-black text-sm transition-all flex items-center gap-3 active:scale-95 shadow-xl">
                                <span>Stand with Patients</span>
                                <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default BloodRequest;