"use client";
import React, { useState } from "react";
import Image from "next/image";
import mba from "@/app/assets/onilnemba.png";
import Heading from "@/utility/Heading";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import Popupforms from "../clientcomponents/forms/Popupforms";
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

  // const finalImageSrc = GetData({ url: imageSrc });

  return (
    <section className="py-6 pt-6" id="overViewOfOnline">
      {category || isSelfPaced ? (
        <Freecoursesform
          source={32}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          formType={category ? "certification" : "selfPaced"}
        />
      ) : (
        <Popupforms
          source={32}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={branch}
          courseName={selectedCourse}
        />
      )}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
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
                  <span className="flex-shrink-0 w-8 h-8 mr-1 flex items-center justify-center text-[#ea6329]">
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
                  onClick={() => {
                    if (button.popup) {
                      handleOpenModal(formDetails);
                    } else if (button.link) {
                      window.location.href = button.link;
                    }
                  }}
                >
                  {button.name}
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverViewOfOnline;
