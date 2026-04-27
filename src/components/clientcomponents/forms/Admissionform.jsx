"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PrimaryButton from "@/utility/PrimaryButton";

const AdmissionForm = () => {
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    universityName: "",
    sourceType:""
  });

  const [formType, setFormType] = useState("student");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      mobile: "",
      email: "",
      name: "",
      universityName: "",
      sourceType:""
    }));

    setError({});
  }, [formType]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number validation - allow only digits, max 10 digits
    if (name === "mobile") {
      if (!/^\d*$/.test(value)) {
        setError((prev) => ({
          ...prev,
          mobile: "Only numbers are allowed",
        }));
        return;
      }

      if (value.length > 10) return;
    }

    // Prevent numbers in name field
    if (name === "name" && /\d/.test(value)) {
      setError((prev) => ({
        ...prev,
        name: "Name should not contain numbers",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    const { name, email, mobile, universityName } = formData;

    const errorMessages = {
      formType: !formType ? "Please select a type" : "",
      name: !name.trim()
        ? "Please enter the name"
        : name.trim().length <= 3
          ? "Name must be at least 3 characters"
          : "",
      email: !email.trim()
        ? "Enter the email ID"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Enter a valid email ID"
          : "",
      mobile: !/^[6-9]\d{9}$/.test(mobile)
        ? "Enter a valid 10-digit Indian mobile number (starting with 6-9)"
        : "",
      ...(formType === "university" && {
        universityName: !universityName.trim() ? "Enter university name" : "",
      }),
    };

    const hasError = Object.entries(errorMessages).find(
      ([_, msg]) => msg !== ""
    );
    if (hasError) {
      const [field, message] = hasError;
      setError((prev) => ({ ...prev, [field]: message }));
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        mobile,
        source: formType === "student" ? "freeCareer" : "universityCollab",
        inquiryType: formType === "student" ? 23 : 24,
        university: formType === "student" ? 145 : 144,
        course: formType === "student" ? 341 : 342,
        sourceType:formType === "student" ? 25 : 26,
        ...(formType === "university" && { universityName }),
      };

      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Form submitted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData?.message || "Failed to submit form.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);

      if (error?.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error?.request) {
        toast.error("No response from server. Check your network.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setFormData((prev) => ({
        ...prev,
        name: "",
        mobile: "",
        email: "",
        universityName: "",
      }));
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-3 lg:mt-0">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="flex justify-end space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-600"></span>
            <span className="h-3 w-3 rounded-full bg-blue-900"></span>
            <span className="h-3 w-3 rounded-full bg-blue-300"></span>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:px-6 lg:py-3 flex-1 flex flex-col">
          {/* Form Type Selection */}
          <div className="mb-3">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="formType"
                  value="student"
                  checked={formType === "student"}
                  onChange={() => {
                    setFormType("student");
                    setError((prev) => ({ ...prev, formType: "" }));
                  }}
                  className="text-[#c41e3a] focus:ring-[#c41e3a]"
                />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Student
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="formType"
                  value="university"
                  checked={formType === "university"}
                  onChange={() => {
                    setFormType("university");
                    setError((prev) => ({ ...prev, formType: "" }));
                  }}
                //  className="w-full px-4 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                
                />
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  University Collaboration
                </span>
              </label>
            </div>
            {error.formType && (
              <p className="text-red-500 h-2 text-sm mt-1">{error.formType}</p>
            )}
          </div>

          {/* Form Title */}
          <div className="text-xl sm:text-2xl font-semibold text-gray-900 transition-all duration-300 mb-3">
            {formType === "university"
              ? "Collaborate With Teksversity"
              : "Free Career Guidance"}
          </div>

          {/* Form */}
          <form
            onSubmit={formSubmit}
            className="space-y-3 sm:space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3 sm:space-y-4">
              {/* Name Field */}
              <div
                className={`relative ${formType == "student" ? "mt-1" : "mt-5"
                  }`}
              >
                <label
                  className={`font-medium text-gray-700 transition-all duration-300 ease-in-out ${formType === "university"
                    ? "absolute -top-2 left-3 bg-white px-1 z-10 text-sm"
                    : "block mb-1 text-sm"
                    }`}
                >
                  {formType === "university" ? "Contact Person" : "Full Name"}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={
                    formType === "university"
                      ? "Enter contact person name"
                      : "Enter your full name"
                  }
                 className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                />
                {error.name && (
                  <p className="text-red-500 text-sm h-1 mt-1">{error.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div
                className={`relative ${formType == "student" ? "" : "mt-5"}`}
              >
                 
                <label
                  className={`font-medium text-gray-700 transition-all duration-300 ease-in-out ${formType === "university"
                    ? "absolute -top-2 left-3 bg-white px-1 z-10 text-sm"
                    : "block mb-1 text-sm"
                    }`}
                >
                  {formType === "university" ? "Official Email" : "Email"}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    formType === "university"
                      ? "Enter official email"
                      : "Enter your email"
                  }
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                />
                {error.email && (
                  <p className="text-red-500 text-sm mt-1 h-1">{error.email}</p>
                )}
              </div>

              {/* Mobile Field */}
              <div
                className={`relative ${formType == "student" ? "" : "mt-5"}`}
              >
                <label
                  className={`font-medium text-gray-700 transition-all duration-300 ease-in-out ${formType === "university"
                    ? "absolute -top-2 left-3 bg-white px-1 z-10 text-sm"
                    : "block mb-1 text-sm"
                    }`}
                >
                  {formType === "university"
                    ? "Contact Number"
                    : "Mobile Number"}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder={
                    formType === "university"
                      ? "Enter contact number"
                      : "Enter your mobile number"
                  }
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                />
                {error.mobile && (
                  <p className="text-red-500 text-sm mt-1 h-1">
                    {error.mobile}
                  </p>
                )}
              </div>

              {/* University Name Field - Only for university form */}
              {formType === "university" && (
                <div
                  className={`relative opacity-0 animate-fadeInSlide ${formType == "student" ? "" : "mt-5"
                    }`}
                >
                  <label className="absolute -top-2 left-3 bg-white px-1 z-10 text-sm font-medium text-gray-700 transition-all duration-300 ease-in-out">
                    University Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    placeholder="Enter university name"
                    className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                  />
                  {error.universityName && (
                    <p className="text-red-500 text-sm h-1 mt-1">
                      {error.universityName}
                    </p>
                  )}
                </div>
              )}

              <input type="hidden" name="source" value="6" />
              <div className="">
                <PrimaryButton
                  type="submit"
                  vareiant="filled"
                  className="w-full mt-2 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : formType === "university" ? (
                    "Submit Partnership Request"
                  ) : (
                    "Submit"
                  )}
                </PrimaryButton>

              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdmissionForm;

