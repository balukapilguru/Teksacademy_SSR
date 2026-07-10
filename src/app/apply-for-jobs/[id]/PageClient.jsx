"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaShareSquare } from "react-icons/fa";
import Image from "next/image";

import Facebook from "../../../assets/Facebook.png";
import instagram from "../../../assets/Instagram.png";
import whatsapp from "../../../assets/Whatsapp.png";

import { IoMdDownload } from "react-icons/io";
import { IoMdCopy } from "react-icons/io";
import { PiBuildingsFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";

const apiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  process.env.NEXT_BLOGS_APPLY_API_URL;

const JobDetail = () => {
  const [open, setOpen] = useState(false);
  const [dis, setDis] = useState(false);
  const [studentDetails, setStudentDetails] = useState();
  const [formDataa, setFormData] = useState({
    highestqualification: "",
    stream: "",
    percentage: "",
    twelfth: "",
    tenth: "",
    location: "",
    resumee: "",
  });
  const formDataRef = useRef({});
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [applyModel, setApplyModel] = useState(false);
  const [formDat, setFormDat] = useState({
    qualification: "",
    stream: "",
    yearPassOut: "",
    qualificationPercentage: "",
    twelfthPercentage: "",
    tenthPercentage: "",
    location: "",
    resume: null,
  });
  const [errors, setErrors] = useState({});
  const [jobDetails, setJobDetails] = useState(null);
  const [link, setLink] = useState(
    "https://teksacademy.com/203/young-soft-india/qa-engineers",
  );
  const [customQuestionId, setCustomQuestionId] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState(null);
  const [mailValidation, setMailValidation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check stored email on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("mail");
    if (storedEmail) {
      try {
        const parsedEmail = JSON.parse(storedEmail);
        setStudentDetails(parsedEmail);
        setMailValidation(parsedEmail);
      } catch (error) {
        console.error("Error parsing stored email:", error);
        localStorage.removeItem("mail");
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`${apiUrl}/jobs/job-posting/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job data");
        }
        const data = await response.json();
        setJobData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) {
      fetchJobData();
    }
  }, [id]);

  // Application submission
  const postTheFormData = (formDat) => {
    setApplyModel(false);
    const formData = new FormData();

    formData.append("type", "submitStudentApplication");
    formData.append("job_posting_id", formDat?.job_posting_id);
    formData.append("applicant_name", formDat?.applicant_name);
    formData.append("applicant_email", formDat?.applicant_email);
    formData.append("applicant_phone", formDat?.applicant_phone);
    formData.append("current_location", formDat?.location);
    formData.append(
      "applicant_teksenrollmentid",
      formDat?.applicant_teksenrollmentid || "",
    );
    formData.append("highest_qualification", formDat?.qualification || "");
    formData.append("stream", formDat?.stream);
    formData.append(
      "highest_degree_percentage",
      formDat?.qualificationPercentage,
    );
    formData.append("twelve_percentage", formDat?.twelfthPercentage);
    formData.append("tenth_percentage", formDat?.tenthPercentage);

    formData.append("resume", formDat?.resume);
    formData.append("year_of_passout", formDat?.yearPassOut);
    formData.append("source", "teksacademy");

    const result = [];

    customQuestionId.forEach((id) => {
      let key = id.toString();
      if (formDat.hasOwnProperty(key)) {
        result.push({
          questionId: id,
          answer: formDat[key],
        });
      }
    });

    formData.append("extraquestions", JSON.stringify(result));

    fetch(`${apiUrl}/jobs/apply`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to submit application");
        }
        const responseData = await response.json();
        // console.log("Application submitted successfully:", responseData);
        router.push("/thankyou");
      })
      .catch((error) => {
        console.error("Error submitting application:", error);
        const errorMessage = error.message || "An unexpected error occurred.";
        Swal.fire("Error", errorMessage, "error");
      });
  };

  // Handle Apply button click - Check eligibility before applying
  const handleApply = () => {
    const jobType = jobData?.jobPosting?.job_verified_type;

    // ============================
    // PUBLIC JOB
    // ============================
    if (jobType === "PUBLIC_JOBS") {
      const link = jobData?.jobPosting?.verified_job_link;

      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
        return;
      }

      Swal.fire({
        icon: "info",
        title: "Walk-In Drive",
        text: "This is a Walk-In Drive. Please visit the venue on the mentioned date and time.",
        confirmButtonColor: "#405189",
      });

      return;
    }

    // ============================
    // TEKS VERIFIED
    // ============================

    if (!mailValidation) {
      Swal.fire({
        icon: "error",
        title: "Verification Required",
        text: "Please verify your registered email to apply.",
        confirmButtonColor: "#405189",
      });

      return;
    }

    if (!mailValidation.eligible_for_application || !mailValidation.jobready) {
      Swal.fire({
        icon: "error",
        title: "Not Eligible",
        text:
          mailValidation.message ||
          "You are not eligible to apply for this job.",
        confirmButtonColor: "#405189",
      });

      return;
    }

    jobData?.jobPosting?.customQuestions?.forEach((question) => {
      setCustomQuestionId((prev) =>
        prev.includes(question.id) ? prev : [...prev, question.id],
      );
    });

    const db = mailValidation;
    const student = db.students?.[db.students.length - 1] || {};

    setFormDat({
      qualification: student.highest_qualification || "",
      stream: student.stream || "",
      yearPassOut: student.year_of_passout || "",
      qualificationPercentage: student.highest_degree_percentage || "",
      twelfthPercentage: student.twelve_percentage || "",
      tenthPercentage: student.tenth_percentage || "",
      location: student.current_location || "",
      resume: student.resume || null,

      job_posting_id: jobData.jobPosting.id,

      applicant_name: db.name,
      applicant_email: db.email,
      applicant_phone: db.mobilenumber,
      applicant_teksenrollmentid: db.registrationnumber,
    });

    setApplyModel(true);
  };
  // Helper functions
  const dateValidation = (givenDate) => {
    const currentDate = new Date();
    const targetDate = new Date(givenDate);

    const currentDateOnly = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const targetDateOnly = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    );

    if (targetDateOnly >= currentDateOnly) {
      const formattedDate = `${targetDateOnly
        .getDate()
        .toString()
        .padStart(2, "0")}-${(targetDateOnly.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${targetDateOnly.getFullYear()}`;
      return `Apply Before : ${formattedDate}`;
    } else {
      return "Expired";
    }
  };

  const downloadCV = (fileUrl) => {
    const baseURL =
      "https://teksacademy.s3.ap-south-1.amazonaws.com/HRM/Applicants_CV/";
    if (fileUrl) {
      const fullURL = baseURL + fileUrl;
      const link = document.createElement("a");
      link.href = fullURL;
      link.download = fileUrl;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("CV is not available");
    }
  };

  const shareUrl = (elem) => {
    const url = `${window.location.origin}/apply-for-jobs/${elem?.id}`;
    setCurrentShareUrl(url);
    setIsOpen(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentShareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Application form validation and submission
  const submitTheForm = () => {
    const newErrors = {};

    const requiredFields = [
      "qualification",
      "stream",
      "yearPassOut",
      "qualificationPercentage",
      "twelfthPercentage",
      "tenthPercentage",
      "location",
      "resume",
    ];

    requiredFields.forEach((field) => {
      const value = formDat[field]?.toString().trim();

      if (!value) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())} is required`;
      } else if (field === "yearPassOut" && value.length !== 4) {
        newErrors[field] = "Year Pass Out must be exactly 4 digits";
      }
    });

    jobData?.jobPosting?.customQuestions?.forEach((question) => {
      if (
        question.manderatory === "1" &&
        (!formDat[question.id] || formDat[question.id].toString().trim() === "")
      ) {
        newErrors[question.id] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      postTheFormData(formDat);
    }
  };

  const handleChange = (eOrId, value, isRequired = false) => {
    if (typeof eOrId === "object") {
      const { name, value, files } = eOrId.target;

      if (name === "resume") {
        setFormDat((prev) => ({
          ...prev,
          resume: files[0],
        }));
      } else {
        if (
          [
            "qualificationPercentage",
            "twelfthPercentage",
            "tenthPercentage",
          ].includes(name)
        ) {
          if (!/^\d*$/.test(value)) return;
          if (value.length > 3) return;
        }

        if (name === "yearPassOut") {
          if (!/^\d*$/.test(value)) return;
          if (value.length > 4) return;
        }

        setFormDat((prev) => ({
          ...prev,
          [name]: value,
        }));

        if (errors[name] && value.trim() !== "") {
          setErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        }
      }
    } else {
      if (
        [
          "qualificationPercentage",
          "twelfthPercentage",
          "tenthPercentage",
        ].includes(eOrId)
      ) {
        if (!/^\d*$/.test(value) || value.length > 3) return;
      }

      if (eOrId === "yearPassOut") {
        if (!/^\d*$/.test(value) || value.length > 4) return;
      }

      setFormDat((prev) => ({
        ...prev,
        [eOrId]: value,
      }));

      if (isRequired && value.trim() !== "") {
        setErrors((prev) => ({
          ...prev,
          [eOrId]: "",
        }));
      }
    }
  };

  const inputClass = (field) =>
    `w-full p-2 border rounded ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  // Check if this is a public job and redirect to external link
  // useEffect(() => {
  //   if (jobData?.jobPosting?.job_verified_type === "PUBLIC_JOBS" && jobData?.jobPosting?.verified_job_link) {
  //     window.location.href = jobData.jobPosting.verified_job_link;
  //   }
  // }, [jobData]);

  // Render
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If public job, redirect happens in useEffect, so show loading or return null
  // if (jobData?.jobPosting?.job_verified_type === "PUBLIC_JOBS") {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Redirecting to job application...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Check if user is logged in, if not redirect to main jobs page
  // if (!mailValidation) {
  //   router.push('/apply-for-jobs');
  //   return null;
  // }

  return (
    <>
      {applyModel && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] p-0 flex flex-col">
            <h2 className="text-xl text-center mt-2 font-semibold mb-3 text-gray-800">
              Candidate Details
            </h2>
            <div className="overflow-y-auto p-8">
              <div className="space-y-5">
                {/* Qualification */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Highest Qualification
                    <span className="text-red-500 ml-1 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formDat.qualification}
                    onChange={handleChange}
                    className={inputClass("qualification")}
                  />
                  {errors.qualification && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.qualification}
                    </p>
                  )}
                </div>

                {/* Stream */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Stream<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="stream"
                    value={formDat.stream}
                    onChange={handleChange}
                    className={inputClass("stream")}
                  />
                  {errors.stream && (
                    <p className="text-red-500 text-sm pt-1">{errors.stream}</p>
                  )}
                </div>

                {/* Year Pass Out */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Year Pass Out<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="yearPassOut"
                    value={formDat.yearPassOut}
                    onChange={handleChange}
                    className={inputClass("yearPassOut")}
                  />
                  {errors.yearPassOut && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.yearPassOut}
                    </p>
                  )}
                </div>

                {/* Qualification Percentage */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Highest Qualification Percentage
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualificationPercentage"
                    value={formDat.qualificationPercentage}
                    onChange={handleChange}
                    className={inputClass("qualificationPercentage")}
                  />
                  {errors.qualificationPercentage && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.qualificationPercentage}
                    </p>
                  )}
                </div>

                {/* 12th & 10th Percentage */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      12th Percentage
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="twelfthPercentage"
                      value={formDat.twelfthPercentage}
                      onChange={handleChange}
                      className={inputClass("twelfthPercentage")}
                    />
                    {errors.twelfthPercentage && (
                      <p className="text-red-500 text-sm pt-1">
                        {errors.twelfthPercentage}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      10th Percentage
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenthPercentage"
                      value={formDat.tenthPercentage}
                      onChange={handleChange}
                      className={inputClass("tenthPercentage")}
                    />
                    {errors.tenthPercentage && (
                      <p className="text-red-500 text-sm pt-1">
                        {errors.tenthPercentage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Current Location<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formDat.location}
                    onChange={handleChange}
                    className={inputClass("location")}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Resume Upload */}
                <div>
                  <div className="flex flex-row justify-between">
                    <label className="block text-gray-600 font-medium mb-1">
                      Resume Upload<span className="text-red-500 ml-1">*</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      Please upload a PDF or DOC file.
                    </span>
                  </div>

                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {formDat?.resume && (
                    <span className="flex items-center gap-2 mt-1 text-gray-700 text-xs">
                      {typeof formDat.resume === "string"
                        ? formDat.resume
                        : formDat.resume.name}
                      <IoMdDownload
                        onClick={() => downloadCV(formDat.resume)}
                        className="cursor-pointer text-blue-600"
                      />
                    </span>
                  )}
                  {errors.resume && (
                    <p className="text-red-500 text-sm pt-1">{errors.resume}</p>
                  )}
                </div>

                {/* Custom Questions */}
                {jobData?.jobPosting?.customQuestions?.map((question) => {
                  const isRequired = question.manderatory === "1";
                  const fieldValue = formDat[question.id] || "";

                  const commonProps = {
                    id: question.id,
                    name: question.id,
                    value: fieldValue,
                    onChange: (e) =>
                      handleChange(question.id, e.target.value, isRequired),
                    className: `w-full border rounded-md p-2 ${
                      errors[question.id] ? "border-red-500" : "border-gray-300"
                    }`,
                  };

                  return (
                    <div key={question.id} className="mb-4">
                      <label className="block font-medium text-gray-700 mb-1">
                        {question.title}
                        {isRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {(() => {
                        switch (question.type) {
                          case "text":
                          case "number":
                          case "date":
                          case "time":
                            return (
                              <input type={question.type} {...commonProps} />
                            );
                          case "select":
                            return (
                              <select {...commonProps} value={fieldValue || ""}>
                                <option value="">Select an option</option>
                                {question.options?.map((opt, idx) => (
                                  <option key={idx} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            );
                          case "textarea":
                            return <textarea {...commonProps} rows={4} />;
                          default:
                            return <input type="text" {...commonProps} />;
                        }
                      })()}

                      {errors[question.id] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[question.id]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-center gap-4 mt-2 mb-2">
              <button
                onClick={() => setApplyModel(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-5 py-2 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={submitTheForm}
                className="bg-[#2a619d] hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Job Content */}
      <div className="main_container">
        <div className="flex">
          <div className="main_container flex flex-col justify-center items-center gap-y-5 p-2">
            {/* First Card */}
            <div className="2xl:w-6/12 lg:w-4/5 p-3 h-48 shadow-2xl rounded-lg mt-10">
              <div className="flex float-right items-center justify-center border-2 rounded-md p-1 mt-1 h-14 w-14">
                {jobData?.jobPosting?.company_logo ? (
                  <Image
                    src={`https://teksacademy.s3.ap-south-1.amazonaws.com/HRM/jobposting_companylogos/${jobData.jobPosting.company_logo}`}
                    alt="icon"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className="border-2 rounded-md border-gray-200 p-2">
                    <PiBuildingsFill className="w-7 h-8" />
                  </span>
                )}
              </div>
              <div>
                <div>
                  <b>{jobData?.jobPosting?.title}</b>
                </div>
                <div className="text-[#474d6a] text-[14px] sm:text-[16px]">
                  <div>{jobData?.jobPosting?.company_name}</div>
                </div>
                <div className="text-[#474d6a] text-[15px] font-normal flex gap-2 mt-2">
                  <FaMapMarkerAlt className="mt-1" />
                  {jobData?.jobPosting?.location}
                </div>
              </div>
              <div className="my-4 w-full">
                <hr />
              </div>
              <div className="flex gap-0 sm:gap-3 md:gap-12 lg:gap-20">
                <div className="flex w-full text-[#474d6a] text-[15px] font-normal">
                  {dateValidation(jobData?.jobPosting?.closing_date)}
                </div>
                {/* <div className="flex justify-end xs:ml-2 sm:ml-7 md:ml-16 gap-2">
                  <button
                    className="flex focus:outline-none active:outline-1 active:outline-blue-400 bg-[#2a619d] rounded-md gap-3 h-10 w-24 justify-center pt-1 text-white cursor-pointer"
                    onClick={() => shareUrl(jobData?.jobPosting)}
                  >
                    Share
                    <FaShareSquare className="mt-1" />
                  </button>

                  {dateValidation(jobData?.jobPosting?.closing_date) !==
                    "Expired" && (
                    <button
                      className="flex focus:outline-none active:outline-1 active:outline-blue-400 bg-[#2a619d] rounded-md w-20 h-10 justify-center pt-1 text-white cursor-pointer"
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                  )}

                  {isOpen && (
                    <div
                      className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-[1px]"
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className="bg-white rounded-lg max-w-lg w-full p-6 border border-black/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="text-xl font-semibold">
                            Share This Job
                          </h5>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500"
                            aria-label="Close"
                          >
                            &times;
                          </button>
                        </div>

                        <div className="flex justify-around items-center my-4">
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                              currentShareUrl,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={whatsapp}
                              alt="WhatsApp"
                              width="28"
                              height="28"
                            />
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              currentShareUrl,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={Facebook}
                              alt="facebook"
                              width="28"
                              height="28"
                            />
                          </a>
                          <a
                            href={`https://www.instagram.com/?url=${encodeURIComponent(
                              currentShareUrl,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={instagram}
                              alt="instagram"
                              width="28"
                              height="28"
                            />
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={currentShareUrl}
                            readOnly
                            className="flex-1 border p-2 rounded"
                          />
                          <button
                            onClick={copyLink}
                            className="text-black p-2 rounded"
                          >
                            <IoMdCopy />
                          </button>
                        </div>

                        {copied && (
                          <p className="text-green-500 mt-2">
                            Link copied to clipboard!
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            </div>

            {/* Second Card - Description */}
            <div className="2xl:w-6/12 lg:w-4/5">
              <div className="text-gray-600 text-[14px] lg:text-[16px] text-justify shadow-2xl rounded-lg p-7 mt-4 mb-16">
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobData?.jobPosting?.description,
                  }}
                />

                <div className="flex justify-end ml-16 mt-5 gap-2">
                  <button
                    className="flex focus:outline-none active:outline-1 active:outline-blue-400 bg-[#2a619d] rounded-md gap-3 h-10 w-24 justify-center pt-1 text-white cursor-pointer"
                    onClick={() => shareUrl(jobData?.jobPosting)}
                  >
                    Share
                    <FaShareSquare className="mt-1" />
                  </button>
                  {dateValidation(jobData?.jobPosting?.closing_date) !==
                    "Expired" && (
                    <button
                      className="flex focus:outline-none active:outline-1 active:outline-blue-400 bg-[#2a619d] rounded-md w-20 h-10 justify-center pt-1 text-white cursor-pointer"
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetail;
