"use client";

import { MdClose } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";  // Use FaGraduationCap from react-icons/fa instead
import ReusableForm from "@/components/ReusableForm";
import { useRouter } from "next/navigation";

export default function CareerGuidanceForm({ isOpen, onClose }) {
  const router = useRouter();
  const API_URL = "https://apierp.infozit.com";

  const handleSubmit = async (formValues, mappedPayload) => {
    console.log("Career Guidance Form - Form Values:", formValues);
    console.log("Career Guidance Form - Mapped Payload:", mappedPayload);

    try {
      const response = await fetch(`${API_URL}/lead/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      // Close the modal
      onClose();
      
      // Redirect to thank you page
      router.push("/thankyou");
      
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-4 transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <MdClose size={24} />
            </button>

            {/* Header */}
            <div className="text-center pt-4 pb-2 px-6">
              {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-3">
                <FaGraduationCap className="text-3xl text-[#2a619d]" />
              </div> */}
              <h2 className="text-lg font-bold text-gray-800">
               1:1 Career Guidance
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Get expert advice for your career journey
              </p>
            </div>

            {/* Form Body */}
            <div className="p-4">
              <ReusableForm
                formType="Career"
                onSubmit={handleSubmit}
                buttonText="Submit"
                successMessage="Thank you! We'll contact you soon."
                className="space-y-4"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}