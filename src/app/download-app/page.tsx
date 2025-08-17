"use client";

import React from "react";
import androidicon from "@/assets/androidicon.svg";
import appleicon from "@/assets/appleicon.svg";
import Image from "next/image";
import MobileLogo from "@/components/layouts/rxmateicon";

const DownloadApp = () => {
  const handleTapToContinue = () => {
    // Handle deep link to app or app store redirect
    console.log("Redirecting to app...");
    // You can implement deep linking logic here
    // window.location.href = 'rxmate://continue' || fallback to app store
  };

  const handleDownloadApp = () => {
    // Handle app download redirect
    console.log("Redirecting to app store...");
    // You can implement app store redirect logic here
    // window.open('https://apps.apple.com/app/rxmate', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 font-openSauce">
      {/* Mobile Logo - Only visible on mobile devices */}
      <MobileLogo />

      <div className="w-full max-w-md p-8">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Continue to the App
          </h1>

          {/* Progress Indicator */}
          <div className="flex items-center justify-left mb-8">
            <div className="h-1 w-25 bg-green-500 rounded-full mr-2"></div>
            <div className="h-1 w-25 bg-green-500 rounded-full mr-2"></div>
            <div className="h-1 w-25 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Existing App Section */}
          <div className="text-left">
            <p className="text-gray-800 mb-4">
              Do you have Rxmate mobile app already?
            </p>
            <a
              onClick={handleTapToContinue}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 cursor-pointer block"
            >
              Tap to continue to app
            </a>
          </div>

          {/* Divider */}
          <div className="py-4">
            <div className="border-t border-gray-200"></div>
          </div>

          {/* Download Section */}
          <div>
            <p className="text-gray-800 mb-6 leading-relaxed">
              Incase you don't have the app, Click on the button to download now
            </p>

            <a
              href="#download"
              className="flex justify-between items-center bg-[#A559E7] text-white px-4 py-2 rounded-[12px] text-sm font-bold hover:bg-blue-700 transition-all w-[201px]"
            >
              <div className="flex-shrink-0">
                <Image src={appleicon} alt="Apple" width={20} height={20} />
              </div>
              <div className="flex-shrink-0">
                <Image src={androidicon} alt="Android" width={20} height={20} />
              </div>
              <div className="flex-shrink-0 w-[109px] h-[18px] text-center">
                Download App
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
