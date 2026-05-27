"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/app/assets/course-banner/bgt3.png";
import Particles from "../coursePage/Particles";
import GetData from "@/utility/GetData";
import Bannerheading from "@/utility/Bannerheading";
import PrimaryButton from "@/utility/PrimaryButton";
import Popupform from "../Popupform";


const Banner = ({
  data,
  formDetails,
  category = false,
  branch = "course",
  isSelfPaced = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(formDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!data) return null;

  const handleOpenModal = (details) => {
    console.log("Opening modal with course:", details); // Debug log
    setSelectedCourse(details);
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
      
      {/* Popupform for regular courses */}
      {!category && !isSelfPaced && (
        <Popupform
          show={showModal}
          onClose={() => !isSubmitting && setShowModal(false)}
          course={branch}
          courseName={selectedCourse}
          source={30}
          title={data?.button?.name || "Enroll Now"}
          subtitle="Fill in your details to get course guidance and a callback from our team."
          onSubmit={handleFormSubmit}
          formType="banner"
          buttonText={data?.button?.name || "Enroll Now"}
          successMessage="Thank you! We'll contact you soon."
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
        {/* LEFT COLUMN */}
        <div className="pl-8 mt-2">
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