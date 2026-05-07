"use client";
import Heading from "@/utility/Heading";
import React, { useState } from "react";
import {
  FiCalendar,
  FiAlertCircle,
  FiCreditCard,
  FiRefreshCcw,
  FiGlobe,
} from "react-icons/fi";

const FAQ = ({ faq }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const [error, setError] = useState(null);

  const iconConfig = [
    { icon: FiRefreshCcw, color: "text-green-500" },
    { icon: FiAlertCircle, color: "text-orange-500" },
    { icon: FiCreditCard, color: "text-green-600" },
    { icon: FiCalendar, color: "text-[#DC57A3]" },
    { icon: FiRefreshCcw, color: "text-blue-500" },
    { icon: FiGlobe, color: "text-yellow-500" },
  ];

  const renderIcon = (index) => {
    const { icon: IconComponent, color } = iconConfig[index % iconConfig.length];
    return <IconComponent className={`${color} w-5 h-5 mr-3 flex-shrink-0`} />;
  };

  const toggleFAQ = (index) =>
    setActiveIndex(activeIndex === index ? null : index);

  const head = ["Frequently asked", "Questions"];

  if (error) {
    return (
      <div className="max-w-8xl mx-auto ">
        <div className="pl-3">
          <Heading data={faq?.heading} />
        </div>

        <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="max-w-3xl mx-auto my-16 px-4">
        <Heading data={faq?.heading} />

        <div className="text-center py-8 text-gray-500">
          No FAQs available at the moment.
        </div>
      </div>
    );
  }

  return (
    <section id="questionSection">
      <div className=" px-2 lg:px-5 py-3">
        <div className="py-4">
          <Heading data={faq?.heading} />
        </div>

        <div className="rounded-lg border-gray-200 border shadow-md ">
          {faq.faq.map((item, index) => (
            <div
              key={index}
              className={`overflow-hidden duration-200 ${index !== faq.faq.length - 1 ? "border-b border-gray-200" : ""
                }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="hover:bg-red-50  w-full flex items-center justify-between px-5 lg:px-6 py-4 text-left transition-colors duration-150"
                aria-expanded={activeIndex === index}
              >
                <div className="flex items-center gap-2 flex-1">
                  {renderIcon(index)}
                  <span className="hover:text-[#ea6329] font-semibold text-gray-800 text-md lg:text-lg">
                    {item.question}
                  </span>
                </div>
                <div
                  className={`transform transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""
                    }`}
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${activeIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
                  } overflow-hidden`}
              >
                <div className="">
                 <div className="my-2 ps-4 justify-text text-gray-600 leading-snug  pb-2 lg:ps-16">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default FAQ;
