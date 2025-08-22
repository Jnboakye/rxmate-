"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MobileLogo from "@/components/layouts/rxmateicon";
import PaymentService from "@/lib/payment";
import { useUniversities } from "@/hooks/useUniversitiesAndCohorts";

const RegistrationForm = () => {
  const searchParams = useSearchParams();
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);
  const [paymentError, setPaymentError] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Fetch universities from backend
  const { universities, loading: universitiesLoading, error: universitiesError } = useUniversities();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    university: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verify payment on page load if reference is present
  useEffect(() => {
    const verifyPayment = async () => {
      // Get payment reference from URL parameters
      const reference = searchParams.get('reference') || 
                       searchParams.get('trxref') || 
                       searchParams.get('payment_reference');
      
      // Also try to get stored payment data
      const storedData = PaymentService.getStoredPaymentData();
      
      if (reference) {
        try {
          console.log('Verifying payment with reference:', reference);
          const response = await PaymentService.getPaymentStatus(reference);
          
          if (response.status === 'success' && response.data?.status === 'success') {
            setPaymentVerified(true);
            setPaymentData(response.data);
            
            // Pre-populate form with payment data if available
            if (response.data.customer) {
              // Extract phone number without country code for display
              let phoneDisplay = response.data.customer.phone;
              if (phoneDisplay.startsWith('+233')) {
                phoneDisplay = phoneDisplay.substring(4);
              }
              
              setFormData(prev => ({
                ...prev,
                whatsappNumber: phoneDisplay,
              }));
            }
            
            // If we have stored payment data, use it to pre-populate university
            if (storedData?.formData?.university_id) {
              setFormData(prev => ({
                ...prev,
                university: storedData.formData.university_id,
              }));
            }
            
            console.log('Payment verified successfully:', response.data);
          } else {
            setPaymentVerified(false);
            setPaymentError('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setPaymentVerified(false);
          setPaymentError('Unable to verify payment. Please contact support.');
        }
      } else if (storedData?.reference) {
        // Try to verify using stored reference
        try {
          const response = await PaymentService.getPaymentStatus(storedData.reference);
          if (response.status === 'success' && response.data?.status === 'success') {
            setPaymentVerified(true);
            setPaymentData(response.data);
          } else {
            // Allow them to proceed but show a warning
            setPaymentVerified(true);
            console.warn('Could not verify stored payment reference');
          }
        } catch (error) {
          console.warn('Could not verify stored payment:', error);
          setPaymentVerified(true); // Allow them to proceed
        }
      } else {
        // No payment reference found - user might have navigated directly
        // In production, you might want to redirect them to payment page
        console.warn('No payment reference found');
        setPaymentVerified(true); // Allow them to proceed for now
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUniversitySelect = (universityId: string, universityName: string) => {
    handleInputChange("university", universityId);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.whatsappNumber.trim() || !formData.university) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Account setup form submitted:", formData);
      
      // Here you would typically:
      // 1. Create user account with the form data
      // 2. Associate it with the payment data
      // 3. Send welcome email with app setup instructions
      
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear stored payment data since account is now created
      PaymentService.clearStoredPaymentData();
      
      // Redirect to success page or app download
      console.log("Account created successfully!");
      
    } catch (error) {
      console.error("Account creation error:", error);
      alert("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while verifying payment or loading universities
  if (paymentVerified === null || universitiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {paymentVerified === null ? "Verifying payment..." : "Loading universities..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error if payment verification failed or universities failed to load
  if (paymentVerified === false || universitiesError) {
    const errorMessage = paymentError || universitiesError || "An error occurred";
    const isPaymentError = paymentVerified === false;
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isPaymentError ? "Payment Verification Failed" : "Failed to Load Data"}
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            {isPaymentError && (
              <Link href="/checkout" className="block">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Try Payment Again
                </button>
              </Link>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Retry
            </button>
            <Link href="/" className="block">
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the selected university name for display
  const selectedUniversity = universities.find(uni => uni.id === formData.university);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
       {/* Mobile Logo - Only visible on mobile devices */}
      <MobileLogo />
      
      <div className="">
        {/* Payment Success Message */}
        {(searchParams.get('reference') || paymentData) && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
            <p className="font-medium">🎉 Payment Successful!</p>
            <p className="text-sm">Let's complete your account setup</p>
            {paymentData && (
              <p className="text-xs mt-1">
                Amount: {paymentData.currency} {paymentData.amount?.toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-7">
            Let&apos;s Get You Started
          </h1>
          <div className="flex items-left justify-left mb-3">
            <div className="h-1 w-25 bg-green-500 rounded-full mr-2"></div>
            <div className="h-1 w-25 bg-green-500 rounded-full mr-2"></div>
            <div className="h-1 w-25 bg-[#F4F4F4] rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-2">
              WhatsApp number *
            </label>
            <div className="flex">
              <div className="flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                <span className="text-lg mr-2">🇬🇭</span>
                <span className="text-sm text-gray-600">+233</span>
              </div>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  handleInputChange("whatsappNumber", e.target.value)
                }
                placeholder="241 000 000"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
                maxLength={10}
                pattern="[0-9]{9,10}"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your WhatsApp number for important updates
            </p>
          </div>

          {/* University Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-2">
              University *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-left flex items-center justify-between bg-white"
              >
                <span
                  className={
                    formData.university ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {selectedUniversity?.name || "Choose your university"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {universities.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No universities available
                    </div>
                  ) : (
                    universities.map((university) => (
                      <button
                        key={university.id}
                        type="button"
                        onClick={() => handleUniversitySelect(university.id, university.name)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        {university.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Complete Setup'
            )}
          </button>
          
          {/* Alternative: Link to download app if you want to skip account creation for now */}
          <div className="text-center">
            <Link href="/download-app" className="text-blue-600 hover:text-blue-800 text-sm">
              Skip for now and download app →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;