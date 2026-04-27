"use client";
import React from "react";
import Link from "next/link";

const MostSearchedTerms = ({ data }) => {
  if (!data || !data.locations?.length || !data.courses?.length) {
    return (
      <section className="bg-[#0E2849] border border-[#0E2849] rounded-lg py-6 flex justify-center items-center">
        <div className="text-white text-center text-sm md:text-base">
          No most searched terms available
        </div>
      </section>
    );
  }

  const { locations, courses } = data;

  return (
    <section className=" bg-[#0E2849] " aria-label="Most Searched Terms">
      <div className="px-4  md:px-6 xl:px-0 py-4 lg:py-6 xl:py-6 main_container">

        {/* Locations */}
        <h3 className="p-2 font-inter font-medium text-[1rem] xl:text-[1.2rem] 2xl:text-[1.4rem] pb-2 leading-relaxed tracking-wide text-white">
          {locations.join(" | ")}
        </h3>

        {/* Courses */}
        <div className="p-2 flex flex-wrap items-center gap-1 ">
          {courses.map((course, index) => {
            const slug = course
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]+/g, "");

            return (
              <span key={index} className="flex items-center max-w-7xl">
               
                  <span className="text-white hover:text-blue-300 font-thin text-lg  transition-colors duration-200">
                    {course}
                  </span>
              
                {courses.length !== index + 1 && (
                  <span className="mx-1 text-white hidden md:block">|</span>
                )}
              </span>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default MostSearchedTerms;

