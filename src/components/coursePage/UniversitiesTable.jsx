"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Heading from "../../utility/Heading";
import { Star, Calendar, IndianRupee, Award, ChevronRight, Building2, Users, Clock, GraduationCap, Trophy, Briefcase, Zap, Shield, BookOpen } from "lucide-react";
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
  if (courseSlugMap[slug]) {
    return courseSlugMap[slug];
  }

  const slugParts = slug.split("-");
  for (const [mapSlug, courseName] of Object.entries(courseSlugMap)) {
    const mapParts = mapSlug.split("-");
    if (
      slugParts.some((part) => mapParts.some((mapPart) => part === mapPart)) &&
      (slug.includes("bim") || slug.includes("revit") || slug.includes("autocad"))
    ) {
      if (mapSlug.includes("bim") || mapSlug.includes("revit")) {
        return courseName;
      }
    }
  }

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
    <section id="offeringUniversity" className="px-4 sm:px-0">
      <div className="my-8 md:my-10">
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

        <div className="mt-6 md:mt-10">

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block w-full overflow-x-auto rounded-2xl shadow-xl border">
            <div className="grid grid-cols-7 text-white text-sm px-6 py-4 bg-[#47557c]">
              {columns.map((col, i) => (
                <div key={i}>{col}</div>
              ))}
            </div>

            {universities.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-7 items-center px-4 py-5 border-b"
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

          {/* IMPROVED MOBILE CARDS */}
          <div className="lg:hidden space-y-6">
            {universities.map((row, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Gradient Header with Program Name */}
                <div className="bg-gradient-to-br from-[#47557c] via-[#5a6a94] to-[#6b7cae] px-6 py-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-medium mb-3">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Premium Program</span>
                  </div>
                  
                  <h3 className="text-white font-bold text-xl leading-tight mb-2 relative z-10">
                    {row.universityName}
                  </h3>
                  
                  {row.tagline && (
                    <p className="text-white/80 text-sm mt-1 relative z-10">
                      {row.tagline}
                    </p>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-5">
                  {/* University/Provider Logos */}
                  {getImageSrcList(row).length > 0 && (
                    <div className="border-b border-gray-100 pb-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner Institutions</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {getImageSrcList(row).map((img, i) => (
                          <div 
                            key={i} 
                            className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-gray-200"
                          >
                            <Image
                              src={GetData({ url: img?.src })}
                              alt={img?.alt || `Provider ${i + 1}`}
                              width={80}
                              height={50}
                              className="object-contain w-20 h-12"
                              onError={() => handleImageError(`${index}-${i}`)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accreditations & Certifications */}
                  {row.accreditations && row.accreditations.length > 0 && (
                    <div className="border-b border-gray-100 pb-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accreditations & Certifications</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {row.accreditations.map((mode, i) => (
                          <span 
                            key={i} 
                            className="text-xs font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100"
                          >
                            {mode}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Rating Card */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Rating</span>
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-800">{row.rating}</span>
                        <span className="text-xs text-gray-500">/5</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(row.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Duration Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Duration</span>
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="text-lg font-bold text-gray-800">{row.duration}</div>
                      <div className="text-xs text-gray-500 mt-1">Program Length</div>
                    </div>
                  </div>

                  {/* Fee Section - Enhanced */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Investment</span>
                      </div>
                      {row.originalFee && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Save ₹{row.originalFee - parseInt(getCourseFee(row).replace(/[^0-9]/g, ''))}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {getCourseFee(row)}
                      </span>
                      {row.originalFee && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{row.originalFee}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-3">
                      {getCourseFeeNote(row)}
                    </p>

                    {/* EMI/Installment Info */}
                    {row.courseFee?.emi && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/70 rounded-lg px-3 py-2">
                        <Zap className="w-3.5 h-3.5 text-purple-600" />
                        <span>Starting at ₹{row.courseFee.emi}/month</span>
                      </div>
                    )}
                  </div>

                  {/* Key Highlights */}
                  {row.highlights && row.highlights.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Program Highlights</span>
                      </div>
                      <div className="space-y-1.5">
                        {row.highlights.slice(0, 3).map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <ChevronRight className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <PrimaryButton
                      onClick={() => {
                        setSelectedUniversity(row);
                        handleCourseSelect(row);
                        setShowGetDetailsModal(true);
                      }}
                      className="w-full justify-center py-3.5 rounded-xl font-semibold text-base shadow-md hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-[#47557c] to-[#5a6a94] hover:from-[#3a4568] hover:to-[#4e5d82]"
                    >
                      {getButtonText(row)}
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </PrimaryButton>

                   
                  </div>
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