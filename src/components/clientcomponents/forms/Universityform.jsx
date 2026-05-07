"use client";
 import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UniversityForm({formDetails,
  show,
  onClose,
  universityData = null,
  course = {
    heading: "University Enquiry",
    specializations: [],
  },

  source
}) {
  const router = useRouter();
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";

  useEffect(() => {
    if (!show) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      const y = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(y || "0") * -1);
    };
  }, [show]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    specialization: "",
    university: universityData?.instituteName || "",
    ProductId: "",
    sourceId: "",
    sourceType:source
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Specializations from the course prop
  const specializations = course?.specializations || [];

  useEffect(() => {
    if (universityData?.instituteName) {
      setFormData((prev) => ({
        ...prev,
        university: universityData.instituteName,
      }));
    }
  }, [universityData]);

  const handleChange = (event) => {
    const { value, name } = event.target;

    if (name === "specialization") {
      // Find the selected specialization
      const selectedSpecialization = specializations.find(
        (spec) => spec?.heading?.trim() === value?.trim()
      );

      if (selectedSpecialization) {
        setFormData((prev) => ({
          ...prev,
          specialization: selectedSpecialization.heading || "",
          course: selectedSpecialization.heading || "", // Set course to specialization heading
          ProductId: selectedSpecialization.ProductId || "",
          sourceId: selectedSpecialization.sourceId || "",
        }));
        
      } else {
        setFormData((prev) => ({
          ...prev,
          specialization: value || "",
          course: value || "",
        }));
      }
    } else {
      setError((prev) => ({ ...prev, [name]: "" }));
      setFormData((prev) => ({ ...prev, [name]: value || "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      name = "",
      email = "",
      mobile = "",
      university = "",
      specialization = "",
      sourceType
    } = formData;

    const errorMessages = {
      name: !name?.trim()
        ? "Please enter your name."
        : /\d/.test(name)
          ? "Name should not contain numbers."
          : name.trim().length <= 2
            ? "Name must be at least 3 characters."
            : "",
      email: !email?.trim()
        ? "Please enter your email ID."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Please enter a valid email ID."
          : "",
      mobile: (() => {
        const cleaned = mobile.replace(/\D/g, "");
        if (!cleaned) return "Please enter your phone number.";
        if (cleaned.length !== 10)
          return "Please enter a valid 10-digit mobile number.";
        if (!/^[6-9]\d{9}$/.test(cleaned))
          return "Mobile number must start with 6, 7, 8, or 9.";
        return "";
      })(),
      specialization: !specialization?.trim()
        ? "Please select a course/specialization."
        : "",
      university: !university?.trim() ? "University name is required." : "",
    };

    const hasError = Object.values(errorMessages).some(
      (message) => message !== ""
    );

    if (hasError) {
      setError(errorMessages);
      setIsLoading(false);
      return;
    }

    try {
      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,

        // specialization: formData.specialization,
        university: formData.university,
        ProductId: formData.ProductId || "",
        sourceId: formData.sourceId || "",
        sourceType:source
      };


      const response = await fetch(`${baseUrl}/lead/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.status === 201) {
        // Success
        toast.success("Form submitted successfully!");
        router.push("/thankyou");

        // Reset form and close
        setFormData({
          name: "",
          email: "",
          mobile: "",
          //   course: "",
          specialization: "",
          university: universityData?.instituteName || "",
          source: "getDetails",
          ProductId: "",
          sourceId: "",
          sourceType:""
        });

        setIsLoading(false);
        onClose();
        return;
      } else {
        // Handle server errors
        const errorMessage = responseData.message || "Failed to submit form";
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed text-black inset-0 flex justify-center items-center z-50 bg-[#2f3032]/80 transition-all duration-300 ease-out ${show ? "opacity-100 backdrop-blur-sm" : "opacity-0"
        }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl border w-[95%] max-w-sm relative shadow-2xl transform transition-all duration-500 ease-out flex flex-col ${show
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-75 opacity-0 translate-y-8"
          } hover:shadow-3xl`}
      >
        <div className="w-full p-5 overflow-y-auto flex flex-col justify-center">
          <div className="text-2xl font-medium text-gray-800 grid justify-center mb-5">
            University Enquiry Form
          </div>

          <form className="space-y-1" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name<span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                />
                {error.name && (
                  <p className="text-red-400 text-xs mt-1">{error.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                />
                {error.email && (
                  <p className="text-red-400 text-xs mt-1">{error.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number<span className="text-red-600">*</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  placeholder="Enter your phone number"
                  value={formData.mobile || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      handleChange({ target: { name: "mobile", value } });
                    }
                  }}
                  maxLength={10}
                  className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                />
                {error.mobile && (
                  <p className="text-red-400 text-xs mt-1">{error.mobile}</p>
                )}
              </div>

              {/* University (Auto-filled, read-only) */}
              <div>
                <label
                  htmlFor="university"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  University<span className="text-red-600">*</span>
                </label>
                <input
                  id="university"
                  type="text"
                  name="university"
                  value={formData.university || ""}
                  readOnly
                  className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                />
                {error.university && (
                  <p className="text-red-400 text-xs mt-1">
                    {error.university}
                  </p>
                )}
              </div>

              {/* Specialization/Course Dropdown */}
              <div>
                <label
                  htmlFor="specialization"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Course/Specialization<span className="text-red-600">*</span>
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization || ""}
                  onChange={handleChange}
                  className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                >
                  <option value="">Select a course</option>
                  {specializations.map((spec, index) => (
                    <option
                      key={index}
                      value={spec.heading || ""}
                      data-productid={spec.ProductId}
                      data-sourceid={spec.sourceId}
                    >
                      {spec.heading}
                    </option>
                  ))}
                </select>
                {error.specialization && (
                  <p className="text-red-400 text-xs mt-1">
                    {error.specialization}
                  </p>
                )}
              </div>

              {/* Course (Auto-filled based on specialization) */}
              {/* <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Selected Course
                </label>
                <input
                  id="course"
                  type="text"
                  name="course"
                  value={formData.course || ""}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div> */}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer mt-5 w-full px-2 h-10 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 text-white transition-all duration-200 transform ${isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#ea6329] hover:bg-white hover:text-[#ea6329] hover:border-2 hover:border-[#ea6329] transition-all shadow-lg"
                }`}
            >
              Submit
            </button>
          </form>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-800 text-xl 
                              font-medium rounded-full p-2 flex items-center justify-center hover:bg-gray-100 
                              transition-all duration-200"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

