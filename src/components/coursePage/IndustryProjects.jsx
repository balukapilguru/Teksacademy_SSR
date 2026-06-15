"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Heading from "../../utility/Heading";
import GetData from "@/utility/GetData";
import { FaArrowRightLong } from "react-icons/fa6";

export default function IndustryProjects({ data }) {
  const { projects, heading } = data || {};

  const [visibleCount, setVisibleCount] = useState(4);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!projects || !Array.isArray(projects)) {
    return null;
  }

  // 👉 Core fix: responsive slicing
  const visibleProjects = isMobile
    ? projects.slice(0, visibleCount)
    : projects;

  return (
    <div className="min-h-fit py-5">
      <div className="mx-auto">
        <Heading data={heading} />

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
          {visibleProjects.map((project, index) => {
            const iconSrc = project?.icon?.src;
            const iconAlt =
              project?.icon?.alt || project?.title || "Project Icon";

            const validIcon = iconSrc ? GetData({ url: iconSrc }) : null;

            return (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {validIcon ? (
                    <Image
                      src={validIcon}
                      alt={iconAlt}
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-[70px] h-[70px] bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs text-center">
                        No Icon
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="md:text-lg font-semibold text-gray-800 text-center">
                  {project.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Buttons → ONLY MOBILE */}
        {isMobile && (
          <div className="flex justify-center mr-3 mt-6">
            {!expanded && visibleCount < projects.length && (
              <button
                onClick={() => {
                  const newCount = visibleCount + 4;
                  setVisibleCount(newCount);

                  if (newCount >= projects.length) {
                    setExpanded(true);
                  }
                }}
                className="bg-[#2a619d] text-white font-semibold px-3 py-2 rounded-full"
              >
                <div className="flex gap-2">
                  Load More
                  <span className="mt-1.5">
                    <FaArrowRightLong />
                  </span>
                </div>
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
                <div className="flex gap-2">
                  Show Less
                  <span className="mt-1.5">
                    <FaArrowRightLong />
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}