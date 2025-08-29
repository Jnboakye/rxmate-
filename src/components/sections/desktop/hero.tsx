"use client";
import React from "react";
import Wrapper from "../../shared/wrapper";
import Link from "next/link";
import Image from "next/image";
import phoneimage from "@/assets/phoneimage.svg";
import wrongquestions from "@/assets/wrongquestion.svg";
import correctanswer from "@/assets/correctanswer.svg";
import rightcardcomment from "@/assets/rightcardcomment.svg";
import leftcardcomment from "@/assets/leftcardcomment.svg";
import leftcurl from "@/assets/leftcurl.svg";
import rightcurl from "@/assets/rightcurl.svg";

const Hero = () => {
  return (
    <section
      id="hero"
      className="pt-16 pb-24 bg-white font-openSauce hidden md:block relative"
    >
      {/* Wavy Dashed Line Background */}
      <div
        className="absolute inset-0 flex justify-center pointer-events-none z-0"
        style={{ alignItems: "flex-start", paddingTop: "30%" }}
      >
        <svg width="1342" height="200" viewBox="0 0 1342 200" className="">
          <path
            d="M 0,100 Q 168,50 336,100 T 671,100 T 1006,100 T 1342,100"
            stroke="#00000099"
            strokeWidth="3"
            strokeDasharray="12 8"
            fill="none"
          />
        </svg>
      </div>

      <Wrapper>
        <div className="w-[1249px] h-[688px] mx-auto rounded-[36px] relative z-10">
          {/* Headline + Button */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[40px] font-bold leading-[1.05] text-black text-center">
              Your All-in-One GPPQE Prep: Practice
              <br />
              Questions + Expert Summaries
            </h1>
            <div className="mt-8">
              <Link href="/checkoutform">
                <button className="bg-[#1C76FD] text-white w-[269px] h-[50px] px-[12px] py-[12px] rounded-[24px] font-medium hover:bg-blue-700 transition">
                  <span className="w-[82px] h-[20px] text-[16px] leading-[20px] text-center">
                    Subscribe
                  </span>
                </button>
              </Link>
            </div>
          </div>
          {/* Images Section */}
          <div className="mt-20 flex flex-row items-center gap-10">
            {/* Left Card */}
            <div className="flex flex-col gap-3 ">
              <div className="w-384.89px h-43.89px">
                <Image src={leftcardcomment} alt="left card comment" />
              </div>
              <div className="w-[359px] h-[270px]">
                <Image
                  src={wrongquestions}
                  alt="Wrongly Answered Question"
                  width={335}
                  height={238}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {/* Phone */}
            <div className="w-full max-w-sm">
              <Image
                src={phoneimage}
                alt="App Preview"
                width={320}
                height={673}
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Right Card */}
            <div className="flex flex-col mt-13">
              <div className="w-342.89px h-43.89px">
                <Image src={rightcardcomment} alt="Right card comment" />
              </div>
              <div className="w-[311px] h-[337px]">
                <Image
                  src={correctanswer}
                  alt="Correct Answer Card"
                  width={279}
                  height={305}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default Hero;
