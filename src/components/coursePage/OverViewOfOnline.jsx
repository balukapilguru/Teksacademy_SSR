"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import mba from "@/app/assets/onilnemba.png";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";
import { LiaArrowsAltSolid } from "react-icons/lia";
import { GiPentarrowsTornado } from "react-icons/gi";
import RichTextRenderer from "../coursePage/RichTextRenderer";
const OverViewOfOnline = ({
  data,
  formDetails,
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
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(formDetails);

  const imageSrc =
    overViewImage?.src && overViewImage.src !== "" ? overViewImage.src : mba;
  const imageAlt = overViewImage?.alt || subHeading || "Overview image";

  const handleOpenModal = (details) => {
    setSelectedCourse(details);
    setShowModal(true);
  };

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
                  <PrimaryButton
                    variant="filled"
                    onClick={() => handleOpenModal(formDetails)}
                  >
                    {button.name}
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverViewOfOnline;
