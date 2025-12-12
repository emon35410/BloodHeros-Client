import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { Calendar } from "lucide-react";
import useAxiousSecure from "../../../Hooks/useAxiousSecure";
import Swal from "sweetalert2";

const BloodRequest = () => {
    const { user } = useAuth();
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazila, setFilteredUpazila] = useState([]);
    const axiousSecure = useAxiousSecure();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const selectedDistrict = watch("district");

    // Load District + Upazila
    useEffect(() => {
        const load = async () => {
            const d = await fetch("/districts.json").then((r) => r.json());
            const u = await fetch("/upazilas.json").then((r) => r.json());
            setDistricts(d);
            setUpazilas(u);
        };
        load();
    }, []);

    // Filter upazila based on district
    useEffect(() => {
        if (selectedDistrict) {
            const filtered = upazilas.filter(
                (item) => item.district_id == selectedDistrict
            );
            setFilteredUpazila(filtered);
        } else {
            setFilteredUpazila([]);
        }
    }, [selectedDistrict, upazilas]);

   // Submit Form
const onSubmit = (data) => {
    const finalData = {
        ...data,
        requesterName: user?.displayName,
        requesterEmail: user?.email,
        status: "pending",
    };

    console.log(finalData);

    // SweetAlert confirmation
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit this blood donation request?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, submit it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Post request to server
                await axiousSecure.post("/donorRequest", finalData);

                Swal.fire(
                    "Submitted!",
                    "Your donation request has been created.",
                    "success"
                );
                 window.location.reload();
            } catch (error) {
                console.log(error)
                Swal.fire(
                    "Error!",
                    "Something went wrong. Please try again.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                "Cancelled",
                "Your request is not submitted.",
                "info"
            );
        }
    });
};


    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md p-8 rounded-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">
                Create Blood Donation Request
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* INPUT WRAPPER */}
                <div className="grid md:grid-cols-2 gap-5">

                    {/* Requester Name */}
                    <div>
                        <label className="font-semibold text-gray-700">Requester Name</label>
                        <input
                            type="text"
                            readOnly
                            value={user?.displayName}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                        />
                    </div>

                    {/* Requester Email */}
                    <div>
                        <label className="font-semibold text-gray-700">Requester Email</label>
                        <input
                            type="email"
                            readOnly
                            value={user?.email}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                        />
                    </div>

                    {/* Recipient Name */}
                    <div>
                        <label className="font-semibold text-gray-700">Recipient Name</label>
                        <input
                            {...register("recipientName", { required: "Recipient name required" })}
                            type="text"
                            placeholder="Enter recipient name"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
                        />
                        {errors.recipientName && (
                            <p className="text-red-500 text-sm">{errors.recipientName.message}</p>
                        )}
                    </div>

                    {/* District */}
                    <div>
                        <label className="font-semibold text-gray-700">Recipient District</label>
                        <select
                            {...register("district", { required: "District is required" })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 bg-white"
                        >
                            <option value="">Select District</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        {errors.district && (
                            <p className="text-red-500 text-sm">{errors.district.message}</p>
                        )}
                    </div>

                    {/* Upazila */}
                    <div>
                        <label className="font-semibold text-gray-700">Recipient Upazila</label>
                        <select
                            {...register("upazila", { required: "Upazila is required" })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800"
                        >
                            <option value="">Select Upazila</option>
                            {filteredUpazila.map((u) => (
                                <option key={u.id} value={u.name}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                        {errors.upazila && (
                            <p className="text-red-500 text-sm">{errors.upazila.message}</p>
                        )}
                    </div>

                    {/* Hospital */}
                    <div className="md:col-span-2">
                        <label className="font-semibold text-gray-700">Hospital Name</label>
                        <input
                            {...register("hospital", { required: "Hospital is required" })}
                            type="text"
                            placeholder="Dhaka Medical College Hospital"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
                        />
                        {errors.hospital && (
                            <p className="text-red-500 text-sm">{errors.hospital.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="font-semibold text-gray-700">Full Address</label>
                        <input
                            {...register("address", { required: "Address is required" })}
                            type="text"
                            placeholder="Zahir Raihan Rd, Dhaka"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="font-semibold text-gray-700">Blood Group</label>
                        <select
                            {...register("bloodGroup", { required: "Blood group required" })}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800"
                        >
                            <option value="">Select Blood Group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                <option key={bg} value={bg}>
                                    {bg}
                                </option>
                            ))}
                        </select>
                        {errors.bloodGroup && (
                            <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>
                        )}
                    </div>

                    {/* Donation Date */}


                    <div className="relative">
                        <label className="font-semibold text-gray-700">Donation Date</label>

                        <div className="relative">
                            <input
                                {...register("donationDate", { required: "Donation date required" })}
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 pr-10 cursor-pointer"
                            />

                            {/* Calendar Icon */}
                            <Calendar
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                                size={20}
                                onClick={() => {
                                    // Open the date picker
                                    document.querySelector('input[name="donationDate"]').showPicker();
                                }}
                            />
                        </div>

                        {errors.donationDate && (
                            <p className="text-red-500 text-sm">{errors.donationDate.message}</p>
                        )}
                    </div>



                </div>

                {/* Message */}
                <div>
                    <label className="font-semibold text-gray-700">Request Message</label>
                    <textarea
                        {...register("message", { required: "Message is required" })}
                        rows="4"
                        placeholder="Explain why you need blood..."
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
                    ></textarea>
                    {errors.message && (
                        <p className="text-red-500 text-sm">{errors.message.message}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition"
                >
                    Submit Donation Request
                </button>

            </form>
        </div>
    );
};

export default BloodRequest;
