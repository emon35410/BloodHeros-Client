import React from "react";
import { useForm } from "react-hook-form";
import { CreditCard, User, Mail, DollarSign } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiousSecure from "../../Hooks/useAxiousSecure";

const SupportUs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiousSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
      confirmButtonText: "Yes, donate!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.post("/create-checkout-session", {
            name: data.name,
            email: data.email,
            amount: data.amount,
          });

          // Redirect to Stripe Checkout
          window.location.href = res.data.url;
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Payment initiation failed", "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your donation was not processed.", "info");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center py-10">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
          Support Us
        </h2>
        <p className="text-gray-700 text-center mb-8">
          Your monetary contribution helps us run our{" "}
          <span className="text-red-500">BloodHeros</span> and save lives.
          Every donation counts!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Donor Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <input
                {...register("name")}
                type="text"
                readOnly
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Donor Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                readOnly
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Donation Amount */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Amount (USD)</label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <input
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Minimum $1" },
                })}
                type="number"
                placeholder="Enter amount"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "+") e.preventDefault();
                }}
                min={1}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition"
          >
            Donate Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportUs;
