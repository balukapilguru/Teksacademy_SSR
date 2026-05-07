"use client";
import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import Heading from "@/utility/Heading";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaBars, FaViacoin } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import Loader from "../../components/Loader";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import {
  IoGridOutline,
  IoRibbonOutline,
  IoSchoolOutline,
  IoBookOutline,
} from "react-icons/io5";
import CourseCard from "@/components/allcoursepage/Coursecards";
import Freecoursesform from "@/components/clientcomponents/forms/Freecoursesform";
import Popupform from "@/components/clientcomponents/forms/Popupform";
import { IoIosSearch } from "react-icons/io";
import { SelectedCourseContext } from "@/context/SelectedCourseContext";

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
  dualCertification: "Dual Certification",
  postGraduationCertification: "Post Graduation Certification",
  certification: "Teksversity Certification",
  fastTrack: "Fast Track Courses",

  ug: "Under Graduation",
  pg: "Post Graduation",

  selfPacedLearning: "Self Paced Learning",
  liveLearningCourses: "Live Learning Courses",
};

const Sidebar = ({
  counts,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedProgram,
  setSelectedProgram,
  onCloseMobile,
  handleProgramFilter,
  onClearSearch,
}) => {
  if (!counts || !counts.categoryCounts) return null;
  const categoryCounts = counts.categoryCounts;

  return (
    <div className="bg-white w-80">
      <div className="rounded-lg h-fit mr-4 mt-4 pb-2 shadow-sm bg-gray-50 border-2 border-[#f7fafa]">
        <div className="p-4">
          <div className="text-2xl font-semibold text-black mb-2">Course Categories</div>
          <div>Explore {counts?.totalCourses || 0} available</div>
        </div>
        <div className="border-gray-200 border-b-2 mr-2 ml-2"></div>

        {/* All Courses Button */}
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubCategory(null);
            setSelectedProgram(null);
            if (onClearSearch) onClearSearch();
            if (onCloseMobile) onCloseMobile();
          }}
          className={`mt-3 w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition
            ${!selectedCategory
              ? "border-[#c41e3a] bg-[#faf3f3] text-[#c41e3a]"
              : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          <span className="flex items-center gap-2">
            <IoGridOutline size={18} /> All Courses
          </span>
          <span className="px-2 py-1 mr-4 text-sm text-black">
            {counts?.totalCourses || 0}
          </span>
        </button>

        <div className="space-y-2">
          {Object.entries(categoryCounts).map(([category, details]) => (
            <div key={category} className="">
              <button
                onClick={() => {
                  const newCat = selectedCategory === category ? null : category;
                  setSelectedCategory(newCat);
                  setSelectedSubCategory(null);
                  setSelectedProgram(null);
                  if (onClearSearch) onClearSearch();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="cursor-pointer flex justify-between w-full p-3 py-2 text-md rounded-sm hover:bg-gray-200 transition"
              >
                <span
                  className={`flex items-center gap-2 ${selectedCategory === category
                      ? "text-[#c41e3a]"
                      : "text-gray-700"
                    }`}
                >
                  {category.toLowerCase().includes("cert") && (
                    <IoRibbonOutline size={18} className="mt-1" />
                  )}
                  {category.toLowerCase().includes("academic") && (
                    <IoSchoolOutline size={18} className="mt-1" />
                  )}
                  {category.toLowerCase().includes("self") && (
                    <IoBookOutline size={18} className="mt-1" />
                  )}
                  {formatLabel(category)}
                </span>

                <div className="flex items-center gap-1">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${selectedCategory === category
                        ? "bg-[#c41e3a] text-white"
                        : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {details.total}
                  </span>
                  {selectedCategory === category ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </div>
              </button>

              {selectedCategory === category && details.subCategory && (
                <div className="space-y-1 border-l-2 border-gray-200 ml-4 mr-4 pl-3">
                  {Object.entries(details.subCategory).map(
                    ([sub, subDetails]) => (
                      <div key={sub}>
                        <button
                          onClick={() => {
                            const newSub =
                              selectedSubCategory === sub ? null : sub;
                            setSelectedSubCategory(newSub);
                            setSelectedProgram(null);
                            if (onClearSearch) onClearSearch();
                            if (onCloseMobile) onCloseMobile();
                          }}
                          className={`flex justify-between items-center w-full text-sm h-9 rounded-md transition cursor-pointer
                            ${selectedSubCategory === sub
                              ? "text-[#c41e3a] bg-[#fff5f7] border border-[#c41e3a]"
                              : "text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          <span className="pl-2">
                            {SUBCATEGORY_LABELS[sub] || formatLabel(sub)}
                          </span>

                          <span
                            className={`px-2 py-1 mr-2 text-sm 
                              ${selectedSubCategory === sub
                                ? "text-[#c41e3a]"
                                : "text-gray-700"
                              }`}
                          >
                            {subDetails?.total || 0}
                          </span>
                        </button>

                        {category.toLowerCase() === "academics" &&
                          selectedSubCategory === sub &&
                          subDetails?.programs && (
                            <div className="mt-2 ml-2">
                              {Object.entries(subDetails.programs).map(
                                ([progKey, progValue]) => (
                                  <button
                                    key={progKey}
                                    onClick={() => {
                                      setSelectedProgram(progKey);
                                      if (typeof handleProgramFilter === "function")
                                        handleProgramFilter(progKey);
                                      if (onClearSearch) onClearSearch();
                                      if (onCloseMobile) onCloseMobile();
                                    }}
                                    className={`cursor-pointer w-full justify-between flex text-[14px] px-2 h-9 rounded-md 
                                      ${selectedProgram === progKey
                                        ? "text-[#c41e3a] font-semibold"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-[#c41e3a]"
                                      }`}
                                  >
                                    <span className="flex flex-row items-center gap-2">
                                      <RiCheckboxBlankCircleLine className="text-[10px]" />{" "}
                                      {formatLabel(progKey)}
                                    </span>
                                    <span className={`flex align-center justify-center rounded-full w-8 h-8 items-center px-2
                                      ${selectedProgram === progKey ? "text-[#c41e3a]" : "text-gray-700"}
                                    `}>
                                      {progValue}
                                    </span>
                                  </button>
                                )
                              )}
                            </div>
                          )
                        }
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// const Page = () => {
    export default function CoursesClient() {
  // ================================
  // STATE
  // ================================

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
  const [isAcademicCourse, setIsAcademicCourse] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const pageSize = 9;
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  // ================================
  // RESTORE FILTERS FROM LOCALSTORAGE (FIXED: now also restores program)
  // ================================

  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory");
    const savedSubCategory = localStorage.getItem("selectedSubCategory");
    const savedProgram = localStorage.getItem("selectedProgram");

    if (savedCategory) {
      setSelectedCategory(savedCategory);
      setContextCategory(savedCategory);
    }

    if (savedSubCategory) {
      setSelectedSubCategory(savedSubCategory);
      setContextSubCategory(savedSubCategory);
    }

    if (savedProgram) {
      setSelectedProgram(savedProgram);
      // Program is not in context, so no need to set context
    }
  }, []);

  // ================================
  // SYNC CONTEXT
  // ================================

  useEffect(() => {
    if (contextCategory && contextCategory !== selectedCategory) {
      setSelectedCategory(contextCategory);
    }

    if (contextSubCategory && contextSubCategory !== selectedSubCategory) {
      setSelectedSubCategory(contextSubCategory);
    }
  }, [contextCategory, contextSubCategory]);

  // ================================
  // SAVE TO CONTEXT + LOCALSTORAGE (including program)
  // ================================

  useEffect(() => {
    if (selectedCategory !== contextCategory) {
      setContextCategory(selectedCategory);
    }

    if (selectedSubCategory !== contextSubCategory) {
      setContextSubCategory(selectedSubCategory);
    }

    // Save category
    if (selectedCategory) {
      localStorage.setItem("selectedCategory", selectedCategory);
    } else {
      localStorage.removeItem("selectedCategory");
    }

    // Save subcategory
    if (selectedSubCategory) {
      localStorage.setItem("selectedSubCategory", selectedSubCategory);
    } else {
      localStorage.removeItem("selectedSubCategory");
    }

    // Save program
    if (selectedProgram) {
      localStorage.setItem("selectedProgram", selectedProgram);
    } else {
      localStorage.removeItem("selectedProgram");
    }
  }, [selectedCategory, selectedSubCategory, selectedProgram]);

  // ================================
  // FETCH COUNTS
  // ================================

  useEffect(() => {
    if (!baseUrl) return;

    let mounted = true;

    const fetchCounts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/course`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!mounted) return;
        setCounts(data.counts || {});
      } catch (err) {
        console.error("Counts fetch error:", err);
      }
    };

    fetchCounts();

    return () => {
      mounted = false;
    };
  }, [baseUrl]);

  // ================================
  // RESET PAGE WHEN FILTER CHANGES
  // ================================

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory, selectedProgram, searchTerm]);

  // ================================
  // HANDLE PROGRAM FILTER
  // ================================

  const handleProgramFilter = async (branchValue) => {
    setSelectedProgram(branchValue);
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (branchValue) params.append("branch", branchValue);
      params.append("page", String(1));
      params.append("limit", String(pageSize));
      if (searchTerm.trim()) params.append("search", searchTerm.trim());

      const url = `${baseUrl}/api/v1/course?${params.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      setCourses(data.data || []);
      const total = Number(data.total ?? data.counts?.totalCourses ?? 0);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load courses for branch");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FETCH COURSES BASED ON FILTERS
  // ================================

  useEffect(() => {
    if (!baseUrl) return;

    const controller = new AbortController();

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (selectedProgram) {
          params.append("branch", selectedProgram);
        } else {
          if (selectedCategory) params.append("category", selectedCategory);
          if (selectedSubCategory)
            params.append("subCategory", selectedSubCategory);
        }

        if (searchTerm.trim()) params.append("search", searchTerm.trim());

        params.append("page", String(currentPage));
        params.append("limit", String(pageSize));

        const url = `${baseUrl}/api/v1/course?${params.toString()}`;
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await res.json();

        setCourses(data.data || []);
        const total = Number(data.total ?? data.counts?.totalCourses ?? 0);
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load courses");
        }
      } finally {
        setLoading(false);
        setTimeout(() => {
          setPageLoading(false);
        }, 1000);
      }
    };

    fetchCourses();
    return () => controller.abort();
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedProgram,
    searchTerm,
    currentPage,
    baseUrl,
  ]);

  // ================================
  // MODAL
  // ================================

  const handleOpenModal = (course) => {
    const isAcademic = course?.category === "academics";
    setIsAcademicCourse(isAcademic);
    setSelectedCourse(course);
    setShowModal(true);
  };

  // ================================
  // PAGINATION BUTTONS
  // ================================

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
            ${
              currentPage === p
                ? "bg-[#c41e3a] text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {p}
        </button>
      )
    );
  };

  // ================================
  // LOADER
  // ================================

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center bg-white h-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="main_container mx-auto rounded-xl">
      {/* Modal at the top level */}
      {showModal && selectedCourse && (
        isAcademicCourse ? (
          <Popupform
            show={showModal}
            onClose={() => setShowModal(false)}
            course={selectedCourse?.heading}
            courseName={selectedCourse}
            source={28}
          />
        ) : (
          <Freecoursesform
            show={showModal}
            onClose={() => setShowModal(false)}
            course={selectedCourse?.universities ? selectedCourse : null}
            courseName={selectedCourse.programName}
            university={selectedCourse.universities?.[0]?.name || "Teksversity"}
            source={28}
          />
        )
      )}

      <div className="flex flex-col md:flex-row">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-between mb-3 px-2">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="cursor-pointer p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoMdClose size={22} /> : <FaBars size={22} />}
          </button>

          <div className="flex-1 text-center">
            <span className="text-base font-medium">
              {selectedProgram
                ? formatLabel(selectedProgram)
                : selectedSubCategory
                  ? formatLabel(selectedSubCategory)
                  : selectedCategory
                    ? formatLabel(selectedCategory)
                    : counts?.heading || "Courses"}
            </span>
          </div>

          <div style={{ width: 44 }} />
        </div>

        {/* Mobile sidebar */}
        {menuOpen && (
          <div className="md:hidden bg-white p-2 mb-3">
            <div className="flex justify-end mb-4">
              <div className="relative w-full md:w-80">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder={
                    counts?.searchBar?.placeholder || "Search for courses..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <Sidebar
              counts={counts}
              selectedCategory={selectedCategory}
              setSelectedCategory={(c) => {
                setSelectedCategory(c);
                setMenuOpen(false);
              }}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={(s) => {
                setSelectedSubCategory(s);
                setMenuOpen(false);
              }}
              selectedProgram={selectedProgram}
              setSelectedProgram={(p) => {
                setSelectedProgram(p);
                setMenuOpen(false);
              }}
              onCloseMobile={() => setMenuOpen(false)}
              handleProgramFilter={handleProgramFilter}
              onClearSearch={() => setSearchTerm("")}
            />
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden mb-8 md:block w-80">
          <Sidebar
            counts={counts}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            selectedProgram={selectedProgram}
            setSelectedProgram={setSelectedProgram}
            handleProgramFilter={handleProgramFilter}
            onClearSearch={() => setSearchTerm("")}
          />
        </div>

        {/* Main content */}
        <div className="pt-4 px-6 border-l-2 mt-4 w-full rounded-lg mb-4 border-blue-100 bg-[#f1f6ff]">
          <div className="text-4xl font-bold text-black mb-2">All Courses</div>
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="text-black justify-start">Browse our comprehensive course catalog</div>
            <div className=" bg-white mt-4 w-full md:w-80  justify-start border-blue-100 border-2 rounded-lg">
              <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
                <input
                  type="text"
                  placeholder={
                    counts?.searchBar?.placeholder || "Search courses..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full font-medium border-blue-100 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>
          <div className="mb-4 mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-72">
                <Loader />
              </div>
            ) : error ? (
              <p className="text-red-500 mt-6">{error}</p>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  {selectedCategory || selectedSubCategory || selectedProgram
                    ? "No courses found for the selected filter"
                    : "No courses found for the selected filter"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center my-8">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center border rounded-md mx-1 hover:bg-gray-200 disabled:opacity-40
                  ${currentPage === 1
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                  }`}
              >
                <IoIosArrowBack />
              </button>

              {renderPageButtons()}

              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center border rounded-md mx-1 hover:bg-gray-200 disabled:opacity-40
                  ${currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
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
};

// export default Page;