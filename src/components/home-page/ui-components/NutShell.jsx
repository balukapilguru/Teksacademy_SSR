"use client";

import GetData from "@/utility/GetData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import Popupform from "@/components/clientcomponents/forms/Popupform";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

export default function Nutshell({ data, courseData, courseName = "" }) {
  const { title, services, button, image } = data || {};
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const isBFSI = courseData?.coursename === "BFSI-Course";
  const selectedCourse =
    courseName ||
    courseData?.coursename ||
    courseData?.courseName ||
    courseData?.name ||
    "";

  const handleSubmit = async (_formValues, mappedPayload) => {
    
    try {
      const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedPayload),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Submission failed");
      setShowModal(false);
      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  return (
    <div className="main_container md:pb-5">
      {showModal && (
        <Popupform
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourse}
          title="Request Callback"
          subtitle="Fill in your details and our team will call you back shortly."
          onSubmit={handleSubmit}
          formType="requestCallback"
          buttonText="Request Callback"
          successMessage="Thank you! We'll contact you soon."
        />
      )}

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on md+)
      ══════════════════════════════════════════════ */}
      <div className="block md:hidden px-4 py-6">

        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            {title?.[0]}
           
             <span className="relative inline-block text-[#2A619D]">
                  {title?.[1]}
                  <svg
                    className="absolute left-0 -bottom-2 w-full h-[14px]"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 10 Q50 0 98 10"
                      stroke="orangered"
                      strokeWidth="2"
                      fill="transparent"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
          </h2>
        </div>

        {/* 1 — Mobile image full width */}
        <div className="mb-5 flex justify-center ">
          <Image
            src={GetData({ url: image?.mobile })}
            alt={image?.alt}
            width={500}
            height={500}
            className="w-[88%] rounded-2xl"
          />
        </div>

        {/* 2 — Table: [number] | [icon + content full width] */}
        <div className="flex flex-col">
          {services?.map((item, index) => {
            const isLast = index === services.length - 1;
            const words = item.title.split(" ");

            return (
              <div key={index}>
                {/* Row: 2 columns only — number | full-width content */}
                <div
                  className="grid items-center gap-2"
                  style={{ gridTemplateColumns: "28px 1fr" }}
                >
                  {/* LEFT — Number badge */}
                  <div
                    className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 ${
                      isLast ? "bg-[#2A619D]" : "bg-[#FE543D]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* RIGHT — Icon + content chip, full width */}
                  <div
                    className={`flex items-center gap-2 rounded-[10px] px-3 py-[10px] border w-full ${
                      isLast
                        ? "bg-[#EDF3FA] border-[#2A619D33]"
                        : "bg-[#FFF0EE] border-[#FE543D33]"
                    }`}
                  >
                    <Image
                      src={GetData({ url: item.icon.url })}
                      alt={item.icon.name}
                      width={28}
                      height={28}
                      className="w-6 h-6 object-contain flex-shrink-0"
                    />
                    <div className="flex flex-wrap text-[13px] font-medium text-gray-800 leading-snug">
                      {words.map((word, i) => {
                        const highlight =
                          word.toLowerCase().includes("technical") ||
                          word.toLowerCase().includes("interviews") ||
                          word.toLowerCase().includes("ready") ||
                          word.toLowerCase().includes("portal") ||
                          word.toLowerCase().includes("opportunity") ||
                          word.toLowerCase() === "it";
                        return (
                          <span
                            key={i}
                            className={`mr-[3px] ${
                              highlight
                                ? isLast
                                  ? "text-[#2A619D] font-bold"
                                  : "text-[#FE543D] font-bold"
                                : ""
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Connector line between rows */}
                {!isLast && (
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: "28px 1fr", gap: "8px" }}
                  >
                    <div className="flex justify-center">
                      <div className="w-[2px] h-[14px] bg-[#FE543D] opacity-25 rounded-full" />
                    </div>
                    <div />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="md:w-full py-3 px-2 md:px-0 rounded-xl border-2 border-[#2a619d] text-[#2a619d] font-bold text-sm tracking-wide hover:bg-[#2a619d] hover:text-white transition-all active:scale-[0.98]"
          >
            {button?.text || "Request Call Back"}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden below md) — unchanged
      ══════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col items-center">

        {/* Heading */}
        <div className="my-6 text-center">
          <h2 className="text-xl md:text-3xl font-semibold">
            {title?.[0]}
           
             <span className="relative inline-block text-[#2A619D]">
                 {title?.[1]}
                  <svg
                    className="absolute left-0 -bottom-2 w-full h-[14px]"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 10 Q50 0 98 10"
                      stroke="orangered"
                      strokeWidth="2"
                      fill="transparent"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6 px-4 w-full">

          {/* LEFT — Service list */}
          <div className="space-y-6 xl:mt-10">
            {services?.map((item, index) => {
              const words = item.title.split(" ");
              return (
                <div key={index} className="flex items-center gap-3">
                  <Image
                    src={GetData({ url: item.icon.url })}
                    alt={item.icon.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 object-fill"
                  />
                  <div className="flex flex-wrap items-end text-sm md:text-xl">
                    {words.map((word, i) => {
                      const highlight =
                        word.toLowerCase().includes("technical") ||
                        word.toLowerCase().includes("interviews") ||
                        word.toLowerCase().includes("Ready") ||
                        word.toLowerCase().includes("portal") ||
                        word.toLowerCase().includes("it");
                      return (
                        <span
                          key={i}
                          className={`mr-1 ${highlight ? "text-[#FE543D] font-medium" : ""}`}
                        >
                          {word}
                        </span>
                      );
                    })}
                    {index !== services.length - 1 && (
                      <FaArrowDownLong className="ml-2 text-[#FE543D]" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 mb-4 px-6 py-2 border border-[#2a619d] text-[#2a619d] rounded-lg hover:bg-[#2a619d] hover:text-white transition"
            >
              {button?.text || "Request Callback"}
            </button>
          </div>

          {/* RIGHT — Desktop image */}
          <div className="flex justify-center items-center mb-6 lg:mb-0">
            <Image
              src={GetData({ url: image?.mobile })}
              alt={image?.alt}
              width={500}
              height={500}
              className="lg:hidden w-[80%]"
            />
            <Image
              src={GetData({ url: isBFSI ? image?.desktop : image?.desktop })}
              alt={image?.alt}
              width={700}
              height={700}
              className="hidden lg:block w-[90%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}