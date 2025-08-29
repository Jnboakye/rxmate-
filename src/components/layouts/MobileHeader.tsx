// (Mobile view only)


"use client";
import React from "react";
import Wrapper from "../shared/wrapper";
import Link from "next/link";


const MobileHeader = () => {
  return (
    <header className="block sm:block md:hidden lg:hidden xl:hidden py-6 bg-white font-openSauce">
      <Wrapper>
        <div className="flex items-center justify-between px-4 font-openSauce">
          {/* Rxmate Text icon */}
          <div className="text-[#1C76FD] font-bold text-[20px] py-3">
            Rxmate
          </div>

          {/* Download App */}
          <Link href="">
          <button className="bg-[#A559E7]  text-white px-5 py-3 rounded-full text-[12px] font-extrabold transition-colors">
            Download App
          </button>
          </Link>
          
        </div>
      </Wrapper>
    </header>
  );
};

export default MobileHeader;