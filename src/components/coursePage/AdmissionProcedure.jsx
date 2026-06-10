// "use client";
import React from "react";
import {
  AiOutlineGlobal,
  AiOutlineForm,
  AiOutlineCloudUpload,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { VscGitStashApply } from "react-icons/vsc";
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";
import { MdOutlineDomainVerification } from "react-icons/md";
import Heading from "@/utility/Heading";
import Image from "next/image";
import GetData from "@/utility/GetData";

const Admission = ({ data }) => {

  const admissionData = data || {};

  const description = admissionData.description || "Starting your academic journey is now simpler than ever...";

  const admissionSteps = admissionData.admissionSteps || {};
  const stepsHeading = admissionSteps.heading?.[0] || "Guide to Online Admission Process";

  const stepsData = admissionSteps.steps || [];
console.log(admissionSteps,"stepsData")
  const stepColors = [
    "bg-[#002b80]",
    "bg-green-800",
    "bg-yellow-800",
    "bg-[#2a619d]",
    "bg-green-800",
    "bg-[#76777a]",
  ];

  // const getIconComponent = (index) => {
  //   const icons = [
  //     <AiOutlineGlobal size={28} key="signup" />,
  //     <VscGitStashApply size={28} key="application" />,
  //     <AiOutlineForm size={28} key="upload" />,
  //     <AiOutlineCloudUpload size={28} key="fees" />,
  //     <MdOutlineDomainVerification size={28} key="verification" />,
  //     <AiOutlineCheckCircle size={28} key="confirmation" />,
  //   ];
  //   return icons[index] || <AiOutlineGlobal size={28} />;
  // };

  // Process steps from API data
  const steps = stepsData.map((step, index) => ({
    number: step.stepNumber,
    title: step.heading[0],
    description: step.details,
    icon: step.image.src,
    color: stepColors[index] || "bg-gray-600",
  }));

  // Don't render if no steps data
  if (steps.length === 0) {
    return null;
  }

  return (
    <section id="OnlineAdmissionProcedure">
      <div className="">
        <div className=" mx-auto md:py-3">
          {/* Header */}
          <Heading data={data?.heading} className="hidden md:block" />
          <div className="text-md hidden md:block">
            {description}
          </div>
          {/* Steps Section */}
          <div className="bg-white rounded-3xl shadow-xl p-4 mb-12 md:mt-3">
            <div className="relative mb-2 ">
              <div className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {stepsHeading}
              </div>

              {/* Steps Wrapper */}
              <div className="flex flex-col md:flex-row justify-between items-start relative z-10">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-col items-center text-center md:items-center relative mb-10 md:mb-0 w-full md:w-auto"
                  >
                    {/* === Mobile view === */}
                    <div className="flex flex-col md:hidden items-center md:mb-6">
                      {/* Step Number */}
                      <div
                        className={`px-4 py-1 rounded-full mb-2 shadow-md font-medium text-sm ${index < 5
                          ? "bg-blue-100 text-gray-800 border-gray-200"
                          : "bg-gray-700 text-white"
                          }`}
                      >
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-14 h-14  p-1.5 flex items-center justify-center rounded-full ${step.color} text-white shadow-lg mb-3`}
                      >
                        {/* {step.icon} */}
                        <Image 
                        width={70}
                        height={30}
                        alt="icons"
                        src={GetData({url:step.icon})}/>
                      </div>

                      {/* Title + Description */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-center sm:text-left">
                        <h3 className="font-semibold text-gray-800 text-base">
                          {step.title}
                        </h3>
                        <div className="text-gray-600 text-sm hidden md:block">{step.description}</div>
                      </div>
                    </div>

                    {/* Mobile vertical line + arrow */}
                    {index < steps.length - 1 && (
                      <>
                        {/* Dashed vertical line */}
                        <div className="block md:hidden absolute top-[130px] h-[50px] border-l-4 border-dashed border-gray-400 z-[-1]" />

                        {/* Down arrow */}
                        <div className="block md:hidden absolute top-[170px] text-gray-500">
                          <BiSolidDownArrow size={16} />
                        </div>
                      </>
                    )}

                    {/* === Desktop view === */}
                    <div className="hidden md:flex flex-col items-center">
                      {/* Icon */}
                      <div
                        className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-4 ${step.color} shadow-lg text-white z-10`}
                      >
                        <Image 
                        width={40}
                        height={30}
                        alt="icons"
                        src={GetData({url:step.icon})}/>
                      </div>

                      {/* Dashed line + arrow (desktop only) */}
                      {index < steps.length - 1 && (
                        <>
                          <div className="hidden md:block absolute md:top-8 md:left-1/2 lg:top-10 lg:left-1/2 w-full h-4 border-t-4 border-dashed border-gray-400 z-[-1]" />
                          <div className="hidden md:block absolute md:top-6 lg:top-8 md:left-[90%] text-gray-600">
                            <BiSolidRightArrow size={20} />
                          </div>
                        </>
                      )}

                      {/* Step Number */}
                      <div
                        className={`px-4 rounded-full mb-6 flex items-center justify-center shadow-lg font-medium text-sm ${index < 5
                          ? "bg-blue-100 text-gray-800 border-gray-200"
                          : "bg-gray-700 text-white"
                          }`}
                      >
                        {step.number}
                      </div>

                      {/* Title + Description */}
                      <div className="text-center max-w-[250px]">
                        <h3 className="font-bold text-gray-800 mr-2 text-lg mb-1">
                          {step.title}
                        </h3>
                        <div className="text-gray-600 text-sm ml-2 leading-relaxed">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


  );
};

export default Admission;