"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReusableForm from "@/components/ReusableForm";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

const vector =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/vector.webp";
const tekslogo =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/teks_logo.webp";
const orange1 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-1.webp";
const orange2 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-2.webp";
const orange3 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-3.webp";
const orange4 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-4.webp";
const orange5 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/orange-5.webp";
const blue1 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-1.webp";
const blue2 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-2.webp";
const blue3 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-3.webp";
const blue4 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-4.webp";
const blue5 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/blue-5.webp";

const orangeItems = [
  {
    imgSrc: orange1,
    alt: "Career Guidance",
    title: "Free",
    description: "Career Guidance",
  },
  {
    imgSrc: orange2,
    alt: "Approved Curriculum",
    title: "IIT",
    description: "Approved Curriculum",
  },
  {
    imgSrc: orange3,
    alt: "Student Dashboard",
    title: "Dedicated",
    description: "Student Dashboard",
  },
  {
    imgSrc: orange4,
    alt: "& Online Trainings",
    title: "Classroom",
    description: "& Online Trainings",
  },
  {
    imgSrc: orange5,
    alt: "Recordings",
    title: "Class",
    description: "Recordings",
  },
];

const blueItems = [
  {
    imgSrc: blue1,
    alt: "Materials",
    title: "Course",
    description: "Materials",
  },
  {
    imgSrc: blue2,
    alt: "Based Assessments",
    title: "Module",
    description: "Based Assessments",
  },
  {
    imgSrc: blue3,
    alt: "On Projects",
    title: "Hands",
    description: "On Projects",
  },
  {
    imgSrc: blue4,
    alt: "Opportunity",
    title: "Internship",
    description: "Opportunity",
  },
  {
    imgSrc: blue5,
    alt: "Job Assistance",
    title: "100%",
    description: "Job Assistance",
  },
];

/* ─── Mobile Feature Pill ─────────────────────────────────── */
function FeaturePill({ imgSrc, alt, title, description, accent }) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-2 py-3 shadow-sm"
      style={{
        background: "#fff",
        border: `1.5px solid ${accent === "orange" ? "#FE543D22" : "#2A619D22"}`,
      }}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={alt}
          width={36}
          height={36}
          className="w-10 h-10 object-contain"
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="font-bold text-sm"
          style={{ color: accent === "orange" ? "#FE543D" : "#2A619D" }}
        >
          {title}
        </span>
        <span className="text-xs text-[#52525B]">{description}</span>
      </div>
    </div>
  );
}

