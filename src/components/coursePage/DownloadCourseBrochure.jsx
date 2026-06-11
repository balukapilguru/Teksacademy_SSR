"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiDownload } from "react-icons/fi";
import Image from "next/image";
import Heading from "../../utility/Heading";
import GetData from "@/utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";
import { RiArrowRightBoxFill } from "react-icons/ri";
import Popupform from "@/components/clientcomponents/forms/Popupform";
import { coursesList } from "@/data/courses";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

const normalizeCourseText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) {
    return normalizeCourseText(value.find(Boolean));
  }
  if (typeof value === "object") {
    return normalizeCourseText(
      value.slug ||
      value.courseName ||
      value.programName ||
      value.title ||
      value.name ||
      value.heading ||
      value.course
    );
  }
  return value
    .toString()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const findCourseBrochureLink = ({ courseSlug, courseName, formDetails }) => {
  const candidates = [
    normalizeCourseText(courseSlug),
    normalizeCourseText(courseName),
    normalizeCourseText(formDetails),
  ].filter(Boolean);

  const matchedCourse = coursesList.find((course) => {
    const searchableValues = [
      course.slug,
      course.shortTitle,
      course.title,
      course.category,
    ]
      .map(normalizeCourseText)
      .filter(Boolean);

    return candidates.some((candidate) =>
      searchableValues.some(
        (value) => value === candidate || value.includes(candidate) || candidate.includes(value)
      )
    );
  });

  return matchedCourse?.brochureLink || "";
};

const getPdfLink = (value) => {
  if (!value || value === "#") return "";
  return value.toLowerCase().includes(".pdf") ? value : "";
};

const DownloadCourseBrochure = ({
  data,
  formDetails,
  courseName = "",
  courseSlug = "",
  category = false,
  branch = "course",
  isSelfPaced = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(formDetails);
  const router = useRouter();

  if (!data) return null;

  const courseDisplayName = courseName || selectedCourse || formDetails || "";

  const getBrochureUrl = () => {
    const brochureUrl =
      data?.brochure?.url ||
      data?.brochureUrl ||
      data?.downloadLink ||
      findCourseBrochureLink({ courseSlug, courseName: courseDisplayName, formDetails }) ||
      getPdfLink(data?.button?.link) ||
      "";

    if (!brochureUrl || brochureUrl === "#") return "";

    return brochureUrl && !brochureUrl.startsWith("http")
      ? GetData({ url: brochureUrl })
      : brochureUrl;
  };

  const handleOpenModal = (details) => {
    setSelectedCourse(details);
    setShowModal(true);
  };

  const handleSubmit = async (_formValues, mappedPayload) => {
    try {
      const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      console.log(responseData,"responsee")
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      const brochureUrl = getBrochureUrl();

      if (brochureUrl) {
        const link = document.createElement("a");
        link.href = brochureUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = "";
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Brochure PDF is not available for this course right now.");
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
        {showModal && (
          <Popupform
            show={showModal}
            onClose={() => setShowModal(false)}
            course={courseDisplayName}
            courseName={courseDisplayName}
            title="Download Curriculum"
            subtitle="Fill in your details to download the course brochure."
            onSubmit={handleSubmit}
            formType="syllabus"
            buttonText={data?.button?.name || "Download Brochure"}
            successMessage="Thank you! Your brochure download will start shortly."
          />
        )}

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
            <div className="pl-4 font-semibold text-sm text-[#e7622c]">{data.downloadCount}</div>
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

