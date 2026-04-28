"use client";
import React, { useEffect, useState, useRef } from "react";
import Heading from "@/utility/Heading";
import CourseCard from "./Coursecards";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import PrimaryButton from "@/utility/PrimaryButton";

const Page = ({ data }) => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const firstCategory = data?.subCategory?.[0]?.value || "";

  // Fetch courses for the first category only (no tabs needed)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
        const response = await fetch(
          `${baseUrl}/api/v1/courses?subCategory=${firstCategory}`,
          { method: "GET", next: { revalidate: 60 } }
        );
        const resData = await response.json();
        setFilteredCourses(resData?.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (firstCategory) fetchCourses();
  }, [firstCategory]);

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const displayedCourses = filteredCourses.slice(0, 4);

  const handlePrev = () => {
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : displayedCourses.length - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev < displayedCourses.length - 1 ? prev + 1 : 0));
  };

  return (
    <section>
      <div className="max-w-8xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <Heading data={data?.heading} />

        <Freecoursesform
          source={28}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse?.universities ? selectedCourse : null}
        />

        {filteredCourses.length > 0 ? (
          <>
            {/* ── Desktop: 4-card grid ── */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {displayedCourses.map((course, idx) => (
                <CourseCard
                  key={idx}
                  course={course}
                  onGetDetailsClick={() => handleOpenModal(course)}
                />
              ))}
            </div>

            {/* ── Mobile: carousel with arrows ── */}
            <div className="flex sm:hidden items-center justify-between gap-3 mt-6">
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                aria-label="Previous course"
                className="flex-shrink-0 p-2 bg-[#c41e3a] text-white rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Single card in center */}
              <div className="flex-1">
                <CourseCard
                  course={displayedCourses[mobileIndex]}
                  onGetDetailsClick={() => handleOpenModal(displayedCourses[mobileIndex])}
                />
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                aria-label="Next course"
                className="flex-shrink-0 p-2 bg-[#c41e3a] text-white rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Dots indicator (mobile only) */}
            <div className="flex sm:hidden justify-center gap-2 mt-3">
              {displayedCourses.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setMobileIndex(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    idx === mobileIndex ? "bg-[#c41e3a]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="flex justify-center h-40 w-full items-center">
            No courses found.
          </p>
        )}

        {/* View All Button */}
        <div className="flex justify-center pt-5">
          <PrimaryButton
            variant="outline"
            label="View All Courses"
            href="/courses"
            onClick={() => {
              localStorage.setItem("selectedCategory", "certifications");
              localStorage.setItem("selectedSubCategory", firstCategory);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;