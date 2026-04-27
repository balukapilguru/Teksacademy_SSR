"use client";
import React, { useState } from "react";
import Image from "next/image";
import bgImage from "@/app/assets/course-banner/bgt3.png";
import Particles from "../coursePage/Particles";
import GetData from "@/utility/GetData";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import Popupforms from "../clientcomponents/forms/Popupforms";
import Bannerheading from '@/utility/Bannerheading'
import PrimaryButton from "@/utility/PrimaryButton";

const Banner = ({ 
  data, 
  formDetails, 
  category = false, 
  branch = "course",
  isSelfPaced = false // Add this new prop
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(formDetails);

  if (!data) return null;

  const handleOpenModal = (details) => {
    
    setSelectedCourse(details);
    setShowModal(true);
  };

  // Use Freecoursesform for BOTH certifications AND self-paced learning
  // Use Popupforms for regular courses
  return (
    <div className="relative main_container rounded-2xl text-white overflow-hidden">
      {/* Show Freecoursesform for certifications OR self-paced learning */}
      {category || isSelfPaced ? (
        <Freecoursesform
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
         formType={category ? "certification" : "selfPaced"}
          source={30}
        />
      ) : (
        <Popupforms
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

      <div className="relative z-10 max-w-8xl pl-4 pr-2 lg:pl-10 lg:pr-0 lg:pt-0 lg:pb-0 grid grid-cols-1  lg:grid-cols-2 lg:gap-10 items-center">
        <div>
          <Bannerheading text={data.mainHeading} data={data?.mainHeading} className="mt-5 md:mt-0" />

          {/* Description */}
          {data.description && (
            <div className="mt-4 text-gray-300 text-base text-justify sm:text-lg leading-relaxed">
              {data.description}
            </div>
          )}

          {data.desc && !data.description && (
            <div className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
              {data.desc}
            </div>
          )}

          {!data.description && !data.desc && (
            <div className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
              Step into the tech world with industry-ready Full Stack expertise.
            </div>
          )}

          {data.button && (
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
