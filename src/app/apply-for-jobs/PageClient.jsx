"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaBox, FaBuilding } from "react-icons/fa";
import { FaShareSquare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PiBuildingsFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaFilter } from "react-icons/fa";
import { IoMdCopy } from "react-icons/io";
import { LuShare2 } from "react-icons/lu";
import Facebook from "../../assets/Facebook.png";
import instagram from "../../assets/Instagram.png";
import whatsapp from "../../assets/Whatsapp.png";
import { MdLock } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { MdRemoveRedEye } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import placed from "../../../public/images/placed.png";
import metadata from "../../app/metadata.json";
import Loader from "@/components/Loader";

const apiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL;

const PUBLIC_API_KEY =
  "aea23b3fa4fcfe4c64e9c714729fc06d2f00aef9ebb52b6e28aef92796f56713";

// Helper for authenticated requests
const authFetchOptions = (method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": PUBLIC_API_KEY,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return options;
};

const ApplyForJobs = () => {
  // ========== LEFT PANEL STATE (Original Job Listings) ==========
  const [mailValidation, setMailValidation] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [blockedEmails, setBlockedEmails] = useState({});
  const isFetchingRef = useRef(false);
  const [failedAttempts, setFailedAttempts] = useState({});
  const [filters, setFilters] = useState({
    job_type: "",
    workplace_type: "",
    experience: "",
  });
  const router = useRouter();

  // ========== JOB TABS STATE ==========
  const [jobTab, setJobTab] = useState("teks_verified"); // "public" | "teks_verified"

  // ========== MOBILE TAB STATE ==========
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "placements"

  // ========== RIGHT PANEL STATE (Placements with Infinite Scroll) ==========
  const [placements, setPlacements] = useState([]);
  const [placementsPage, setPlacementsPage] = useState(1);
  const [placementsHasMore, setPlacementsHasMore] = useState(true);
  const [placementsLoading, setPlacementsLoading] = useState(false);
  const [placementsError, setPlacementsError] = useState(null);
  const observerTarget = useRef(null);
  const mobileObserverTarget = useRef(null);
  const rightPanelContainerRef = useRef(null);

  // ---------- Left Panel: LocalStorage & Metadata Effects ----------
  useEffect(() => {
    const storedBlocked = localStorage.getItem("blockedEmails");
    if (storedBlocked) {
      try {
        setBlockedEmails(JSON.parse(storedBlocked));
      } catch (error) {
        console.error("Error parsing blocked emails:", error);
      }
    }
    const storedFailedAttempts = localStorage.getItem("failedAttempts");
    if (storedFailedAttempts) {
      try {
        setFailedAttempts(JSON.parse(storedFailedAttempts));
      } catch (error) {
        console.error("Error parsing failed attempts:", error);
      }
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("mail");
    if (storedEmail) {
      try {
        const parsedEmail = JSON.parse(storedEmail);
        setMailValidation(parsedEmail);
      } catch (error) {
        console.error("Error parsing stored email:", error);
        localStorage.removeItem("mail");
      }
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    document.title = metadata["apply-for-jobs"]?.dynamicTitle;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = metadata["apply-for-jobs"]?.description;
  }, []);

  // ---------- Left Panel: Fetch Jobs ----------
  const fetchJobs = async () => {
    setIsFetching(true);
    try {
      // Determine search parameter based on active tab
      let searchParam = debouncedSearchTerm;
      if (jobTab === "teks_verified" && !debouncedSearchTerm) {
        searchParam = "TEKS_VERIFIED";
      } else if (jobTab === "teks_verified" && debouncedSearchTerm) {
        searchParam = `TEKS_VERIFIED ${debouncedSearchTerm}`;
      } else if (jobTab === "public" && !debouncedSearchTerm) {
        searchParam = "PUBLIC_JOBS";
      } else if (jobTab === "public" && debouncedSearchTerm) {
        searchParam = `PUBLIC_JOBS ${debouncedSearchTerm}`;
      }

      const queryParams = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        search: debouncedSearchTerm || "",
        job_verified_type:
          jobTab === "public" ? "PUBLIC_JOBS" : "TEKS_VERIFIED", // 👈 clean separation instead of mixing into search
        "filter[job_type]": filters.job_type,
        "filter[workplace_type]": filters.workplace_type,
        "filter[experience]": filters.experience,
      });
      const response = await fetch(
        `${apiUrl}/jobs/job-postings?${queryParams}`,
        authFetchOptions(),
      );
      if (response.ok) {
        const data = await response.json();
        setJobs({
          ...data,
          reversedjobs: data?.reversedjobs || data?.jobs || data?.data || [],
        });
      } else {
        const errorText = await response.text();
        console.error("Job fetch error:", response.status, errorText);
        throw new Error(
          `Failed to fetch job data: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, filters, jobTab]);

  // ---------- Right Panel: Fetch Placements (with pagination) ----------
  const fetchPlacements = useCallback(async (page) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setPlacementsLoading(true);
    setPlacementsError(null);

    try {
      const url = `${apiUrl}/studentplace/placed-students?isVerifiedStudent=VERIFIED&page=${page}&pageSize=10&shuffle=true`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": PUBLIC_API_KEY,
        },
      });

      const data = await response.json();
      const newPlacements = data.data || [];

      setPlacements((prev) =>
        page === 1 ? newPlacements : [...prev, ...newPlacements],
      );

      setPlacementsHasMore(newPlacements.length === 10);
      setPlacementsPage(page);
    } catch (error) {
      setPlacementsError(error.message);
      setPlacementsHasMore(false);
    } finally {
      setPlacementsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPlacements(1);
  }, [fetchPlacements]);

  // Intersection Observer for infinite scroll — DESKTOP
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          placementsHasMore &&
          !placementsLoading &&
          !placementsError &&
          !isFetchingRef.current
        ) {
          fetchPlacements(placementsPage + 1);
        }
      },
      { threshold: 0.5, root: rightPanelContainerRef.current },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [
    fetchPlacements,
    placementsHasMore,
    placementsLoading,
    placementsError,
    placementsPage,
  ]);

  // Intersection Observer for infinite scroll — MOBILE
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          placementsHasMore &&
          !placementsLoading &&
          !placementsError &&
          !isFetchingRef.current
        ) {
          fetchPlacements(placementsPage + 1);
        }
      },
      { threshold: 0.5 },
    );

    if (mobileObserverTarget.current) {
      observer.observe(mobileObserverTarget.current);
    }

    return () => {
      if (mobileObserverTarget.current) {
        observer.unobserve(mobileObserverTarget.current);
      }
    };
  }, [
    fetchPlacements,
    placementsHasMore,
    placementsLoading,
    placementsError,
    placementsPage,
  ]);

  // ---------- Left Panel: Utility Functions ----------
  const copyLink = () => {
    navigator.clipboard.writeText(currentShareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1) setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchJobs();
    toggleDrawer();
  };

  const clearFilters = () => {
    setFilters({ job_type: "", workplace_type: "", experience: "" });
    fetchJobs();
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(jobs.totalJobs / itemsPerPage);
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 border rounded-xl ${
            currentPage === i ? "bg-[#216299] text-white" : "bg-gray-300"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }
    return (
      <div className="flex items-center">
        <button
          className={`px-4 py-3 mx-1 rounded-xl flex ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#2b6199] text-white"
          }`}
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>

        {pages}

        <button
          className={`px-4 py-3 mx-1 rounded-xl flex ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#2b6199] text-white"
          }`}
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `posted on: ${day}-${month}-${year}`;
  };

  const isJobExpired = (closingDate) => {
    if (!closingDate) return false;
    const currentDate = new Date();
    const targetDate = new Date(closingDate);
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
    return targetDateOnly < currentDateOnly;
  };

  const isEmailBlocked = (email) => blockedEmails[email] === true;
  const hasFailedAttempts = (email) => failedAttempts[email] >= 3;

  const markAsFailed = (email) => {
    const currentAttempts = failedAttempts[email] || 0;
    const updatedAttempts = currentAttempts + 1;

    const updatedFailed = {
      ...failedAttempts,
      [email]: updatedAttempts,
    };

    setFailedAttempts(updatedFailed);
    localStorage.setItem("failedAttempts", JSON.stringify(updatedFailed));

    if (updatedAttempts >= 3) {
      const updatedBlocked = { ...blockedEmails, [email]: true };
      setBlockedEmails(updatedBlocked);
      localStorage.setItem("blockedEmails", JSON.stringify(updatedBlocked));
    }
  };

  const handleViewDetails = async (jobId, job) => {
    // For Public Jobs, directly open verified_job_link in new tab
    if (jobTab === "public") {
      router.push(`/apply-for-jobs/${jobId}`);
      return;
    }
    // For Teks Verified Jobs, proceed with email verification
    if (mailValidation) {
      if (
        mailValidation.eligible_for_application === true &&
        mailValidation.jobready === true
      ) {
        router.push(`/apply-for-jobs/${jobId}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Not Eligible",
          text: "You are not job ready yet. Kindly come back after being job ready. Thank you.",
          confirmButtonColor: "#405189",
        });
      }
    } else {
      const storedEmail = localStorage.getItem("lastFailedEmail");
      if (storedEmail && hasFailedAttempts(storedEmail)) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Sorry, you are not enrolled in Teksacademy. Kindly enter your registered email ID",
          confirmButtonColor: "#405189",
        });
        return;
      }

      Swal.fire({
        title: "Please enter your registered Mail ID to access job details",
        input: "text",
        inputAttributes: { autocapitalize: "off" },
        customClass: { title: "swal-title-small" },
        showCancelButton: true,
        confirmButtonText: "Verify",
        showLoaderOnConfirm: true,
        confirmButtonColor: "#405189",
        inputValidator: (value) => {
          if (!value) return "Please enter your mail ID.";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value))
            return "Please enter a valid email address.";
          if (isEmailBlocked(value))
            return "Sorry, you are not enrolled in Teksacademy. Kindly enter your registered email ID";
          return null;
        },
        preConfirm: async (login) => {
          try {
            const response = await fetch(
              `${apiUrl}/jobs/chech_jobapply`,
              authFetchOptions("POST", { email: login }),
            );
            if (response.status === 200) {
              const responseBody = await response.json();
              if (responseBody.id && responseBody.email) {
                localStorage.setItem("mail", JSON.stringify(responseBody));
                localStorage.removeItem("lastFailedEmail");
                setMailValidation(responseBody);
                if (
                  responseBody.eligible_for_application === true &&
                  responseBody.jobready === true
                ) {
                  return {
                    success: true,
                    message: `Hi ${responseBody?.name}, Welcome Back!`,
                    userData: responseBody,
                  };
                } else {
                  return {
                    success: false,
                    message:
                      responseBody.message ||
                      "You are not job ready yet. Kindly come back after being job ready. Thank you.",
                    userData: responseBody,
                    isRegistered: true,
                  };
                }
              } else {
                markAsFailed(login);
                localStorage.setItem("lastFailedEmail", login);
                localStorage.removeItem("mail");
                return {
                  success: false,
                  message:
                    "You are not a registered Tek's Academy student. Access has been permanently blocked.",
                  isRegistered: false,
                };
              }
            } else {
              const errorData = await response.json();
              markAsFailed(login);
              localStorage.setItem("lastFailedEmail", login);
              localStorage.removeItem("mail");
              return {
                success: false,
                message:
                  errorData.message ||
                  "Sorry, you are not enrolled in Teksacademy. Kindly enter your registered email ID",
                isRegistered: false,
              };
            }
          } catch (error) {
            markAsFailed(login);
            localStorage.setItem("lastFailedEmail", login);
            localStorage.removeItem("mail");
            return {
              success: false,
              message: `Request failed: ${error}. Access has been permanently blocked.`,
              isRegistered: false,
            };
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          if (result.value.success) {
            Swal.fire({
              title: result.value.message,
              icon: "success",
              confirmButtonColor: "#405189",
            }).then(() => {
              router.push(`/apply-for-jobs/${jobId}`);
            });
          } else {
            Swal.fire({
              title: "Not Eligible",
              text:
                result.value.message ||
                "You are not job ready yet. Kindly come back after being job ready. Thank you.",
              icon: "error",
              confirmButtonColor: "#405189",
            }).then((retryResult) => {
              if (retryResult.isConfirmed) {
                localStorage.removeItem("mail");
                localStorage.removeItem("lastFailedEmail");
                setMailValidation(null);
                handleViewDetails(jobId, job);
              }
            });
          }
        }
      });
    }
  };

  const shareUrl = (elem) => {
    const url = `${window.location.origin}/apply-for-jobs`;
    setCurrentShareUrl(url);
    setIsOpen(true);
  };

  // =============================================
  // PLACEMENT SKELETON
  // =============================================
  const PlacementSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 animate-pulse">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-20 h-20 bg-gray-200 rounded-xl" />
          <div className="h-5 bg-gray-200 rounded-md w-20" />
        </div>
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="flex justify-between mt-4">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-6 bg-gray-200 rounded-full w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );

  // ---------- Job Card — Responsive ----------
  const JobCard = ({ job, showViewDetails = true, expired = false }) => (
    <>
      {/* MOBILE + TABLET (320px → 1023px) */}
      <div
        className={`block lg:hidden relative border border-gray-100 rounded-lg w-full shadow-md bg-white transition duration-200 ${
          !expired ? "hover:shadow-xl" : "opacity-70 cursor-not-allowed"
        }`}
      >
        <div className="p-2">
          <b className="text-md font-semibold text-gray-900 block">
            {job.title?.toLowerCase().replace(/^./, (c) => c.toUpperCase())}
          </b>

          <div className="flex flex-wrap mt-1 gap-x-2 gap-y-1">
            <div className="flex items-center py-1 border bg-[#f0dbca] rounded-full px-2">
              <GoDotFill className="text-[#5e4a3e] text-xs mr-1 scale-90" />
              <span className="text-xs">{job.experience}</span>
            </div>

            <div className="flex items-center py-1 border bg-[#c7cfe8] rounded-full px-2">
              <FaMapMarkerAlt className="text-xs mr-1" />
              <span className="text-xs">{job.location}</span>
            </div>
          </div>

          <span className="text-xs font-medium text-[#2D3748] mt-1 block">
            ({formatDate(job?.created_at || job?.posted_date)})
          </span>

          <div className="flex items-center justify-between mt-2 gap-2">
            <div>
              {showViewDetails && !expired ? (
                <button
                  onClick={() => handleViewDetails(job.id, job)}
                  className="bg-[#2a619d] text-white text-xs px-2 py-1.5 rounded-full flex items-center gap-1"
                >
                  <MdRemoveRedEye /> View Details
                </button>
              ) : expired ? (
                <span className="bg-gray-300 text-gray-500 text-xs px-2 py-1.5 rounded-full flex items-center gap-1">
                  <MdLock /> Application Closed
                </span>
              ) : null}
            </div>

            <button
              onClick={() => shareUrl(job)}
              className="bg-white text-[#2a619d] border border-[#2a619d] text-xs px-2 py-1.5 rounded-full flex items-center gap-1"
            >
              <LuShare2 />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP (≥1024px) */}
      <div
        className={`hidden lg:block relative border-t border-r border-b border-gray-100 border-l-4 border-l-[#2a619d] rounded-lg w-full shadow-md bg-white transition duration-200 ${
          !expired ? "hover:shadow-xl" : "opacity-70 cursor-not-allowed"
        }`}
      >
        <div className="p-2 pl-3">
          <div className="flex justify-between gap-2">
            <div>
              <b className="text-md font-semibold text-gray-900 capitalize block">
                {job.title?.toLowerCase().replace(/^./, (c) => c.toUpperCase())}
              </b>

              <div className="flex flex-wrap mt-1 gap-x-3 gap-y-1">
                <div className="flex items-center py-1 border bg-[#f0dbca] rounded-full px-2">
                  <GoDotFill className="text-[#5e4a3e] text-xs mr-1 scale-90" />
                  <span className="text-xs">{job.experience}</span>
                </div>

                <div className="flex items-center py-1 border bg-[#c7cfe8] rounded-full px-2">
                  <FaMapMarkerAlt className="text-xs mr-1" />
                  <span className="text-xs">{job.location}</span>
                </div>

                <span className="text-xs font-medium text-[#2D3748] py-1">
                  ({formatDate(job?.created_at || job?.posted_date)})
                </span>
              </div>
            </div>

            <div className="flex items-end flex-wrap gap-2">
              {showViewDetails && !expired ? (
                <button
                  onClick={() => handleViewDetails(job.id, job)}
                  className="bg-[#2a619d] text-white text-xs px-2 py-1.5 rounded-full flex items-center gap-1"
                >
                  <MdRemoveRedEye /> View Details
                </button>
              ) : (
                <span className="bg-gray-300 text-gray-500 text-xs px-2 py-1.5 rounded-full flex items-center gap-1">
                  <MdLock /> Application Closed
                </span>
              )}

              <button
                onClick={() => shareUrl(job)}
                className="bg-white text-[#2a619d] border border-[#2a619d] text-xs px-2 py-1.5 rounded-full flex items-center gap-1"
              >
                <LuShare2 />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // =============================================
  // PLACEMENT CARD
  // =============================================
  const PlacementCard = ({ placement }) => {
    const student = placement.student || placement;

    const imageName = placement.studentImg || student?.studentImg;

    const imageUrl = imageName
      ? `https://teksacademy.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/placedStudents/${imageName}`
      : null;

    const [imgError, setImgError] = React.useState(false);

    const formatCTC = (ctc) => {
      if (!ctc) return "N/A";
      const number = Number(ctc.toString().replace(/[^\d]/g, ""));
      if (!number) return "N/A";
      if (number < 100) {
        return `₹ ${number} LPA`;
      }
      const lpa = number / 100000;
      return `₹ ${lpa % 1 === 0 ? lpa : lpa.toFixed(1)} LPA`;
    };
    return (
      <div className="bg-[#fff] rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-400 transition-shadow duration-200 p-3">
        <div className="flex gap-3">
          <div className="relative flex flex-col items-center shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              {!imageUrl || imgError ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 text-xs text-center">
                  No Image
                </div>
              ) : (
                <Image
                  fill
                  src={imageUrl}
                  alt={student.name}
                  className="w-full h-full object-cover object-top rounded-full border border-gray-300"
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            <span className="absolute -bottom-2 bg-[#03a84e] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">
              Placed
            </span>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-blue-800 font-semibold text-[17px] leading-tight capitalize truncate w-full">
              {student.name
                ?.toLowerCase()
                .replace(/^./, (c) => c.toUpperCase()) || "Name not available"}
            </h3>

            <div className="flex justify-between items-start gap-2 min-w-0">
              {placement.designation && (
                <p className="text-black text-[14px] capitalize truncate flex-1 min-w-0 mt-0.5">
                  {placement.designation
                    ?.toLowerCase()
                    .replace(/^./, (c) => c.toUpperCase())}
                </p>
              )}
              <span className="bg-orange-50 text-orange-600 font-semibold text-xs px-2 py-0.5 rounded-full border border-orange-500 whitespace-nowrap shrink-0">
                {formatCTC(placement.CTC)}
              </span>
            </div>

            <div className="flex justify-between items-center mt-1 text-xs text-gray-500 min-w-0">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <HiOutlineOfficeBuilding className="text-gray-800 text-[10px] shrink-0" />
                <span className="truncate text-gray-800">
                  {placement.placementAt
                    ?.toLowerCase()
                    .replace(/^./, (c) => c.toUpperCase()) || "N/A"}
                </span>
              </div>
              <p className="text-[10px] mt-1 text-gray-500 whitespace-nowrap shrink-0 ml-2">
                ID: {student.registrationnumber || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------- Share Modal ----------
  const ShareModal = () =>
    isOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-[1px] z-50"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="bg-white rounded-lg max-w-lg w-full p-6 border border-black/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h5 className="text-xl font-semibold">Share This Job</h5>
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
              <Image src={whatsapp} alt="WhatsApp" width="28" height="28" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                currentShareUrl,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={Facebook} alt="Facebook" width="28" height="28" />
            </a>
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(
                currentShareUrl,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={instagram} alt="instagram" width="28" height="28" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentShareUrl}
              readOnly
              className="flex-1 border p-2 rounded"
            />
            <button onClick={copyLink} className="text-black p-2 rounded">
              <IoMdCopy />
            </button>
          </div>
          {copied && (
            <p className="text-green-500 mt-2">Link copied to clipboard!</p>
          )}
        </div>
      </div>
    );

  // ---------- Main Render ----------
  return (
    <div className="bg-gradient-to-br from-[#DDEBF1] to-[#F3F4F6] min-h-screen">
      {/* ========== MOBILE/TABLET TABS — visible below lg (< 1024px) ========== */}
      <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-all duration-200 border-b-2 ${
              activeTab === "jobs"
                ? "border-[#2b6199] text-[#2b6199] bg-[#f0f7ff]"
                : "border-transparent text-gray-500 bg-white"
            }`}
          >
            💼 Apply for Jobs
          </button>
          <button
            onClick={() => setActiveTab("placements")}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-all duration-200 border-b-2 ${
              activeTab === "placements"
                ? "border-[#03a84e] text-[#03a84e] bg-[#f0fff4]"
                : "border-transparent text-gray-500 bg-white"
            }`}
          >
            🎓 Placed Students
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 main_container mx-auto items-start">
        {/* ========== LEFT PANEL — Jobs ========== */}
        <div
          className={` w-full lg:w-8/12 mt-3 p-2 mb-4 ${
            activeTab === "jobs" ? "block" : "hidden lg:block"
          }`}
        >
          {/* JOB TYPE TABS - Public Jobs & Teks Verified */}
          <div className="w-full flex justify-center mb-6">
            <div className="flex gap-6 rounded-xl">
              {/* ✅ FIRST: Teks Verified */}
              <button
                onClick={() => {
                  setJobTab("teks_verified");
                  setCurrentPage(1);
                  setSearchTerm("");
                }}
                className={`px-4 rounded-full font-medium transition-all duration-200 ${
                  jobTab === "teks_verified"
                    ? "p-1 px-4 text-sm border border-[#eb6328] text-white bg-[#eb6328]"
                    : "p-1 px-4 text-sm border border-[#eb6328] text-[#eb6328] bg-[#fff]"
                }`}
              >
                Teks Verified Jobs
              </button>

              {/* SECOND: Public */}
              <button
                onClick={() => {
                  setJobTab("public");
                  setCurrentPage(1);
                  setSearchTerm("");
                }}
                className={`px-4 rounded-full font-medium transition-all duration-200 ${
                  jobTab === "public"
                    ? "p-1 px-4 text-sm border border-[#eb6328] text-white bg-[#eb6328]"
                    : "p-1 px-4 text-sm border border-[#eb6328] text-[#eb6328] bg-[#fff]"
                }`}
              >
                Public Jobs
              </button>
            </div>
          </div>

          {/* MOBILE + TABLET: Search full width + Filter button below */}
          <div className="flex flex-col gap-2 lg:hidden mt-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for jobs, locations..."
                className="w-full border-2  text-sm p-2 pl-4 pr-10 rounded-full focus:border-[#295F9D]  border-[#295F9D] focus:outline-none"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer" />
            </div>
            <button onClick={toggleDrawer} className="mx-auto">
              <span className="bg-[#fff] text-[#000] border border-gray-300 text-[14px] w-full flex justify-center rounded-md gap-x-1 p-2">
                <FaFilter className="mt-1 mr-1 scale-75" />
                Filters
              </span>
            </button>
          </div>

          {/* DESKTOP: Search + Filter side by side */}
          <div className="hidden lg:flex justify-between w-full mt-6">
            <div className="text-center">
              <div className="relative w-80 md:w-96 sm:w-fit">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search for jobs, companies, locations..."
                  className="w-full border-2 border-black text-sm p-2 pl-4 pr-10 rounded-full focus:border-[#295F9D] focus:outline-none"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer" />
              </div>
            </div>
            <div>
              <button className="btn btn-primary" onClick={toggleDrawer}>
                <span className="bg-[#fff] text-[#000] border border-gray-300 text-[16px] w-fit flex rounded-md gap-x-[2px] p-1 px-2">
                  <FaFilter className="mt-1 mr-2 scale-75" />
                  Filters
                </span>
              </button>
            </div>
          </div>

          {isFetching ? (
            <div className="text-center mt-8">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                {jobs?.reversedjobs?.map((elem, index) => {
                  const expired = isJobExpired(elem?.closing_date);
                  return (
                    <JobCard
                      key={elem.key || index}
                      job={elem}
                      showViewDetails={true}
                      expired={expired}
                    />
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                <div className="flex bg-white border-2 border-gray-200 rounded-md gap-x-2 p-2">
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    {[10, 25, 50, 75, 100].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {renderPageNumbers()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ========== MOBILE/TABLET: Placements Tab Panel ========== */}
        <div
          className={`w-full mt-2 px-2 pb-6 ${
            activeTab === "placements" ? "block lg:hidden" : "hidden"
          }`}
        >
          <h2
            className="relative flex items-center text-[16px] py-2 my-4 font-bold 
  bg-gradient-to-r from-[#f4b13e] via-[#fbd545] to-[#f4b13e] 
  text-black border-b border-gray-200 px-4 rounded-t-xl shadow-sm 
  overflow-visible h-[45px]"
          >
            <span className="relative z-30 flex items-center gap-2 pr-4 bg-inherit">
              🎓 Placed Students
            </span>

            <div className="absolute right-0 bottom-0 z-20 pointer-events-none">
              <Image
                src={placed}
                alt="Students"
                className="h-[60px] mr-2 w-auto object-contain animate-moveLeft"
                priority
              />
            </div>
          </h2>
          <div className="space-y-4">
            {placementsError && (
              <div className="text-center text-red-500 p-4">
                Failed to load placements: {placementsError}. Please try again
                later.
              </div>
            )}
            {placements.map((placement, idx) => (
              <PlacementCard
                key={placement.id ? `${placement.id}-${idx}` : idx}
                placement={placement}
              />
            ))}
            {placementsLoading && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <PlacementSkeleton key={i} />
                ))}
              </div>
            )}
            {!placementsHasMore && !placementsLoading && !placementsError && (
              <div className="text-center py-4 text-gray-500">
                No more placements
              </div>
            )}
            <div ref={mobileObserverTarget} className="h-5" />
          </div>
        </div>

        {/* ========== DESKTOP: Right Panel sticky sidebar ========== */}
        <div className="hidden lg:block w-full lg:w-4/12 sticky top-[140px] mb-4">
          <div
            className="mt-4 border border-gray-300 rounded-xl bg-[#F0F7FA] shadow-sm flex flex-col"
            style={{ height: "calc(100vh - 170px)" }}
          >
            <h2
              className="relative flex items-center text-[16px] py-2 font-bold 
  bg-gradient-to-r from-[#f4b13e] via-[#fbd545] to-[#f4b13e] 
  text-black border-b border-gray-200 px-4 rounded-t-xl shadow-sm 
  overflow-visible h-[45px]"
            >
              <span className="relative z-30 flex items-center gap-2 pr-4 bg-inherit">
                🎓 Placed Students
              </span>

              <div className="absolute right-0 bottom-0 z-20 pointer-events-none">
                <Image
                  src={placed}
                  alt="Students"
                  className="h-[60px] mr-2 
                  w-auto object-contain animate-moveLeft"
                  priority
                />
              </div>
            </h2>

            <div
              ref={rightPanelContainerRef}
              className="flex-1 overflow-y-auto p-2 space-y-4 bg-[#F0F7FA]"
            >
              {placementsError && (
                <div className="text-center text-red-500 p-4">
                  Failed to load placements: {placementsError}. Please try again
                  later.
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {placements.map((placement, idx) => (
                  <PlacementCard
                    key={placement.id ? `${placement.id}-${idx}` : idx}
                    placement={placement}
                  />
                ))}
              </div>

              {placementsLoading && (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <PlacementSkeleton key={i} />
                  ))}
                </div>
              )}

              {!placementsHasMore && !placementsLoading && !placementsError && (
                <div className="text-center py-4 text-gray-500">
                  No more placements
                </div>
              )}

              <div ref={observerTarget} className="h-5" />
            </div>
          </div>
        </div>

        {/* Filter Drawer */}
        {isDrawerOpen && (
          <>
            <div
              className="fixed top-0 left-0 z-50 w-screen h-screen bg-black opacity-50"
              onClick={toggleDrawer}
            ></div>
            <div
              className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white shadow-lg rounded-l-xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                isDrawerOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Filter Jobs
                  </h2>
                  <button
                    onClick={toggleDrawer}
                    className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1"
                    aria-label="Close filter panel"
                  >
                    <RxCross2 size={24} />
                  </button>
                </div>
                <form onSubmit={applyFilters} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="job_type"
                      className="block text-base font-medium text-gray-700"
                    >
                      Job Type
                    </label>
                    <select
                      id="job_type"
                      name="job_type"
                      value={filters.job_type}
                      onChange={handleFilterChange}
                      className="w-full text-lg p-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2b6199] focus:border-[#2b6199]"
                    >
                      <option value="">All</option>
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="workplace_type"
                      className="block text-base font-medium text-gray-700"
                    >
                      Workplace Type
                    </label>
                    <select
                      id="workplace_type"
                      name="workplace_type"
                      value={filters.workplace_type}
                      onChange={handleFilterChange}
                      className="w-full bg-white text-lg p-2.5 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2b6199] focus:border-[#2b6199]"
                    >
                      <option value="">All</option>
                      <option value="on-site">On-Site</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="experience"
                      className="block text-base font-medium text-gray-700"
                    >
                      Experience
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={filters.experience}
                      onChange={handleFilterChange}
                      className="w-full text-lg p-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2b6199] focus:border-[#2b6199]"
                    >
                      <option value="">All</option>
                      <option value="0-2">0-2 Years</option>
                      <option value="2-5">2-5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-4 py-2 text-base font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      Clear Filters
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-base font-medium text-white bg-[#2b6199] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Share Modal */}
        <ShareModal />
      </div>
    </div>
  );
};

export default ApplyForJobs;
