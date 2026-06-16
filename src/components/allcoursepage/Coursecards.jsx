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
  const batchTitle = course.batchInfo?.title || "New Batch Starts On";
  const batchDate = course.batchInfo?.date || course.batchStartDate || course.batchDate;

  const openEnquiryPopup = () => {
    onGetDetailsClick?.(course.heading, course);
  };

  // Helper function to get tag styling
  const getTagStyles = (tag) => {
    const lowerTag = tag.toLowerCase();
    
    if (lowerTag.includes("placement") || lowerTag.includes("assistance")) {
      return {
        bgColor: "bg-[#e8f5e9]",
        textColor: "text-[#2e7d32]",
        icon: "🎯"
      };
    }
    if (lowerTag.includes("internship")) {
      return {
        bgColor: "bg-[#e3f2fd]",
        textColor: "text-[#1565c0]",
        icon: "💼"
      };
    }
    if (lowerTag.includes("certification") || lowerTag.includes("ai")) {
      return {
        bgColor: "bg-[#f3e5f5]",
        textColor: "text-[#6a1b9a]",
        icon: "🤖"
      };
    }
    if (lowerTag.includes("cyber") || lowerTag.includes("security")) {
      return {
        bgColor: "bg-[#e8eaf6]",
        textColor: "text-[#283593]",
        icon: "🛡️"
      };
    }
    return {
      bgColor: "bg-[#e6f8f1]",
      textColor: "text-[#2e7d32]",
      icon: "✨"
    };
  };

  return (
    <div className="">
      <div
        className="group rounded-xl bg-white overflow-hidden 
             shadow-[0_4px_14px_rgba(0,0,0,0.08)] 
             border border-transparent hover:border-[#2a619d] transition-all duration-300 hover:shadow-xl"
      >
        {/* IMAGE WRAPPER */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={GetData({ url: course?.image?.src })}
            alt={course.heading}
            height={288}
            width={192}
            className="object-cover transition-all duration-500 
                 group-hover:scale-105 h-48 w-full"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent
                 transition-all duration-500 
                 group-hover:bg-black/20"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-md font-bold text-[#162f51] leading-snug line-clamp-2 min-h-[48px]">
            {course.heading}
          </h3>

          {/* Fee & Duration */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#faf2ec] rounded-lg p-2">
              <div className="text-xs text-gray-500">💰 Fee</div>
              <div className="text-[#e6662a] text-sm font-bold">
                ₹{formatIndianRupees(course.feeRange)}
              </div>
            </div>

            <div className="flex-1 bg-[#eef4ff] rounded-lg p-2">
              <div className="text-xs text-gray-500">⏱️ Duration</div>
              <div className="text-[#1d3b70] text-sm font-bold">
                {course.duration}
              </div>
            </div>
          </div>

          {/* Placement & Internship - Single Line */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#e8f5e9] rounded-lg px-1 py-1.5">
              <span className="text-xs">🎯</span>
              <span className="text-[11px] font-semibold text-[#2e7d32]">Placement Assistance</span>
            </div>

            <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#d2e7f6] rounded-lg px-1 py-1.5">
              <span className="text-xs">💼</span>
              <span className="text-[11px] font-semibold  text-[#1565c0]">100% Internship</span>
            </div>
          </div>

          {/* Other Tags */}
          <div className="flex flex-wrap gap-1.5">
            {course.tags?.filter(tag => {
              const lowerTag = tag.toLowerCase();
              return !lowerTag.includes("placement") && 
                     !lowerTag.includes("assistance") && 
                     !lowerTag.includes("internship");
            }).map((tag, i) => {
              const styles = getTagStyles(tag);
              return (
                <span
                  key={i}
                  className={`text-[11px] px-2 py-1 rounded-full font-medium ${styles.bgColor} ${styles.textColor} flex items-center gap-1`}
                >
                  <span>{styles.icon}</span>
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Batch Date Button */}
          {batchDate && (
            <button
              type="button"
              onClick={openEnquiryPopup}
              className="bg-[#e6662a] hover:bg-[#d85a20] p-2 text-white rounded-lg text-sm w-full cursor-pointer text-center transition-colors font-medium"
            >
              📅 {batchTitle} :{" "}
              <span className="font-bold">
                {batchDate}
              </span>
            </button>
          )}

          {/* Buttons */}
          <div
            className={`flex gap-3 mt-2 ${isSingle ? "justify-center" : "justify-between"}`}
          >
            {buttons.slice().reverse().map((btn, index) => (
              <PrimaryButton
                key={index}
                variant={btn.form ? "filled" : "outline"}
                label={btn.name}
                href={btn.link || null}
                className={isSingle ? "w-full" : "flex-1"}
                onClick={() => btn.form && openEnquiryPopup()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;