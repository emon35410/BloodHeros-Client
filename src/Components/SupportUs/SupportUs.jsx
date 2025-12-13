import React from "react";
import { useForm } from "react-hook-form";
import { CreditCard, User, Mail, DollarSign } from "lucide-react";
import Swal from "sweetalert2";

const SupportUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);

    // SweetAlert confirmation
    Swal.fire({
      title: "Confirm Donation",
      text: `Are you sure you want to donate $${data.amount}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, donate!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Integrate payment gateway here
        Swal.fire(
          "Thank You!",
          "Your donation has been received successfully.",
          "success"
        );
        reset();
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
          Your monetary contribution helps us run our <span className="text-red-500">BloodHeros</span>  and save lives.
          Every donation counts!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Donor Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Your Full Name"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Donor Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                placeholder="your@email.com"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Donation Amount */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Amount (USD)</label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <input
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Minimum $1" }
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
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
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
