"use client";
import React, { useState } from "react";
import Link from "next/link";
import MobileLogo from "@/components/layouts/rxmateicon";


const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    cohort: "2024/2025",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your payment logic here when ready
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Mobile Logo - Only visible on mobile devices */}
      <MobileLogo />

      <div className=" p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Personal Information
        </h1>

        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone
            </label>
            <div className="flex">
              <div className="flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                <span className="text-lg mr-2">🇬🇭</span>
                <span className="text-sm text-gray-600">+233</span>
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="241 000 000"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Cohort Field */}
          <div>
            <label
              htmlFor="cohort"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cohort
            </label>
            <div className="relative">
              <select
                id="cohort"
                name="cohort"
                value={formData.cohort}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
                <option value="2025/2026">2025/2026</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Warning Text */}
          <div className="text-sm text-gray-600 leading-relaxed">
            Please ensure that the email provided is correct as setup
            instructions will be sent to that email
          </div>

          {/* Pay Button */}
          <Link href="/account-setup">
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition-colors duration-200 text-lg"
            >
              Pay GHS 1,000
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
