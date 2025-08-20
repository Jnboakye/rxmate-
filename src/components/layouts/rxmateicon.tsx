{
  /* Mobile Logo - Only visible on mobile devices */
}
import React from "react";
import Link from "next/link";

const MobileLogo = () => {
  return (
    <div className="absolute top-8 left-4 md:hidden ">
      <Link href="/">
        <div className="text-[#1C76FD] font-bold text-xl font-openSauce">
          Rxmate
        </div>
      </Link>
    </div>
  );
};

export default MobileLogo;
