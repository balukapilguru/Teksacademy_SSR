"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

const FormStepCourse = ({ formData = {}, onChange, forceValidation = false, error }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(
    formData.selectedCourse || null
  );
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  /* ---------------- FETCH TOP 5 COURSES ---------------- */
  const fetchTopCourses = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/courses?top=true`);
      const json = await res.json();
      setCourses(Array.isArray(json?.data) ? json.data : []);
      setFilteredCourses(Array.isArray(json?.data) ? json.data : []);
    } catch (error) {
      console.error("Failed to fetch top courses:", error);
    }
  };

  /* ---------------- FETCH SEARCH COURSES ---------------- */
  const fetchSearchCourses = async (text) => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/courses?search=${text}`);
      const json = await res.json();
      setFilteredCourses(Array.isArray(json?.data) ? json.data : []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchTopCourses();
  }, [baseUrl]);

  /* ---------------- SEARCH FILTER ---------------- */
  useEffect(() => {
    if (!isOpen) return;

    if (searchText.trim() === "") {
      fetchTopCourses();
    } else {
      fetchSearchCourses(searchText);
    }
  }, [searchText, isOpen]);

  /* ---------------- OUTSIDE CLICK CLOSE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- AUTO FOCUS SEARCH ---------------- */
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  /* ---------------- SELECT COURSE ---------------- */
  const handleSelect = (course) => {
    setSelectedCourse(course);
    setIsOpen(false);
    setSearchText("");

    let productId = "";
    let sourceId = "";
    let universityName = "";

    if (course.universities && course.universities.length > 0) {
      const firstUniversity = course.universities[0];
      productId = firstUniversity.productId || firstUniversity.ProductId || "";
      sourceId = firstUniversity.sourceId || "";
      universityName = firstUniversity.universityName || firstUniversity.name || "";
    }

    


    if (!productId) {
      productId = course.productId || course.ProductId || "";
    }

    onChange?.({
      course: course.heading || course.programName || "",
      productId,
      ProductId: productId,
      selectedCourse: course,
      university: universityName,
      sourceId,
    });
  };

  const isInvalid = forceValidation && !(formData.ProductId || formData.productId);

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white mb-1">
        Select Your Course *
      </label>

      <div className="relative w-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setIsOpen(prev => !prev);
            setSearchText("");
          }}
          className={`w-full h-10 px-4 flex items-center justify-between rounded-md border bg-white
            ${isInvalid || error ? "border-red-500" : "border-gray-300"}
          `}
        >
          <span className="truncate text-left text-black">
            {selectedCourse ? (selectedCourse.heading || selectedCourse.programName) : "Select a course"}
          </span>
          <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""} text-black`} />
        </button>

        {isOpen && (
          <div
            className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-2 border-b">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setIsOpen(true);
                  }}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-3 h-9 border rounded-md focus:outline-none bg-white text-black placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="h-64 overflow-y-auto bg-white">
              {filteredCourses.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-400">
                  No courses found
                </div>
              ) : (
                filteredCourses.map((course, index) => (
                  <div
                    key={course.id || index}
                    onClick={() => handleSelect(course)}
                    className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-black">
                      {course.heading || course.programName}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {isInvalid && !error && (
        <p className="text-red-500 text-sm mt-1">Please select a course</p>
      )}
    </div>
  );
};

export default FormStepCourse;
