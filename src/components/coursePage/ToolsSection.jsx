"use client";

import React, { useState } from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
import { FaArrowRightLong } from "react-icons/fa6";

export default function ToolsAndFeatures({ data }) {
  if (!data) return null;

  const { heading = [], roles = [] } = data;
const [visibleCount, setVisibleCount] = useState(4);
const [expanded, setExpanded] = useState(false);
  // Safety checks
  if (!Array.isArray(roles) || roles.length === 0) {
    return (
      <div className="py-10 text-center text-gray-600">
        No tools or features available.
      </div>
    );
  }

  return (
    <div className="md:py-10">
      <div className="">
        {/* Section Heading */}
        
          <div className="">
            <Heading data={heading} />
          </div>
        

        {/* Tools Grid */}
      {/* Tools Grid */}
<div className="bg-white rounded-2xl shadow-md p-6">

  {/* ✅ Desktop / Tablet (md and above → show ALL) */}
  <div className="hidden md:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-8 md:gap-x-4 md:gap-y-6">
    {roles.map((tool, index) => {
      const imageSrc =
        tool?.image?.src && tool.image.src.startsWith("/")
          ? GetData({ url: tool.image.src })
          : tool?.image?.src || "/placeholder.png";

      return (
        <div key={index} className="flex flex-col items-center group hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-200">
            <Image
              src={imageSrc}
              alt={tool.image?.alt || tool.name || "Tool"}
              width={100}
              height={100}
              className="object-contain p-2"
              priority
            />
          </div>
          <span className="text-gray-800 font-semibold text-center text-sm md:text-base capitalize">
            {tool.name}
          </span>
        </div>
      );
    })}
  </div>

  {/* ✅ Mobile only (slice + buttons) */}
  <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:hidden">
    {roles.slice(0, visibleCount).map((tool, index) => {
      const imageSrc =
        tool?.image?.src && tool.image.src.startsWith("/")
          ? GetData({ url: tool.image.src })
          : tool?.image?.src || "/placeholder.png";

      return (
        <div key={index} className="flex flex-col items-center group hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-gray-200">
            <Image
              src={imageSrc}
              alt={tool.image?.alt || tool.name || "Tool"}
              width={100}
              height={100}
              className="object-contain p-2"
              priority
            />
          </div>
          <span className="text-gray-800 font-semibold text-center text-sm capitalize">
            {tool.name}
          </span>
        </div>
      );
    })}
  </div>

  {/* ✅ Mobile Buttons ONLY */}
  <div className="flex justify-center mr-4 mt-6 md:hidden">
    {!expanded && visibleCount < roles.length && (
      <button
        onClick={() => {
          const newCount = visibleCount + 4;
          setVisibleCount(newCount);
          if (newCount >= roles.length) setExpanded(true);
        }}
        className="bg-[#2a619d] text-white font-semibold px-3 py-2 rounded-full"
      >
        <div className="flex gap-2">  Load More<span className="mt-1.5"> <FaArrowRightLong /></span> </div>
       
      </button>
    )}

    {expanded && (
      <button
        onClick={() => {
          setVisibleCount(4);
          setExpanded(false);
        }}
        className="bg-[#2a619d] text-white font-semibold px-3 py-2 rounded-full"
      >
         <div className="flex gap-2">  Show Less<span className="mt-1.5"> <FaArrowRightLong /></span> </div>
        
      </button>
    )}
  </div>

</div>
 
      </div>
    </div>
  );
}

