"use client";
import React from "react";
import Image from "next/image";


import industry from "@/app/assets/embrance/industry.png";
import salary from "@/app/assets/embrance/salary.png";
import revenue from "@/app/assets/embrance/revenue.png";
import growth from "@/app/assets/embrance/growth.png";
import Heading from "@/utility/Heading";

const Oppurtunities = ({ data }) => {
  if (!data) return null;

  const fixedImages = [industry, salary, revenue, growth];

  const { heading = [], subHeading = "", sections = [] } = data;

  return (
    <div className="h-full  p-2 lg:p-6 rounded-2xl pt-6 pb-6 ">
      {/* Header */}
       <Heading data={heading}/>
        <div
         className="text-[#c41e3a] text-2xl xl:text-3xl font-semibold mb-8 text-start">
            {subHeading}
          </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <div key={index}>
            <div className="bg-white rounded-md shadow-sm p-4 h-64 lg:h-52 xl:h-44 w-full duration-300 border-l-4 border-blue-900">
              <div className="flex">
                {/* ✅ Fixed Image for Each Card */}
                <div className="flex items-center justify-center">
                  <div className="bg-blue-100 border-blue-200 border-2 h-16 w-16 p-3 rounded-full mr-4 flex items-center justify-center">
                    <Image
                      src={fixedImages[index % fixedImages.length]}
                      alt={section.title || "opportunity"}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                
                <div>
                  <h3 className="text-xl sm:text-2xl font-medium text-[#002e82]">
                    {section.title}
                  </h3>
                  <div className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
                    {section.data}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Oppurtunities;

