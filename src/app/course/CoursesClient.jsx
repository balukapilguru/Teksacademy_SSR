"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
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
import Freecoursesform from "@/components/clientcomponents/forms/Freecoursesform";
import Popupform from "@/components/clientcomponents/forms/Popupform";
import { IoIosSearch } from "react-icons/io";
import { SelectedCourseContext } from "@/context/SelectedCourseContext";

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

const CATEGORY_LABELS = {
  certifications: "Industry Ready Programs",
  academics: "Academics",
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
// BUILD COUNTS
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
// BREADCRUMB
// Rules:
//   - No selection           → nothing rendered (heading = "All Courses")
//   - Only category          → just heading, no breadcrumb trail needed
//   - category + subCategory → "Industry Ready Programs > Certification"
//   - category + sub + prog  → "Academics > Under Graduation > BBA"
//
// Clickable crumbs navigate UP the tree (reset children).
// Last crumb is plain text (not clickable).
// ================================

const Breadcrumb = ({
  selectedCategory,
  selectedSubCategory,
  selectedProgram,
  setSelectedCategory,
  setSelectedSubCategory,
  setSelectedProgram,
}) => {
  // Only render when there is something BELOW the top category selected
  if (!selectedCategory || (!selectedSubCategory && !selectedProgram)) {
    return null;
  }

  const crumbs = [];

  // Category crumb — always clickable (resets sub + program)
  crumbs.push({
    label: CATEGORY_LABELS[selectedCategory] || formatLabel(selectedCategory),
    onClick: () => {
      setSelectedSubCategory(null);
      setSelectedProgram(null);
    },
    active: false,
  });

  // SubCategory crumb
  if (selectedSubCategory) {
    const subLabel =
      SUBCATEGORY_LABELS[selectedSubCategory] ||
      formatLabel(selectedSubCategory);

    if (selectedProgram) {
      // Clickable — resets program only
      crumbs.push({
        label: subLabel,
        onClick: () => setSelectedProgram(null),
        active: false,
      });
    } else {
      // Last crumb — not clickable
      crumbs.push({
        label: subLabel,
        onClick: null,
        active: true,
      });
    }
  }

  // Program crumb — always last, not clickable
  if (selectedProgram) {
    crumbs.push({
      label: formatLabel(selectedProgram),
      onClick: null,
      active: true,
    });
  }

  return (
    <nav className="flex items-center flex-wrap gap-1 mb-1">
      {crumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <MdChevronRight className="text-gray-400 text-xl flex-shrink-0" />
          )}
          {crumb.active ? (
            <span className="text-sm font-semibold text-gray-800">
              {crumb.label}
            </span>
          ) : (
            <button
              onClick={crumb.onClick}
              className="text-sm font-medium text-[#c41e3a] hover:underline cursor-pointer"
            >
              {crumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ================================
// SIDEBAR
// ================================

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
  const { categoryCounts } = counts;

  return (
    <div className="bg-white w-80">
      <div className="rounded-lg h-fit mr-4 mt-4 pb-2 shadow-sm bg-gray-50 border-2 border-[#f7fafa]">
        <div className="p-4">
          <div className="text-2xl font-semibold text-black mb-2">
            Course Categories
          </div>
          <div>Explore {counts?.totalCourses || 0} available</div>
        </div>
        <div className="border-gray-200 border-b-2 mr-2 ml-2"></div>

        {/* All Courses */}
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubCategory(null);
            setSelectedProgram(null);
            if (onClearSearch) onClearSearch();
            if (onCloseMobile) onCloseMobile();
          }}
          className={`mt-3 w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition
            ${
              !selectedCategory
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
          {Object.entries(categoryCounts).map(([category, details]) => {
            const categoryLabel =
              CATEGORY_LABELS[category] || formatLabel(category);
            const isSelected = selectedCategory === category;

            return (
              <div key={category}>
                {/* Category row */}
                <button
                  onClick={() => {
                    const newCat = isSelected ? null : category;
                    setSelectedCategory(newCat);
                    setSelectedSubCategory(null);
                    setSelectedProgram(null);
                    if (onClearSearch) onClearSearch();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="cursor-pointer flex justify-between w-full p-3 py-2 text-md rounded-sm hover:bg-gray-200 transition"
                >
                  <span
                    className={`flex items-center gap-2 ${
                      isSelected ? "text-[#c41e3a]" : "text-gray-700"
                    }`}
                  >
                    {category === "certifications" && (
                      <IoRibbonOutline size={18} className="mt-1" />
                    )}
                    {category === "academics" && (
                      <IoSchoolOutline size={18} className="mt-1" />
                    )}
                    {categoryLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        isSelected
                          ? "bg-[#c41e3a] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {details.total}
                    </span>
                    {isSelected ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </div>
                </button>

                {/* Sub-category dropdown */}
                {isSelected && details.subCategory && (
                  <div className="space-y-1 border-l-2 border-gray-200 ml-4 mr-4 pl-3">
                    {Object.entries(details.subCategory).map(
                      ([sub, subDetails]) => {
                        const isSubSelected = selectedSubCategory === sub;
                        const subLabel =
                          SUBCATEGORY_LABELS[sub] || formatLabel(sub);

                        return (
                          <div key={sub}>
                            <button
                              onClick={() => {
                                const newSub = isSubSelected ? null : sub;
                                setSelectedSubCategory(newSub);
                                setSelectedProgram(null);
                                if (onClearSearch) onClearSearch();
                                if (onCloseMobile) onCloseMobile();
                              }}
                              className={`flex justify-between items-center w-full text-sm h-9 rounded-md transition cursor-pointer
                                ${
                                  isSubSelected
                                    ? "text-[#c41e3a] bg-[#fff5f7] border border-[#c41e3a]"
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              <span className="pl-2">{subLabel}</span>
                              <span
                                className={`px-2 py-1 mr-2 text-sm ${
                                  isSubSelected
                                    ? "text-[#c41e3a]"
                                    : "text-gray-700"
                                }`}
                              >
                                {subDetails?.total || 0}
                              </span>
                            </button>

                            {/* Programs — only for academics */}
                            {category === "academics" &&
                              isSubSelected &&
                              subDetails?.programs && (
                                <div className="mt-2 ml-2">
                                  {Object.entries(subDetails.programs).map(
                                    ([progKey, progValue]) => (
                                      <button
                                        key={progKey}
                                        onClick={() => {
                                          setSelectedProgram(progKey);
                                          if (
                                            typeof handleProgramFilter ===
                                            "function"
                                          )
                                            handleProgramFilter(progKey);
                                          if (onClearSearch) onClearSearch();
                                          if (onCloseMobile) onCloseMobile();
                                        }}
                                        className={`cursor-pointer w-full justify-between flex text-[14px] px-2 h-9 rounded-md
                                          ${
                                            selectedProgram === progKey
                                              ? "text-[#c41e3a] font-semibold"
                                              : "text-gray-500 hover:bg-gray-50 hover:text-[#c41e3a]"
                                          }`}
                                      >
                                        <span className="flex flex-row items-center gap-2">
                                          <RiCheckboxBlankCircleLine className="text-[10px]" />
                                          {formatLabel(progKey)}
                                        </span>
                                        <span
                                          className={`flex align-center justify-center rounded-full w-8 h-8 items-center px-2 ${
                                            selectedProgram === progKey
                                              ? "text-[#c41e3a]"
                                              : "text-gray-700"
                                          }`}
                                        >
                                          {progValue}
                                        </span>
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ================================
// MAIN PAGE
// ================================

export default function CoursesClient() {
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

  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory");
    const savedSubCategory = localStorage.getItem("selectedSubCategory");
    const savedProgram = localStorage.getItem("selectedProgram");
    if (savedCategory) { setSelectedCategory(savedCategory); setContextCategory(savedCategory); }
    if (savedSubCategory) { setSelectedSubCategory(savedSubCategory); setContextSubCategory(savedSubCategory); }
    if (savedProgram) setSelectedProgram(savedProgram);
  }, []);

  useEffect(() => {
    if (contextCategory && contextCategory !== selectedCategory)
      setSelectedCategory(contextCategory);
    if (contextSubCategory && contextSubCategory !== selectedSubCategory)
      setSelectedSubCategory(contextSubCategory);
  }, [contextCategory, contextSubCategory]);

  useEffect(() => {
    if (selectedCategory !== contextCategory) setContextCategory(selectedCategory);
    if (selectedSubCategory !== contextSubCategory) setContextSubCategory(selectedSubCategory);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory, selectedProgram, searchTerm]);

  useEffect(() => {
    if (!baseUrl) return;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (selectedProgram) {
          params.append("branch", selectedProgram);
        } else {
          if (selectedCategory) params.append("category", selectedCategory);
          if (selectedSubCategory) params.append("subCategory", selectedSubCategory);
        }

        if (searchTerm.trim()) params.append("search", searchTerm.trim());
        params.append("page", String(currentPage));
        params.append("limit", String(pageSize));

        const url = `${baseUrl}/api/v1/course?${params.toString()}`;
        const res = await fetch(url, { cache: "no-store", signal: controller.signal });
        const data = await res.json();

        setCourses(data.data || []);
        if (data.counts) setCounts(buildCounts(data));

        const total = Number(data.total ?? data.counts?.allCourses ?? 0);
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to load courses");
      } finally {
        setLoading(false);
        setTimeout(() => setPageLoading(false), 800);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [selectedCategory, selectedSubCategory, selectedProgram, searchTerm, currentPage, baseUrl]);

  const handleProgramFilter = useCallback((branchValue) => {
    setSelectedProgram(branchValue);
  }, []);

  const handleOpenModal = (course) => {
    const isAcademic = course?.category === "academics";
    setIsAcademicCourse(isAcademic);
    setSelectedCourse(course);
    setShowModal(true);
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
        <span key={`dots-${index}`} className="px-2 text-gray-500 select-none">...</span>
      ) : (
        <button
          key={`page-${p}-${index}`}
          onClick={() => setCurrentPage(Number(p))}
          className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-md border mx-1 text-sm transition
            ${currentPage === p ? "bg-[#c41e3a] text-white" : "border-gray-300 text-gray-700 hover:bg-gray-200"}`}
        >
          {p}
        </button>
      )
    );
  };

  // ── Heading: always shows the deepest active label ──
  const activeHeading = selectedProgram
    ? formatLabel(selectedProgram)
    : selectedSubCategory
    ? SUBCATEGORY_LABELS[selectedSubCategory] || formatLabel(selectedSubCategory)
    : selectedCategory
    ? CATEGORY_LABELS[selectedCategory] || formatLabel(selectedCategory)
    : "All Courses";

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center bg-white h-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="main_container mx-auto rounded-xl">
      {showModal && selectedCourse &&
        (isAcademicCourse ? (
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
        ))}

      <div className="flex flex-col md:flex-row">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between mb-3 px-2">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="cursor-pointer p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoMdClose size={22} /> : <FaBars size={22} />}
          </button>
          <div className="flex-1 text-center">
            <span className="text-base font-medium">{activeHeading}</span>
          </div>
          <div style={{ width: 44 }} />
        </div>

        {/* Mobile sidebar */}
        {menuOpen && (
          <div className="md:hidden bg-white p-2 mb-3">
            <div className="flex justify-end mb-4">
              <div className="relative w-full">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <Sidebar
              counts={counts}
              selectedCategory={selectedCategory}
              setSelectedCategory={(c) => { setSelectedCategory(c); setMenuOpen(false); }}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={(s) => { setSelectedSubCategory(s); setMenuOpen(false); }}
              selectedProgram={selectedProgram}
              setSelectedProgram={(p) => { setSelectedProgram(p); setMenuOpen(false); }}
              onCloseMobile={() => setMenuOpen(false)}
              handleProgramFilter={handleProgramFilter}
              onClearSearch={() => setSearchTerm("")}
            />
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden mb-8 md:block w-80 flex-shrink-0">
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

          {/* Breadcrumb — only renders when subCategory or program is selected */}
          <Breadcrumb
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedProgram={selectedProgram}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            setSelectedProgram={setSelectedProgram}
          />

          {/* Big heading */}
          <div className="text-4xl font-bold text-black mb-2">
            {activeHeading}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="text-black">Browse our comprehensive course catalog</div>
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

          {/* Cards */}
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