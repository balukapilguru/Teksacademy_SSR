"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";

export default function GetDetailsModal({ show, onClose, course, courseName, source }) {
  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [universityOptions, setUniversityOptions] = useState([]);

  useEffect(() => {
    setSpecializationOptions([]);
    setUniversityOptions([]);
  }, [course]);

  const router = useRouter();
  useEffect(() => {
    if (!show) return;

    // Save current scroll position
    const scrollY = window.scrollY;

    // Lock body (works well on iOS & desktop)
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      // Unlock body and restore scroll position
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
    number: "",
    course: course?.course || "",
    university: "",
    specialization: "",
    universityId: "",
    courseId: "",
    sourceType: source,
  });


  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, course: course || "" }));

    if (courseName?.specializations) {
      setSpecializationOptions(courseName.specializations);
    }
  }, [course]);

  useEffect(() => {
    if (formData.specialization) {
      const selectedSpec = specializationOptions.find(
        (spec) => spec.name === formData.specialization
      );
      if (selectedSpec) {
        setUniversityOptions(selectedSpec.universities);
        setFormData((prev) => ({ ...prev, university: "" })); // reset previous university
      }
    } else {
      setUniversityOptions([]);
      setFormData((prev) => ({ ...prev, university: "" }));
    }
  }, [formData.specialization, specializationOptions]);

  const handleChange = (event) => {
    const { value, name } = event.target;

    if (name === "university") {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));

      const selectedUni = universityOptions?.find(
        (item) => item.universityName === value
      );

      if (selectedUni) {
        setFormData((prev) => ({
          ...prev,
          courseId: selectedUni.ProductId,
          universityId: selectedUni.sourceId,
          university: selectedUni.universityName,
        }));
      } else {

        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      return;
    }

    if (name === "name") {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");

      setFormData((prev) => ({
        ...prev,
        [name]: onlyLetters,
      }));

      setError((prev) => ({
        ...prev,
        [name]: "",
      }));

      return;
    }

    if (name === "number") {
      const numberValue = value.replace(/\D/g, "").slice(0, 10); // limit to 10 digits

      setFormData((prev) => ({
        ...prev,
        [name]: numberValue,
      }));

      setError((prev) => ({
        ...prev,
        [name]: "",
      }));

      return;
    }

    // Default case
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      name,
      email,
      number,
      course,
      university,
      specialization,
      courseId,
      sourceType,
      universityId,
    } = formData;

    const formDataNew = {
      name: name,
      email: email,
      mobile: number,
      course: courseId,
      university: universityId,
      sourceType   // keep original value from prop
      ,
    };
    const errorMessages = {
      name: !name.trim()
        ? "Please enter your name."
        : /\d/.test(name)
          ? "Name should not contain numbers."
          : name.trim().length <= 2
            ? "Name must be at least 3 characters."
            : "",
      email: !email.trim()
        ? "Please enter your email ID."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Please enter a valid email ID."
          : "",
      number: (() => {
        const cleaned = number.replace(/\D/g, ""); // remove non-digits
        if (!cleaned) return "Please enter your phone number.";
        if (cleaned.length !== 10)
          return "Please enter a valid 10-digit mobile number.";
        if (!/^[6-9]\d{9}$/.test(cleaned))
          return "Mobile number must start with 6, 7, 8, or 9.";
        return "";
      })(),

      course: !course
        ? "Please enter the course."
        : // : /\d/.test(course)
        // ? "Please enter a valid course."
        "",
      university: !university ? "Please select a university." : "",
      specialization: !specialization ? "Please select a specialization." : "",
    };

    const hasError = Object.entries(errorMessages).some(
      ([key, message]) => message !== ""
    );

    if (hasError) {
      setError(errorMessages);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://apierp.teksversity.com/lead/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataNew),
      });
      if (response.status === 201) {
        // router.push("/Thankyou");
        toast.success("Form submitted successfully!");
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
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setFormData((prev) => ({
        ...prev,
        name: "",
        number: "",
        email: "",
        university: "",
        specialization: "",
        sourceType: source
        ,
      }));

      setIsLoading(false);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center z-50 bg-[#2f3032]/80 transition-all duration-300 ease-out ${show ? "opacity-100 backdrop-blur-sm" : "opacity-0"
        }`}
    >
   <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#ffffff] rounded-xl border w-[56%]
           relative shadow-2xl transform transition-all duration-500 ease-out flex md:flex-row flex-col ${show
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-75 opacity-0 translate-y-8"
          } hover:shadow-3xl`}
      >
        <div className="hidden md:flex w-96 p-4 rounded-l-xl bg-[#c41e3a] flex-col items-center justify-center text-white">
          <Image
            src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/formimage.webp"
            alt="Join the Family Illustration"
            width={300}
            height={200}
            className="object-contain mb-4 rounded-md"
          />
          <div className="text-xl font-extrabold text-white mb-4 drop-shadow-md">
            Join The Family
          </div>
          <div className="flex space-x-4">

            {/* Facebook */}
            <div className="group p-2 rounded-full border border-white hover:border-[#002b80] transition-colors duration-300 flex items-center justify-center">
              <Link
                href="https://www.facebook.com/profile.php?id=61578853585345"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors duration-300 group-hover:text-[#002b80]"
              >
                <FaFacebookF size={14} />
              </Link>
            </div>

            {/* Instagram */}
            <div className="group p-2 rounded-full border border-white hover:border-[#002b80] transition-colors duration-300 flex items-center justify-center">
              <Link
                href="https://www.instagram.com/teksversity/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors duration-300 group-hover:text-[#002b80]"
              >
                <FaInstagram size={16} />
              </Link>
            </div>

            {/* YouTube */}
            <div className="group p-2 rounded-full border border-white hover:border-[#002b80] transition-colors duration-300 flex items-center justify-center">
              <Link
                href="https://www.youtube.com/@Teksversity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors duration-300 group-hover:text-[#002b80]"
              >
                <FaYoutube size={16} />
              </Link>
            </div>

            {/* LinkedIn */}
            <div className="group p-2 rounded-full border border-white hover:border-[#002b80] transition-colors duration-300 flex items-center justify-center">
              <Link
                href="https://www.linkedin.com/company/108117280/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors duration-300 group-hover:text-[#002b80]"
              >
                <FaLinkedinIn size={16} />
              </Link>
            </div>

          </div>


        </div>

        {/* Right Section: Form */}
        <div className="w-ful p-4 overflow-y-auto flex flex-col justify-center">
          <div className="text-2xl font-medium text-gray-800 grid justify-center mb-5">
            Get Course Details
          </div>

          <form className="md:space-y-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Full Name */}
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black mb-1 "
                >
                  Full Name
                  <span className="text-red-600 text-xs">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData?.name}
                  // onChange={(e) => {
                  //   const onlyLetters = e.target.value.replace(
                  //     /[^a-zA-Z\s]/g,
                  //     ""
                  //   );
                  //   setFormData({ ...formData, name: onlyLetters });
                  // }}
               className="w-full px-4 h-10 placeholder-gray-400 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                  onChange={handleChange}
                />
                {error?.name && (
                  <p className="text-red-500 text-xs mt-1 pl-2 h-2 ">
                    {error?.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Email
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your mail"
                  className="w-full px-4 h-10 placeholder-gray-400 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                  onChange={handleChange}
                  value={formData?.email}
                />
                {error?.email && (
                  <p className="text-red-500 text-xs mt-1 pl-2 h-2">
                    {error?.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="">
                <label
                  htmlFor="number"
                  className="block text-xs font-medium text-gray-700 mb-2"
                >
                  Phone Number
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  placeholder="Enter your phone number"
                className="w-full px-4 h-10 placeholder-gray-400 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
                  // onChange={(e) => {
                  //   // Allow only numbers
                  //   const value = e.target.value.replace(/\D/g, "");
                  //   setFormData({ ...formData, number: value });

                  // }}
                  onChange={handleChange}
                  value={formData?.number}
                />
                {error?.number && (
                  <p className="text-red-500 text-xs mt-1 pl-2 h-2">
                    {error?.number}
                  </p>
                )}
              </div>

              {/* Course */}
              <div className="">
                <label
                  htmlFor="course"
                  className="block text-xs font-medium text-gray-700 mb-2"
                >
                  Course
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Course"
                  name="course"
                  value={formData.course}
                  className="w-full p-2 border dark:text-black border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed transition-all duration-200"
                  disabled={true}
                />
                {error?.course && (
                  <p className="text-red-500 text-xs mt-1 pl-2 h-2">
                    {error?.course}
                  </p>
                )}
              </div>

              {/* University */}

              {/* Specialization */}
              <div className="">
                <label
                  htmlFor="specialization"
                  className="block text-xs font-medium text-gray-700 mb-2"
                >
                  Specialization
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <select
                  name="specialization"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#981b1b] transition-all duration-300 ease-in-out transform cursor-pointer"
                  onChange={handleChange}
                  value={formData.specialization}
                >
                  <option value="">Select a specialization</option>
                  {specializationOptions.map((spec) => (
                    <option key={spec.name} value={spec.ProductId}>
                      {spec.name}
                    </option>
                  ))}
                </select>

                {error?.specialization && (
                  <p className="text-red-500 text-xs mt-1 pl-2 h-2">
                    {error?.specialization}
                  </p>
                )}
              </div>
              <div className="">
                <label
                  htmlFor="university"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  University
                  <span className="text-red-500 text-sm font-medium">*</span>
                </label>
                <select
                  name="university"
                  className="w-full p-2 border border-gray-300 bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#981b1b] transition-all duration-300 ease-in-out transform"
                  onChange={handleChange}
                  value={formData.university}
                >
                  <option value="">Select a university</option>
                  {universityOptions.map((uni, index) => (
                    <option key={index} value={uni.universityName}>
                      {uni.universityName}
                    </option>
                  ))}
                </select>

                {error?.university && (
                  <p className="text-red-500 text-xs mt-1 pl-2 h-2">
                    {error?.university}
                  </p>
                )}
              </div>
            </div>{" "}
            {/* End of grid container */}
          <div className="flex justify-end">
              <button
                type="submit"
                className="mt-3 w-auto px-6 bg-[#c41e3a] h-10 cursor-pointer text-white rounded-md font-semibold text-sm 
               hover:bg-white hover:text-[#c41e3a]
               hover:border-2 hover:border-[#c41e3a]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold 
             p-2 rounded-full hover:bg-gray-100 transition-all flex items-center justify-center"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

