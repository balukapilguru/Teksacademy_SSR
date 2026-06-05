"use client";

import React, { useMemo } from "react";
import ReusableForm from "@/components/ReusableForm";

const getCourseLabel = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const firstValue = value.find((item) => item !== undefined && item !== null);
    return getCourseLabel(firstValue);
  }
  if (typeof value === "object") {
    return (
      value.programName ||
      value.heading ||
      value.courseName ||
      value.course ||
      value.title ||
      value.name ||
      ""
    );
  }
  return "";
};

const isMeaningfulCourseLabel = (label) => {
  if (typeof label !== "string") return Boolean(label);

  const normalizedLabel = label.trim().toLowerCase();
  return (
    normalizedLabel !== "" &&
    normalizedLabel !== "course" &&
    normalizedLabel !== "course enquiry" &&
    normalizedLabel !== "course details"
  );
};

const normalizeCourseInput = (value) => {
  const label = getCourseLabel(value);
  return isMeaningfulCourseLabel(label) ? label : "";
};

export default function Popupform({
  show,
  onClose,
  course,
  courseName,
  university,
  source,
  onSubmit,
  title = "Enquiry Form",
  subtitle = "Please fill in the details below and our team will contact you shortly.",
  formType = "enquiry",
  buttonText = "Submit",
  successMessage = "Thank you! We'll contact you soon.",
  disableCourseField = false,
}) {
  if (!show) return null;

  const initialCourse = normalizeCourseInput(courseName) || normalizeCourseInput(course);
  const initialValues = useMemo(
    () => ({ course: initialCourse, branch: university || "" }),
    [initialCourse, university]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[calc(100dvh-2rem)] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute cursor-pointer right-4 top-4 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200 z-10"
          aria-label="Close form modal"
        >
          Close
        </button>
        <div className="p-6 md:p-8 overflow-y-auto overscroll-contain">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-sm text-gray-600 mb-6">{subtitle}</p>
          <ReusableForm
            formType={formType}
            initialValues={initialValues}
            onSubmit={onSubmit}
            buttonText={buttonText}
            successMessage={successMessage}
            disableCourseField={disableCourseField}
          />
        </div>
      </div>
    </div>
  );
}
