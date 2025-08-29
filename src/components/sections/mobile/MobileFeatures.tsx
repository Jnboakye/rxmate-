"use client";
import React, { useState } from "react";
import Image from "next/image";
import Wrapper from "@/components/shared/wrapper";
import phonemockup from "@/assets/phonemockup.svg";
import phonemockup2 from "@/assets/phonemockup2.svg";
import phonemockup3 from "@/assets/phonemockup3.svg";


const Features = () => {
  const [activeTab, setActiveTab] = useState("Topic Overview");

  const tabs = [
    {
      name: "Explanations",
      title: "Answer Explanations",
      description:
        "Learn from your mistakes with detailed explanations for every question.",
      image: phonemockup2,
    },
    {
      name: "Topic Overview",
      title: "Answer Explanations",
      description:
        "Quickly revise key concepts with our comprehensive topic summaries",
      image: phonemockup,
    },
    {
      name: "Question Sets",
      title: "Configurable Question Sets",
      description:
        "Take control of your learning with customizable question sets.",
      image: phonemockup3,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.name === activeTab) || tabs[1];

  const goToPrevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.name === activeTab);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    setActiveTab(tabs[prevIndex].name);
  };

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.name === activeTab);
    const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    setActiveTab(tabs[nextIndex].name);
  };

  return (
    <section className="py-16 bg-white block sm:block md:hidden lg:hidden xl:hidden relative">
      <Wrapper>
        <div className="text-center mb-12">
          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Discover Our Features
          </h2>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex max-w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 ${
                    activeTab === tab.name
                      ? "text-[#1C76FD] border-[#1C76FD]"
                      : "text-gray-600 hover:text-gray-900 border-transparent"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section with Side Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrevTab}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-lg "
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNextTab}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-[#1C76FD] hover:bg-blue-700 rounded-full transition-colors shadow-lg"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Main Content - ADJUSTED: Changed from 2-column grid to centered single column layout */}
          <div className="flex flex-col items-center px-20 space-y-8">
            {/* Text Content - ADJUSTED: Centered text instead of left-aligned */}
            <div className="text-center space-y-6 max-w-2xl">
              <h3 className="text-3xl font-bold text-gray-900">
                {activeTabData.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {activeTabData.description}
              </p>
            </div>

            {/* Phone Mockup - ADJUSTED: Moved below text content, remains centered */}
            <div className="flex justify-center">
              <div className="relative w-80 h-auto max-w-full">
                <Image
                  src={activeTabData.image}
                  alt={`${activeTabData.name} feature preview`}
                  width={320}
                  height={640}
                  className="w-full h-auto drop-shadow-2xl transition-opacity duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default Features;
