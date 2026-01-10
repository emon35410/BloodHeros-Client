import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { Calendar, Clock, MapPin, Hospital, User, MessageSquare, Droplet, Send } from "lucide-react";
import useAxiousSecure from "../../../Hooks/useAxiousSecure";
import Swal from "sweetalert2";
import Aos from "aos";
import 'aos/dist/aos.css';

const BloodRequest = () => {
    const { user } = useAuth();
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazila, setFilteredUpazila] = useState([]);
    const axiousSecure = useAxiousSecure();

    useEffect(() => {
        Aos.init({ duration: 800, once: true });
        const load = async () => {
            const d = await fetch("/districts.json").then((r) => r.json());
            const u = await fetch("/upazilas.json").then((r) => r.json());
            setDistricts(d);
            setUpazilas(u);
        };
        load();
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
        const finalData = { ...data, donationTime: finalTime, requesterName: user?.displayName, requesterEmail: user?.email, status: "pending" };

        Swal.fire({
            title: "Confirm Request?",
            icon: "warning",
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#000',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: "Yes, Post Request",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiousSecure.post("/donorRequest", finalData);
                    Swal.fire({ title: "Success!", icon: "success", timer: 1500 });
                    window.location.reload();
                } catch (error) {
                    Swal.fire("Error!", "Action failed.", "error");
                }
            }
        });
    };

    const inputClasses = "w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all duration-200";
    const labelClasses = "flex items-center gap-2 text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1";
    const optionClasses = "bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100";

    return (
        <div className="max-w-3xl mx-auto py-3 px-4" data-aos="fade-up">
            <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm p-8 md:p-12 transition-colors duration-300">
                
                <div className="mb-10 border-b border-slate-50 dark:border-slate-800/50 pb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-500"><Droplet size={24} /></span>
                        Create Emergency Request
                    </h2>
                    <p className="text-slate-500 dark:text-slate-500 mt-2 text-sm">Provide accurate details to find donors quickly.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500"><User size={16}/></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.displayName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-400"><MessageSquare size={16}/></div>
                            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="md:col-span-1">
                            <label className={labelClasses}>Recipient Name</label>
                            <input {...register("recipientName", { required: true })} placeholder="Full Name" className={inputClasses} />
                        </div>

                        <div>
                            <label className={labelClasses}>Blood Group</label>
                            <select {...register("bloodGroup", { required: true })} className={inputClasses}>
                                <option className={optionClasses} value="">Select Group</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                    <option className={optionClasses} key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}><MapPin size={14}/> District</label>
                            <select {...register("district", { required: true })} className={inputClasses}>
                                <option className={optionClasses} value="">Select District</option>
                                {districts.map(d => (
                                    <option className={optionClasses} key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClasses}><MapPin size={14}/> Upazila</label>
                            <select {...register("upazila", { required: true })} className={inputClasses}>
                                <option className={optionClasses} value="">Select Upazila</option>
                                {filteredUpazila.map(u => (
                                    <option className={optionClasses} key={u.id} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-3">
                            <label className={labelClasses}><Hospital size={14}/> Hospital & Address</label>
                            <input {...register("hospital", { required: true })} placeholder="Hospital Name" className={inputClasses} />
                            <input {...register("address", { required: true })} placeholder="Full Address (e.g. Ward 4, Room 202)" className={inputClasses} />
                        </div>

                        <div>
                            <label className={labelClasses}><Calendar size={14}/> Date</label>
                            <input {...register("donationDate", { required: true })} type="date" className={`${inputClasses} dark:color-scheme-dark`} />
                        </div>

                        <div>
                            <label className={labelClasses}><Clock size={14}/> Time</label>
                            <div className="flex gap-2">
                                {/* Hour */}
                                <select {...register("hour")} className={inputClasses}>
                                    {[...Array(12)].map((_, i) => (
                                        <option className={optionClasses} key={i+1} value={i+1}>{i+1}</option>
                                    ))}
                                </select>
                                
                                {/* Minute: 0 to 59 */}
                                <select {...register("minute")} className={inputClasses}>
                                    {[...Array(60)].map((_, i) => (
                                        <option className={optionClasses} key={i} value={i < 10 ? `0${i}` : i}>
                                            {i < 10 ? `0${i}` : i}
                                        </option>
                                    ))}
                                </select>

                                {/* AM/PM */}
                                <select {...register("ampm")} className={inputClasses}>
                                    <option className={optionClasses} value="AM">AM</option>
                                    <option className={optionClasses} value="PM">PM</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClasses}>Message</label>
                            <textarea {...register("message", { required: true })} rows="3" placeholder="Why is this urgent?" className={`${inputClasses} resize-none`}></textarea>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-rose-500/10">
                        Submit Request <Send size={18} />
                    </button>

                </form>
            </div>
        </div>
    );
};

export default BloodRequest;