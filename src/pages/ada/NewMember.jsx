import React, { useState } from "react";
import { createAgent } from "../../api/client"; // ✅ Correct API

export default function NewMember() {

    const [formData, setFormData] = useState({
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: "Gramdoot",
        firstName: "",
        lastName: "",
        gender: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const currentUser = {
        id: 1,
        working_zone: { district_id: 10, block_id: 5 },
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.mobile) newErrors.mobile = "Mobile is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirmPassword)
            newErrors.confirmPassword = "Confirm your password";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.gender) newErrors.gender = "Gender is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const result = await createAgent({
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,

                role_id: formData.role === "Gramdoot" ? 8 : 7,

                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,

                // ✅ REQUIRED EXTRA FIELDS (from your cURL)
                fatherName: "NA",
                dob: "1990-01-01",

                address: "Default Address",
                district_id: currentUser.working_zone.district_id,
                block_id: currentUser.working_zone.block_id,
                village_id: 1,
                pincode: "700001",
                gram_panchayat_id: 1,

                account_number: "1234567890",
                account_holder_name: formData.firstName,
                bank_name: "SBI",
                ifsc_code: "SBIN0000001",
                branch_name: "Default Branch",
                account_type: "Savings",

                wz_district_id: currentUser.working_zone.district_id,
                wz_block_id: currentUser.working_zone.block_id,
            });

            console.log("SUCCESS:", result);
            alert("Member registered successfully!");

            setFormData({
                email: "",
                mobile: "",
                password: "",
                confirmPassword: "",
                role: "Gramdoot",
                firstName: "",
                lastName: "",
                gender: "",
            });

            setErrors({});

        } catch (err) {
            console.error("FULL ERROR:", err);
            alert("Failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <main className="grow w-full px-4 py-8">
                <div className="max-w-6xl mx-auto">

                    <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-6">
                        New Member
                    </h2>

                    <div className="border border-gray-200 p-6">

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-wrap gap-4">

                                {/* Email */}
                                <div className="flex flex-col gap-1 w-60">
                                    <label className="text-xs text-gray-600">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs">{errors.email}</p>
                                    )}
                                </div>

                                {/* Mobile */}
                                <div className="flex flex-col gap-1 w-52">
                                    <label className="text-xs text-gray-600">Mobile *</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.mobile && (
                                        <p className="text-red-500 text-xs">{errors.mobile}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1 w-52">
                                    <label className="text-xs text-gray-600">Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col gap-1 w-52">
                                    <label className="text-xs text-gray-600">Confirm Password *</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="flex flex-col gap-1 w-40">
                                    <label className="text-xs text-gray-600">Role *</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    >
                                        <option value="Gramdoot">Gramdoot</option>
                                        <option value="ADA">ADA</option>
                                    </select>
                                </div>

                                {/* First Name */}
                                <div className="flex flex-col gap-1 w-48">
                                    <label className="text-xs text-gray-600">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="flex flex-col gap-1 w-48">
                                    <label className="text-xs text-gray-600">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs">{errors.lastName}</p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="flex flex-col gap-1 w-40">
                                    <label className="text-xs text-gray-600">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="text-red-500 text-xs">{errors.gender}</p>
                                    )}
                                </div>

                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-6 py-2 rounded disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </main>
        </>
    );
}