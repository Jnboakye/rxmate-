"use client";
import React, { useState } from "react";
import MobileLogo from "@/components/layouts/rxmateicon";
import PaymentService from "@/lib/payment";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    cohort: "2024/2025",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // We set testMode to true for testing, false for production
      const testMode = true; // We Change to false when ready for production

      await PaymentService.initiatePayment(formData, 1000, testMode);
      // If we reach here, payment was initiated successfully
      // The user will be redirected to the payment page
    } catch (error: any) {
      console.error("Payment error:", error);
      setError(
        error.message || "Payment initialization failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-openSauce">
      {/* Mobile Logo - Only visible on mobile devices */}
      <MobileLogo />

      <div className="p-8 w-full max-w-md">
        <h3 className="text-3xl font-bold text-gray-900 text-left mb-8">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#00000099] mb-2"
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
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                error && !formData.email ? "border-red-300" : "border-gray-300"
              }`}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#00000099] mb-2"
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
                required
                maxLength={10}
                pattern="[0-9]{9,10}"
                className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  error && !formData.phone
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Cohort Field */}
          <div>
            <label
              htmlFor="cohort"
              className="block text-sm font-medium text-[#00000099] mb-2"
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
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full font-semibold py-4 rounded-[24px] transition-colors duration-200 text-lg ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1C76FD] hover:bg-blue-600 text-white"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Pay GHS 1,000"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
