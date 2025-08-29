//CheckoutForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import MobileLogo from "@/components/layouts/rxmateicon";
import { PaymentFormData, Cohort } from "@/lib/payment";
import { useUniversitiesWithCohorts, usePaymentInit } from "@/hooks/useUniversitiesAndCohorts";

const CheckoutForm = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    email: "",
    phone: "",
    cohort: "",
    university: "", // Keep this for backend compatibility but won't be shown
  });

  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);

  // Use the improved hooks
  const {
    universities,
    cohorts,
    loading: dataLoading,
    error: dataError,
    getCohortsByUniversity,
    getUniversityById,
    getCohortById,
    refetchAll,
  } = useUniversitiesWithCohorts();

  const {
    initiatePayment,
    loading: paymentLoading,
    error: paymentError,
    success: paymentSuccess,
    clearState: clearPaymentState,
  } = usePaymentInit();

  // Update selected cohort when cohort selection changes
  useEffect(() => {
    if (formData.cohort) {
      const cohortId = parseInt(formData.cohort, 10);
      const cohort = getCohortById(cohortId);
      setSelectedCohort(cohort || null);
      
      // Auto-set university based on selected cohort
      if (cohort && cohort.university_id) {
        setFormData(prev => ({
          ...prev,
          university: cohort.university_id ? String(cohort.university_id) : ""
        }));
      }
    } else {
      setSelectedCohort(null);
      setFormData(prev => ({
        ...prev,
        university: ""
      }));
    }
  }, [formData.cohort, getCohortById]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear payment error when user starts typing
    if (paymentError) {
      clearPaymentState();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous payment state
    clearPaymentState();

    // Validation
    if (!selectedCohort) {
      alert("Please select a cohort");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate phone number (should be 9-10 digits)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid phone number (9-10 digits)");
      return;
    }

    try {
      // Generate callback URL for after payment completion
      const baseUrl = window.location.origin;
      const callbackUrl = `${baseUrl}/account-setup`;
      
      console.log('🚀 Initiating payment with callback URL:', callbackUrl);
      
      // Initiate payment using the improved service
      await initiatePayment(
        { ...formData, university: formData.university ?? "" },
        selectedCohort,
        callbackUrl
      );
      
      // The payment service will automatically redirect the user to the payment gateway
      // If we reach here without being redirected, something went wrong
      console.warn('⚠️ Payment initiation completed but no redirect occurred');
      
    } catch (error: unknown) {
      console.error("❌ Payment error:", error);
      // Error handling is now managed by the usePaymentInit hook
      // The error will be displayed in the UI automatically
    }
  };

  // Format price for display
  const formatPrice = (price: number, currency: string = 'GHS') => {
    return `${currency} ${price.toLocaleString()}`;
  };

  // Show loading state while fetching data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-openSauce">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cohorts...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-openSauce">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <div className="space-y-2">
            <button
              onClick={refetchAll}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Retry Loading Data
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-openSauce">
      {/* Mobile Logo */}
      <MobileLogo />

      <div className="p-8 w-full max-w-md">
        <h3 className="text-3xl font-bold text-gray-900 text-left mb-8">
          Payment Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {paymentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <div>
                  <p className="font-medium">Payment Error</p>
                  <p>{paymentError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {paymentSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <div>
                  <p className="font-medium">Payment Initiated Successfully</p>
                  <p>Redirecting to payment gateway...</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#00000099] mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your Email"
              required
              disabled={paymentLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                paymentError && !formData.email 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              } ${paymentLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#00000099] mb-2"
            >
              Phone *
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
                disabled={paymentLoading}
                className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  paymentError && !formData.phone 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } ${paymentLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your number without the country code (e.g., 241000000)
            </p>
          </div>

          {/* Cohort Field - Now shows all cohorts */}
          <div>
            <label
              htmlFor="cohort"
              className="block text-sm font-medium text-[#00000099] mb-2"
            >
              Cohort *
            </label>
            <div className="relative">
              <select
                id="cohort"
                name="cohort"
                value={formData.cohort}
                onChange={handleInputChange}
                required
                disabled={paymentLoading || cohorts.length === 0}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer ${
                  paymentLoading || cohorts.length === 0 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : 'hover:border-gray-400'
                }`}
              >
                <option value="">
                  {cohorts.length === 0 ? "Loading cohorts..." : "Select Cohort"}
                </option>
                {cohorts.map((cohort) => {
                  const universityName = cohort.university_id 
                    ? getUniversityById(cohort.university_id)?.name || 'Unknown University'
                    : '';
                  
                  return (
                    <option key={cohort.id} value={cohort.id.toString()}>
                      {cohort.name || cohort.title} - {formatPrice(cohort.current_price, cohort.currency)}
                      {universityName && ` (${universityName})`}
                    </option>
                  );
                })}
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

          {/* Price Display */}
          {selectedCohort && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(selectedCohort.current_price, selectedCohort.currency)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedCohort.name || selectedCohort.title}
                {selectedCohort.university_id && (
                  <> • {getUniversityById(selectedCohort.university_id)?.name || 'Unknown University'}</>
                )}
              </div>
              {selectedCohort.original_price > selectedCohort.current_price && (
                <div className="text-sm text-green-600 mt-1">
                  You save: {formatPrice(selectedCohort.original_price - selectedCohort.current_price, selectedCohort.currency)}
                </div>
              )}
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 mt-0.5">⚠️</span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important:</p>
                <p>Please ensure your email is correct as setup instructions will be sent there after payment.</p>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={paymentLoading || !selectedCohort || dataLoading}
            className={`w-full font-semibold py-4 rounded-[24px] transition-colors duration-200 text-lg ${
              paymentLoading || !selectedCohort || dataLoading
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-[#1C76FD] hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {paymentLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Redirecting to payment...
              </div>
            ) : dataLoading ? (
              'Loading...'
            ) : selectedCohort ? (
              `Pay ${formatPrice(selectedCohort.current_price, selectedCohort.currency)}`
            ) : (
              'Select Cohort to Continue'
            )}
          </button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Secure payment powered by Paystack
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;