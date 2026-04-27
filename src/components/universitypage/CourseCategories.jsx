"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import TabsCards from "./TabsCards";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import Heading from "@/utility/Heading";

export default function CourseCategories({ data, universityName,formDetails  }) {
  const [selectedBranch, setSelectedBranch] = useState(
    data?.courseCategories?.[0]?.id || ""
  );

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  /* ---------- Responsive Cards ---------- */
  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(1);
      else if (width < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  /* ---------- Fetch Courses ---------- */
  useEffect(() => {
    if (!selectedBranch) return;

    async function fetchCourses() {
      setLoading(true);
      try {
        const url = `${baseUrl}/api/v1/courses/university-branch?name=${encodeURIComponent(
          universityName
        )}&branch=${encodeURIComponent(selectedBranch)}`;

        const res = await axios.get(url);
        const apiData = res?.data?.data || [];

       const flattened = apiData.flatMap((course) =>
  (course.universities || []).map((uni) => ({
    heading: course.heading || "No heading",
    programName: course.programName || "N/A",
    feeRange: uni.fee || course.feeRange || "N/A",
    duration: uni.duration || course.duration || "N/A",

    universityName: uni.universityName || "Unknown",
    universityImage: uni.image?.src || "/placeholder-university.png",
    courseImage: course.image?.src || "/placeholder-course.png",

   ProductId: uni.ProductId,
    sourceId: uni.sourceId,

    universities: course.universities || [],
    tags: course.tags || [],
    button: course.button || [],
  }))
);


        setCourses(flattened);
        setCurrentPage(1);
      } catch (error) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [selectedBranch, universityName, baseUrl]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const paginatedData = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

 const handleGetDetailsClick = (heading, course) => {
  setSelectedCourse({
    heading,
    universities: course.universities, // ✅ FULL DATA
  });

  setShowModal(true);
};


  return (
    <div>
      {/* ---------- Popup ---------- */}
      <Freecoursesform
      
      formDetails={data?.formDetails}
        show={showModal}
        onClose={() => setShowModal(false)}
        course={selectedCourse}
        courseName={selectedCourseName}
        university={selectedUniversity}
        
        source={40}
      />

      {/* ---------- Heading ---------- */}
      <Heading data={data?.heading} />

      {/* ---------- Tabs ---------- */}
      {data?.courseCategories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 pl-4">
          {data.courseCategories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedBranch(tab.id)}
              className={`px-4 py-2 rounded-full transition ${
                selectedBranch === tab.id
                  ? "bg-[#c41e3a] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.value.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* ---------- Loading ---------- */}
      {loading && (
        <p className="text-center text-gray-500 py-10">
          Loading courses...
        </p>
      )}

      {/* ---------- No Courses Found ---------- */}
      {!loading && courses.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No courses found for this category.
        </p>
      )}

      {/* ---------- Courses Grid ---------- */}
      {!loading && courses.length > 0 && (
        <div className="relative p-3">
          {/* Left Arrow */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="absolute left-0 top-[40%] bg-[#c41e3a] p-2 rounded-full text-white disabled:opacity-50 z-10"
          >
            <FiChevronLeft size={24} />
          </button>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedData.map((course, index) => (
              <TabsCards
                key={index}
                courses={[course]}
                onGetDetailsClick={handleGetDetailsClick}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="absolute right-0 top-[40%] bg-[#c41e3a] p-2 rounded-full text-white disabled:opacity-50 z-10"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      )}

      {/* ---------- Pagination Dots ---------- */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`w-3 h-3 rounded-full ${
                  currentPage === page ? "bg-[#ba3148]" : "bg-gray-300"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
