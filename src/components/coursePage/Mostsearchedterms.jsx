"use client";
import React from "react";
import FooterAdressbar from "../FooterAdressbar";

const MostSearchedTerms = ({ data }) => {
  if (!data || !data.courses?.length) {
    return null;
  }

  const { courses } = data;

  return (
    <section className="bg-[#0E2849]" aria-label="Most Searched Terms">
      <div className=" md:px-6 xl:px-0 py-4 lg:py-6 xl:py-6 main_container">
         {/* <h2 className="text-start text-2xl md:text-3xl font-semibold text-white mb-3">
          Search <span className="text-[#7db7f0]">Terms</span>
        </h2> */}
        <div className="p-2 flex flex-wrap items-center gap-1">
          {courses.map((course, index) => {
            const slug = course
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]+/g, "");

            return (
              <span key={index} className="flex items-center max-w-8xl">
                <span className="text-white hover:text-blue-300 font-thin lg:text-xl transition-colors duration-200">
                  {course}
                </span>
                {courses.length !== index + 1 && (
                  <span className="mx-1 text-white hidden md:block">|</span>
                )}
              </span>
            );
          })}
        </div>
        {/* <FooterAdressbar branchData={data.branches} /> */}
      </div>
    </section>
  );
};

export default MostSearchedTerms;
