"use client";
import React, { useState, useEffect } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Image from "next/image";
import { toast } from "react-toastify";
import GetData from "@/utility/GetData";
import { PiArrowBendDoubleUpRightLight } from "react-icons/pi";


const ReserveYourSpots = ({ data, formDetails, branch = "Course",source }) => {
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";

  if (!data || !formDetails) return null;

  const {
    heading = [],
    image = [],
    whyJoinThisCourse = {},
    reserveYourSpotForm = {},
  } = data;

  const specializationList = formDetails?.specializations || [];


  const [universityOptions, setUniversityOptions] = useState([]);

  // ✨ Full form data
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    mobile: "",
    source: "freeCareer",
    sourceType:source,
    

    // Added correct course name
    courseName: formDetails?.courseName || "",

    specialization: "",
    universityName: "",
    sourceId: "",
    ProductId: "",
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Auto-update universities based on specialization
  useEffect(() => {
    if (!formData.specialization) {
      setUniversityOptions([]);
      setFormData((prev) => ({ ...prev, universityName: "" }));
      return;
    }

    const selectedSpec = specializationList.find(
      (spec) => spec.heading.trim() === formData.specialization.trim()
    );

    if (selectedSpec) {
      setUniversityOptions(selectedSpec.universities || []);
      setFormData((prev) => ({ ...prev, universityName: "" }));
    }
  }, [formData.specialization]);

  // 🔥 Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name validation
    if (name === "name") {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, name: onlyLetters }));
      setError((prev) => ({ ...prev, name: "" }));
      return;
    }

    // Mobile validation
    if (name === "mobile") {
      const num = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, mobile: num }));
      setError((prev) => ({ ...prev, mobile: "" }));
      return;
    }

    // University selection
    if (name === "universityName") {
      const selectedUni = universityOptions.find(
        (u) => u.universityName?.trim() === value.trim()
      );

      if (selectedUni) {
        setFormData((prev) => ({
          ...prev,
          universityName: selectedUni.universityName,
          sourceId: selectedUni.sourceId,
          ProductId: selectedUni.ProductId,
        }));
      }

      setError((prev) => ({ ...prev, universityName: "" }));
      return;
    }

    // Default update
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  // 🔥 Submit
  const formSubmit = async (e) => {
    e.preventDefault();

    const { name, mail, mobile, specialization, universityName,sourceType } = formData;

    const errorMessages = {
      name: !name.trim()
        ? "Please enter your name"
        : name.trim().length < 3
          ? "Name must be at least 3 characters"
          : "",
      mail: !mail.trim()
        ? "Enter your mail"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
          ? "Enter a valid mail"
          : "",
      mobile: !/^[6-9]\d{9}$/.test(mobile)
        ? "Enter a valid 10-digit mobile number"
        : "",
      specialization: !specialization ? "Please select specialization" : "",
      universityName: !universityName ? "Please select a university" : "",
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

    const newData = {
      course: formData?.ProductId,
      email: formData?.mail,
      mobile: formData?.mobile,
      name: formData?.name,
      university: formData?.sourceId,
      source: "freeCareer",
      sourceType 
    };

    try {
      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        toast.success("Form submitted successfully!");
      } else {
        const err = await response.json();
        toast.error(err?.message || "Failed to submit form.");
      }
    } catch {
      toast.error("Something went wrong.");
    }

    setIsLoading(false);

    // Reset form
    setFormData({
      name: "",
      mail: "",
      mobile: "",
      courseName: formDetails?.courseName || "",
      specialization: "",
      universityName: "",
      sourceId: "",
      ProductId: "",
      source: "freeCareer",
      sourceType:''
    });

    setUniversityOptions([]);
  };

  const { benefits = [], heading: benefitsHeading } = whyJoinThisCourse;
  const { formTitle, formSubtitle, formDescription } = reserveYourSpotForm;

  return (
    <div className="mt-6">
      <section className="relative bg-[#e1e7ec] rounded-lg overflow-hidden main_container">
        <div className="relative max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Left Section */}
            <div className="lg:col-span-3 space-y-6">
              {heading?.length > 0 && (
                <p className="text-[#c41e3a] text-sm font-medium mb-1">
                  {heading[0]}
                </p>
              )}

              {/* Logos */}
              {image?.length > 0 && (
                <div className="overflow-hidden">
                  <div className="scroll-container flex gap-4">
                    {[...image, ...image].map((uni, index) => (
                      <div key={index} className="flex justify-center px-2">
                        <Image
                          src={GetData({ url: uni.src })}
                          alt={uni.alt || "Logo"}
                          width={150}
                          height={70}
                          className="bg-white rounded-lg p-1 w-28 h-14 object-contain shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Benefits */}
              {benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    {benefitsHeading}
                  </h3>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-lg">
                    {benefits.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <PiArrowBendDoubleUpRightLight 
                          className="text-[#c41e3a] text-xl mt-1"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                {formTitle && (
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {formTitle}
                  </div>
                )}

                {formSubtitle && (
                  <p className="text-gray-700 mb-4">{formSubtitle}</p>
                )}

                <form onSubmit={formSubmit} className="space-y-3">
                  {/* Name */}
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-2 h-10 dark:text-black border text-black placeholder-gray-500 border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                  />
                  {error.name && (
                    <p className="text-red-600 text-xs">{error.name}</p>
                  )}

                  {/* Email */}
                  <input
                    type="text"
                    name="mail"
                    placeholder="Enter Email"
                    value={formData.mail}
                    onChange={handleChange}
                    className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                  />
                  {error.mail && (
                    <p className="text-red-500 text-xs">{error.mail}</p>
                  )}

                  {/* Mobile */}
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                     className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 text-gray-900 placeholder-gray-500 focus:border-[#981b1b] focus:ring-0 outline-none"
                  />
                  {error.mobile && (
                    <p className="text-red-500 text-xs">{error.mobile}</p>
                  )}

                  {/* Course */}
                  <input
                    type="text"
                    name="courseName"
                    value={branch}
                    disabled
                    className="cursor-not-allowed w-full px-2 h-10 border rounded-md bg-gray-200 text-gray-600 border-gray-300 text-gray-900 placeholder-gray-500"
                  />

                  {/* Specialization */}
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                     className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 text-gray-900 placeholder-gray-500 focus:border-[#981b1b] focus:ring-0 outline-none"
                  >
                    <option value="">Select Specialization</option>

                    {specializationList.map((spec, index) => (
                      <option key={index} value={spec.heading.trim()}>
                        {spec.heading.trim()}
                      </option>
                    ))}
                  </select>
                  {error.specialization && (
                    <p className="text-red-500 text-xs">
                      {error.specialization}
                    </p>
                  )}

                  {/* University */}
                  <select
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 text-gray-900 placeholder-gray-500 focus:border-[#981b1b] focus:ring-0 outline-none"
                  >
                    <option value="">Select University</option>

                    {universityOptions.map((uni, index) => (
                      <option key={index} value={uni.universityName}>
                        {uni.universityName}
                      </option>
                    ))}
                  </select>
                  {error.universityName && (
                    <p className="text-red-500 text-xs">
                      {error.universityName}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`cursor-pointer w-full h-10 px-6 rounded-md font-semibold text-sm flex items-center text-gray-900 placeholder-gray-500 justify-center space-x-2 text-white transition-all duration-200 transform ${isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#c41e3a] hover:bg-[#a31930]"
                      }`}
                  >
                    Request Callback
                  </button>

                  {/* {formDescription && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {formDescription}
                    </p>
                  )} */}
                </form>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-container {
            width: max-content;
            animation: scroll 20s linear infinite;
          }
        `}</style>
      </section>
    </div>
  );
};

export default ReserveYourSpots;
