"use client";

import ReusableForm from "@/components/ReusableForm";

const getCourseLabel = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return (
      value.heading || value.programName || value.courseName || value.course || value.title || value.name || ""
    );
  }
  return "";
};

export default function Popupform({
  show,
  onClose,
  course,
  courseName,
  university,
  source,
  onSubmit,
}) {
  if (!show) return null;

  const initialCourse = getCourseLabel(courseName) || getCourseLabel(course);
  const initialValues = {
    course: initialCourse,
    branch: university || "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute  cursor-pointer right-4 top-4 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          aria-label="Close form modal"
        >
          Close
        </button>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enquiry Form</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please fill in the details below and our team will contact you shortly.
          </p>
          <ReusableForm
            formType="enquiry"
            initialValues={initialValues}
            onSubmit={onSubmit}
            buttonText="Submit"
            successMessage="Thank you! We'll contact you soon."
          />
        </div>
      </div>
    </div>
  );
}
