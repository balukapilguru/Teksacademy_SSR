"use client";

import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UniversityForm({ show, onClose, source }) {
  const router = useRouter();
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";

  // Disable background scroll
  useEffect(() => {
    if (!show) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      const savedY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(savedY || "0") * -1);
    };
  }, [show]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    sourceType: source,
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setError((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, mobile, sourceType } = formData;

    // Validation
    const errorMessages = {
      name: !name?.trim()
        ? "Please enter your name."
        : /\d/.test(name)
        ? "Name should not contain numbers."
        : name.trim().length < 3
        ? "Name must be at least 3 characters."
        : "",
      email: !email?.trim()
        ? "Please enter your email."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Please enter a valid email address."
        : "",
      mobile: (() => {
        const cleaned = mobile.replace(/\D/g, "");
        if (!cleaned) return "Please enter your phone number.";
        if (cleaned.length !== 10)
          return "Mobile number must be 10 digits.";
        if (!/^[6-9]\d{9}$/.test(cleaned))
          return "Mobile number must start with 6, 7, 8, or 9.";
        return "";
      })(),
    };

    if (Object.values(errorMessages).some((msg) => msg !== "")) {
      setError(errorMessages);
      setIsLoading(false);
      return;
    }

    try {
      const payload = { name, email, mobile, sourceType };

      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.status === 201) {
        toast.success("Form submitted successfully!");
        router.push("/thankyou");
        onClose();

        setFormData({
          name: "",
          email: "",
          mobile: "",
          sourceType: "",
        });

        return;
      } else {
        toast.error(responseData.message || "Failed to submit form.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[95%] max-w-md rounded-xl relative shadow-xl p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-black"
        >
          <IoClose size={25} />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-[#c41e3a]">
          Franchise Enquiry Form
        </h2>

        <p className="text-gray-600 mt-1 mb-6">
          Share your details below and our team will contact you soon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Full Name<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 text-black placeholder:text-gray-400 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />
            {error.name && (
              <p className="text-xs text-red-500 mt-1">{error.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Email<span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />
            {error.email && (
              <p className="text-xs text-red-500 mt-1">{error.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Phone Number<span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your phone number"
              value={formData.mobile}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                if (v.length <= 10)
                  handleChange({ target: { name: "mobile", value: v } });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />
            {error.mobile && (
              <p className="text-xs text-red-500 mt-1">{error.mobile}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-white font-semibold
              ${isLoading
                ? "bg-gray-400"
                : "bg-[#c41e3a] hover:bg-[#a21731]"
              }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

