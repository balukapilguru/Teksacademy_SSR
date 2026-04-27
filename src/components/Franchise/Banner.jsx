"use client";
import React, { useState } from "react";
import Image from "next/image";
import bgImage from "@/app/assets/course-banner/bgt3.png";
import Particles from "../coursePage/Particles";
import GetData from "@/utility/GetData";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import Heading from "@/utility/Heading";
import Bannerheading from "@/utility/Bannerheading";
import Franchisefrom from "../clientcomponents/forms/Franchisepopup";

const Banner = ({ data, formDetails, source}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(formDetails);

  if (!data) return null;

  const handleOpenForm = () => {
    setSelectedCourse(formDetails);
    setShowForm(true);
  };

  const headingData = data.banner?.mainHeading;
  const mainImage = data.bannerImage?.src;
  const applyButton = data.button?.applyButton;
  const talkButton = data.button?.letsTalkButton;
  
  
  const getUniversityName = () => {

    if (data?.formDetails?.universityName) return data.formDetails.universityName;
   
    if (formDetails?.universityName) return formDetails.universityName;
    
    if (data?.secondNavbar?.university?.name) return data.secondNavbar.university.name;
    
    return "University";
  };

  const universityName = getUniversityName();
  
  return (
    <div className="relative rounded-2xl text-white overflow-hidden mt-6">
      {/* University Form Modal */}
      {showForm && (
        <Franchisefrom
        source={34}
          show={showForm}
          onClose={() => {
            setShowForm(false);
          }}
          universityData={{
            instituteName: universityName, 
            image: data?.bannerImage, 
            rating: data?.rating 
          }}
          course={{
            heading: universityName + " Courses",
            specializations: formDetails?.specializations || data?.formDetails?.specializations || [], 
          }}
        />
      )}

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0028] via-[#011338] to-[#1a0033] z-0 " />

      {/* Background Image */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src={bgImage}
          alt="Background Pattern"
          height={453}
          width={1073}
          className="object-cover w-full h-full opacity-40 mix-blend-screen"
          priority
        />
      </div>

      <Particles />

      <div className="relative z-10 max-w-8xl p-4 lg:pl-6 lg:pr-0 lg:pb-0 lg:pt-0 grid grid-cols-1 lg:grid-cols-2  lg:gap-10 items-center">
        <div>
          <Bannerheading data={data?.mainHeading} text={data?.mainHeading} />
          {/* Description FIXED */}
          <p className="mt-4 text-gray-300 text-base text-justify sm:text-lg leading-relaxed">
            {data.paragraph}
          </p>
          
          <div className="mt-4 lg:mb-4 flex flex-wrap gap-4">
            
            
            {talkButton?.name && (
              <button
                className="border hover:bg-transparent hover:text-white border-white cursor-pointer px-6 h-9 rounded-lg bg-white text-black text-sm sm:text-base transition"
                onClick={handleOpenForm}
              >
                {talkButton.name}
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center md:justify-end relative mt-8 lg:mt-0">
          <div className="w-full max-w-lg md:max-w-lg">
            <Image
              src={GetData({ url: mainImage })}
              alt={data.imageAlt || "Course Banner"}
              width={800}
              height={400}
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
