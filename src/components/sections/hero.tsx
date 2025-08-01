"use client";

import React from "react";
import Wrapper from "../shared/wrapper";
import Image from "next/image";
import phoneimage from "@/assets/phoneimage.svg";
import wrongquestions from "@/assets/wrongquestion.svg";
import correctanswer from "@/assets/correctanswer.svg";
import rightcardcomment from "@/assets/rightcardcomment.svg";
import leftcardcomment from "@/assets/leftcardcomment.svg";

const Hero = () => {
  return (
    <section className="pt-16 pb-24 bg-white font-openSauce">
      <Wrapper>
        <div className="w-[1249px] h-[688px] mx-auto rounded-[36px]">
          {/* Headline + Button */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[40px] font-bold leading-[1] text-black text-center">
              Pass the <span className="text-[#1C76FD]">GPPQE</span> Faster with{" "}
              <span className="bg-[#1C76FD] text-white px-1 py-[0] rounded-[3px] font-semibold ">
                Rxmate
              </span>
              &nbsp;–
              <br />
              Practice Smarter, And Harder!
            </h1>

            <div className="mt-8">
              <button className="bg-[#1C76FD] text-white w-[269px] h-[50px] px-[12px] py-[12px] rounded-[24px] font-medium hover:bg-blue-700 transition">
                <span className="w-[82px] h-[20px] text-[16px] leading-[20px] text-center">
                  Subscribe
                </span>
              </button>
            </div>
          </div>

          {/* Images Section */}
          <div className="mt-20 flex flex-col items-center gap-10 md:flex-row md:justify-center md:gap-14">
            {/* Left Card */}
            <div className="flex flex-col gap-6">
              <div className="w-full max-w-xs"> 
                <Image src={leftcardcomment} alt="right card comment" /> {/* remove the images and build them */}
              </div>

              <div className="w-full max-w-xs">
                <Image
                  src={wrongquestions}
                  alt="Wrongly Answered Question"
                  width={300}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="w-full max-w-sm">
              <Image
                src={phoneimage}
                alt="App Preview"
                width={320}
                height={640}
                className="w-full h-auto"
              />
            </div>

            {/* Right Card */}
            <div className="flex flex-col gap-6">
              <div className="w-full max-w-xs">
                <Image src={rightcardcomment} alt="left card comment" /> {/* remove the images and build them */}
              </div>

              <div className="w-full max-w-xs">
                <Image
                  src={correctanswer}
                  alt="Correct Answer Card"
                  width={300}
                  height={300}
                  className="w-full h-auto"
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