/* ─── Desktop Feature Row ─────────────────────────────────── */
function DesktopFeatureRow({ imgSrc, alt, title, description, accent }) {
  return (
    <div className="flex items-center">
      <div className="h-16 3xl:h-20 border-r-4 border-teal-400 rounded-sm flex items-center justify-center pr-3 3xl:pr-4 flex-shrink-0">
        <Image
          width={220}
          height={260}
          src={imgSrc}
          className="scale-75 sm:scale-75 md:scale-100 lg:scale-100 w-14 h-12 3xl:w-16 3xl:h-14"
          alt={alt}
        />
      </div>
      <div className="ml-3 3xl:ml-4 flex flex-col 3xl:gap-y-2">
        <div
          className="font-semibold xs:text-[11px] sm:text-sm xl:text-xl 2xl:text-2xl 3xl:text-3xl"
          style={{ color: accent === "orange" ? "#FE543D" : "#2A619D" }}
        >
          {title}
        </div>
        <div className="text-[#52525B] font-normal xs:text-[10px] sm:text-xs 2xl:text-[14px] 3xl:text-[1rem]">
          {description}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function Excel({ data, courseName, courses = [] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  // console.log(data, "data in excel");
  const buttonText = data?.button?.text || "Request Call Back";
  const courseDisplayName = courseName || "";
  const branch =
    data?.branch || data?.branchName || data?.location || data?.center || "";
  const initialValues = {
    ...(courseDisplayName && { course: courseDisplayName }),
    ...(branch && { branch }),
  };
  const handleSubmit = async (formValues, mappedPayload) => {
    try {
      const response = await fetch(
        buildApiUrl(blogsApplyBaseUrl, "/lead/create"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mappedPayload),
        },
      );
      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || "Submission failed");

      const brochureUrl =
        data?.button?.link ||
        data?.downloadLink ||
        data?.brochureUrl ||
        data?.brochure?.url ||
        "";

      if (brochureUrl) window.open(brochureUrl, "_blank");
      router.push("/thankyou");
    } catch (error) {
      console.error("Form submission failed:", error);
      throw error;
    }
  };

  return (
    <>
      {/* ════════════════════════════════════════
                MOBILE LAYOUT  (hidden on lg+)
            ════════════════════════════════════════ */}
      <div
        className="block lg:hidden w-full"
        style={{
          background: "linear-gradient(160deg, #f8f4f2 0%, #eef4fb 100%)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center pt-5 pb-5 px-5">
          {/* Logo + title row */}
          <div className="flex items-center gap-3 mb-1">
            <Image
              src={tekslogo}
              alt="Teks Academy Logo"
              width={52}
              height={52}
              className="w-12 h-12 object-contain"
            />
            <div className="text-left">
              <h2 className="text-2xl xl:text-3xl font-medium text-black leading-tight md:text-2xl mb-4">
                Excel with{" "}
                <span className="relative inline-block text-[#2A619D]">
                  Teks&nbsp;Academy
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
          </div>
        </div>

        {/* Features grid — 2 columns */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Interleave orange + blue so the grid looks balanced */}
            {orangeItems.map((item, i) => (
              <React.Fragment key={`pair-${i}`}>
                <FeaturePill {...item} accent="orange" />
                {blueItems[i] && (
                  <FeaturePill {...blueItems[i]} accent="blue" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CTA / Floating Form */}
        <div className="px-4 pb-10">
          {!showForm ? (
            /* Collapsed CTA banner */
            <div
              className="rounded-3xl p-5 flex flex-col items-center gap-4 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #2A619D 0%, #1d4a7a 100%)",
              }}
            >
              <p className="text-white text-center text-sm font-medium leading-snug">
                Ready to take the next step?
                <br />
                <span className="text-teal-300 font-semibold">
                  Get a free callback from our experts.
                </span>
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="w-full py-3 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-95"
                style={{
                  background:
                    "linear-gradient(90deg, #FE543D 0%, #ff7a5c 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 18px #FE543D55",
                }}
              >
                {buttonText} →
              </button>

              {/* Trust badges */}
              <div className="flex items-center gap-4 mt-1">
                {["IIT Approved", "100% Placement", "Live Classes"].map(
                  (badge) => (
                    <div key={badge} className="flex items-center gap-1">
                      <span className="text-teal-400 text-xs">✓</span>
                      <span className="text-white text-[10px] font-medium">
                        {badge}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            /* Expanded inline form */
            <div
              className="rounded-3xl overflow-hidden shadow-xl"
              style={{ background: "#2A619D" }}
            >
              {/* Form header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div>
                  <p className="text-white font-bold text-base">
                    Request a Callback
                  </p>
                  <p className="text-teal-300 text-xs">
                    We&apos;ll reach out within 24 hrs
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white/60 hover:text-white text-xl leading-none"
                  aria-label="Close form"
                >
                  ✕
                </button>
              </div>

              <div className="px-3 pb-5">
                <ReusableForm
                  formType="requestCallback"
                  initialValues={initialValues}
                  courses={courses}
                  buttonText={buttonText}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl p-4"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
                DESKTOP LAYOUT  (hidden below lg) — unchanged
            ════════════════════════════════════════ */}
      <div className="hidden lg:block xs:bg-[url('https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel_bg.webp')] bg-cover bg-center">
        <div className="main_container">
          <div className="flex flex-col items-center my-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 w-full pb-4">
              {/* Title */}
              <div className="lg:col-span-12 flex justify-center mt-4">
                <span className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
                  <span>Excel with&nbsp;</span>
                  <span className="relative inline-block text-[#2A619D]">
                    Teks&nbsp;Academy
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
                </span>
              </div>

              {/* Logo */}
              <div className="lg:col-span-2">
                <div className="flex items-center h-full justify-center">
                  <Image
                    width={250}
                    height={200}
                    src={tekslogo}
                    className="w-auto h-36 sm:h-40 lg:h-44 xl:h-52 2xl:h-72 3xl:h-80"
                    alt="teks-academy logo"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="lg:col-span-6">
                <div className="flex justify-center h-full lg:px-4 xl:px-0 gap-x-2 xl:gap-x-6 2xl:gap-x-24 3xl:gap-x-28 items-center relative">
                  {/* Orange column */}
                  <div className="flex items-center">
                    <div className="flex flex-col gap-y-4 2xl:gap-y-8 3xl:gap-y-10">
                      {orangeItems.map((item, index) => (
                        <DesktopFeatureRow
                          key={index}
                          {...item}
                          accent="orange"
                        />
                      ))}
                    </div>
                  </div>
                  {/* Blue column */}
                  <div className="flex items-center">
                    <div className="flex flex-col gap-y-4 2xl:gap-y-8 3xl:gap-y-10">
                      {blueItems.map((item, index) => (
                        <DesktopFeatureRow
                          key={index}
                          {...item}
                          accent="blue"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-4 w-full">
                <div className="flex relative items-center h-full w-full justify-center xl:justify-end">
                  <div
                    className="absolute hidden xl:block top-1/2 -translate-y-1/2 left-3 lg:left-32 xl:left-2 2xl:left-6 h-[320px] 2xl:h-[380px] 3xl:h-[420px] border-r-[3px] border-[#FE543D]
                                        before:content-[''] before:absolute before:left-[-7px] before:top-[-8px] before:w-4 before:h-4 before:bg-[#FE543D] before:rounded-full
                                        after:content-[''] after:absolute after:left-[-7px] after:bottom-[-6px] after:w-4 after:h-4 after:bg-[#FE543D] after:rounded-full"
                  ></div>
                  <div className="w-full">
                    <div className="bg-[#2A619D] p-1 px-6 2xl:p-10 mx-7 sm:mx-14 lg:mx-2 xl:ml-10 2xl:ml-16 3xl:ml-28 xl:mr-0 rounded-lg">
                      <ReusableForm
                        formType="requestCallback"
                        initialValues={initialValues}
                        courses={courses}
                        buttonText={buttonText}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl p-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
