"use client";
import { IoClose } from "react-icons/io5";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Freecoursesform({
  show,
  onClose,
  course,
  pdf,
  enableBrochureDownload = false,
  source,
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
    course: course?.heading || course?.courseName,
    university: "",
    sourceId: "",
    ProductId: "",
    specialization: "",
    // source: "getDetails",
    sourceType: source,
  });

  // console.log("Form Data:", formData);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [universitiesList, setUniversitiesList] = useState([]);
  const [brochureUrls, setBrochureUrls] = useState({});

  useEffect(() => {
    if (course) {
      setFormData((prev) => ({
        ...prev,
        course: course?.heading || course?.courseName,
      }));

      const universities = course.universities || [];
      setUniversitiesList(universities);

      // FIXED — Add base URL for all brochure files
      if (enableBrochureDownload) {
        const baseS3Url =
          "https://teksversity.s3.us-east-1.amazonaws.com/website/assets";

        const brochureMap = {};
        universities.forEach((uni) => {
          if (uni.brochure) {
            // → If `brochure` only contains file name, append base URL
            brochureMap[uni.universityName] = baseS3Url + uni.brochure;
          }
        });

        setBrochureUrls(brochureMap);
      }
    }
  }, [
    course?.heading,
    course?.courseName,
    JSON.stringify(course?.universities),
    enableBrochureDownload,
  ]);

  const handleChange = (event) => {
    const { value, name } = event.target;

    if (name === "university") {
      const selectedUniversity = universitiesList.find(
        (u) => u.universityName === value
      );

      if (selectedUniversity) {
        setFormData((prev) => ({
          ...prev,
          university: selectedUniversity.universityName,
          sourceId: selectedUniversity.sourceId,
          ProductId: selectedUniversity.productId,
        }));
      }
    } else {
      setError((prev) => ({ ...prev, [name]: "" }));
      setFormData((prev) => ({ ...prev, [name]: value || "" }));
    }
  };

  const downloadBrochure = () => {
    if (!enableBrochureDownload) return;

    const selectedUniversity = formData.university;

    if (!selectedUniversity) {
      toast.warning("Please select a university first");
      return;
    }

    const brochureUrl = brochureUrls[selectedUniversity]; 

    if (!brochureUrl) {
      toast.warning("Brochure not available for selected university");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = brochureUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const fileName =
        brochureUrl.split("/").pop() || `${selectedUniversity}_syllabus.pdf`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${selectedUniversity} syllabus`);
    } catch (error) {
      console.error("Error downloading brochure:", error);
      toast.error("Failed to download brochure");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, mobile, course, university } = formData;

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
      course: !course?.trim() ? "Please select a course." : "",
      university: !university?.trim()
        ? "Please select a university/institute."
        : "",
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
      // Try different payload formats to find what the server expects
      const newPayload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        course: formData?.ProductId,
        university: formData.sourceId,
        sourceType: source,
      };

      

      let lastResponse = null;

      try {
        const response = await fetch(`${baseUrl}/lead/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPayload),
        });

        const responseData = await response.json();

        lastResponse = { status: response.status, data: responseData };

        if (response.status === 201) {
          // Success
          toast.success("Form submitted successfully!");
          router.push("/thankyou");

          if (enableBrochureDownload) {
            downloadBrochure();
          }

          // Reset form and close
          setFormData((prev) => ({
            ...prev,
            name: "",
            mobile: "",
            email: "",
            university: "",
            // source: "getDetails",
          }));
          setIsLoading(false);
          onClose();
          return;
        }

        // If not success, try next payload format
      } catch (error) {
        console.error("Error with payload:", payload, error);
        lastResponse = { error: error.message };
      }

      // If we tried all formats and none worked
      if (lastResponse) {
        if (lastResponse.data?.message) {
          toast.error(`Server error: ${lastResponse.data.message}`);
        } else {
          toast.error(
            "Failed to submit form. Please check the console for details."
          );
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
      // Don't auto-close on error - let user see the error message
    }
  };
  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed text-black inset-0 flex justify-center items-center z-50 bg-[#2f3032]/80 transition-all duration-300 ease-out ${
        show ? "opacity-100 backdrop-blur-sm" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl border 
      w-[90%] 
      max-w-lg 
      md:max-w-xl 
      lg:max-w-lg
      relative shadow-2xl transform transition-all duration-500 ease-out flex flex-col ${
        show
          ? "scale-100 opacity-100 translate-y-0"
          : "scale-75 opacity-0 translate-y-8"
      } hover:shadow-3xl`}
      >
        <div className="w-full p-5 overflow-y-auto flex flex-col justify-center">
          <div className="text-2xl font-medium text-gray-800 grid justify-center mb-5">
            Get Course Details
          </div>

          <form className="space-y-1" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name<span className="text-red-600 text-xs">*</span>
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
                  Email<span className="text-red-600 text-xs">*</span>
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
                  Phone Number<span className="text-red-600 text-xs">*</span>
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

              {/* Course */}
              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course<span className="text-red-600 text-xs">*</span>
                </label>
                <input
                  id="course"
                  type="text"
                  name="course"
                  value={formData.course || ""}
                  disabled
                  className="cursor-not-allowed w-full px-2 h-10 p-2 border border-gray-300 rounded-lg bg-gray-200 text-gray-600"
                />
                {error.course && (
                  <p className="text-red-400 text-xs mt-1">{error.course}</p>
                )}
              </div>

              {/* University */}
              <div>
                <label
                  htmlFor="university"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  University/Institute
                  <span className="text-red-600 text-xs">*</span>
                </label>
                <select
                  id="university"
                  name="university"
                  value={formData.university || ""}
                  onChange={handleChange}
                  className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                >
                  <option value="">Select a university</option>
                  {universitiesList.map((u, index) => (
                    <option
                      key={index}
                      value={u.universityName || ""}
                      data-productid={u.productId}
                      data-sourceid={u.sourceId}
                    >
                      {u.universityName}
                      {enableBrochureDownload && u.brochure && " "}
                    </option>
                  ))}
                </select>
                {error.university && (
                  <p className="text-red-400 text-xs mt-1">
                    {error.university}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer mt-5 w-full py-4 px-6 h-9 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 text-white transition-all duration-200 transform ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#ea6329] hover:bg-white hover:text-[#ea6329] hover:border-2 hover:border-[#ea6329] transition-all shadow-lg"
              }`}
            >
              <span>
                {isLoading
                  ? "Submitting..."
                  : enableBrochureDownload
                  ? "Submit & Download Syllabus"
                  : "Submit"}
              </span>
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
