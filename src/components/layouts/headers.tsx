// (Desktop only)

"use client";

import React from "react";
import Wrapper from "../shared/wrapper";
import Image from "next/image";
import androidicon from "@/assets/androidicon.svg";
import appleicon from "@/assets/appleicon.svg";

const Header = () => {
  return (
    <header className="hidden md:block py-6">
      <Wrapper>
        <div className="flex items-center justify-between font-openSauce ">

            {/* Rxmate Text icon */}
          <div className="text-[#1C76FD] font-bold text-xl w-[76px] h-[25px]">
            Rxmate
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 text-[#00000080] text-sm font-medium">
            <a href="#features" className="hover:text-[#1C76FD]">
              Features
            </a>
            <a href="#about" className="hover:text-[#1C76FD]">
              About
            </a>
            <a href="#faqs" className="hover:text-[#1C76FD]">
              FAQs
            </a>
            <a href="#contact" className="hover:text-[#1C76FD]">
              Contact Us
            </a>
          </nav>

          {/* Download App Button */}
          <a
            href="#download"
            className="flex justify-between items-center bg-[#1C76FD] text-white px-4 py-2 rounded-[12px] text-sm font-bold hover:bg-blue-700 transition-all w-[201px]"
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
      </Wrapper>
    </header>
  );
};

export default Header;
