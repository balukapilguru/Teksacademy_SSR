"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import mba from "@/app/assets/onilnemba.png";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
import Popupform from "../clientcomponents/forms/Popupform";
import { GiPentarrowsTornado } from "react-icons/gi";
import RichTextRenderer from "../coursePage/RichTextRenderer";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
const OverViewOfOnline = ({
  data,
  formDetails,
  courseName = "",
  category = false,
  branch = "course",
  isSelfPaced = false,
}) => {
  const router = useRouter();

  if (!data) return null;

  const {
    heading = "",
    subHeading = "",
    description = "",
    keyPoints = [],
    button,
    overViewImage = {},
  } = data;
  const courseDisplayName = courseName || formDetails?.courseName || formDetails?.course || formDetails || "";
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseDisplayName);

  const imageSrc =
    overViewImage?.src && overViewImage.src !== "" ? overViewImage.src : mba;
  const imageAlt = overViewImage?.alt || subHeading || "Overview image";

  const handleOpenModal = (details) => {
    setSelectedCourse(courseDisplayName || details);
    setShowModal(true);
  };

  const handleSubmit = async (formValues, mappedPayload) => {
    console.log("Mapped payload being sent:", mappedPayload);

    try {
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

      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  // const finalImageSrc = GetData({ url: imageSrc });

  return (
    <div className="">
      <section className="py-6 pt-6">
     
        <div className="">
          <Heading data={heading} />

          <div className="grid lg:grid-cols-2 gap-12 mt-6">
            <div className="flex justify-center">
              <Image
                src={GetData({ url: imageSrc })}
                alt={imageAlt}
                className="rounded-xl shadow-lg border border-gray-200 object-cover"
                width={700}
                height={400}
              />
            </div>

            <div className="rounded-md space-y-1 flex flex-col h-full">
              <h2 className="text-2xl font-medium text-[#012a7f] mb-3">
                {subHeading}
              </h2>

              <div className="text-gray-700 text-md md:text-lg   space-y-2 leading-relaxed">
                {/* <p className="text-justify">{description}</p>
               */}
                <div className="text-justify">
                  {description?.type === "richText" ? (
                    <RichTextRenderer content={description.content} />
                  ) : (
                    description
                  )}
                </div>

                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start ">
                    <span className="flex-shrink-0 w-8 h-8 mr-1 flex items-center justify-center text-[#2a619d]">
                      <GiPentarrowsTornado />
                    </span>
                    <p className="flex-1">{point}</p>
                  </div>
                ))}
              </div>

              {button?.name && (
                <div className="mt-auto pt-6">
                  <button
                    className="mt-6 cursor-pointer lg:mb-4 flex flex-wrap gap-4 text-lg bg-transparent font-semibold border border-[#2a619d] text-[#2a619d] px-6 py-2 rounded-md hover:bg-white hover:text-[#2a619d] transition-colors duration-300"
                    onClick={() => handleOpenModal(formDetails)}
                  >
                    Enroll Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {showModal && (
          <Popupform
            show={showModal}
            onClose={() => setShowModal(false)}
            course={selectedCourse}
            courseName={selectedCourse}
            source={30}
            title="Enroll Now"
            subtitle="Fill in your details to get course guidance and a callback from our team."
            onSubmit={handleSubmit}
            formType="EnrollNow"
            buttonText="Enroll Now"
            successMessage="Thank you! We'll contact you soon."
          />
        )}
      </section>
    </div>
  );
};

export default OverViewOfOnline;
