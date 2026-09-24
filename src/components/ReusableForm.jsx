"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import OtpVerificationModal from "./OtpVerificationModal";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import {
  RECAPTCHA_SITE_KEY,
  validateIndianMobileNumber,
  computeDynamicClientHash,
  fetchOtpHandshake,
} from "@/lib/otpSecurity";
import {
  COURSE_OPTIONS,
  BRANCH_OPTIONS,
  getFormConfig,
  buildPayload,
} from "@/config/formConfig";
import { storeBranchData } from "@/lib/branchStorage";

// Complete field configuration
const ALL_FIELDS = {
  name: {
    id: "name",
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Enter your name",
  },
  email: {
    id: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Enter your email",
  },
  phone: {
    id: "phone",
    label: "Mobile Number",
    type: "phone",
    required: true,
    placeholder: "10-digit mobile number",
  },
  course: { id: "course", label: "Course", type: "course", required: true },
  career: {
    id: "career",
    label: "I want a career in",
    type: "select",
    required: true,
    options: COURSE_OPTIONS,
  },
  qualification: {
    id: "qualification",
    label: "My qualification is",
    type: "select",
    placeholder: "select qualification",
    required: true,
    options: [
      "Fresher / Student",
      "Working IT Professional",
      "Career Switcher",
    ],
  },
  prefferd: {
    id: "prefferd",
    label: "Preferred mode",
    type: "select",
    required: true,
    options: ["Online (Live)", "Offline (Classroom)", "Hybrid"],
  },
  branch: {
    id: "branch",
    label: "Branch",
    type: "select",
    required: true,
    options: BRANCH_OPTIONS,
  },
  city: {
    id: "city",
    label: "City",
    type: "text",
    required: false,
    placeholder: "Enter your city",
  },
  message: {
    id: "message",
    label: "Message",
    type: "textarea",
    required: false,
    placeholder: "Your message here...",
    rows: 4,
  },
  companyName: {
    id: "companyName",
    label: "Company Name",
    type: "text",
    required: true,
    placeholder: "Enter company name",
  },
  designation: {
    id: "designation",
    label: "Designation",
    type: "text",
    required: true,
    placeholder: "Your designation",
  },
  issue: {
    id: "issue",
    label: "Issue / Query",
    type: "textarea",
    required: true,
    placeholder: "Describe your issue...",
    rows: 3,
  },
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
    const firstValue = value.find(
      (item) => item !== undefined && item !== null,
    );
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
  courses = [],
  onSubmit,
  initialValues = {},
  buttonText = "Submit",
  successMessage = "Form submitted successfully!",
  className = "",
  disableCourseField = false,
  redirectToThankYou = true,
  requireOtp = true,
}) {
  const router = useRouter();
  const courseOptions = courses.map((course) => ({
    label: course.heading || course.programName || course.title || course.name,

    value: course.heading || course.programName || course.title || course.name,
  }));
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
      RequestDemo: ["name", "email", "phone", "course", "branch"],
    };
    return formFields[formType] || formFields.default;
  }, [formType]);

  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    getFieldsForType().forEach((fieldId) => {
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

  // 4-Pillar Security & OTP Modal States
  const [captchaToken, setCaptchaToken] = useState(null);
  const [handshakeData, setHandshakeData] = useState(null);
  const [honeypotValue, setHoneypotValue] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const recaptchaRef = useRef(null);

  const API_URL = blogsApplyBaseUrl;

  useEffect(() => {
    try {
      router.prefetch("/thankyou");
    } catch {}
  }, [router]);

  const handleCaptchaSuccess = async (token) => {
    setCaptchaToken(token);
    if (!token) return;
    try {
      const hs = await fetchOtpHandshake(API_URL);
      setHandshakeData(hs);
    } catch (err) {
      // Handshake error silently handled
    }
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
    setHandshakeData(null);
    try {
      recaptchaRef.current?.reset();
    } catch {}
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setHandshakeData(null);
    try {
      recaptchaRef.current?.reset();
    } catch {}
  };

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
    return prevKeys.every((key) => prev[key] === next[key]);
  };

  useEffect(() => {
    const initial = {};
    getFieldsForType().forEach((fieldId) => {
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

  const resetForm = useCallback(() => {
    const initial = {};
    getFieldsForType().forEach((fieldId) => {
      initial[fieldId] = normalizeInitialValue(fieldId, initialValues[fieldId]);
    });
    prevInitialValuesRef.current = initial;
    setFormValues(initial);
    setErrors({});
    setIsOtpVerified(false);
    setShowOtpModal(false);
    setCourseSearchTerm(normalizeCourseInput(initial.course || ""));
    setShowCourseDropdown(false);
    setCaptchaToken(null);
    setHandshakeData(null);
    setHoneypotValue("");
    try {
      recaptchaRef.current?.reset();
    } catch {
      // ignore
    }
  }, [getFieldsForType, initialValues]);

  // const mapToApiPayload = (values) => {
  //   const sourceMap = {
  //     contact: "Contact Us - Website",
  //     support: "enquiryform",
  //     recruiter: "formdata",
  //     ebook: "Ebook—Website",
  //     home: "Website",
  //     excel: "Request Callback—Website",
  //     syllabus: "Download Syllabus—Website",
  //     banner: "Enrollnow",
  //     Enrollnow: "Enrollnow",
  //     requestCallback: "Request Callback—Website",
  //     reserveSpot: "Website",
  //     default: "Website",
  //     career: "Career Guidance",
  //     Enquirynow: "Enquirynow",
  //     RequestDemo: "Request Demo - Website",
  //   };

  //   return {
  //     name: values.name || "",
  //     email: values.email || "",
  //     number: values.phone || "",
  //     course: values.course || values.career || "",
  //     city: values.city || "",
  //     branch: values.branch || "",
  //     course_branch: values.branch || "",
  //     referredby: "website",
  //     qualification: values.qualification || "",
  //     source_id: "home_form",
  //     company: values.companyName || "",
  //     designation: values.designation || "",
  //     message: values.message || "",
  //     issue: values.issue || "",
  //     source: sourceMap[formType] || "Website",
  //     crm_source: sourceMap[formType] || "Website",
  //     form_type: formType,
  //     timestamp: new Date().toISOString(),
  //   };
  // };

  const validateField = (fieldId, value) => {
    const field = ALL_FIELDS[fieldId];
    if (!field) return "";

    if (field.required && !value?.toString().trim()) {
      return `${field.label} is required`;
    }

    if (
      fieldId === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return "Please enter a valid email address";
    }

    if (fieldId === "phone" && value && !/^[6-9]\d{9}$/.test(value)) {
      return "Please enter a valid 10-digit Indian mobile number starting with 6-9";
    }

    if (fieldId === "name" && value && value.trim().length < 2) {
      return "Name must be at least 2 characters";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = getFieldsForType();

    fields.forEach((fieldId) => {
      const error = validateField(fieldId, formValues[fieldId]);
      if (error) newErrors[fieldId] = error;
    });

    // commented for as of now
    // if (fields.includes("phone") && formValues.phone && !isOtpVerified) {
    //   newErrors.phone = "Please verify your mobile number with OTP";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }

    if (fieldId === "phone") {
      setIsOtpVerified(false);
      setShowOtpModal(false);
    }
  };

  const submitLeadData = async () => {
    setIsSubmitting(true);
    try {
      const config = getFormConfig(formType);
      const payload = buildPayload(formValues, config);
      payload.course_branch = formValues.branch;
      payload.website_verification_code = honeypotValue || "";
      if (captchaToken) {
        payload.recaptchaToken = captchaToken;
      }

      if (onSubmit) {
        await onSubmit(formValues, payload);
        resetForm();
      } else {
        const response = await fetch(buildApiUrl(API_URL, "/lead/create"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Submission failed");
        }

        const result = await response.json();

        if (formValues.branch) {
          storeBranchData(formValues.branch);
        }

        // Show success toast immediately so it appears alongside navigation
        toast.success(successMessage || "Thank you! We'll contact you soon.", {
          duration: 4000,
          icon: "🎉",
          style: {
            background: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
          },
        });

        if (redirectToThankYou) {
          router.push("/thankyou");
          return;
        }

        window.dispatchEvent(new CustomEvent("formSubmissionSuccess"));

        resetForm();
      }
    } catch (error) {
      toast.error(error.message || "Submission failed. Please try again.", {
        duration: 4000,
        icon: "❌",
        style: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (honeypotValue && honeypotValue.trim().length > 0) {
      toast.success(successMessage);
      if (redirectToThankYou) {
        router.push("/thankyou");
        return;
      }
      resetForm();
      window.dispatchEvent(new CustomEvent("formSubmissionSuccess"));
      return;
    }

    if (isOtpVerified || !requireOtp) {
      if (!captchaToken && !isOtpVerified) {
        toast.error("Please click 'I'm not a robot' before submitting.", {
          duration: 4000,
          icon: "🔒",
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        });
        return;
      }
      await submitLeadData();
      return;
    }

    const fields = getFieldsForType();
    if (fields.includes("phone")) {
      const mobileValidation = validateIndianMobileNumber(formValues.phone);
      if (!mobileValidation.valid) {
        setErrors((prev) => ({ ...prev, phone: mobileValidation.message }));
        toast.error(mobileValidation.message);
        return;
      }
      const cleanedNumber = mobileValidation.cleaned;

      if (!captchaToken) {
        toast.error("Please click 'I'm not a robot' before submitting.", {
          duration: 4000,
          icon: "🔒",
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        });
        return;
      }

      setIsSendingOtp(true);
      try {
        let hs = handshakeData;
        if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
          hs = await fetchOtpHandshake(API_URL);
          setHandshakeData(hs);
        }

        const clientHash = await computeDynamicClientHash(
          cleanedNumber,
          hs.timestamp,
          hs.handshakeId
        );

        const res = await fetch(buildApiUrl(API_URL, "/lead/send-otp"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: cleanedNumber,
            recaptchaToken: captchaToken,
            handshakeId: hs.handshakeId,
            timestamp: hs.timestamp,
            signature: hs.signature,
            clientHash: clientHash,
            website_verification_code: honeypotValue || "",
          }),
        });

        const data = await res.json();

        if (data?.success) {
          setShowOtpModal(true);
          toast.success("OTP sent successfully via WhatsApp!", {
            duration: 3000,
            icon: "✅",
          });
        } else {
          toast.error(data?.message || "Failed to send OTP", {
            duration: 4000,
            icon: "❌",
          });
        }
      } catch (err) {
        toast.error(err.message || "OTP send failed. Please try again.", {
          duration: 4000,
          icon: "❌",
        });
      } finally {
        setIsSendingOtp(false);
        try {
          recaptchaRef.current?.reset();
        } catch {
          // ignore
        }
        setCaptchaToken(null);
        setHandshakeData(null);
      }
      return;
    }

    await submitLeadData();
  };

  const renderField = (fieldId) => {
    const field = ALL_FIELDS[fieldId];
    if (!field) return null;

    const value = formValues[fieldId];
    const error = errors[fieldId];

    if (fieldId === "phone") {
      return (
        <div key={fieldId} className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 text-sm font-medium select-none pointer-events-none">
              +91
            </span>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={value || ""}
              maxLength={10}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleChange(fieldId, digits);
                setIsOtpVerified(false);
              }}
              className={`w-full pl-12 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2a619d] transition
                ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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

      const availableCourses =
        courseOptions.length > 0
          ? courseOptions
          : COURSE_OPTIONS.map((course) => ({
              label: course,
              value: course,
            }));

      const filteredCourses = availableCourses.filter((course) =>
        course.label.toLowerCase().includes(courseSearchTerm.toLowerCase()),
      );

      // Clear search input handler
      const handleClearSearch = () => {
        setCourseSearchTerm("");
        // Focus the search input after clearing
        const searchInput = document.getElementById("course-search-input");
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
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showCourseDropdown ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.value}
                    onClick={() => {
                      handleChange(fieldId, course.value);
                      setCourseSearchTerm(course.label);
                      setShowCourseDropdown(false);
                    }}
                    className={`px-4 py-1 text-sm cursor-pointer hover:bg-blue-50
      ${
        value === course.value
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-gray-700"
      }`}
                  >
                    {course.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No courses found
                </div>
              )}
            </div>
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    if (
      fieldId === "career" ||
      fieldId === "qualification" ||
      fieldId === "prefferd"
    ) {
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
            <option value="" className="text-gray-400">
              {field.label}
            </option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldId === "branch") {
      const isBranchFixed =
        initialValues &&
        initialValues.branch &&
        initialValues.branch.toString().trim() !== "";

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
            {field.options.map((opt) => (
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
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
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
          {field.label}{" "}
          {field.required && <span className="text-red-500">*</span>}
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

      {/* Pillar 3: Invisible Honeypot field */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
          height: 0,
          width: 0,
          overflow: "hidden",
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <label htmlFor="website_verification_code_rf">Do not fill this</label>
        <input
          type="text"
          id="website_verification_code_rf"
          name="website_verification_code"
          value={honeypotValue}
          onChange={(e) => setHoneypotValue(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Pillar 1: Google reCAPTCHA v2 Checkbox right above Submit button */}
      {!isOtpVerified && (
        <div className="pt-2 pb-2 flex justify-center relative z-10 w-full overflow-visible touch-manipulation">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaSuccess}
            onExpired={handleCaptchaExpired}
            onErrored={handleCaptchaError}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isSendingOtp}
        className={`w-full py-2.5 px-4 rounded-md font-semibold text-white transition-all shadow-md
          ${
            isSubmitting || isSendingOtp
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2a619d] hover:bg-[#214d7d] active:scale-[0.98]"
          }`}
      >
        {isSendingOtp ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Sending OTP...
          </span>
        ) : isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Submitting...
          </span>
        ) : (
          buttonText
        )}
      </button>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phone={formValues.phone || ""}
        onVerified={async () => {
          setIsOtpVerified(true);
          setShowOtpModal(false);
          await submitLeadData();
        }}
        baseUrl={API_URL}
      />
    </form>
  );
}
