"use client";

import React from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";

export default function ToolsAndFeatures({ data }) {
  if (!data) return null;

  const { heading = [], roles = [] } = data;

  // Safety checks
  if (!Array.isArray(roles) || roles.length === 0) {
    return (
      <div className="py-10 text-center text-gray-600">
        No tools or features available.
      </div>
    );
  }

  return (
    <div className="min-h-fit py-10 bg-gray-50">
      <div className=" max-w-8xl mx-auto px-6">
        {/* Section Heading */}
        
          <div className="">
            <Heading data={heading} />
          </div>
        

        {/* Tools Grid */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-8 md:gap-x-4 md:gap-y-6">
            {roles.map((tool, index) => {
              // Construct valid AWS image URL
              const imageSrc =
                tool?.image?.src && tool.image.src.startsWith("/")
                  ? GetData({ url: tool.image.src })
                  : tool?.image?.src || "/placeholder.png";

              return (
                <div
                  key={index}
                  className="flex flex-col items-center group hover:scale-105 transition-transform duration-300"
                >
                  <div
                    className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-50 to-gray-100
                    rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md 
                    transition-all duration-300 border border-gray-200"
                  >
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
        </div>
      </div>
    </div>
  );
}

