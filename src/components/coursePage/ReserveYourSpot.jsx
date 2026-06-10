"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import ReusableForm from "@/components/ReusableForm";
import { PiArrowBendDoubleUpRightLight } from "react-icons/pi";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

const ReserveYourSpot = ({ data, formDetails, course, courseName = "", source }) => {
  const router = useRouter();

  if (!data) return null;

  const courseDisplayName =
    courseName || course || formDetails?.courseName || formDetails?.course || "";
  const initialValues = {
    course: courseDisplayName,
  };

  const {
    heading = [],
    image = [],
    whyJoinThisCourse = {},
    reserveYourSpotForm = {},
  } = data;

  const { formTitle, formSubtitle } = reserveYourSpotForm;

  const handleSubmit = async (formValues, mappedPayload) => {
    try {
      const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      router.push("/thankyou");
    } catch (error) {
      toast.error(error.message || "Submission failed. Please try again.");
      throw error;
    }
  };

  const { benefits = [], heading: benefitsHeading } = whyJoinThisCourse;

  return (
    <div className="mt-6">
      <section className="relative bg-[#e1e7ec] rounded-lg overflow-hidden main_container">
        <div className="relative main_container mx-auto py-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 lg:gap-12">
            {/* Left Section */}
            <div className="lg:col-span-3 space-y-6">
              {heading?.length > 0 && (
                <div className="text-[#2a619d] text-sm font-medium mb-1">
                  {heading[0]}
                </div>
              )}

              {/* Logos */}
{image?.length > 0 && (
  <div className="  md:hidden  grid grid-cols-2 gap-4">
    {image.map((uni, index) => (
      <div
        key={index}
        className="flex justify-center items-center bg-white rounded-lg p-2 shadow"
      >
        <Image
          src={GetData({ url: uni.src })}
          alt={uni.alt || "Partner Logo"}
          width={150}
          height={70}
          className="w-28 h-14 sm:w-32 sm:h-16 object-contain"
        />
      </div>
    ))}
  </div>
)}

              {image?.length > 0 && (
                <div className="overflow-hidden hidden md:block">
                  <div className="scroll-container flex gap-4">
                    {[...image, ...image].map((uni, index) => (
                      <div
                        key={index}
                        className="flex justify-center px-2 sm:px-4"
                      >
                        <Image
                          src={GetData({ url: uni.src })}
                          alt={uni.alt || "Partner Logo"}
                          width={150}
                          height={70}
                          className="bg-white rounded-lg p-1 w-28 h-14 sm:w-32 sm:h-16 object-contain shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Benefits */}
              {benefits?.length > 0 && (
                <div className="mt-8">
                  <Heading data={benefitsHeading}/>
                  {/* <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    {benefitsHeading}
                  </h3> */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-md md:text-lg">
                    {benefits.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <PiArrowBendDoubleUpRightLight
                          className="text-[#2a619d] mt-[2px] flex-shrink-0"
                          size={22}
                        />
                        <span className="leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Inline Reserve Your Spot Form */}
            <div className="lg:col-span-2 w-full md:w-[60%] lg:w-[60%] xl:w-[100%] mt-8 lg:mt-0">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                <div className="text-left mb-4">
                  {formTitle && (
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {formTitle}
                    </div>
                  )}
                  {formSubtitle && (
                    <p className="text-gray-700">{formSubtitle}</p>
                  )}
                </div>
                <div className="mt-6">
                  <ReusableForm
                    formType="reserveSpot"
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    title={formTitle || "Reserve Your Spot"}
                    subtitle={formSubtitle || "Complete the form to reserve your seat and get a callback."}
                    buttonText={formTitle || "Reserve Your Spot"}
                    successMessage="Thank you! We'll contact you soon."
                    source={source}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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
            display: flex;
            width: max-content;
            animation: scroll 20s linear infinite;
          }
        `}</style>
      </section>
    </div>
  );
};

export default ReserveYourSpot;

