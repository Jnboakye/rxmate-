// (Mobile view only)


"use client";
import React from "react";
import Wrapper from "../shared/wrapper";
import Link from "next/link";


const MobileHeader = () => {
  return (
    <header className="block sm:block md:hidden lg:hidden xl:hidden py-4 bg-white">
      <Wrapper>
        <div className="flex items-center justify-between font-openSauce">
          {/* Rxmate Text icon */}
          <div className="text-[#1C76FD] font-bold text-xl">
            Rxmate
          </div>

          {/* Subscribe Button */}
          <Link href="/checkoutform">
          <button className="bg-[#8B5CF6] hover:bg-[#7a7fda] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
            Subscribe
          </button>
          </Link>
          
        </div>
      </Wrapper>
    </header>
  );
};

export default MobileHeader;