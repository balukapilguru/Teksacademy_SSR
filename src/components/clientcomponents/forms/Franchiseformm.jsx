"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";

export default function GetDetailsForm({ source, image }) {
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
const baseUrl = 'https://apierp.teksversity.com';

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    university: "",
    specialization: "",
    universityId: "",
    sourceType: source,
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, number, universityId, sourceType } = formData;

    const formDataNew = {
      name,
      email,
      mobile: number,
      university: universityId,
      sourceType,
    };

    const errorMessages = {
      name:
        !name.trim()
          ? "Please enter your name."
          : name.trim().length <= 2
          ? "Name must be at least 3 characters."
          : /\d/.test(name)
          ? "Name should not contain numbers."
          : "",
      email:
        !email.trim()
          ? "Please enter your email ID."
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Please enter a valid email ID."
          : "",
      number:
        !number
          ? "Please enter your phone number."
          : number.length !== 10
          ? "Mobile number must be 10 digits."
          : !/^[6-9]\d{9}$/.test(number)
          ? "Mobile number must start with 6-9."
          : "",
    };

    const hasError = Object.values(errorMessages).some((msg) => msg !== "");

    if (hasError) {
      setError(errorMessages);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataNew),
      });

      response.status === 201
        ? toast.success("Form submitted successfully!")
        : toast.error("Something went wrong!");
    } catch {
      toast.error("Network error occurred");
    } finally {
      setFormData({
        name: "",
        number: "",
        email: "",
        university: "",
        specialization: "",
        sourcename: source,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-10">
      <Heading heading="Contact Us" />

      <div className="w-[90%] xl:w-[100%] max-w-5xl flex flex-col md:flex-row justify-between items-center gap-10">

        {/* LEFT IMAGE */}
       

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 lg:w-full bg-white shadow-xl border border-red-100 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-2 text-[#c41e3a]">
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
              {error.name && <p className="text-red-500 text-xs h-3 pt-1">{error.name}</p>}
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
              {error.email && <p className="text-red-500 text-xs  h-2">{error.email}</p>}
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
              {error.number && <p className="text-red-500 text-xs  h-2">{error.number}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c41e3a] text-white font-bold h-10 rounded-lg hover:bg-white hover:text-[#c41e3a] border-2 border-[#c41e3a] transition"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

