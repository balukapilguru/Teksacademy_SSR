"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";

export default function Basicform({ source, image, course, sourcetype }) {
  const baseUrl = "https://apierp.teksversity.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    sourceType: sourcetype,
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { value, name } = event.target;

    if (name === "name") {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyLetters }));
      setError((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    if (name === "number") {
      const numberValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numberValue }));
      setError((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const { name, email, number } = formData;
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Please enter your name.";
    else if (name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters.";
    else if (/\d/.test(name))
      newErrors.name = "Name should not contain numbers.";

    if (!email.trim()) newErrors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email ID.";

    const cleanedMobile = number.replace(/\D/g, "");
    if (!cleanedMobile) newErrors.number = "Please enter your phone number.";
    else if (cleanedMobile.length !== 10)
      newErrors.number = "Mobile number must be 10 digits.";
    else if (!/^[6-9]\d{9}$/.test(cleanedMobile))
      newErrors.number = "Mobile number must start with 6-9.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      
      // Show toast errors for each field
      Object.entries(validationErrors).forEach(([field, errorMsg]) => {
        if (errorMsg) {
          toast.error(errorMsg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
      
      setIsLoading(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile: formData.number,
      course: course, 
      university: 8,
      sourceType: formData.sourceType,
    };

    try {
      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Check API response for success or specific errors
      if (response.status === 201 || response.ok) {
        toast.success("Form submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setIsSubmitted(true);
        
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          number: "",
          sourceType: sourcetype,
        });
        
       
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
        
      } else if (
        response.status === 403 &&
        data?.message?.toLowerCase().includes("already registered")
      ) {
       
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setError((prev) => ({
          ...prev,
          email: data.message,
        }));
        
      } else if (
        response.status === 403 &&
        data?.message?.toLowerCase().includes("phone")
      ) {
       
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        setError((prev) => ({
          ...prev,
          number: data.message,
        }));
        
      } else {
        // General API error
        toast.error(data?.message || "Something went wrong. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred. Please check your connection.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-10">
      <Heading heading="Contact Us" />

      <div className="w-[90%] xl:w-[60%] max-w-5xl flex flex-col md:flex-row justify-between items-center gap-10">
        {/* IMAGE */}
        <div className="w-full md:w-1/2 h-[430px] flex justify-center">
          <Image
            src={GetData({ url: image })}
            width={400}
            height={900}
            className="rounded-xl shadow-md object-cover"
            alt="Contact Form Image"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-1/2 bg-white shadow-xl border border-red-100 rounded-xl p-6 relative">
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
                <p className="text-gray-600">
                  Our team will contact you shortly.
                </p>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-2 text-[#ea6329]">
            Talk to Our Team
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Share your details below and our team will reach out shortly.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
              />
              {error.name && <p className="text-red-500 text-xs h-2">{error.name}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email<span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
              />
              {error.email && <p className="text-red-500 text-xs h-2">{error.email}</p>}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile No.<span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="number"
                placeholder="Enter your mobile number"
                value={formData.number}
                maxLength="10"
                onChange={handleChange}
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
              />
              {error.number && <p className="text-red-500 text-xs h-2">{error.number}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#ea6329] text-white font-bold h-10 rounded-lg hover:bg-white hover:text-[#ea6329] border-2 border-[#ea6329] transition ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}