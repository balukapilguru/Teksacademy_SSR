"use client";

import { useState, useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import GetData from "@/utility/GetData";

export default function Ebooksform({
  course,
  downloadLink,
  productId,
  sourceId,

  closePopup,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: productId || "", 
    university: sourceId || "", 
    sourceType: 37,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullDownloadLink, setFullDownloadLink] = useState("");
  const formRef = useRef(null);

 useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    course: productId,        
    university: sourceId,     
  }));

  if (downloadLink) {
    setFullDownloadLink(GetData({ url: downloadLink }));
  }
}, [productId, sourceId, downloadLink]);


  useEffect(() => {
    function handleClickOutside(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        closePopup();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePopup]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormToAPI = async () => {
    try {
      const res = await fetch("https://apierp.teksversity.com/lead/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to submit form!");
        return false;
      }

      return true;
    } catch (error) {
      toast.error("Something went wrong!");
      return false;
    }
  };

  const triggerDownload = () => {
    if (!fullDownloadLink) {
      toast.error("No download link available!");
      return false;
    }

    try {
      const link = document.createElement("a");
      link.href = fullDownloadLink;

      const filename = getFileNameFromUrl(fullDownloadLink);
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error("Download error:", error);

      window.open(fullDownloadLink, "_blank");
      return true;
    }
  };

  const getFileNameFromUrl = (url) => {
    try {
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      return filename || `${course.replace(/\s+/g, "_")}_ebook.pdf`;
    } catch {
      return `${course.replace(/\s+/g, "_")}_ebook.pdf`;
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email!");
      return;
    }
    if (!formData.mobile.trim()) {
      toast.error("Please enter your mobile number!");
      return;
    }
    if (formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formSubmitted = await submitFormToAPI();

      if (!formSubmitted) {
        setIsSubmitting(false);
        return;
      }

      toast.success("Form submitted successfully! Downloading your e-book...");

      setTimeout(() => {
        const downloadStarted = triggerDownload();

        if (downloadStarted) {
          setTimeout(() => {
            closePopup();
          }, 1000);
        }
      }, 500);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex justify-center items-center z-50">
      <div
        ref={formRef}
        className="bg-white w-[90%] max-w-md p-5 rounded-xl shadow-lg relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Download E-Book
            </h3>
            <p className="text-sm text-gray-600">
              Fill the form to download{" "}
              <span className="font-medium text-[#c41e3a]">{course}</span>
            </p>
          </div>

          <button
            className="p-2 bg-[#c41e3a] text-white rounded-lg hover:bg-[#a31a2d] transition"
            onClick={closePopup}
            type="button"
            disabled={isSubmitting}
          >
            <RxCross2 size={18} />
          </button>
        </div>

        <form className="space-y-1" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#c41e3a] focus:border-transparent outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#c41e3a] focus:border-transparent outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your 10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  handleChange({ target: { name: "mobile", value } });
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#c41e3a] focus:border-transparent outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Course (Read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              E-Book <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="course"
              value={course}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-3 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#c41e3a] hover:bg-[#a31a2d]"
            } text-white py-3 rounded-lg font-semibold text-base transition duration-300 flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Download E-Book Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
