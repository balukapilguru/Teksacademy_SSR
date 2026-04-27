"use client";

import React from "react";
import Image from "next/image";
import GetData from "@/utility/GetData";
import Link from "next/link";
import PrimaryButton from "@/utility/PrimaryButton";

const TabsCards = ({ courses, onGetDetailsClick }) => {
  if (!courses || courses.length === 0) return <p>No courses available.</p>;

  return (
    <div className="">
      {courses.map((course, index) => (
        <div key={index} className="group rounded-xl shadow-md border border-transparent hover:border-[#b3727d] bg-white overflow-hidden transition-all duration-300">

          {/* Course Image */}
          {course.courseImage && (
            <div className="relative overflow-hidden rounded-t-xl w-full h-48">
              <Image
                src={GetData({ url: course.courseImage })}
                alt={course.heading || "Course Image"}
                width={276}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 space-y-4">

            {/* Title */}
            <h3 className="text-lg font-semibold h-11 text-[#162f51] leading-snug line-clamp-2">
              {course.heading}
            </h3>

            {/* Fee & Duration */}
            <div className="flex gap-3">
              <div className="flex-1 bg-[#faf2ec] rounded-lg p-2">
                <p className="text-xs text-gray-600">Fee Range</p>
                <p className="text-[#ba3148] font-semibold">{course.feeRange}</p>
              </div>
              <div className="flex-1 bg-[#eef4ff] rounded-lg p-2">
                <p className="text-xs text-gray-600">Duration</p>
                <p className="text-[#1d3b70] font-semibold">{course.duration}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {course.tags?.map((tag, i) => {
                let bgColor = "";
                let textColor = "";
                if (tag.toLowerCase().includes("placement")) {
                  bgColor = "bg-[#f8efe9]";
                  textColor = "text-[#8d6420]";
                } else if (tag.toLowerCase().includes("no cost emi")) {
                  bgColor = "bg-[#e6f8f1]";
                  textColor = "text-[#2e7d32]";
                }
                return (
                  <span key={i} className={`text-xs px-3 py-1 rounded-md font-medium border ${bgColor} ${textColor} border-transparent`}>
                    {tag}
                  </span>
                );
              })}
            </div>

            {/* Buttons - Fixed Layout */}
            <div className="flex justify-between gap-4 mt-4 mb-1">
              {course.button?.slice().reverse().map((btn, index) => (
                <PrimaryButton
                  key={index}
                  variant={btn.form ? "filled" : "outline"}
                  label={btn.name}
                  href={btn.link || null}
                  onClick={() => btn.form && onGetDetailsClick(course.heading, course)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabsCards;
