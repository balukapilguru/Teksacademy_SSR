import React from "react";
import Link from "next/link";
import Image from "next/image";
import GetData from "@/utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";

const formatIndianRupees = (num) => {
  if (!num) return "0";
  const number =
    typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;
  return number.toLocaleString("en-IN");
};

const CourseCard = ({ course, onGetDetailsClick }) => {
  if (!course) return <div>No course data available.</div>;

  const buttons = course.button || [];
  const isSingle = buttons.length === 1;

  return (
    <div className="">
      <div
        className="group rounded-xl bg-white overflow-hidden 
             shadow-[0_4px_14px_rgba(0,0,0,0.08)] 
             border border-transparent hover:border-[#ba3148] transition-all duration-300"
      >
        {/* IMAGE WRAPPER */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={GetData({ url: course?.image?.src })}
            alt={course.heading}
            
            height={288}
            width={192}
            className="object-cover transition-all duration-500 
                 group-hover:blur-0 h-48 w-full group-hover:brightness-100"
          />

          <div
            className="absolute inset-0 bg-black/10
                 transition-all duration-500 
                 group-hover:bg-black/0 group-hover:backdrop-blur-0"
          />
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="h-12 text-lg font-semibold text-[#162f51] leading-snug line-clamp-2">
            {course.heading}
          </h3>

          {/* Fee & Duration */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#faf2ec] rounded-lg p-2">
              <div className="text-xs text-gray-600">Fee Range</div>
              <div className="text-[#ba3148] text-sm mt-1 font-semibold">
                {course.feeRange}
              </div>
            </div>

            <div className="flex-1 bg-[#eef4ff] rounded-lg p-2">
              <div className="text-xs text-gray-600">Duration</div>
              <div className="text-[#1d3b70] text-sm mt-1 font-semibold">
                {course.duration}
              </div>
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
                <span
                  key={i}
                  className={`text-xs px-3 py-1 rounded-md font-medium border ${bgColor} ${textColor} border-transparent`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Buttons */}
          <div
            className={`flex gap-4 mt-4 mb-1 ${
              isSingle ? "justify-center" : "justify-between"
            }`}
          >
            {buttons.slice().reverse().map((btn, index) => (
              <PrimaryButton
                key={index}
                variant={btn.form ? "filled" : "outline"}
                label={btn.name}
                href={btn.link || null}
                className={isSingle ? "w-full" : "flex-1"} // ✅ Full width if single
                onClick={() =>
                  btn.form && onGetDetailsClick(course.heading, course)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

