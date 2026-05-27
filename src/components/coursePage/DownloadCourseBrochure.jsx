"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiDownload } from "react-icons/fi";
import Image from "next/image";
import Heading from "../../utility/Heading";
import GetData from "@/utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";
import { RiArrowRightBoxFill } from "react-icons/ri";
const DownloadCourseBrochure = ({
  data,
  formDetails,
  category = false,
  branch = "course",
  isSelfPaced = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(formDetails);
  const router = useRouter();

  if (!data) return null;

  const handleOpenModal = (details) => {
    setSelectedCourse(details);
    setShowModal(true);
  };

  const handleSubmit = async (formValues, mappedPayload) => {
    try {
      const response = await fetch("https://apierp.infozit.com/lead/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      const brochureUrl =
        data?.button?.link ||
        data?.downloadLink ||
        data?.brochureUrl ||
        data?.brochure?.url ||
        "";

      if (brochureUrl) {
        window.open(brochureUrl, "_blank");
      }

      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };


  return (
   
      <section
        className="rounded-xl bg-[#e5e7eb]"
        id="downloadOurCourseBrochure"
      >
        <div className="main_container grid lg:grid-cols-2 md:gap-1 lgLgap-0 items-center">
          {/* Left Content + Button */}
          <div className="py-4 backdrop-blur-sm border  rounded-l-lg border-[#e5e7eb] ">
            <h3><Heading data={data?.heading} /></h3>


            {/* Description */}
            <div className="text-md md:text-lg text-gray-600 text-justify leading-relaxed mb-4">
              {data?.description}
            </div>

            {/* Sub Heading */}
            {data?.subHeading && (
              <div className="text-xl md:text-22xl font-semibold text-gray-800 mb-3">
                {data.subHeading}
              </div>
            )}

            {/* Highlights */}
            <ul className="space-y-3 text-gray-800 mb-6">
              {data?.highlights?.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-md md:text-lg gap-3 px-3"
                >
                  <RiArrowRightBoxFill className="w-5 h-5 md:w-6 md:h-6 rounded-full text-[#2a619d] flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {data?.button && (
              <PrimaryButton
                onClick={() => handleOpenModal(formDetails)}
                variant="filled"
              >
                <FiDownload className="w-5 h-5 me-1" />
                <span>{data.button.name}</span>
              </PrimaryButton>
            )}
          </div>

          {/* Right Image */}
          <div className="flex justify-center p-4 ">
            {data?.image?.src && data.image.src !== "null" ? (
              <Image
                src={GetData({ url: data?.image.src })}
                alt={data.image.alt || "Course Brochure"}
                width={600}
                height={400}
                className="rounded-2xl transition-transform duration-500 bg-white/60  object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-white/60 rounded-2xl flex items-center justify-center">
                <span className="text-gray-500">Brochure Image</span>
              </div>
            )}
          </div>
        </div>
      </section>
  
  );
};

export default DownloadCourseBrochure;

