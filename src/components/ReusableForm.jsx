"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MobileOtpField } from "./MobileOtpField";

// Complete field configuration
const ALL_FIELDS = {
  name: { id: "name", label: "Name", type: "text", required: true, placeholder: "Enter your name" },
  email: { id: "email", label: "Email", type: "email", required: true, placeholder: "Enter your email" },
  phone: { id: "phone", label: "Mobile Number", type: "phone", required: true, placeholder: "10-digit mobile number" },
  course: { id: "course", label: "Course", type: "course", required: true },
  career: { id: "career", label: "I want a career in", type: "select", required: true, options: ["Full Stack Java", "Full Stack Python", "Cyber Security", "Generative AI", "AWS + DevOps", "Data Science", "Data Analytics", "Digital Marketing"] }, 
    // "BIM - Revit MEP, Navis" "AutoCAD", "Medical Coding", "SAP FICO", "SAP MM", "Testing - Automation", "Multimedia", "Advanced Excel", "Revit MEP Certification", "Business Analytics"
  qualification: { id: "qualification", label: "My qualification is", type: "select", placeholder:"select qualification", required: true, options: ["Fresher / Student", "Working IT Professional", "Career Switcher"] },
  prefferd: { id: "prefferd", label: "Preferred mode", type: "select", required: true, options: ["Online (Live)", "Offline (Classroom)", "Hybrid"] },
  branch: { id: "branch", label: "Branch", type: "select", required: true, options: ["ameerpet", "kukatpally", "mehdipatnam", "hiteccity", "secunderabad", "dilsukhnagar", "bangalore", "visakhapatnam"] },
  city: { id: "city", label: "City", type: "text", required: true, placeholder: "Enter your city" },
  message: { id: "message", label: "Message", type: "textarea", required: false, placeholder: "Your message here...", rows: 4 },
  companyName: { id: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Enter company name" },
  designation: { id: "designation", label: "Designation", type: "text", required: true, placeholder: "Your designation" },
  issue: { id: "issue", label: "Issue / Query", type: "textarea", required: true, placeholder: "Describe your issue...", rows: 3 }
};

// Course options
const COURSE_OPTIONS = [
  "Full Stack Python", "Full Stack Java", "Data Science", "AWS & DevOps",
  "Digital Marketing", "Cyber Security", "Data Analytics", "Business Analytics",
  "Generative AI", "Medical Coding", "SAP FICO", "Testing Tools", "Excel", "AutoCAD", "BIM", "Revit"
];

const isFixedCourseValue = (course) => {
  if (!course || !course.toString().trim()) return false;

  const normalizedCourse = course.toString().trim().toLowerCase();
  return (
    normalizedCourse !== "course" &&
    normalizedCourse !== "course enquiry" &&
    normalizedCourse !== "course details"
  );
};

const normalizeInitialValue = (fieldId, value) => {
  if (fieldId === "course" && !isFixedCourseValue(value)) {
    return "";
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
  className = ""
}) {
  // Define which fields to show for each form type
  const getFieldsForType = useCallback(() => {
    const formFields = {
      default: ["name", "email", "phone", "course", "branch", "city", "message"],
      contact: ["name", "email", "phone", "course", "branch", "city"],
      support: ["name", "email", "phone", "course", "branch", "issue"],
      recruiter: ["name", "email", "phone", "companyName", "designation"],
      ebook: ["name", "email", "phone", "course", "branch"],
      home: ["name", "email", "phone", "career", "qualification", "prefferd"],
      excel: ["name", "email", "phone", "message", "branch"],
      syllabus: ["name", "email", "phone", "branch", "city", "course"],
      banner: ["name", "email", "phone", "course", "branch", "city"],
      Career: ["name", "email", "phone", "course", "branch"],
      EnrollNow: ["name", "email", "phone", "course", "branch", "city"],
      requestCallback: ["name", "email", "phone", "course", "branch", "city"],
      reserveSpot: ["name", "email", "phone", "course", "branch", "city"],
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

  const API_URL = "https://apierp.infozit.com";

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
    setCourseSearchTerm(initial.course || "");
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
      EnrollNow: "Enrollnow",
      requestCallback: "Request Callback—Website",
      reserveSpot: "Reserve Spot—Website",
      default: "Website",
      Career: "Request Callback—Website"
    };
    
    return {
      name: values.name || "",
      email: values.email || "",
      number: values.phone || "",
      course: values.course || values.career || "",
      city: values.city || "",
      branch: values.branch || "",
      course_branch: values.prefferd || "Online",
      referredby: "website",
      qualification: values.qualification || "B.Tech",
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

    if (fields.includes("phone") && !isOtpVerified) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = mapToApiPayload(formValues);
      console.log("Submitting payload:", payload);
      
      if (onSubmit) {
        await onSubmit(formValues, payload);
      } else {
        const response = await fetch(`${API_URL}/lead/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Submission failed");
        }
        
        alert(successMessage);
        const fields = getFieldsForType();
        const resetValues = {};
        fields.forEach(fieldId => { resetValues[fieldId] = ""; });
        setFormValues(resetValues);
        setIsOtpVerified(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "Submission failed. Please try again.");
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
            value={value}
            onChange={(e) => {
              const v = typeof e === "string" ? e : e && e.target ? e.target.value : "";
              handleChange(fieldId, v);
            }}
            onVerified={setIsOtpVerified}
            error={error}
          />
        </div>
      );
    }

    if (fieldId === "course") {
      const filteredCourses = COURSE_OPTIONS.filter(c =>
        c.toLowerCase().includes(courseSearchTerm.toLowerCase())
      );

      return (
        <div key={fieldId} className="mb-4 relative" ref={dropdownRef}>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label} <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            className={`w-full px-4 py-2 border rounded-md flex items-center justify-between text-sm cursor-pointer
              ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
          >
            <span className={value || initialValues.course ? "text-gray-900" : "text-gray-400"}>
              {value || initialValues.course || "Select a course"}
            </span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCourseDropdown ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {showCourseDropdown && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
              <div className="p-1 border-b">
                <input
                  type="text"
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {filteredCourses.map(course => (
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
              ))}
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
            value={value}
            onChange={(e) => handleChange(fieldId, e.target.value)}
            className={`w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
          >
            <option value="">Select {field.label}</option>
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
            value={value}
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
            value={value}
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
          value={value}
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
        className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-all shadow-md
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
