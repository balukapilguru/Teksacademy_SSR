"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/app/assets/course-banner/bgt3.png";
import Particles from "../coursePage/Particles";
import GetData from "@/utility/GetData";
import Bannerheading from "@/utility/Bannerheading";
import PrimaryButton from "@/utility/PrimaryButton";
import Popupform from "../clientcomponents/forms/Popupform";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

const Banner = ({
  data,
  formDetails,
  courseLabel = "",
  category = false,
  branch = "",
  isSelfPaced = false,
}) => {
  const normalizeCourseLabel = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      const firstValue = value.find(
        (item) => item !== undefined && item !== null,
      );
      return normalizeCourseLabel(firstValue);
    }
    if (typeof value === "object") {
      return (
        value.heading ||
        value.programName ||
        value.courseName ||
        value.course ||
        value.title ||
        value.name ||
        ""
      );
    }
    return "";
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseLabel || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!data) return null;

  const handleOpenModal = () => {
    const courseObj =
      courseLabel ||
      normalizeCourseLabel(data?.banner?.name) ||
      normalizeCourseLabel(formDetails) ||
      branch ||
      "";

    setSelectedCourse(courseObj);
    setShowModal(true);
  };

  const handleFormSubmit = async (formValues, mappedPayload) => {
    setIsSubmitting(true);
// console.log(mappedPayload,"branchcoure")
    try {
      const response = await fetch(
        buildApiUrl(blogsApplyBaseUrl, "/lead/create"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mappedPayload),
        },
      );

      const responseData = await response.json();
      // {
      //   console.log(mappedPayload, "mappedPayload:");
      // }
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      setShowModal(false);
      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  const rating = parseFloat(data?.bannerrating);
  const review = parseFloat(data?.bannerRiview);
  return (
    <div className="relative main_container rounded-2xl text-white overflow-hidden">
      {/* Popup */}
      {showModal && (
        <Popupform
          show={showModal}
          onClose={() => !isSubmitting && setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourse}
          university={branch}
          course_branch={branch}
          source={30}
          title="Request a Demo"
          subtitle="Fill in your details to get course guidance and a callback from our team."
          onSubmit={handleFormSubmit}
          formType="RequestDemo"
          buttonText="Request a Demo"
          successMessage="Thank you! We'll contact you soon."
        />
      )}
      {/* {console.log(formDetails, courseLabel, branch, "courseLabel:")} */}

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0028] via-[#011338] to-[#1a0033] z-0" />

      <div className="absolute w-full inset-0 z-0 hidden md:block">
        <Image
          src={bgImage}
          alt="Background Pattern"
          width={1194}
          height={403}
          className="object-cover opacity-40 mix-blend-screen"
          priority
        />
      </div>

      <Particles />

      <div className="relative z-10 max-w-8xl pl-4 pr-2 lg:pr-0 grid grid-cols-1 lg:grid-cols-2 lg:gap-10 items-center">
        {/* LEFT */}
        <div className="md:pl-8 mt-2">
          <Bannerheading
            text={data.mainHeading}
            data={data?.mainHeading}
            className="mt-4"
          />

          {data.description ? (
            <div className="mt-2 text-gray-300 text-base text-justify sm:text-lg leading-relaxed">
              {data.description}
            </div>
          ) : data.desc ? (
            <div className="mt-2 text-gray-300 text-base sm:text-lg leading-relaxed">
              {data.desc}
            </div>
          ) : (
            <div className="mt-2 text-gray-300 text-base sm:text-lg leading-relaxed">
              Step into the tech world with industry-ready Full Stack expertise.
            </div>
          )}

          {/* ⭐ FIXED: Rating OUTSIDE condition */}
          {!isNaN(rating) && rating > 0 && (
            <div className="mt-4 flex items-center gap-2 text-white font-medium">
              <span className="text-lg">{rating.toFixed(1)}</span>

              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              {!isNaN(review) && review > 0 && (
                <span className="text-gray-300 text-sm">{review} Reviews</span>
              )}
            </div>
          )}

          {/* CTA */}
          {data.button && !category && !isSelfPaced && (
            <div className="mt-2 lg:mb-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-4">
                <PrimaryButton
                  variant="light"
                  className="text-lg"
                  onClick={handleOpenModal}
                >
                  {data.button.name}
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* Secondary Button */}
          <button
            className="mt-3 mb-3 cursor-pointer lg:mb-4 flex flex-wrap gap-4 text-lg bg-transparent border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition-colors duration-300"
            onClick={handleOpenModal}
          >
            Request a Demo
          </button>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex justify-center md:justify-end relative">
          <div className="w-full max-w-lg">
            <Image
              src={GetData({ url: data?.bannerImage?.src })}
              alt={data.imageAlt || "Course Banner"}
              width={800}
              height={600}
              className="w-full h-auto object-contain rounded-md z-10"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
