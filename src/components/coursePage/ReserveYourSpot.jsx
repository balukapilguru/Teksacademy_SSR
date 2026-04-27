"use client";
import React, { useState } from "react";
import { FaRegCheckCircle, FaArrowCircleRight } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { versityApi } from "../../serviceLayer/interseptor";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import PrimaryButton from "@/utility/PrimaryButton";
import { PiArrowBendDoubleUpRightLight } from "react-icons/pi";

const ReserveYourSpot = ({ data, formDetails,course,source }) => {
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";

  if (!data) return null;

  const {
    heading = [],
    image = [],
    whyJoinThisCourse = {},
    reserveYourSpotForm = {},
  } = data;

  const universitiesList = formDetails?.universities || [];
  const router = useRouter();

  // ✅ Form Data State - Same structure as first code
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    mobile: "",
    // source: "freeCareer",
    courseName: formDetails?.courseName || "",
    universityName: "",
    sourceId: "",
    ProductId: "",
     sourceType: source,
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Handle Input Changes - Same validation as first code
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation - Same as first code
    if (name === "mobile" && !/^\d*$/.test(value)) {
      setError((prev) => ({ ...prev, mobile: "Only numbers are allowed" }));
      return;
    }
    if (name === "mobile" && value.length > 10) return;

    if (name === "name" && /\d/.test(value)) {
      setError((prev) => ({
        ...prev,
        name: "Name should not contain numbers",
      }));
      return;
    }

    // ✅ Handle university selection - Same as first code
    if (name === "universityName") {
      const selectedUniversity = universitiesList.find(
        (u) => u?.universityName?.trim() === value?.trim()
      );

      if (selectedUniversity) {
        setFormData((prev) => ({
          ...prev,
          universityName: selectedUniversity.universityName || "",
          sourceId: selectedUniversity.sourceId || "",
          ProductId: selectedUniversity.productId || "",
        }));
        setError((prev) => ({ ...prev, universityName: "" }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Submit Form - Same logic as first code
  const formSubmit = async (e) => {
    e.preventDefault();

    const { name, mail, mobile, universityName ,sourceType} = formData;

    // Validation rules - Same as first code
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
        ? "Enter a valid 10-digit mobile number (starting with 6-9)"
        : "",
      universityName: !universityName.trim() ? "Please Select University" : "",
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
      sourceType:source
      
    };

    try {
      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        toast.success("Form submitted successfully!" || response?.statusText);
      } else {
        const errorData = await response.json();
        toast.error(errorData?.message || "Failed to submit form.");
      }
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error?.request) {
        toast.error("No response from server. Check your network.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
      setFormData({
        name: "",
        mail: "",
        mobile: "",
        courseName: formDetails?.courseName || "",
        universityName: "",
        sourceId: "",
        ProductId: "",
        source: "freeCareer",
        sourceType:source
      });
    }
  };

  const { benefits = [], heading: benefitsHeading } = whyJoinThisCourse;
  const { formTitle, formSubtitle, formDescription } = reserveYourSpotForm;

  return (
    <div className="mt-6">
      <section className="relative bg-[#e1e7ec] rounded-lg overflow-hidden main_container">
        <div className="relative max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 lg:gap-12">
            {/* Left Section */}
            <div className="lg:col-span-3 space-y-6">
              {heading?.length > 0 && (
                <div className="text-[#c41e3a] text-sm font-medium mb-1">
                  {heading[0]}
                </div>
              )}

              {/* Logos */}
              {image?.length > 0 && (
                <div className="overflow-hidden">
                  <div className="scroll-container flex gap-4">
                    {[...image, ...image].map((uni, index) => (
                      <div
                        key={index}
                        className="flex justify-center px-2 sm:px-4"
                      >
                        <Image
                          src={GetData({ url: uni.src })}
                          alt={uni.alt || "Partner Logo"}
                          width={150}
                          height={70}
                          className="bg-white rounded-lg p-1 w-28 h-14 sm:w-32 sm:h-16 object-contain shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Benefits */}
              {benefits?.length > 0 && (
                <div className="mt-8">
                  <Heading data={benefitsHeading}/>
                  {/* <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    {benefitsHeading}
                  </h3> */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-md md:text-lg">
                    {benefits.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <PiArrowBendDoubleUpRightLight
                          className="text-[#c41e3a] mt-[2px] flex-shrink-0"
                          size={22}
                        />
                        <span className="leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Form Section - Same form structure as first code */}
            <div className="lg:col-span-2 w-full md:w-[60%] lg:w-[60%] xl:w-[100%] mt-8 lg:mt-0">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                <div className="text-left mb-4">
                  {formTitle && (
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {formTitle}
                    </div>
                  )}
                  {formSubtitle && (
                    <p className="text-gray-700">{formSubtitle}</p>
                  )}
                </div>

                {/* ✅ Same form structure as first code */}
                <form onSubmit={formSubmit} className="space-y-4">
                  {["name", "mail", "mobile", "courseName"].map((field) => (
                    <div key={field}>
                      <input
                        type={field === "mail" ? "email" : "text"}
                        disabled={field === "courseName"}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={`Enter your ${
                          field === "mobile"
                            ? "Mobile Number"
                            : field.charAt(0).toUpperCase() + field.slice(1)
                        }`}
                        
                        className={`${field === "courseName"
                            ? "w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                            : "w-full px-3 py-2 border-2 rounded-xl transition-colors text-black duration-200 border-gray-200 focus:border-[#c41e3a] text-black focus:outline-none placeholder-gray-500"
                            

                        }`}
                      />
                      {error[field] && (
                        <p className="text-red-500 text-xs mt-1">
                          {error[field]}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* University Select - Same as first code */}
                  <div> 
                    <select
                      name="universityName"
                      value={formData.universityName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#981b1b]"
                    >
                      <option value="">Select a university</option>
                      {universitiesList.map((u, index) => (
                        <option
                          key={index}
                          value={u.universityName || ""}
                          data-productid={u.ProductId}
                          data-sourceid={u.sourceId}
                        >
                          {u.universityName}
                        </option>
                      ))}
                    </select>
                    {error.universityName && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.universityName}
                      </p>
                    )}
                  </div>

                  <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2"
                    variant="filled"
                    label="Request Callback"
                  >
                  </PrimaryButton>

                  {formDescription && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {formDescription}
                    </p>
                  )}
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
            display: flex;
            width: max-content;
            animation: scroll 20s linear infinite;
          }
        `}</style>
      </section>
    </div>
  );
};

export default ReserveYourSpot;

