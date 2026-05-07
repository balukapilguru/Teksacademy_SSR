"use client";
import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import Heading from "../../utility/Heading";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import Popupforms from "../clientcomponents/forms/Popupforms";
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


  if (!data) return null;

  const handleOpenModal = (details) => {
    setSelectedCourse(details);
    setShowModal(true);
  };


  return (
    <div className="mb-6">
      {category || isSelfPaced? (
        <Freecoursesform
        source={41}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          enableBrochureDownload={true}
          formType={category ? "certification" : "selfPaced"}
        />
      ) : (
        <Popupforms
         source={41}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={branch}
          courseName={selectedCourse}
          enableBrochureDownload={true}
          formType={category ? "certification" : "selfPaced"}
        />
      )}

      <section
        className="rounded-xl bg-[#e5e7eb]"
        id="downloadOurCourseBrochure"
      >
        <div className="max-w-8xl grid lg:grid-cols-2 md:gap-1 lgLgap-0 items-center">
          {/* Left Content + Button */}
          <div className="p-4 lg:p-6 xl:p-8 backdrop-blur-sm border  rounded-l-lg border-[#e5e7eb] ">
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
                  <RiArrowRightBoxFill className="w-5 h-5 md:w-6 md:h-6 rounded-full text-[#ea6329] flex-shrink-0" />
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
          <div className="flex justify-center p-2">
            {data?.image?.src && data.image.src !== "null" ? (
              <Image
                src={GetData({ url: data?.image.src })}
                alt={data.image.alt || "Course Brochure"}
                width={600}
                height={400}
                className="rounded-2xl transition-transform duration-500 bg-white/60 hover:scale-105 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-white/60 rounded-2xl flex items-center justify-center">
                <span className="text-gray-500">Brochure Image</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DownloadCourseBrochure;

