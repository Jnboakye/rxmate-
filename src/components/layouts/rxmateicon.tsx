 {/* Mobile Logo - Only visible on mobile devices */}
import React from "react";

const MobileLogo = () => {
  return (
    <div className="absolute top-4 left-4 md:hidden">
      <div className="text-[#1C76FD] font-bold text-xl font-openSauce">
        Rxmate
      </div>
    </div>
  );
};

export default MobileLogo;