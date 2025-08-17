"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import MobileLogo from "@/components/layouts/rxmateicon";


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    university: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const universities = [
    "University of Ghana",
    "Kwame Nkrumah University of Science and Technology",
    "GTUC",
    "University of Cape Coast",
    "Ashesi University",
    "University of Winneba",
    "UPSA",
    "University of Mines and Technology",
    "Central University",
    "KNUSTFORD University",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUniversitySelect = (university: string) => {
    handleInputChange("university", university);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
       {/* Mobile Logo - Only visible on mobile devices */}
      <MobileLogo />
      
      <div className="">
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
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-2">
              WhatsApp number
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
              />
            </div>
          </div>

          {/* University Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-2">
              University
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
                  {formData.university || "Choose your university"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {universities.map((university, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleUniversitySelect(university)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                    >
                      {university}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <Link href="/download-app">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
            >
              Continue
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
