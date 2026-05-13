// ReusableForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Configuration for form fields
const formConfig = {
  fields: [
    {
      id: "career",
      label: "Career",
      type: "select",
      required: true,
      options: [
        { value: "web development", label: "Web Development" },
        { value: "datascience", label: "Data Science" },
        { value: "cloud / devops", label: "Cloud / DevOps" },
        { value: "cyber security", label: "Cyber Security" }
      ]
    },
    {
      id: "background",
      label: "Background",
      type: "select",
      required: true,
      options: [
        { value: "fresher/student", label: "Fresher/Student" },
        { value: "working it professional", label: "Working IT Professional" },
        { value: "career switcher", label: "Career Switcher" }
      ]
    },
    {
      id: "preferredMode",
      label: "Preferred Mode",
      type: "select",
      required: true,
      options: [
        { value: "online (live)", label: "Online (Live)" },
        { value: "offline (classroom)", label: "Offline (Classroom)" },
        { value: "hybrid", label: "Hybrid" }
      ]
    },
    {
      id: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name"
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "you@example.com"
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "phone",
      required: true,
      placeholder: "10-digit mobile number"
    },
    {
      id: "city",
      label: "City",
      type: "text",
      required: true,
      placeholder: "Enter your city"
    },
    {
      id: "branch",
      label: "Branch",
      type: "branch",
      required: true,
      options: [
        "ameerpet", "hiteccity", "secunderabad", "dilsukhnagar",
        "mehdipatnam", "kukatpally", "bangalore", "visakhapatnam", "salem"
      ]
    },
    {
      id: "course",
      label: "Course",
      type: "course",
      required: true,
      options: [
        "financial services and insurance", "excel", "autocad", "aws and devops",
        "bim", "business analytics", "cyber security", "data analytics",
        "data science", "digitial marketing", "full stack java", "full stack python",
        "generative ai", "medical coding", "multimedia", "revit",
        "salesforce", "sap fico", "sapmm", "testing tools", "vlsi"
      ]
    },
    {
      id: "message",
      label: "Your Message",
      type: "textarea",
      required: true,
      placeholder: "Write your message or questions here...",
      rows: 4
    }
  ],
  enableDownloadBrochure: true
};

// Helper functions - CORRECTED
function getBranchFromPathname(pathname) {
  const branchMap = {
    "best-software-training-institute-ameerpet": "ameerpet",
    "best-software-training-institute-hiteccity": "hiteccity",
    "best-software-training-institute-secunderabad": "secunderabad",
    "best-software-training-institute-dilsukhnagar": "dilsukhnagar",
    "best-software-training-institute-mehdipatnam": "mehdipatnam",
    "best-software-training-institute-kukatpally": "kukatpally",
    "best-software-training-institute-bangalore": "bangalore",
    "best-software-training-institute-visakhapatnam": "visakhapatnam",
    "best-software-training-institute-salem": "salem",
  };
  
  // CORRECTED: Use Object.entries() instead of .entries()
  for (const [key, value] of Object.entries(branchMap)) {
    if (pathname.includes(key)) return value;
  }
  return null;
}

function getCourseFromPathname(pathname) {
  const courseMap = {
    "banking-financial-services-and-insurance-course": "financial services and insurance",
    "best-advance-excel-course-training-institute": "excel",
    "best-autocad-course-training-institute": "autocad",
    "best-awsplusdevops-course-training-institute": "aws and devops",
    "best-bim-building-information-modeling-course-training-institute": "bim",
    "best-business-analytics-course-training-institute": "business analytics",
    "best-cyber-security-course-training-institute": "cyber security",
    "best-data-analytics-course-training-institute": "data analytics",
    "best-data-science-course-training-institute": "data science",
    "best-digital-marketing-course-training-institute": "digitial marketing",
    "best-full-stack-java-development-course-training-institute": "full stack java",
    "best-full-stack-python-development-course-training-institute": "full stack python",
    "best-generative-ai-course-training-institute": "generative ai",
    "best-medical-coding-course-training-institute": "medical coding",
    "best-multimedia-course-training-institute": "multimedia",
    "best-revit-mep-course-training-institute": "revit",
    "best-salesforce-admin-development-course-training-institute": "salesforce",
    "best-sap-fico-finance-and-controlling-course-training-institute": "sap fico",
    "best-sapmm-course-training-institute": "sapmm",
    "best-testingtools-course-training-institute": "testing tools",
    "best-vlsi-course-training-institute-hyderabad": "vlsi",
  };
  
  // CORRECTED: Use Object.entries() instead of .entries()
  for (const [key, value] of Object.entries(courseMap)) {
    if (pathname.includes(key)) return value;
  }
  return null;
}

