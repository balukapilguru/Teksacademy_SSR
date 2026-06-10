import React from "react";
import Image from "next/image";
import GetData from "@/utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";

const getCourseLink = (course) => {
  if (course.link) return course.link;
  if (course.slug) return `/courses/${course.slug}`;
  if (course.programName) return `/courses/${course.programName}`;
  return "/course";
};

const getImageUrl = (image) => {
  if (!image) return "/assets/img/excel/teks_logo.webp";
  if (typeof image === "string") return image;

  return (
    image.src ||
    image.url ||
    image.desktop ||
    image.mobile ||
    "/assets/img/excel/teks_logo.webp"
  );
};

const getResolvedImageUrl = (url) => {
  if (!url) return GetData({ url: "/assets/img/excel/teks_logo.webp" });
  if (url.startsWith("http") || url.startsWith("/_next")) return url;
  return GetData({ url });
};

const BranchCoursecards = ({ course, onGetDetailsClick }) => {
  if (!course) return <div>No course data available.</div>;

  const title =
    course.heading ||
    course.title ||
    course.name ||
    course.programName ||
    "Course";
  const imageSrc = getImageUrl(course.image);
  const feeRange = course.feeRange || course.fees || course.price || "Contact us";
  const duration = course.duration || course.courseDuration || "Flexible";
  const batchTitle = course.batchInfo?.title || "New Batch Starts On";
  const batchDate =
    course.batchInfo?.date ||
    course.batchStartDate ||
    course.batchDate ||
    course.nextBatchDate;
  const buttons = course.button || course.buttons || [
    { name: "Get Details", form: true },
    { name: "View Course", link: getCourseLink(course) },
  ];
  const isSingle = buttons.length === 1;

  const openEnquiryPopup = () => {
    onGetDetailsClick?.(title, course);
  };

  return (
    <div>
      <div
        className="group rounded-xl bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#2a619d] transition-all duration-300"
      >
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={getResolvedImageUrl(imageSrc)}
            alt={title}
            height={288}
            width={192}
            className="object-cover transition-all duration-500 group-hover:blur-0 h-48 w-full group-hover:brightness-100"
          />

          <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/0 group-hover:backdrop-blur-0" />
        </div>

        <div className="p-3 space-y-2">
          <h3 className="h-12 text-lg font-semibold text-[#162f51] leading-snug line-clamp-2">
            {title}
          </h3>

          <div className="flex gap-3">
            <div className="flex-1 bg-[#faf2ec] rounded-lg p-2">
              <div className="text-xs text-gray-600">Fee Range</div>
              <div className="text-[#2a619d] text-sm mt-1 font-semibold">
                {feeRange}
              </div>
            </div>

            <div className="flex-1 bg-[#eef4ff] rounded-lg p-2">
              <div className="text-xs text-gray-600">Duration</div>
              <div className="text-[#1d3b70] text-sm mt-1 font-semibold">
                {duration}
              </div>
            </div>
          </div>

          {batchDate && (
            <div className="flex flex-wrap gap-2 text-center">
              <button
                type="button"
                onClick={openEnquiryPopup}
                className="bg-[#e6662a] hover:bg-[#d85a20] p-2 pl-2 text-white rounded-md text-sm w-full cursor-pointer transition-colors"
              >
                {batchTitle} :{" "}
                <span className="font-bold pl-2 pr-2 text-sm text-white">
                  {batchDate}
                </span>
              </button>
            </div>
          )}

          <div
            className={`flex gap-4 mb-1 ${
              isSingle ? "justify-center" : "justify-between"
            }`}
          >
            {buttons.slice().reverse().map((btn, index) => (
              <PrimaryButton
                key={index}
                variant={btn.form ? "filled" : "outline"}
                label={btn.name || btn.text}
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

export default BranchCoursecards;
