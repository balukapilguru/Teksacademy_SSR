"use client";

import React, { useState } from "react";
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";
import CoursepageHeading from "@/utility/CoursepageHeading";
import Image from "next/image";
import GetData from "@/utility/GetData";
import Popupform from "../clientcomponents/forms/Popupform";
import { useRouter } from "next/navigation";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

const Admission = ({  data,
  formDetails,
  courseLabel = "",
  branch = "", }) => {

    
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const router = useRouter();
  const courseDisplayName =
  courseLabel ||
  formDetails?.courseName ||
  formDetails?.course ||
  "";

  if (!data) return null;

  const description =
    data?.description ||
    "Starting your academic journey is now simpler than ever...";

  const admissionSteps = data?.admissionSteps || {};
  const stepsHeading =
    admissionSteps?.heading?.[0] ||
    "Guide to Online Admission Process";

  const stepsData = admissionSteps?.steps || [];

  const stepColors = [
    "bg-[#002b80]",
    "bg-green-800",
    "bg-yellow-800",
    "bg-[#2a619d]",
    "bg-green-800",
    "bg-[#76777a]",
  ];

  const steps = stepsData.map((step, index) => ({
    number: step?.stepNumber || index + 1,
    title: step?.heading?.[0] || "Untitled Step",
    description: step?.details || "",
    icon: step?.image?.src || "",
    color: stepColors[index] || "bg-gray-600",
  }));

  if (!steps.length) return null;

  // Handle form submission - matching OverViewOfOnline pattern
  const handleSubmit = async (formValues, mappedPayload) => {
    console.log("Form values:", formValues);
    console.log("Mapped payload being sent:", mappedPayload);

    try {
      setIsLoading(true);
      
      const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
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

      // Close modal and redirect to thank you page
      setShowModal(false);
      router.push("/thankyou");
      
    } catch (error) {
      console.error("Submission error:", error);
      // Keep modal open on error
      setShowModal(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
setSelectedCourse(courseDisplayName);
  setShowModal(true);
};

  return (
    <section id="OnlineAdmissionProcedure main_container" className="py-4  md:mt-12  relative rounded-lg">
      {/* Modal */}
      {showModal && (
        <Popupform
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourse}
          source={30}
          university={branch}
          title="Enroll Now"
          subtitle="Fill in your details to get course guidance and a callback from our team."
          onSubmit={handleSubmit}
          formType="EnrollNow"
          buttonText="Enroll Now"
          successMessage="Thank you! We'll contact you soon."
          isLoading={isLoading}
        />
      )}

      <div className="mx-auto md:py-3">
        {/* Header */}
        <CoursepageHeading data={data?.heading} className="hidden md:block" />
        <div className="text-md hidden md:block">{description}</div>

        {/* Steps */}
        <div className="bg-white rounded-3xl shadow-xl p-4 mb-6 md:mt-3">
          <div className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {stepsHeading}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center relative mb-10 md:mb-0 w-full md:w-auto"
              >
                {/* ================= MOBILE ================= */}
                <div className="flex flex-col md:hidden items-center">
                  {/* Step Number */}
                  <div
                    className={`px-4 py-1 rounded-full mb-2 shadow-md font-medium text-sm ${
                      index < 5
                        ? "bg-blue-100 text-gray-800"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 p-1.5 flex items-center justify-center rounded-full ${step.color} text-white shadow-lg mb-3`}
                  >
                    {step.icon && (
                      <Image
                        width={70}
                        height={30}
                        alt="icon"
                        src={GetData({ url: step.icon })}
                      />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 text-base">
                    {step.title}
                  </h3>
                </div>

                {/* Mobile connectors */}
                {index < steps.length - 1 && (
                  <>
                    <div className="block md:hidden absolute top-[130px] h-[50px] border-l-4 border-dashed border-gray-400 z-[-1]" />
                    <div className="block md:hidden absolute top-[170px] text-gray-500">
                      <BiSolidDownArrow size={16} />
                    </div>
                  </>
                )}

                {/* ================= DESKTOP ================= */}
                <div className="hidden md:flex flex-col items-center">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-4 ${step.color} shadow-lg text-white z-10`}
                  >
                    {step.icon && (
                      <Image
                        width={40}
                        height={30}
                        alt="icon"
                        src={GetData({ url: step.icon })}
                      />
                    )}
                  </div>

                  {/* Connectors */}
                  {index < steps.length - 1 && (
                    <>
                      <div className="absolute md:top-8 md:left-1/2 w-full h-4 border-t-4 border-dashed border-gray-400 z-[-1]" />
                      <div className="absolute md:top-6 md:left-[90%] text-gray-600">
                        <BiSolidRightArrow size={20} />
                      </div>
                    </>
                  )}

                  {/* Step Number */}
                  <div
                    className={`px-4 rounded-full mb-6 flex items-center justify-center shadow-lg font-medium text-sm ${
                      index < 5
                        ? "bg-blue-100 text-gray-800"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Title + Description */}
                  <div className="text-center max-w-[250px]">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {step.title}
                    </h3>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleOpenModal}
            className="bg-[#2a619d] cursor-pointer text-white py-2 px-6 rounded-lg font-medium hover:bg-white hover:text-[#2a619d] hover:border hover:border-[#2a619d] transition"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Enroll Now"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Admission;