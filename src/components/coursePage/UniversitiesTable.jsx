"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Heading from "../../utility/Heading";
import { Star } from "lucide-react";
import GetData from "../../utility/GetData";
import PrimaryButton from "@/utility/PrimaryButton";
import { useCourseFlow } from "./CourseFlowProvider";
import ReusableForm from "../ReusableForm";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import Popupform from "../clientcomponents/forms/Popupform";

// Course slug mapping
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
  "bim-building-information-modeling": "BIM- Revit MEP, NAVIS",
  "revit-mep": "BIM- Revit MEP, NAVIS",
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

// Extract slug from URL
const extractSlug = (url = "") => {
  let slug = url
    .toLowerCase()
    .replace("courses/", "")
    .replace("best-", "")
    .replace("-course-training-institute", "")
    .replace("-development-course-training-institute", "")
    .replace("-training-institute", "")
    .trim();
  
  return slug;
};

// Fuzzy match slug to find the best course name
const findBestCourseMatch = (slug, courseSlugMap) => {
  // Exact match first
  if (courseSlugMap[slug]) {
    return courseSlugMap[slug];
  }

  // Partial match for common variations
  const slugParts = slug.split("-");
  for (const [mapSlug, courseName] of Object.entries(courseSlugMap)) {
    const mapParts = mapSlug.split("-");
    // If slug contains the first 2 parts of map slug, it's likely a match
    if (
      slugParts.some((part) => mapParts.some((mapPart) => part === mapPart)) &&
      (slug.includes("bim") || slug.includes("revit") || slug.includes("autocad"))
    ) {
      if (mapSlug.includes("bim") || mapSlug.includes("revit")) {
        return courseName;
      }
    }
  }

  // No match found, return formatted slug
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const handleSubmit = async (formValues, mappedPayload, router) => {
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

    // Redirect to thankyou page on success
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
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [courseNameFromUrl, setCourseNameFromUrl] = useState("");
  const { handleCourseSelect } = useCourseFlow();
  const [showGetDetailsModal, setShowGetDetailsModal] = useState(false);

  // Extract course name from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname;
      const slug = extractSlug(currentUrl);
      const mappedCourseName =
        findBestCourseMatch(slug, COURSE_SLUG_MAP) || courseName || slug;
      setCourseNameFromUrl(mappedCourseName);
    }
  }, [courseName]);

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

  const universities =
    data?.universities?.length
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
            course={courseNameFromUrl || selectedUniversity?.universityName || courseName || branch}
            courseName={courseNameFromUrl || selectedUniversity?.universityName || courseName}
            source="Enrollnow"
            title="Enroll Now"
            subtitle="Fill in your details to get course guidance and a callback from our team."
            onSubmit={(formValues, mappedPayload) => handleSubmit(formValues, mappedPayload, router)}
            formType="EnrollNow"
            buttonText="Enroll Now"
            successMessage="Thank you! We'll contact you soon."
            disableCourseField={true}
          />
        )}

        <div className="mt-10">

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block w-full overflow-x-auto rounded-2xl shadow-xl border">
            {/* HEADER */}
            <div className="grid grid-cols-[220px_280px_220px_120px_140px_180px_180px] text-white text-sm px-6 py-4 bg-[#47557c]">
              {columns.map((col, i) => (
                <div key={i}>{col}</div>
              ))}
            </div>

            {/* ROWS */}
            {universities.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-[220px_280px_220px_120px_140px_180px_180px] items-center px-4 py-5 border-b"
              >
                <div className="text-sm font-medium">
                  {row.universityName}
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {getImageSrcList(row).map((img, i) => (
                    <Image
                      key={i}
                      src={GetData({ url: img?.src })}
                      alt={img?.alt || ""}
                      width={120}
                      height={55}
                      className="object-contain"
                      onError={() => handleImageError(`${index}-${i}`)}
                    />
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {row.accreditations?.map((mode, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {mode}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {row.rating}
                </div>

                <div>{row.duration}</div>

                <div>
                  <div className="font-bold">{getCourseFee(row)}</div>
                  <div className="text-xs text-gray-500">
                    {getCourseFeeNote(row)}
                  </div>
                </div>

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
            ))}
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4">
            {universities.map((row, index) => (
              <div key={index} className="border rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold mb-2">
                  {row.universityName}
                </h3>

                <div className="flex gap-2 flex-wrap mb-2">
                  {getImageSrcList(row).map((img, i) => (
                    <Image
                      key={i}
                      src={GetData({ url: img?.src })}
                      alt=""
                      width={80}
                      height={40}
                      className="object-contain"
                    />
                  ))}
                </div>

                <div className="text-sm mb-1">
                  <strong>Accreditations:</strong>{" "}
                  {row.accreditations?.join(", ")}
                </div>

                <div className="text-sm mb-1">
                  <strong>Rating:</strong> ⭐ {row.rating}
                </div>

                <div className="text-sm mb-1">
                  <strong>Duration:</strong> {row.duration}
                </div>

                <div className="text-sm mb-3">
                  <strong>Fee:</strong> {getCourseFee(row)}
                </div>

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