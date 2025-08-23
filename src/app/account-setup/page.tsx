"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MobileLogo from "@/components/layouts/rxmateicon";
import {
  useUniversities,
  usePaymentStatus,
} from "@/hooks/useUniversitiesAndCohorts";
import paymentService from "@/lib/payment";

interface AccountSetupFormData {
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  university: string;
}

// Component that uses useSearchParams - needs to be wrapped in Suspense
const RegistrationFormContent = () => {
  const searchParams = useSearchParams();

  // Get payment reference from URL or stored data
  const paymentReference =
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("payment_reference") ||
    paymentService.getStoredPaymentData()?.reference;

  // Use payment status hook
  const {
    paymentStatus,
    loading: paymentLoading,
    error: paymentError,
    isVerified,
    refetch: recheckPayment,
  } = usePaymentStatus(paymentReference || undefined);

  // Fetch universities
  const {
    universities,
    loading: universitiesLoading,
    error: universitiesError,
    refetch: refetchUniversities,
  } = useUniversities();

  const [formData, setFormData] = useState<AccountSetupFormData>({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    university: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Pre-populate form data when payment is verified
  useEffect(() => {
    if (isVerified && paymentStatus) {
      console.log("🎉 Payment verified, pre-populating form data");

      // Pre-populate WhatsApp number from payment data
      if (paymentStatus.customer?.phone) {
        let phoneDisplay = paymentStatus.customer.phone;
        if (phoneDisplay.startsWith("+233")) {
          phoneDisplay = phoneDisplay.substring(4);
        }
        setFormData((prev) => ({
          ...prev,
          whatsappNumber: phoneDisplay,
        }));
      }

      // Pre-populate university from stored payment data
      const storedData = paymentService.getStoredPaymentData();
      if (storedData?.formData?.university_id) {
        setFormData((prev) => ({
          ...prev,
          university: storedData.formData.university_id,
        }));
      }
    }
  }, [isVerified, paymentStatus]);

  const handleInputChange = (
    field: keyof AccountSetupFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleUniversitySelect = (
    universityId: string,
    universityName: string
  ) => {
    handleInputChange("university", universityId);
    setIsDropdownOpen(false);
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) {
      return "First name is required";
    }
    if (!formData.lastName.trim()) {
      return "Last name is required";
    }
    if (!formData.whatsappNumber.trim()) {
      return "WhatsApp number is required";
    }
    if (!formData.university) {
      return "Please select your university";
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.whatsappNumber)) {
      return "Please enter a valid phone number (9-10 digits)";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Validate form data
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("🚀 Account setup form submitted:", formData);
      console.log("💳 Payment reference:", paymentReference);
      console.log("💳 Payment status:", paymentStatus);

      // Prepare account creation data
      const accountData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        whatsappNumber: `+233${formData.whatsappNumber}`,
        university: formData.university,
        email: paymentStatus?.customer?.email,
        paymentReference: paymentReference,
        cohortId: paymentService.getStoredPaymentData()?.formData?.cohort_id,
      };

      console.log("📤 Account creation data:", accountData);

      // Here you would typically call your account creation API
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear stored payment data since account is now created
      paymentService.clearStoredPaymentData();

      // Redirect to success page or app download
      console.log("✅ Account created successfully!");
      alert(
        "Account created successfully! You will receive setup instructions via email."
      );

      // Optionally redirect to app download or success page
      // window.location.href = '/download-app';
    } catch (error) {
      console.error("❌ Account creation error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while verifying payment or loading universities
  if (paymentLoading || universitiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {paymentLoading
              ? "Verifying payment..."
              : "Loading universities..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Show error if payment verification failed or universities failed to load
  // COMMENTED OUT FOR TESTING - Allow users to proceed even if payment verification fails
  /*
  if ((paymentReference && isVerified === false) || universitiesError) {
    const errorMessage =
      paymentError || universitiesError || "An error occurred";
    const isPaymentError = paymentReference && isVerified === false;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isPaymentError
              ? "Payment Verification Failed"
              : "Failed to Load Data"}
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            {isPaymentError ? (
              <>
                <button
                  onClick={() => recheckPayment()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Retry Payment Verification
                </button>
                <Link href="/checkout" className="block">
                  <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
                    Make New Payment
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={refetchUniversities}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Retry Loading Universities
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Refresh Page
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
  */

  // Show error only for universities loading failure (but allow payment failures for testing)
  if (universitiesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Universities
          </h2>
          <p className="text-gray-600 mb-6">{universitiesError}</p>
          <div className="space-y-3">
            <button
              onClick={refetchUniversities}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Retry Loading Universities
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Refresh Page
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
  const selectedUniversity = universities.find(
    (uni) => uni.id === formData.university
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
      {/* Mobile Logo - Only visible on mobile devices */}
      <MobileLogo />

      <div className="max-w-md w-full">
        {/* Payment Success Message */}
        {isVerified && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
            <p className="font-medium">🎉 Payment Successful!</p>
            <p className="text-sm">Let&apos;s complete your account setup</p>
            {paymentStatus && (
              <p className="text-xs mt-1">
                Reference: {paymentReference} • Amount: {paymentStatus.currency}{" "}
                {paymentStatus.amount?.toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Payment Warning for Direct Access */}
        {!paymentReference && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 text-center">
            <p className="font-medium">⚠️ No Payment Reference Found</p>
            <p className="text-sm">
              If you haven&apos;t made a payment yet, please complete payment first
            </p>
            <Link
              href="/checkout"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Make Payment →
            </Link>
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
          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {submitError}
              </div>
            </div>
          )}

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
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
                onClick={() =>
                  !isSubmitting && setIsDropdownOpen(!isDropdownOpen)
                }
                disabled={isSubmitting || universities.length === 0}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-left flex items-center justify-between bg-white ${
                  isSubmitting || universities.length === 0
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:border-gray-400"
                }`}
              >
                <span
                  className={
                    formData.university ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {selectedUniversity?.name ||
                    (universities.length === 0
                      ? "Loading universities..."
                      : "Choose your university")}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && !isSubmitting && (
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
                        onClick={() =>
                          handleUniversitySelect(university.id, university.name)
                        }
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
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
            disabled={isSubmitting || universities.length === 0}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none ${
              isSubmitting || universities.length === 0
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Complete Setup"
            )}
          </button>

          {/* Alternative options */}
          <div className="text-center space-y-2">
            <Link
              href="/download-app"
              className="block text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
              Skip for now and download app →
            </Link>
            <Link
              href="/checkout"
              className="block text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              ← Back to payment
            </Link>
          </div>

          {/* Help section */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-0.5">💡</span>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Need Help?</p>
                <p>
                  If you&apos;re experiencing issues, please contact our support team
                  or try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Main component with Suspense wrapper
const RegistrationForm = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegistrationFormContent />
    </Suspense>
  );
};

export default RegistrationForm;