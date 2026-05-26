"use client";
import React, { useState } from "react";
import Image from "next/image";
import bgImage from "@/app/assets/course-banner/bgt3.png";
import Particles from "../coursePage/Particles";
import GetData from "@/utility/GetData";
import Bannerheading from "@/utility/Bannerheading";
import PrimaryButton from "@/utility/PrimaryButton";
import ReusableForm from "../ReusableForm";
import Popupform from "../clientcomponents/forms/Popupform";

const handleSubmit = async (formValues, mappedPayload) => {
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

    router.push("/thankyou");
  } catch (error) {
    console.error("Submission error:", error);
    throw error;
  }
};

const Banner = ({
  data,
  formDetails,
  category = false,
  branch = "course",
  isSelfPaced = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(formDetails);

  if (!data) return null;

  const handleOpenModal = (details) => {
    setSelectedCourse(details);
    setShowModal(true);
  };

  return (
    <div className="relative main_container rounded-2xl text-white overflow-hidden">
      {/* Popupform for regular courses — rendered outside layout (modal) */}
      {!category && !isSelfPaced && (
        <Popupform
          show={showModal}
          onClose={() => setShowModal(false)}
          course={branch}
          courseName={selectedCourse}
          source={30}
        />
      )}

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0028] via-[#011338] to-[#1a0033] z-0" />

      {/* Background Image */}
      <div className="absolute inset-0 z-0 hidden md:block">
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

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-start">
        {/* LEFT COLUMN — heading, description, button */}
        <div className="p-4">
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
        </div>

        {/* RIGHT COLUMN — form (category/selfPaced) OR banner image (regular course) */}
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