// Popupform.jsx
"use client";
import React, { useEffect, useState } from "react";
import ReusableForm from "./ReusableForm";


const Popupform = ({
  show,
  onClose,
  course,
  courseName,
  source,
  title,
  subtitle,
  onSubmit,
  formType = "banner",
  buttonText = "Enroll Now",
  successMessage = "Thank you! We'll contact you soon.",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible && !show) return null;

  const initialValues = {
    course: courseName || course || "",
  };

  const handleFormSubmit = async (formValues, mappedPayload) => {
    try {
      if (onSubmit) {
        await onSubmit(formValues, mappedPayload);
      }
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[9998]
          ${show ? "opacity-50" : "opacity-0"}`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto z-[9999] transition-all duration-300
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{title || "Enroll Now"}</h3>
            {subtitle && (
              <p className="text-gray-600 text-sm mt-2">{subtitle}</p>
            )}
          </div>

          {/* Form */}
          <ReusableForm
            formType={formType}
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            buttonText={buttonText}
            successMessage={successMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Popupform;