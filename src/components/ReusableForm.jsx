"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MobileOtpField } from "./MobileOtpField";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import { COURSE_OPTIONS, BRANCH_OPTIONS } from "@/config/formConfig";

// Complete field configuration
const ALL_FIELDS = {
  name: { id: "name", label: "Name", type: "text", required: true, placeholder: "Enter your name" },
  email: { id: "email", label: "Email", type: "email", required: true, placeholder: "Enter your email" },
  phone: { id: "phone", label: "Mobile Number", type: "phone", required: true, placeholder: "10-digit mobile number" },
  course: { id: "course", label: "Course", type: "course", required: true },
  career: { id: "career", label: "I want a career in", type: "select", required: true, options: COURSE_OPTIONS },
  qualification: { id: "qualification", label: "My qualification is", type: "select", placeholder: "select qualification", required: true, options: ["Fresher / Student", "Working IT Professional", "Career Switcher"] },
  prefferd: { id: "prefferd", label: "Preferred mode", type: "select", required: true, options: ["Online (Live)", "Offline (Classroom)", "Hybrid"] },
  branch: { id: "branch", label: "Branch", type: "select", required: true, options: BRANCH_OPTIONS },
  city: { id: "city", label: "City", type: "text", required: false, placeholder: "Enter your city" },
  message: { id: "message", label: "Message", type: "textarea", required: false, placeholder: "Your message here...", rows: 4 },
  companyName: { id: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Enter company name" },
  designation: { id: "designation", label: "Designation", type: "text", required: true, placeholder: "Your designation" },
  issue: { id: "issue", label: "Issue / Query", type: "textarea", required: true, placeholder: "Describe your issue...", rows: 3 }
};

const normalizeText = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const isMeaningfulCourseLabel = (value) => {
  if (!value || !value.toString().trim()) return false;
  const normalized = value.toString().trim().toLowerCase();
  return (
    normalized !== "" &&
    normalized !== "course" &&
    normalized !== "course enquiry" &&
    normalized !== "course details"
  );
};

const normalizeCourseInput = (value) => {
  if (!value) return "";

  if (Array.isArray(value)) {
    const firstValue = value.find((item) => item !== undefined && item !== null);
    return normalizeCourseInput(firstValue);
  }

  if (typeof value === "object") {
    const label =
      value.programName ||
      value.heading ||
      value.courseName ||
      value.course ||
      value.title ||
      value.name ||
      "";
    return normalizeCourseInput(label);
  }

  const trimmedValue = value.toString().trim();
  if (!isMeaningfulCourseLabel(trimmedValue)) return "";

  const inputTokens = normalizeText(trimmedValue);
  const exactMatch = COURSE_OPTIONS.find((option) => {
    const optionTokens = normalizeText(option);
    return optionTokens.join(" ") === inputTokens.join(" ");
  });
  if (exactMatch) return exactMatch;

  const tokenMatch = COURSE_OPTIONS.find((option) => {
    const optionTokens = normalizeText(option);
    return optionTokens.every((token) => inputTokens.includes(token));
  });
  if (tokenMatch) return tokenMatch;

  return trimmedValue;
};

const normalizeInitialValue = (fieldId, value) => {
  if (fieldId === "course" || fieldId === "career") {
    return normalizeCourseInput(value);
  }
  return value || "";
};

const formatFixedLabel = (value) => {
  return value
    .toString()
    .trim()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function ReusableForm({
  formType = "default",
  onSubmit,
  initialValues = {},
  buttonText = "Submit",
  successMessage = "Form submitted successfully!",
  className = "",
  disableCourseField = false,
  redirectToThankYou = true
}) {
  const router = useRouter();

  const getFieldsForType = useCallback(() => {
    const formFields = {
      default: ["name", "email", "phone", "course", "branch"],
      contact: ["name", "email", "phone", "course", "branch", "city"],
      support: ["name", "email", "phone", "course", "branch", "issue"],
      recruiter: ["name", "email", "phone", "companyName", "designation"],
      ebook: ["name", "email", "phone", "course", "branch"],
      home: ["name", "email", "phone", "career", "qualification"],
      excel: ["name", "email", "phone", "message", "branch"],
      syllabus: ["name", "email", "phone", "branch", "city", "course"],
      banner: ["name", "email", "phone", "course", "branch"],
      career: ["name", "email", "phone", "course", "branch"],
      Enrollnow: ["name", "email", "phone", "course", "branch"],
      requestCallback: ["name", "email", "phone", "course", "branch"],
      reserveSpot: ["name", "email", "phone", "course", "branch"],
      Enquirynow: ["name", "email", "phone", "course", "branch"],
      RequestDemo: ["name", "email", "phone", "course", "branch"]
    };
    return formFields[formType] || formFields.default;
  }, [formType]);

  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    getFieldsForType().forEach(fieldId => {
      initial[fieldId] = normalizeInitialValue(fieldId, initialValues[fieldId]);
    });
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const prevInitialValuesRef = useRef(null);

  const API_URL = blogsApplyBaseUrl;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCourseDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const areInitialValuesEqual = (prev, next) => {
    if (!prev || !next) return false;
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    if (prevKeys.length !== nextKeys.length) return false;
    return prevKeys.every(key => prev[key] === next[key]);
  };

  useEffect(() => {
    const initial = {};
    getFieldsForType().forEach(fieldId => {
      initial[fieldId] = normalizeInitialValue(fieldId, initialValues[fieldId]);
    });

    if (areInitialValuesEqual(prevInitialValuesRef.current, initial)) {
      return;
    }

    prevInitialValuesRef.current = initial;
    setFormValues(initial);
    setErrors({});
    setIsOtpVerified(false);
    setCourseSearchTerm(normalizeCourseInput(initial.course || ""));
    setShowCourseDropdown(false);
  }, [formType, initialValues, getFieldsForType]);

  const mapToApiPayload = (values) => {
    const sourceMap = {
      contact: "Contact Us - Website",
      support: "enquiryform",
      recruiter: "formdata",
      ebook: "Ebook—Website",
      home: "Website",
      excel: "Request Callback—Website",
      syllabus: "Download Syllabus—Website",
      banner: "Enrollnow",
      Enrollnow: "Enrollnow",
      requestCallback: "Request Callback—Website",
      reserveSpot: "Website",
      default: "Website",
      career: "Career Guidance",
      Enquirynow: "Enquirynow",
      RequestDemo: "Request Demo - Website"
    };
    
    return {
      name: values.name || "",
      email: values.email || "",
      number: values.phone || "",
      course: values.course || values.career || "",
      city: values.city || "",
      branch: values.branch || "",
      course_branch: values.prefferd || "",
      referredby: "website",
      qualification: values.qualification || "",
      source_id: "home_form",
      company: values.companyName || "",
      designation: values.designation || "",
      message: values.message || "",
      issue: values.issue || "",
      source: sourceMap[formType] || "Website",
      crm_source: sourceMap[formType] || "Website",
      form_type: formType,
      timestamp: new Date().toISOString()
    };
  };

  const validateField = (fieldId, value) => {
    const field = ALL_FIELDS[fieldId];
    if (!field) return "";

    if (field.required && !value?.toString().trim()) {
      return `${field.label} is required`;
    }

    if (fieldId === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }

    if (fieldId === "phone" && value && !/^\d{10}$/.test(value)) {
      return "Mobile number must be exactly 10 digits";
    }

    if (fieldId === "name" && value && value.trim().length < 2) {
      return "Name must be at least 2 characters";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = getFieldsForType();

    fields.forEach(fieldId => {
      const error = validateField(fieldId, formValues[fieldId]);
      if (error) newErrors[fieldId] = error;
    });

    if (fields.includes("phone") && formValues.phone && !isOtpVerified) {
      newErrors.phone = "Please verify your mobile number with OTP";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldId, value) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: "" }));
    }
    
    if (fieldId === "phone") {
      setIsOtpVerified(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fields = getFieldsForType();
    if (fields.includes("phone") && formValues.phone && !isOtpVerified) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please verify your mobile number with OTP",
      }));

      toast.error("Please verify your mobile number with OTP", {
        duration: 4000,
        icon: '🔒',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = mapToApiPayload(formValues);
      console.log("Submitting payload:", payload);
      
      if (onSubmit) {
        await onSubmit(formValues, payload);
      } else {
        const response = await fetch(buildApiUrl(API_URL, "/lead/create"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Submission failed");
        }
        
        const result = await response.json();
        console.log("Submission success:", result);
        
        toast.success(successMessage, {
          duration: 3000,
          icon: '🎉',
          style: {
            background: '#dcfce7',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
        });
        
        window.dispatchEvent(new CustomEvent('formSubmissionSuccess'));
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Submission failed. Please try again.", {
        duration: 4000,
        icon: '❌',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldId) => {
    const field = ALL_FIELDS[fieldId];
    if (!field) return null;

    const value = formValues[fieldId];
    const error = errors[fieldId];

    if (fieldId === "phone") {
      return (
        <div key={fieldId} className="mb-4">
          <MobileOtpField
            value={value || ""}
            onChange={(e) => {
              const v = typeof e === "string" ? e : (e && e.target ? e.target.value : "");
              handleChange(fieldId, v);
            }}
            onVerified={(verified) => {
              setIsOtpVerified(verified);
              if (verified && errors.phone) {
                setErrors(prev => ({ ...prev, phone: "" }));
              }
            }}
            error={error}
          />
        </div>
      );
    }

    if (fieldId === "course") {
      const fixedCourseValue = normalizeCourseInput(initialValues.course || "");
      const shouldDisable = disableCourseField || fixedCourseValue;
      
      if (shouldDisable && (fixedCourseValue || value)) {
        return (
          <div key={fieldId} className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {field.label} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fixedCourseValue || value || ""}
              disabled
              className="w-full px-4 py-2 border rounded-md text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
        );
      }

      const filteredCourses = COURSE_OPTIONS.filter(c =>
        c.toLowerCase().includes(courseSearchTerm.toLowerCase())
      );

      // Clear search input handler
      const handleClearSearch = () => {
        setCourseSearchTerm("");
        // Focus the search input after clearing
        const searchInput = document.getElementById('course-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      };

      return (
        <div key={fieldId} className="mb-4 relative" ref={dropdownRef}>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label} <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => setShowCourseDropdown((prev) => !prev)}
            className={`w-full px-4 py-2 border rounded-md flex items-center justify-between text-sm cursor-pointer
              ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}
              ${shouldDisable ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <span className={value ? "text-gray-900" : "text-gray-400"}>
              {value || "Select a course"}
            </span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCourseDropdown ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {showCourseDropdown && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
              <div className="p-1 border-b sticky top-0 bg-white">
                <div className="relative">
                  <input
                    id="course-search-input"
                    type="text"
                    value={courseSearchTerm}
                    onChange={(e) => setCourseSearchTerm(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full px-3 py-2 pr-8 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {/* Clear/Remove icon - shows only when there's text */}
                  {courseSearchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <div
                    key={course}
                    onClick={() => {
                      handleChange(fieldId, course);
                      setCourseSearchTerm(course);
                      setShowCourseDropdown(false);
                    }}
                    className={`px-4 py-1 text-sm cursor-pointer hover:bg-blue-50
                      ${value === course ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
                  >
                    {course}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No courses found</div>
              )}
            </div>
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldId === "career" || fieldId === "qualification" || fieldId === "prefferd") {
      return (
        <div key={fieldId} className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label} <span className="text-red-500">*</span>
          </label>
          <select
            value={value || ""}
            onChange={(e) => handleChange(fieldId, e.target.value)}
            className={`w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
          >
            <option value="" className="text-gray-400">{field.label}</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldId === "branch") {
      const isBranchFixed = initialValues && initialValues.branch && initialValues.branch.toString().trim() !== "";

      if (isBranchFixed) {
        return (
          <div key={fieldId} className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {field.label} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formatFixedLabel(value || initialValues.branch)}
              disabled
              className="w-full px-2 py-2 border rounded-md text-sm bg-gray-100 cursor-not-allowed"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      }

      return (
        <div key={fieldId} className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label} <span className="text-red-500">*</span>
          </label>
          <select
            value={value || ""}
            onChange={(e) => handleChange(fieldId, e.target.value)}
            className={`w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
          >
            <option value="">Select Branch</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={fieldId} className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            rows={field.rows}
            value={value || ""}
            onChange={(e) => handleChange(fieldId, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500 bg-red-50" : "border-gray-300"}`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <div key={fieldId} className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={field.type}
          value={value || ""}
          onChange={(e) => handleChange(fieldId, e.target.value)}
          placeholder={field.placeholder}
          className={`w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500 bg-red-50" : "border-gray-300"}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  const fields = getFieldsForType();

  return (
    <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
      {fields.map(renderField)}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2.5 px-4 rounded-md font-semibold text-white transition-all shadow-md
          ${isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#2a619d] hover:bg-[#214d7d] active:scale-[0.98]"}`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Submitting...
          </span>
        ) : buttonText}
      </button>
    </form>
  );
}