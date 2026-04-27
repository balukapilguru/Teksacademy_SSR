"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Heading from "../../utility/Heading";
import { ExternalLink, Star } from "lucide-react";
import GetData from "../../utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";
import { useCourseFlow } from "./CourseFlowProvider";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import AcademicsForm from "../clientcomponents/forms/Popupforms";
import GetDetailsModal from "../clientcomponents/forms/GetDetailsModal";

export default function CourseInfoTable({
  data,
  isSelfPaced = false,
  isAcademic = false,
  courseName = "",
  bannerData = null,
  formDetails = null,
  branch = "course",
}) {
  const [showModal, setShowModal] = useState(false);
  const [showFreeCourseModal, setShowFreeCourseModal] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [showGetDetailsModal, setShowGetDetailsModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const { handleCourseSelect } = useCourseFlow();

  if (!data) {
    return null;
  }

  const heading = data?.offeringUniversity?.heading || ["Offering", ""];
  const columns = data?.offeringUniversity?.columns || [
    "University",
    "Accreditations",
    "Rating",
    "Duration",
    "Course Fee",
    "Action",
  ];

  const universities =
    data?.universities || data?.formDetails?.universities || [];

  const getUniversityLink = (row) => {
    return (
      row?.image?.url || row?.button?.find((btn) => btn.link)?.link || null
    );
  };

  const universityLink =
    universities.length > 0 ? getUniversityLink(universities[0]) : null;

  if (universities.length === 0) {
    return (
      <section id="offeringUniversity">
        <div className="my-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-6">
            <Heading data={heading} />
            <div className="text-center py-10">
              <p className="text-gray-500">
                No universities available for this course.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getButtonText = (row) => {
    if (!row.button) return isSelfPaced ? "Enroll for Free" : "Get Details";

    if (Array.isArray(row.button)) {
      const button = row.button.find(
        (btn) =>
          btn.name?.toLowerCase().includes("enroll") ||
          btn.text?.toLowerCase().includes("enroll")
      );
      return (
        button?.name ||
        button?.text ||
        (isSelfPaced ? "Enroll for Free" : "Get Details")
      );
    } else {
      return (
        row.button.text ||
        row.button.name ||
        (isSelfPaced ? "Enroll for Free" : "Get Details")
      );
    }
  };

  const getUniversityName = (row) => {
    return row.universityName || row.university || "University";
  };

  const getImageSrc = (row) => {
    return row.image?.src || row.logo || null;
  };

  const getImageAlt = (row) => {
    return row.image?.alt || getUniversityName(row) + " Logo";
  };

  const getCourseFee = (row) => {
    if (isSelfPaced) {
      return row.courseFee?.freeText || row.courseFee?.range || "";
    }
    return row.courseFee?.range
      ? `₹${row.courseFee.range}`
      : "Contact for Price";
  };

  const getCourseFeeNote = (row) => {
    if (isSelfPaced) {
      return row.courseFee?.note || "No cost enrollment";
    }
    return row.courseFee?.note || "Total program fee";
  };

  // NEW: Function to filter specializations based on selected university
  const getFilteredSpecializations = (university) => {
    if (!formDetails?.specializations) return [];

    // Filter specializations that include this specific university
    return formDetails.specializations.filter((spec) => {
      if (!spec.universities) return false;

      return spec.universities.some((uni) => {
        // Match by university name
        if (uni.universityName === university.universityName) return true;

        // Match by university field
        if (uni.university === university.university) return true;

        // Match by sourceId
        if (
          uni.sourceId &&
          university.sourceId &&
          uni.sourceId === university.sourceId
        )
          return true;

        // Match by ProductId
        if (
          uni.ProductId &&
          university.ProductId &&
          uni.ProductId === university.ProductId
        )
          return true;

        // Match by productId (lowercase)
        if (
          uni.productId &&
          university.productId &&
          uni.productId === university.productId
        )
          return true;

        return false;
      });
    });
  };

  // NEW: Function to get universities for a specialization (filtered if needed)
  const getUniversitiesForSpecialization = (
    specialization,
    selectedUni = null
  ) => {
    if (!specialization?.universities) return [];

    // If we have a selected university, filter to only show that one
    if (selectedUni) {
      return specialization.universities.filter((uni) => {
        if (uni.universityName === selectedUni.universityName) return true;
        if (uni.university === selectedUni.university) return true;
        if (
          uni.sourceId &&
          selectedUni.sourceId &&
          uni.sourceId === selectedUni.sourceId
        )
          return true;
        return false;
      });
    }

    return specialization.universities;
  };

  // Handle button click for all course types
  const handleUniversityClick = (university) => {
   
    setSelectedUniversity(university);

    // Get filtered specializations for this university
    const filteredSpecializations = getFilteredSpecializations(university);

    // Prepare course data with filtered specializations
    const courseData = prepareCourseData(university, filteredSpecializations);

    if (isSelfPaced) {
      setShowFreeCourseModal(true);
    } else if (isAcademic) {
      // For academic courses, pass the selected university and filtered specializations
      setShowAcademicModal(true);
    } else {
      // For regular courses
      handleCourseSelect(university);
      // setShowGetDetailsModal(true);
    }
  };

 

  // Updated prepareCourseData to include filtered specializations
  const prepareCourseData = (university, filteredSpecializations = null) => {
    if (!university) return null;

    const courseHeading =
      bannerData?.name ||
      bannerData?.firstHeading ||
      university.courseName ||
      university.title ||
      courseName ||
      "Course Details";

    // Use filtered specializations if provided, otherwise filter them
    const specializations =
      filteredSpecializations || getFilteredSpecializations(university);

    // For each specialization, get only the universities that match the selected one
    const specializationsWithFilteredUnis = specializations.map((spec) => ({
      ...spec,
      universities: getUniversitiesForSpecialization(spec, university),
    }));

    return {
      heading: courseHeading,
      university: university,
      specializations: specializationsWithFilteredUnis,
      // Original data for reference
      originalFormDetails: formDetails,
      // Course type info
      isSelfPaced,
      isAcademic,
      // Include source info
      ...(isSelfPaced && { source: "Free Courses" }),
      ...(isAcademic && { source: "Academic Courses" }),
      ...(!isSelfPaced && !isAcademic && { source: "Course Details" }),
    };
  };

 

  return (
    <>
      <section id="offeringUniversity">
        <div className="my-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-6">
            <Heading data={heading} />

            <div className="mt-10">
              <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
                {/* Table header */}
                <div className="min-w-[800px] grid grid-cols-6 text-white font-semibold text-sm uppercase tracking-wide border-b border-gray-300 px-8 py-4 bg-[#47557c]">
                  {columns.map((col, idx) => (
                    <div key={idx} className={idx === 5 ? "text-center" : ""}>
                      {col}
                    </div>
                  ))}
                </div>

                {/* Table rows */}
                {universities.map((row, index) => {
                  const imageSrc = getImageSrc(row);
                  const imageUrl = imageSrc ? GetData({ url: imageSrc }) : null;
                  const hasImageError = imageErrors[index];
                  const buttonText = getButtonText(row);
                  const universityName = getUniversityName(row);
                  const courseFee = getCourseFee(row);
                  const courseFeeNote = getCourseFeeNote(row);

                  return (
                    <div
                      key={index}
                      className="min-w-[800px] grid grid-cols-6 items-center text-black px-8 py-6 border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                    >
                      {/* University column */}
                      <div className="flex items-center gap-3">
                        {(() => {
                          const universityLink = getUniversityLink(row);

                          const universityImage =
                            imageUrl && !hasImageError ? (
                              <Image
                                src={imageUrl}
                                alt={getImageAlt(row)}
                                width={160}
                                height={56}
                                className="object-contain"
                                onError={() => handleImageError(index)}
                                unoptimized
                              />
                            ) : (
                              <div className="w-40 h-14 flex items-center justify-center bg-gray-100 border rounded">
                                <span className="text-sm font-medium">
                                  {universityName}
                                </span>
                              </div>
                            );

                          return (
                            <>
                              {/* Image always visible */}
                              {universityLink ? (
                                <Link
                                  href={universityLink}
                                  className="hover:scale-105 transition"
                                >
                                  {universityImage}
                                </Link>
                              ) : (
                                <div>{universityImage}</div>
                              )}

                              {/* Icon only if URL exists */}
                              {universityLink && (
                                <Link
                                  href={universityLink}
                                  className="p-2 rounded-full hover:bg-gray-200 transition"
                                  title="View University"
                                >
                                  <ExternalLink className="w-4 h-4 text-[#002a80]" />
                                </Link>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      {/* Accreditations column */}
                      <div className="flex flex-wrap gap-1">
                        {row.accreditations?.map((acc, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {acc}
                          </span>
                        )) || (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </div>

                      {/* Rating column */}
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">
                          {row.rating || "N/A"}
                        </span>
                      </div>

                      {/* Duration column */}
                      <div>
                        <span className="px-3 py-1.5 rounded-md text-sm font-semibold bg-[#002a80] text-white">
                          {row.duration || "N/A"}
                        </span>
                      </div>

                      {/* Course Fee column */}
                      <div>
                        <div className="font-bold">{courseFee}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {courseFeeNote}
                        </div>
                      </div>

                      {/* Action column */}
                      <div className="flex justify-center">
                        <PrimaryButton
                          onClick={() => handleUniversityClick(row)}
                          variant="filled"
                          className={
                            isSelfPaced || isAcademic ? "cursor-pointer" : ""
                          }
                        >
                          {buttonText} →
                        </PrimaryButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Self-paced courses modal */}
      {isSelfPaced && selectedUniversity && (
        <Freecoursesform
          show={showFreeCourseModal}
          onClose={() => {
            setShowFreeCourseModal(false);
            setSelectedUniversity(null);
          }}
          course={prepareCourseData(selectedUniversity)}
          selectedUniversity={selectedUniversity} // Pass selected university
          enableBrochureDownload={false}
          source={34}
        />
      )}

      {/* Academic courses modal */}
      {isAcademic && selectedUniversity && (
        <AcademicsForm
          show={showAcademicModal}
          onClose={() => {
            setShowAcademicModal(false);
            setSelectedUniversity(null);
          }}
          selectedUniversity={selectedUniversity?.university} // Pass selected university
          enableBrochureDownload={true}
          source={28}
          course={branch}
          courseName={prepareCourseData(selectedUniversity)} // Pass filtered data
        />
      )}

      {/* Regular courses modal */}
      {!isSelfPaced && !isAcademic && selectedUniversity && (
        <GetDetailsModal
          show={showGetDetailsModal}
          onClose={() => {
            setShowGetDetailsModal(false);
            setSelectedUniversity(null);
          }}
          course={prepareCourseData(selectedUniversity)}
          selectedUniversity={selectedUniversity} // Pass selected university
          source={28}
          courseName={prepareCourseData(selectedUniversity)} // Pass filtered data
          enableBrochureDownload={true}
        />
      )}
    </>
  );
}
