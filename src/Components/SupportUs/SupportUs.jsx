import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, DollarSign, Heart, ShieldCheck, Zap, Globe } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiousSecure from "../../Hooks/useAxiousSecure";
import { nanoid } from "nanoid";
import Aos from "aos";
import 'aos/dist/aos.css';

const SupportUs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiousSecure();
  const donationTrackingId = nanoid(12);

  useEffect(() => {
    Aos.init({ duration: 800, once: true });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (data) => {
    Swal.fire({
      title: "Confirm Donation",
      text: `Are you sure you want to donate $${data.amount}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Proceed!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.post("/create-checkout-session", {
            name: data.name,
            email: data.email,
            amount: data.amount,
            donationTrackingId
          });
          window.location.href = res.data.url;
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Payment initiation failed", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] dark:bg-[#020617] transition-colors duration-500 py-12 px-4 relative overflow-hidden flex items-center">
      {/* Background Decorative Circles - Soft opacity for eye comfort */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Side: Content */}
          <div data-aos="fade-right" className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider">
              <Heart className="w-3 h-3 fill-current" />
              <span>Become a Life Saver</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Empower <span className="text-rose-500">BloodHeros</span> <br /> With Your Support
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-medium italic">
              "Your small contribution can be the reason for someone's heartbeat."
            </p>

            <div className="flex justify-center lg:justify-start gap-8 pt-4">
              {[
                { icon: ShieldCheck, label: "Secure" },
                { icon: Zap, label: "Fast" },
                { icon: Globe, label: "Impact" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start gap-2">
                  <item.icon className="w-5 h-5 text-rose-500 opacity-80" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Donation Form */}
          <div data-aos="zoom-in" className="relative">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-4">
                  {/* Readonly Info Fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="group/field">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Donor Profile</label>
                      <div className="relative flex items-center">
                         <User className="absolute left-4 w-4 h-4 text-slate-300" />
                         <input
                          {...register("name")}
                          readOnly
                          className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 pl-10 pr-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-sm focus:outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="group/field">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Email Connection</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 w-4 h-4 text-slate-300" />
                        <input
                          {...register("email")}
                          readOnly
                          className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 pl-10 pr-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-sm focus:outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Donation Amount Input */}
                  <div className="group/field pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1.5 block ml-1">Amount to Donate (USD)</label>
                    <div className="relative flex items-center">
                      <DollarSign className="absolute left-4 w-5 h-5 text-rose-500" />
                      <input
                        {...register("amount", {
                          required: "Amount is required",
                          min: { value: 1, message: "Min $1" },
                        })}
                        type="number"
                        placeholder="0"
                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-white/5 pl-12 pr-4 py-4 rounded-xl text-2xl font-black text-slate-900 dark:text-white placeholder:text-slate-200 focus:outline-none focus:border-rose-500/30 transition-all shadow-sm"
                        onKeyDown={(e) => ["-", "e", "+"].includes(e.key) && e.preventDefault()}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-rose-500 text-[10px] font-black mt-2 ml-1 uppercase animate-pulse">{errors.amount.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button - SMALLER & SLEEKER */}
                <button
                  type="submit"
                  className="w-full group relative flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-rose-500/20 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2 tracking-wide">
                    Donate Now <Zap className="w-4 h-4 fill-current" />
                  </span>
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                <div className="flex items-center justify-center gap-2 pt-2 opacity-40">
                  <ShieldCheck size={12} className="text-slate-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure SSL Encrypted Payment</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportUs;