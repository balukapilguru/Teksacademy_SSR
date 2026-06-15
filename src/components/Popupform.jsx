"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ReusableForm from "./ReusableForm";

const normalizeCourseValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const firstValue = value.find((item) => item !== undefined && item !== null);
    return normalizeCourseValue(firstValue);
  }
  if (typeof value === "object") {
    return (
      value.courseName ||
      value.name ||
      value.title ||
      value.programName ||
      value.heading ||
      value.course ||
      ""
    );
  }
  return String(value);
};

const Popupform = ({
  show,
  onClose,
  course,
  courseName,
  branch,
  source,
  title,
  subtitle,
  onSubmit,
  formType = "banner",
  buttonText = "Enroll Now",
  successMessage = "Thank you! We'll contact you soon.",
  redirectToThankYou = true, // Add this prop
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("popup-open");
    };
  }, []);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      document.body.classList.add("popup-open");
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("popup-open");
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Listen for custom form submission success event
  useEffect(() => {
    const handleFormSuccess = () => {
      if (redirectToThankYou) {
        router.push("/thankyou");
      }
      onClose();
    };

    window.addEventListener('formSubmissionSuccess', handleFormSuccess);
    
    return () => {
      window.removeEventListener('formSubmissionSuccess', handleFormSuccess);
    };
  }, [redirectToThankYou, router, onClose]);

  if (!isVisible && !show) return null;
  if (!mounted) return null;

  const initialValues = {
    course: normalizeCourseValue(courseName || course),
    ...(branch ? { branch } : {}),
  };

  // IMPORTANT:
  // Do NOT handle submission here.
  // ReusableForm already performs the /lead/create API call (when onSubmit prop is not used)
  // and dispatches `formSubmissionSuccess` only after successful backend creation.
  // If we intercept submission here, we may show success without actually creating the lead/CRM.


  if (typeof document === "undefined") return null;

  const portalTarget = document.getElementById("__next") || document.body;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[100000]
          ${show ? "opacity-50" : "opacity-0"}`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        style={{
          maxHeight: "calc(100dvh - 100px)",
        }}
        className={`fixed left-1/2 -translate-x-1/2 transform 
          top-2 sm:top-1/2 sm:-translate-y-1/2
          bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-md 
          sm:!max-h-[90vh] 
          overflow-y-auto overscroll-contain z-[100001] transition-all duration-300
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="relative p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
            initialValues={initialValues}
            buttonText={buttonText}
            successMessage={successMessage}
            redirectToThankYou={redirectToThankYou}
          />
        </div>
      </div>
    </>
  );
};

export default Popupform;