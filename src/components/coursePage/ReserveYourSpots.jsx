"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import GetData from "@/utility/GetData";
import { PiArrowBendDoubleUpRightLight } from "react-icons/pi";
import Popupform from "../clientcomponents/forms/Popupform";
import Heading from "@/utility/Heading";
import PrimaryButton from "@/utility/PrimaryButton";

const ReserveYourSpots = ({ data, formDetails, courseName = "", branch = "Course", source }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const selectedCourse = courseName || formDetails?.courseName || formDetails?.course || branch || "";

  if (!data || !formDetails) return null;

  const {
    heading = [],
    image = [],
    whyJoinThisCourse = {},
    reserveYourSpotForm = {},
  } = data;

  const { formTitle, formSubtitle } = reserveYourSpotForm;
  const { benefits = [], heading: benefitsHeading } = whyJoinThisCourse;

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async (formValues, mappedPayload) => {
    try {
      const response = await fetch("https://apierp.teksversity.com/lead/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      toast.success("Form submitted successfully!");
      router.push("/thankyou");
    } catch (error) {
      toast.error(error.message || "Submission failed. Please try again.");
      throw error;
    }
  };

  return (
    <div className="mt-6">
      <section className="relative bg-[#e1e7ec] rounded-lg overflow-hidden main_container">
        <div className="relative main_container mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Left Section */}
            <div className="lg:col-span-3 space-y-6">
              {heading?.length > 0 && (
                <p className="text-[#2a619d] text-sm font-medium mb-1">
                  {heading[0]}
                </p>
              )}

              {/* Logos */}
              {image?.length > 0 && (
                <div className="overflow-hidden">
                  <div className="scroll-container flex gap-4">
                    {[...image, ...image].map((uni, index) => (
                      <div key={index} className="flex justify-center px-2">
                        <Image
                          src={GetData({ url: uni.src })}
                          alt={uni.alt || "Logo"}
                          width={150}
                          height={70}
                          className="bg-white rounded-lg p-1 w-28 h-14 object-contain shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Benefits */}
              {benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    {benefitsHeading}
                  </h3>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-lg">
                    {benefits.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <PiArrowBendDoubleUpRightLight 
                          className="text-[#2a619d] text-xl mt-1"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                {formTitle && (
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {formTitle}
                  </div>
                )}

                {formSubtitle && (
                  <p className="text-gray-700 mb-4">{formSubtitle}</p>
                )}

                <div className="mt-6">
                  <PrimaryButton variant="filled" onClick={handleOpenModal}>
                    {formTitle || "Request Callback"}
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Popupform
          show={showModal}
          onClose={() => setShowModal(false)}
          courseName={selectedCourse}
          course={selectedCourse}
          source={source}
          onSubmit={handleSubmit}
          formType="enquiry"
          buttonText="Submit"
          successMessage="Thank you! We'll contact you soon."
        />

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-container {
            width: max-content;
            animation: scroll 20s linear infinite;
          }
        `}</style>
      </section>
    </div>
  );
};

export default ReserveYourSpots;
