"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/utility/PrimaryButton"; // ⬅ ADD THIS

const countries = [
  "Select Country",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
];

const getSourceId = (country) => {
  switch (country) {
    case "United States":
      return 331;
    case "United Kingdom":
      return 332;
    case "Canada":
      return 333;
    case "Australia":
      return 334;
    default:
      return null;
  }
};

const Blueribbonform = () => {
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    source: 148,
    sourceType: 29,
  });

  const [errors, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError((prev) => ({ ...prev, [name]: "" }));
    if (name === "mobile" && value.length > 10) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, mobile, country, source } = formData;

    const validationErrors = {
      name: !name.trim()
        ? "Please enter your name"
        : /\d/.test(name)
          ? "Name should not contain numbers"
          : name.trim().length <= 3
            ? "Name must be at least 3 characters"
            : "",
      email: !email.trim()
        ? "Enter your email"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Enter a valid email address"
          : "",
      mobile: !/^[6-9]\d{9}$/.test(mobile)
        ? "Enter a valid 10-digit Indian mobile number (starting with 6-9)"
        : "",
      country: !country ? "Please select a country" : "",
    };

    const firstError = Object.entries(validationErrors).find(
      ([_, msg]) => msg !== "",
    );

    if (firstError) {
      const [field, message] = firstError;
      setError((prev) => ({ ...prev, [field]: message }));
      return;
    }

    const payload = {
      name,
      email,
      mobile,
      university: source,
      course: getSourceId(country),
      sourceType: 29,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Form submitted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData?.message || "Failed to submit form.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        country: "",
        source: 148,
        sourceType: 29,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 w-full pt-2">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name<span className="text-red-600 text-xs">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
            placeholder="Enter your full name"
          />
          <p
            className={`text-red-400 text-xs  ${errors.name ? "visible" : "invisible"}`}
          >
            {errors.name}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address<span className="text-red-600 text-xs">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 h-10 border dark:text-black border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
            placeholder="Enter your email address"
          />
          <p
            className={`text-red-400 text-xs ${errors.email ? "visible" : "invisible"}`}
          >
            {errors.email}
          </p>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number<span className="text-red-600 text-xs">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
            placeholder="Enter your mobile number"
          />
          <p
            className={`text-red-400 text-xs  ${errors.mobile ? "visible" : "invisible"}`}
          >
            {errors.mobile}
          </p>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium dark:text-black text-gray-700 mb-2">
            Preferred Study Destination
            <span className="text-red-600 text-xs">*</span>
          </label>
          <div className="w-full">
            <label htmlFor="country" className="sr-only">
              Select Country
            </label>

            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md  focus:border-[#981b1b] focus:ring-0 outline-none"
            >
              {countries.map((country, index) => (
                <option key={index} value={index === 0 ? "" : country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <p
            className={`text-red-400 text-xs ms-1 ${errors.country ? "visible" : "invisible"}`}
          >
            {errors.country}
          </p>
        </div>

        <PrimaryButton
          type="form"
          className="w-full h-10 mt-4"
          label={
            isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Get Free Consultation Now →"
            )
          }
        />
      </form>
    </div>
  );
};

export default Blueribbonform;
