"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export default function CareerGuidanceForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    sourceType: 27,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const baseUrl = "https://apierp.teksversity.com";

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: cleaned }));
      }
    } else if (name === "name") {
      if (/\d/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          name: "Name should not contain numbers",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, name: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Please enter your name.";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters.";

    if (!formData.email.trim()) newErrors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email ID.";

    const cleanedMobile = formData.mobile.replace(/\D/g, "");
    if (!cleanedMobile) newErrors.mobile = "Please enter your mobile number.";
    else if (!/^[6-9]\d{9}$/.test(cleanedMobile))
      newErrors.mobile =
        "Mobile number must be a valid 10-digit Indian number starting with 6-9.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile,
        university: "148",
        course: 341, 
        sourceType: formData.sourceType,
      };

      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

    
      if (response.status === 201 || response.ok) {
        toast.success("Form submitted successfully!");
        setIsSubmitted(true);

        setFormData({
          name: "",
          email: "",
          mobile: "",
          sourceType: 27,
        });

        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
        }, 3000);
      } else if (

    
        response.status === 403 &&
        data?.message?.toLowerCase().includes("already registered")
      ) {
        toast.error(data.message);
        setErrors((prev) => ({
          ...prev,
          email: data.message,
        }));
      } else if (

   
        response.status === 403 &&
        data?.message?.toLowerCase().includes("phone")
      ) {
        toast.error(data.message);
        setErrors((prev) => ({
          ...prev,
          mobile: data.message,
        }));
      } else {

     
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-[95%] max-w-sm p-5 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl p-2 rounded-full"
        >
          <IoClose className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-medium text-gray-800 mb-5 text-center">
          Book 1:1 Career Guidance
        </h2>

        {isSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20 rounded-xl">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-6">
                Our career counselor will contact you within 24 hours.
              </p>
            </div>
          </div>
        )}

        <form className="space-y-2" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Name<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-2 h-10 border border-gray-300 rounded-md focus:border-[#981b1b] focus:ring-0 outline-none"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-2 h-10 border border-gray-300 rounded-md focus:border-[#981b1b] focus:ring-0 outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Mobile Number<span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              className="w-full px-2 h-10 border border-gray-300 rounded-md focus:border-[#981b1b] focus:ring-0 outline-none"
            />
            {errors.mobile && (
              <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-5 h-10 rounded-md font-bold text-white bg-[#c41e3a] hover:bg-white hover:text-[#c41e3a] hover:border-2 hover:border-[#c41e3a] transition-all ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
