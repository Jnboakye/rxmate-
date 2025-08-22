"use client";
import React, { useState, useEffect } from "react";
import MobileLogo from "@/components/layouts/rxmateicon";
import  { PaymentFormData, Cohort, } from "@/lib/payment";
import { useUniversitiesWithCohorts } from "@/hooks/useUniversitiesAndCohorts";

const CheckoutForm = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    email: "",
    phone: "",
    cohort: "",
    university: "",
  });

  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch universities and cohorts
  const {
    universities,
    cohorts,
    loading: dataLoading,
    error: dataError,
    getCohortsByUniversity,
    getUniversityById,
  } = useUniversitiesWithCohorts();

  // Update selected cohort when cohort selection changes
  useEffect(() => {
    if (formData.cohort) {
      const cohortId = parseInt(formData.cohort, 10);
      const cohort = cohorts.find(c => c.id === cohortId);
      setSelectedCohort(cohort || null);
    } else {
      setSelectedCohort(null);
    }
  }, [formData.cohort, cohorts]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If university changes, reset cohort selection
    if (name === 'university') {
      setFormData(prev => ({
        ...prev,
        cohort: "",
      }));
      setSelectedCohort(null);
    }
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");


    // Validation
    if (!selectedCohort) {
      setError("Please select a cohort");
      setIsProcessing(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsProcessing(false);
      return;
    }

    // Validate phone number (should be 9-10 digits)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number (9-10 digits)");
      setIsProcessing(false);
      return;
    }

    try {
      // Generate callback URL for after payment completion
      // This should point to your account setup page
      const baseUrl = window.location.origin;
      const callbackUrl = `${baseUrl}/account-setup`;
      
      console.log('Initiating payment with callback URL:', callbackUrl);
      
      // Initiate payment - this will redirect the user to the payment gateway
    //  await paymentService.initiatePayment(formData, selectedCohort, callbackUrl);
    const initializePaymentDirect = async () => {
  try {
    const response = await fetch('/payment/initialise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
      payment_reference: 'string',
      phone: 'string',
      email: formData.email.trim().toLowerCase(),
      cohort_id: parseInt(formData.cohort, 10),
      ...(callbackUrl && { callback_url: callbackUrl }),
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};

//calling payment function 


    
      
      // If we reach here without being redirected, something went wrong
      console.warn('Payment initiation completed but no redirect occurred');
      
    } catch (error: unknown) {
      console.error("Payment error:", error);
      let errorMessage = "Payment initialization failed. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle specific error cases
        if (error.message.includes('phone number')) {
          errorMessage = "Invalid phone number format. Please enter a valid Ghanaian phone number.";
        } else if (error.message.includes('email')) {
          errorMessage = "Invalid email address. Please check and try again.";
        } else if (error.message.includes('422')) {
          errorMessage = "Please check your details and try again. Make sure all fields are filled correctly.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
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
          <p className="text-gray-600">Loading universities and cohorts...</p>
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-openSauce">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Retry
          </button>
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
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                error && !formData.email ? 'border-red-300' : 'border-gray-300'
              }`}
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
                className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  error && !formData.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your number without the country code (e.g., 241000000)
            </p>
          </div>

          {/* University Field */}
          <div>
            <label
              htmlFor="university"
              className="block text-sm font-medium text-[#00000099] mb-2"
            >
              University *
            </label>
            <div className="relative">
              <select
                id="university"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
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

          {/* Cohort Field */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="">Select Cohort</option>
                {(formData.university ? getCohortsByUniversity(formData.university) : cohorts).map((cohort) => (
                  <option key={cohort.id} value={cohort.id.toString()}>
                    {cohort.name || cohort.title} - {formatPrice(cohort.current_price, cohort.currency)}
                  </option>
                ))}
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
            disabled={isProcessing || !selectedCohort}
            className={`w-full font-semibold py-4 rounded-[24px] transition-colors duration-200 text-lg ${
              isProcessing || !selectedCohort
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-[#1C76FD] hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Redirecting to payment...
              </div>
            ) : selectedCohort ? (
              `Pay ${formatPrice(selectedCohort.current_price, selectedCohort.currency)}`
            ) : (
              'Select Cohort to Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;