// Main Reusable Component
export default function ReusableForm({ 
  onSubmit, 
  initialValues = {}, 
  hiddenFields = [], 
  readOnlyFields = [],
  customValidations = {},
  showBrochure = true,
  buttonText = "Submit Enquiry"
}) {
  const pathname = usePathname();
  
  // Initialize form values
  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    formConfig.fields.forEach(field => {
      initial[field.id] = initialValues[field.id] || "";
    });
    return initial;
  });
  
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  // URL binding for branch and course
  const branchFromUrl = getBranchFromPathname(pathname);
  const courseFromUrl = getCourseFromPathname(pathname);
  const isBranchPage = branchFromUrl !== null;
  const isCoursePage = courseFromUrl !== null;

  useEffect(() => {
    if (isBranchPage) {
      setFormValues(prev => ({ ...prev, branch: branchFromUrl }));
    }
  }, [branchFromUrl, isBranchPage]);

  useEffect(() => {
    if (isCoursePage) {
      setFormValues(prev => ({ ...prev, course: courseFromUrl }));
      setCourseSearchTerm(courseFromUrl);
    }
  }, [courseFromUrl, isCoursePage]);

  // Validation
  const validateField = (fieldId, value, allValues = formValues) => {
    const field = formConfig.fields.find(f => f.id === fieldId);
    if (!field) return "";
    
    if (field.required && !value?.toString().trim()) {
      return `${field.label} is required`;
    }
    
    if (fieldId === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      return "Email is invalid";
    }
    
    if (fieldId === "phone" && value && !/^\d{10}$/.test(value)) {
      return "Phone number must be 10 digits";
    }
    
    if (customValidations[fieldId]) {
      return customValidations[fieldId](value, allValues);
    }
    
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    formConfig.fields.forEach(field => {
      if (hiddenFields.includes(field.id)) return;
      const error = validateField(field.id, formValues[field.id], formValues);
      if (error) newErrors[field.id] = error;
    });
    
    if (!isOtpVerified && !hiddenFields.includes("phone")) {
      newErrors.otp = "Please verify OTP";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleChange = (fieldId, value) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleSendOtp = () => {
    const phoneError = validateField("phone", formValues.phone);
    if (phoneError) {
      setErrors(prev => ({ ...prev, phone: phoneError }));
      return;
    }
    alert(`OTP sent to ${formValues.phone}: 123456 (demo)`);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (formValues.otp === "123456") {
      setIsOtpVerified(true);
      alert("OTP verified successfully!");
      setErrors(prev => ({ ...prev, otp: "" }));
    } else {
      setErrors(prev => ({ ...prev, otp: "Invalid OTP. Use 123456 for demo." }));
    }
  };

  const handleDownloadBrochure = () => {
    if (!formValues.course) {
      alert("Please select a course first to download the syllabus.");
      return;
    }
    const syllabusUrls = {
      "financial services and insurance": "/syllabus/financial_services_insurance.pdf",
      "excel": "/syllabus/excel.pdf",
      "autocad": "/syllabus/autocad.pdf",
      "aws and devops": "/syllabus/aws_devops.pdf",
      "bim": "/syllabus/bim.pdf",
      "business analytics": "/syllabus/business_analytics.pdf",
      "cyber security": "/syllabus/cyber_security.pdf",
      "data analytics": "/syllabus/data_analytics.pdf",
      "data science": "/syllabus/data_science.pdf",
      "digitial marketing": "/syllabus/digital_marketing.pdf",
      "full stack java": "/syllabus/full_stack_java.pdf",
      "full stack python": "/syllabus/full_stack_python.pdf",
      "generative ai": "/syllabus/generative_ai.pdf",
      "medical coding": "/syllabus/medical_coding.pdf",
      "multimedia": "/syllabus/multimedia.pdf",
      "revit": "/syllabus/revit.pdf",
      "salesforce": "/syllabus/salesforce.pdf",
      "sap fico": "/syllabus/sap_fico.pdf",
      "sapmm": "/syllabus/sapmm.pdf",
      "testing tools": "/syllabus/testing_tools.pdf",
      "vlsi": "/syllabus/vlsi.pdf",
    };
    const url = syllabusUrls[formValues.course.toLowerCase()] || "/syllabus/default.pdf";
    alert(`Downloading syllabus for ${formValues.course}: ${url}`);
    window.open(url, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = { ...formValues };
      delete submitData.otp;
      onSubmit ? onSubmit(submitData) : console.log("Form submitted:", submitData);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    if (hiddenFields.includes(field.id)) return null;
    
    const value = formValues[field.id];
    const error = errors[field.id];
    const isReadOnly = readOnlyFields.includes(field.id);
    
    // Branch field with URL binding
    if (field.id === "branch") {
      if (isBranchPage || isReadOnly) {
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={value}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      }
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select {field.label}</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }
    
    // Course field with search dropdown
    if (field.id === "course") {
      const filteredCourses = field.options.filter(c =>
        c.toLowerCase().includes(courseSearchTerm.toLowerCase())
      );
      
      if (isCoursePage || isReadOnly) {
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={value}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
      }
      return (
        <div key={field.id} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={courseSearchTerm}
            onChange={(e) => {
              setCourseSearchTerm(e.target.value);
              setShowCourseDropdown(true);
              handleChange(field.id, "");
            }}
            onFocus={() => setShowCourseDropdown(true)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search or select course"
          />
          {showCourseDropdown && courseSearchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(c => (
                  <div
                    key={c}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      handleChange(field.id, c);
                      setCourseSearchTerm(c);
                      setShowCourseDropdown(false);
                    }}
                  >
                    {c}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">No courses found</div>
              )}
            </div>
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }
    
    // Phone field with OTP
    if (field.id === "phone") {
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={field.placeholder}
              disabled={isOtpVerified || isReadOnly}
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isOtpVerified || isReadOnly}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Send OTP
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          {otpSent && !isOtpVerified && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={formValues.otp || ""}
                onChange={(e) => handleChange("otp", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit OTP"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Verify OTP
              </button>
            </div>
          )}
          {isOtpVerified && <p className="text-green-600 text-xs mt-1">✓ Phone verified</p>}
          {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
        </div>
      );
    }
    
    // Textarea field
    if (field.type === "textarea") {
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            rows={field.rows}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.placeholder}
            readOnly={isReadOnly}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }
    
    // Select field
    if (field.type === "select") {
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isReadOnly}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }
    
    // Default input field
    return (
      <div key={field.id}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={field.type}
          value={value}
          onChange={(e) => handleChange(field.id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={field.placeholder}
          readOnly={isReadOnly}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };
  
  // Filter visible fields
  const visibleFields = formConfig.fields.filter(f => !hiddenFields.includes(f.id));
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {visibleFields.map(renderField)}
          
          {showBrochure && (
            <div>
              <button
                type="button"
                onClick={handleDownloadBrochure}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                📥 Download Brochure / Syllabus
              </button>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}