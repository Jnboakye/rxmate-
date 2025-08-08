"use client";

import React from "react";
import Wrapper from "../../shared/wrapper";
import Image from "next/image";
import phoneimage from "@/assets/phonemockup.svg";
import card1 from "@/assets/card1.svg";
import card2 from "@/assets/card2.svg";
import card3 from "@/assets/card3.svg";

export default function Features() {
  return (
    <Wrapper>
      <div className="w-full bg-white py-16 px-4 md:px-12 font-openSauce hidden md:block">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[40px] md:text-4xl font-bold mb-15">
            Discover Features Built for Efficient Learning
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12 justify-between ml-70">
            {/* Phone Image */}
            <div className="flex justify-center ">
              <Image
                src={phoneimage}
                alt="Phone Screenshot"
                width={271} 
                height={553}
                className="w-[271px] h-[553px] drop-shadow-lg"
              />
            </div>

            {/* Right Side Text + Feature Images */}
            <div className="flex-1 space-y-8 text-left">
              <p className="text-gray-600 text-lg">
                With personalized quizzes, instant feedback, and detailed
                explanations, you'll identify your strengths, improve on your
                weaknesses, and track your progress over time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Image
                  src={card1}
                  alt="Answer Explanations"
                  width={300}
                  height={150}
                  className="rounded-xl"
                />
                <div className="bg-white"></div>
                <Image
                  src={card2}
                  alt="Configurable Question Sets"
                  width={300}
                  height={150}
                  className="rounded-xl"
                />
                <Image
                  src={card3}
                  alt="Answer Explanations"
                  width={300}
                  height={150}
                  className="rounded-xl "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
