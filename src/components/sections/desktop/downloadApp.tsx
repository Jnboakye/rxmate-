import React from 'react';
import { Apple, Smartphone } from 'lucide-react';

const AppContinuationScreen = () => {
  const handleTapToContinue = () => {
    // Handle deep link to app or app store redirect
    console.log('Redirecting to app...');
    // You can implement deep linking logic here
    // window.location.href = 'rxmate://continue' || fallback to app store
  };

  const handleDownloadApp = () => {
    // Handle app download redirect
    console.log('Redirecting to app store...');
    // You can implement app store redirect logic here
    // window.open('https://apps.apple.com/app/rxmate', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Continue to the App
          </h1>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-1 w-16 bg-green-500 rounded-full mr-2"></div>
            <div className="h-1 w-16 bg-green-500 rounded-full mr-2"></div>
            <div className="h-1 w-16 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Existing App Section */}
          <div className="text-center">
            <p className="text-gray-800 mb-4">
              Do you have Rxmate mobile app already?
            </p>
            <button
              onClick={handleTapToContinue}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            >
              Tap to continue to app
            </button>
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
            
            <button
              onClick={handleDownloadApp}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 outline-none"
            >
              <Apple className="w-5 h-5 mr-2" />
              <Smartphone className="w-5 h-5 mr-3" />
              Download App
            </button>
          </div>

          {/* Optional: Add additional platform buttons */}
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadApp}
                className="flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
              >
                <Apple className="w-5 h-5 mr-2" />
                App Store
              </button>
              <button
                onClick={handleDownloadApp}
                className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Google Play
              </button>
            </div>
          </div>

          {/* Footer text */}
          <div className="text-center pt-6">
            <p className="text-sm text-gray-500">
              Continue your registration process in the Rxmate mobile app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppContinuationScreen;