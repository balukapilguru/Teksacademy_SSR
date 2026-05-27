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
      const firstValue = value.find((item) => item !== undefined && item !== null);
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
  const [selectedCourse, setSelectedCourse] = useState(courseLabel || formDetails || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!data) return null;

  const handleOpenModal = (details) => {
    const courseObj = details || courseLabel || formDetails || null;
    console.log("Opening modal with course object:", courseObj); // Debug log
    setSelectedCourse(courseObj);
    setShowModal(true);
  };

  const handleFormSubmit = async (formValues, mappedPayload) => {
    setIsSubmitting(true);
    console.log("Mapped payload being sent:", mappedPayload);

    try {
      const response = await fetch("https://apierp.infozit.com/lead/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

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

  return (
    <div className="relative main_container rounded-2xl text-white overflow-hidden">
      {/* Debug log to check if Popupform renders */}
      {console.log("Modal state:", showModal)}
      
      {/* Popupform for all pages when modal is open */}
      {showModal && (
        <Popupform
          show={showModal}
          onClose={() => !isSubmitting && setShowModal(false)}
          course={selectedCourse || courseLabel || formDetails || branch}
          courseName={selectedCourse || courseLabel || formDetails}
          source={30}
          title={"Enroll Now"}
          subtitle="Fill in your details to get course guidance and a callback from our team."
          onSubmit={handleFormSubmit}
          formType="EnrollNow"
          buttonText={"Enroll Now"}
          successMessage="Thank you! We'll contact you soon."
        />
      )}

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0028] via-[#011338] to-[#1a0033] z-0" />

      {/* Background Image */}
      <div className="absolute w-full inset-0 z-0 hidden md:block ">
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

      <div className="relative z-10 max-w-8xl pl-4 pr-2  lg:pr-0 lg:pt-0 lg:pb-0 grid grid-cols-1  lg:grid-cols-2 lg:gap-10 items-center">
        {/* LEFT COLUMN */}
        <div className="pl-8 mt-2 lg:pt-0">
          <Bannerheading
            text={data.mainHeading}
            data={data?.mainHeading}
            className="mt-4"
          />

          {data.description && (
            <div className="mt-2 text-gray-300 text-base text-justify sm:text-lg leading-relaxed">
              {data.description}
            </div>
          )}

          {data.desc && !data.description && (
            <div className="mt-2 text-gray-300 text-base sm:text-lg leading-relaxed">
              {data.desc}
            </div>
          )}

          {!data.description && !data.desc && (
            <div className="mt-2 text-gray-300 text-base sm:text-lg leading-relaxed">
              Step into the tech world with industry-ready Full Stack expertise.
            </div>
          )}

          {data.button && !category && !isSelfPaced && (
            <div className="mt-4 lg:mb-4 flex flex-wrap gap-4">
              <PrimaryButton
                variant="light"
                className="text-lg"
                onClick={() => handleOpenModal(formDetails)}
              >
                {data.button.name}
              </PrimaryButton>
            </div>
          )}
          
          <button 
            className="mt-6 cursor-pointer lg:mb-4 flex flex-wrap gap-4 text-lg bg-transparent border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition-colors duration-300" 
            onClick={() => handleOpenModal(formDetails)}
          >
            Enroll Now
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex justify-center md:justify-end relative lg:mt-0">
          <div className="w-full max-w-lg md:max-w-lg">
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