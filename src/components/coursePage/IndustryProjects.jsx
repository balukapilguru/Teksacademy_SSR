"use client";

import React from "react";
import Image from "next/image";
import Heading from "../../utility/Heading";
import GetData from "@/utility/GetData"; // Import GetData

export default function IndustryProjects({ data }) {
  const { projects, heading } = data || {};

  if (!projects || !Array.isArray(projects)) {
    return null;
  }

  return (
    <div className="min-h-fit py-5">
      <div className="max-w-8xl mx-auto  px-9">
        <div className="mb-8 px-4 md:px-0">
          <div className="">
            <Heading data={heading} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => {
              // Extract the src string from the icon object
              const iconSrc = project?.icon?.src;
              const iconAlt = project?.icon?.alt || project?.title || "Project Icon";
              
              // Get the full URL using GetData
              const validIcon = iconSrc ? GetData({ url: iconSrc }) : null;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    {validIcon ? (
                      <Image
                        src={validIcon} // Pass the string URL, not the object
                        alt={iconAlt}
                        width={70}
                        height={70}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-[70px] h-[70px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs text-center">No Icon</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {project.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
