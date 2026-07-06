"use client";

import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Loader from "../../components/Loader";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import {
  IoGridOutline,
  IoRibbonOutline,
  IoSchoolOutline,
  IoBookOutline,
} from "react-icons/io5";
import { MdChevronRight } from "react-icons/md";
import CourseCard from "@/components/allcoursepage/Coursecards";
import Popupform from "@/components/clientcomponents/forms/Popupform";
import { IoIosSearch } from "react-icons/io";
import { SelectedCourseContext } from "@/context/SelectedCourseContext";
import ReusableForm from "@/components/ReusableForm";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

// ================================
// HELPERS
// ================================
const formatLabel = (str = "") => {
  if (!str) return "";
  return str
    .toString()
    .replace(/([A-Z])/g, " $1")
    .replace(/_|-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const SUBCATEGORY_LABELS = {
  certification: "Certification",
  dualCertification: "Dual Certification",
  postGraduationCertification: "Post Graduation Certification",
  fastTrack: "Fast Track Courses",
  ug: "Under Graduation",
  pg: "Post Graduation",
  selfPacedLearning: "Self Paced Learning",
  liveLearningCourses: "Live Learning Courses",
};

// ================================
// BUILD COUNTS (for sidebar)
// ================================
function buildCounts(apiData) {
  if (!apiData) return null;
  const raw = apiData.counts || {};
  const totalCourses = Number(raw.allCourses || 0);
  const categoryCounts = {};

  if (raw.sections?.certifications) {
    const certTotal = Number(raw.sections.certifications.total || 0);
    categoryCounts["certifications"] = {
      total: certTotal,
      subCategory: {
        certification: { total: certTotal },
      },
    };
  }

  if (raw.sections?.academics) {
    const acad = raw.sections.academics;
    const subCategory = {};
    if (acad.subCategory?.ug) {
      const ug = acad.subCategory.ug;
      subCategory["ug"] = {
        total: Number(ug.total || 0),
        programs: ug.programs
          ? Object.fromEntries(
              Object.entries(ug.programs).map(([k, v]) => [k, Number(v)])
            )
          : undefined,
      };
    }
    if (acad.subCategory?.pg) {
      const pg = acad.subCategory.pg;
      subCategory["pg"] = {
        total: Number(pg.total || 0),
        programs: pg.programs
          ? Object.fromEntries(
              Object.entries(pg.programs).map(([k, v]) => [k, Number(v)])
            )
          : undefined,
      };
    }
    categoryCounts["academics"] = {
      total: Number(acad.total || 0),
      subCategory,
    };
  }
  return { totalCourses, categoryCounts };
}

// ================================
// SIDEBAR COMPONENT (unchanged)
// ================================
const Sidebar = ({ /* ... same props ... */ }) => {
  // keep your existing Sidebar implementation
  return null; // placeholder
};

// ================================
// MAIN PAGE
// ================================
export default function CoursesClient() {
  const contentRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [counts, setCounts] = useState(null);

  const {
    selectedCategory: contextCategory,
    setSelectedCategory: setContextCategory,
    selectedSubCategory: contextSubCategory,
    setSelectedSubCategory: setContextSubCategory,
  } = useContext(SelectedCourseContext);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState(null); // FIX: keep domain state

  const pageSize = 9;
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;
  const router = useRouter();

  // ========== FIX: Reset sidebar filters and page when domain changes ==========
  const handleDomainChange = (domain) => {
    setSelectedDomain(domain === "all" ? null : domain);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedProgram(null);
    setSearchTerm("");        // optional: clear search when switching domain
    setCurrentPage(1);
    // also clear context if needed
    setContextCategory(null);
    setContextSubCategory(null);
    // clear localStorage filters
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedSubCategory");
    localStorage.removeItem("selectedProgram");
  };

  // ========== FIX: Reset currentPage when domain changes (double guarantee) ==========
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDomain]);

  // ========== FIX: Unified data fetching (domain OR sidebar filters) ==========
  useEffect(() => {
    if (!baseUrl) return;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // --- Domain filter takes precedence ---
        if (selectedDomain) {
          params.append("domain", selectedDomain);
        } else {
          // Sidebar filters (only when no domain selected)
          if (selectedProgram) {
            params.append("branch", selectedProgram);
          } else {
            if (selectedCategory) params.append("category", selectedCategory);
            if (selectedSubCategory)
              params.append("subCategory", selectedSubCategory);
          }
          if (searchTerm.trim()) params.append("search", searchTerm.trim());
        }

        params.append("page", String(currentPage));
        params.append("limit", String(pageSize));

        const url = `${baseUrl}/api/v1/course?${params.toString()}`;
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await res.json();

        setCourses(data.data || []);
        if (data.counts) setCounts(buildCounts(data));

        // --- Correct pagination: use data.total (filtered total) ---
        const total = Number(data.total ?? data.counts?.allCourses ?? 0);
        const newTotalPages = Math.max(1, Math.ceil(total / pageSize));
        setTotalPages(newTotalPages);

        // if currentPage exceeds new totalPages, adjust
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to load courses");
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [
    selectedDomain,        // FIX: domain is now a dependency
    selectedCategory,
    selectedSubCategory,
    selectedProgram,
    searchTerm,
    currentPage,
    baseUrl,
    pageSize,
  ]);

  // ========== Context sync (unchanged) ==========
  useEffect(() => {
    if (contextCategory && contextCategory !== selectedCategory)
      setSelectedCategory(contextCategory);
    if (contextSubCategory && contextSubCategory !== selectedSubCategory)
      setSelectedSubCategory(contextSubCategory);
  }, [contextCategory, contextSubCategory]);

  useEffect(() => {
    if (selectedCategory !== contextCategory)
      setContextCategory(selectedCategory);
    if (selectedSubCategory !== contextSubCategory)
      setContextSubCategory(selectedSubCategory);
    selectedCategory
      ? localStorage.setItem("selectedCategory", selectedCategory)
      : localStorage.removeItem("selectedCategory");
    selectedSubCategory
      ? localStorage.setItem("selectedSubCategory", selectedSubCategory)
      : localStorage.removeItem("selectedSubCategory");
    selectedProgram
      ? localStorage.setItem("selectedProgram", selectedProgram)
      : localStorage.removeItem("selectedProgram");
  }, [selectedCategory, selectedSubCategory, selectedProgram]);

  // ========== Handlers ==========
  const handleProgramFilter = useCallback((branchValue) => {
    setSelectedProgram(branchValue);
  }, []);

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

   const handleSubmit = async (formValues, payload) => {
      try {
        const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const responseData = await response.json();
  
        if (!response.ok) {
          throw new Error(responseData.message || "Submission failed");
        }
  
        router.push("/thankyou");
      } catch (error) {
        console.error("Submission error:", error);
        throw error;
      }
    };

  const renderPageButtons = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages = [1];
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages.map((p, index) =>
      p === "..." ? (
        <span key={`dots-${index}`} className="px-2 text-gray-500 select-none">
          ...
        </span>
      ) : (
        <button
          key={`page-${p}-${index}`}
          onClick={() => setCurrentPage(Number(p))}
          className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-md border mx-1 text-sm transition
            ${currentPage === p ? "bg-[#2a619d] text-white" : "border-gray-300 text-gray-700 hover:bg-gray-200"}`}
        >
          {p}
        </button>
      )
    );
  };

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  const activeHeading = selectedDomain
    ? `${formatLabel(selectedDomain)} Courses`
    : "All Courses";

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center bg-white h-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="main_container h-auto mx-auto rounded-xl">
      {showModal && selectedCourse && (
        <Popupform
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourse}
          source={28}
          onSubmit={handleSubmit}
        />
      )}

      <div className="flex flex-col md:flex-row">
        {/* Main content */}
        <div
          ref={contentRef}
          className="pt-4 px-6 border-l-2 mt-4 w-full rounded-lg mb-4 border-blue-100 bg-[#f1f6ff]"
        >
          <div className="text-3xl font-bold text-black mb-2">
            {activeHeading}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="text-black">
              Browse our comprehensive course catalog
            </div>
            <div className="bg-white mt-4 w-full md:w-80 border-blue-100 border-2 rounded-lg">
              <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full font-medium border-blue-100 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Domain filter buttons */}
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            {["all", "coding", "data", "cloud", "designing", "marketing", "cyber"].map((domain) => {
              const isAll = domain === "all";
              return (
                <button
                  key={domain}
                  onClick={() => handleDomainChange(domain)}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border whitespace-nowrap transition
                    ${(isAll && selectedDomain === null) || selectedDomain === domain
                      ? "bg-[#2a619d] text-white border-[#2a619d]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                >
                  <span>{isAll ? "All" : `#${domain}`}</span>
                </button>
              );
            })}
          </div>

          {/* Course Cards */}
          <div className="mb-4 mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-72">
                <Loader />
              </div>
            ) : error ? (
              <p className="text-[#2a619d] mt-6">{error}</p>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {courses.map((course, index) => (
                  <div
                    key={course.id ?? `${course.programName || "course"}-${index}`}
                    className="rounded-lg hover:shadow-lg transition"
                  >
                    <CourseCard
                      course={course}
                      onGetDetailsClick={() => handleOpenModal(course)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">
                  No courses found for the selected filter
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center my-8">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center border rounded-md mx-1 hover:bg-gray-200 disabled:opacity-40 ${
                  currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <IoIosArrowBack />
              </button>
              {renderPageButtons()}
              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center border rounded-md mx-1 hover:bg-gray-200 disabled:opacity-40 ${
                  currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}