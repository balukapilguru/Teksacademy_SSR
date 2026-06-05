"use client";

import { useState } from "react";
import Image from "next/image";
import Heading from "../../utility/Heading";
import { Star } from "lucide-react";
import GetData from "../../utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";
import { useCourseFlow } from "./CourseFlowProvider";
import ReusableForm from "../ReusableForm";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import Popupform from "../clientcomponents/forms/Popupform";

const handleSubmit = async (formValues, mappedPayload) => {
  try {
    const response = await fetch(
      buildApiUrl(blogsApplyBaseUrl, "/lead/create"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedPayload),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Submission failed");
    }

    router.push("/thankyou");
  } catch (error) {
    console.error("Submission error:", error);
    throw error;
  }
};

export default function CourseInfoTable({
  data,
  isSelfPaced = false,
  courseName = "",
  branch = "course",
}) {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const { handleCourseSelect } = useCourseFlow();
  const [showGetDetailsModal, setShowGetDetailsModal] = useState(false);

  if (!data) return null;

  const heading = data?.offeringUniversity?.heading || ["Offering", ""];

  const columns = data?.offeringUniversity?.columns || [
    "Offering Program",
    "Offered By",
    "Accreditations",
    "Rating",
    "Duration",
    "Course Fee",
    "Action",
  ];

  const COURSE_SLUG_MAP = {
  "full-stack-java": "Full Stack Java",
  "full-stack-python": "Full Stack Python",
  "cybersecurity": "Cybersecurity",
  "gen-ai": "Gen AI",
  "aws-devops": "AWS+ DevOps",
  "data-science": "Data Science",
  "data-analytics": "Data Analytics",
  "digital-marketing": "Digital Marketing",
  "bim-revit-mep-navis": "BIM- Revit MEP, NAVIS",
  "autocad": "AutoCAD",
  "medical-coding": "Medical Coding",
  "sap-fico": "SAP FICO",
  "sap-mm": "SAP MM",
  "testing-automation": "Testing-Automation",
  "multimedia": "Multimedia",
  "advanced-excel": "Advanced Excel",
  "revit-mep-certification": "Revit MEP Certification",
  "business-analytics": "Business Analytics",
};
const extractSlug = (url = "") => {
  return url
    .toLowerCase()
    .replace("courses/", "")
    .replace("best-", "")
    .replace("-course-training-institute", "")
    .trim();
};
const resolveCourseName = (url) => {
  const slug = extractSlug(url);
  return COURSE_SLUG_MAP[slug] || slug.replace(/-/g, " ");
};
  const universities = data?.universities?.length
    ? data.universities
    : data?.offeringUniversity?.universityOfferings?.map((item) => ({
        universityName: item.program,
        image: item.image,
        accreditations: item.trainingMode,
        rating: item.rating,
        duration: item.duration,
        courseFee: item.courseFee,
        button: item.button,
      })) || [];

  if (universities.length === 0) {
    return (
      <section id="offeringUniversity">
        <div className="my-10 text-center text-gray-500">
          No universities available for this course.
        </div>
      </section>
    );
  }

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getImageSrcList = (row) => row.image || [];

  const getCourseFee = (row) =>
    row.courseFee?.range ? `₹${row.courseFee.range}` : "Contact";

  const getCourseFeeNote = (row) =>
    row.courseFee?.note || "Total program fee";

  const getButtonText = (row) =>
    row?.button?.text || (isSelfPaced ? "Enroll for Free" : "Get Details");

  return (
    <section id="offeringUniversity">
      <div className="my-10">
        <Heading data={heading} />

        {showGetDetailsModal && selectedUniversity && (
          <Popupform
            show={showGetDetailsModal}
            onClose={() => setShowGetDetailsModal(false)}
            course={
              selectedUniversity?.universityName ||
              courseName ||
              branch
            }
            courseName={
              selectedUniversity?.universityName || courseName
            }
            source="Enrollnow"
            title="Enroll Now"
            subtitle="Fill in your details to get course guidance and a callback from our team."
            onSubmit={handleSubmit}
            formType="EnrollNow"
            buttonText="Enroll Now"
            successMessage="Thank you! We'll contact you soon."
          />
        )}

        <div className="mt-10">
          <div className="w-full overflow-x-auto rounded-2xl shadow-xl border">

            {/* HEADER */}
            <div className="min-w-[1000px] grid grid-cols-[220px_280px_220px_120px_140px_180px_180px] text-white text-sm px-6 py-4 bg-[#47557c]">
              {columns.map((col, i) => (
                <div key={i}>{col}</div>
              ))}
            </div>

            {/* ROWS */}
            {universities.map((row, index) => (
              <div
                key={index}
                className="min-w-[1000px] grid grid-cols-[220px_280px_220px_120px_140px_180px_180px] items-center px-4 py-5 border-b"
              >
                {/* Offering Program (TEXT ONLY) */}
                <div className="text-sm font-medium whitespace-nowrap">
                  {row.universityName}
                </div>

                {/* Offered By (IMAGES ONLY) */}
                <div className="grid grid-cols-3 items-center gap-1">
                  {getImageSrcList(row).length > 0 ? (
                    getImageSrcList(row).map((img, i) => (
                      <Image
                        key={i}
                        src={GetData({ url: img?.src })}
                        alt={img?.alt || row.universityName}
                        width={120}
                        height={55}
                        className="object-contain w-auto"
                        onError={() => handleImageError(`${index}-${i}`)}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </div>

                {/* Accreditations */}
                <div className="flex gap-2 flex-wrap">
                  {row.accreditations?.map((mode, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {mode}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {row.rating}
                </div>

                {/* Duration */}
                <div>{row.duration}</div>

                {/* Fee */}
                <div>
                  <div className="font-bold">{getCourseFee(row)}</div>
                  <div className="text-xs text-gray-500">
                    {getCourseFeeNote(row)}
                  </div>
                </div>

                {/* Action */}
                <div>
                  <PrimaryButton
                    onClick={() => {
                      setSelectedUniversity(row);
                      handleCourseSelect(row);
                      setShowGetDetailsModal(true);
                    }}
                  >
                    {getButtonText(row)} →
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isSelfPaced && selectedUniversity && (
        <ReusableForm
          formType="enquiry"
          onSubmit={handleSubmit}
          buttonText="Submit"
          initialValues={{ course: courseName }}
        />
      )}
    </section>
  );
}