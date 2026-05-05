"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/utility/Heading";
import CourseCard from "./Coursecards";
import Link from "next/link";
import Popupform from "../clientcomponents/forms/Popupform";
import PrimaryButton from "@/utility/PrimaryButton";

const CertificationCourse = ({ data }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(null);

  // Mobile carousel index
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const propCourses =
      data?.courses || data?.courseList || data?.coursesList || [];

    if (propCourses && propCourses.length > 0) {
      console.log("Using courses from prop:", propCourses);
      setCourses(propCourses);
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`${baseUrl}/api/v1/courses?subCategory=certification`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const result = await res.json();
        console.log(result?.data, "CertificationCourse API DATA");

        setCourses(result?.data || result?.courses || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [data]);

  const handleOpenModal = (courseName, course) => {
    setSelectedCourse(courseName);
    setSelectedCourseName(course);
    setShowModal(true);
  };

  // Slice same as desktop (first 4)
  const visibleCourses = courses.slice(0, 4);

  // Simple minimal chevron arrow
  const ArrowBtn = ({ direction, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="p-1 text-[#002b80] disabled:opacity-25 disabled:cursor-not-allowed transition"
    >
      {direction === "prev" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );

  return (
    <section>
      <div className="main_container mx-auto mt-4 pt-5">

        {/* Heading */}
        <Heading data={data?.heading} as="h1" />

        {/* Popup Modal */}
        <Popupform
          source={28}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourseName}
          university={null}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002b80]"></div>
          </div>
        )}

        {/* Course Cards */}
        {!loading && visibleCourses.length > 0 ? (
          <>
            {/* DESKTOP: 4-col grid — untouched */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleCourses.map((course, idx) => (
                <CourseCard
                  key={course.programName || course.id || idx}
                  course={course}
                  onGetDetailsClick={handleOpenModal}
                />
              ))}
            </div>

            {/* MOBILE: 1 card at a time, arrows beside dots below */}
            <div className="sm:hidden">
              <div className="flex flex-col items-center gap-2">
                {/* Card — full width, no side arrows cramping it */}
                <div className="w-full">
                  <CourseCard
                    key={visibleCourses[mobileIndex]?.programName || visibleCourses[mobileIndex]?.id || mobileIndex}
                    course={visibleCourses[mobileIndex]}
                    onGetDetailsClick={handleOpenModal}
                  />
                </div>
                {/* Arrows + Dots row */}
                <div className="flex items-center justify-center gap-3 mt-1">
                  <ArrowBtn
                    direction="prev"
                    onClick={() => setMobileIndex((i) => Math.max(0, i - 1))}
                    disabled={mobileIndex === 0}
                  />
                  <div className="flex gap-2">
                    {visibleCourses.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setMobileIndex(i)}
                        className={`h-2 rounded-full transition-all duration-200 ${
                          i === mobileIndex ? "bg-[#002b80] w-5" : "bg-gray-300 w-2"
                        }`}
                      />
                    ))}
                  </div>
                  <ArrowBtn
                    direction="next"
                    onClick={() => setMobileIndex((i) => Math.min(visibleCourses.length - 1, i + 1))}
                    disabled={mobileIndex === visibleCourses.length - 1}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <p className="flex justify-center h-40 items-center text-gray-500">
              No certification courses available.
            </p>
          )
        )}

        {/* View All Button */}
        {data?.viewAllButton && courses.length > 0 && (
          <div className="flex justify-center pt-5">
            <PrimaryButton
              variant="outline"
              label={data.viewAllButton.name}
              href={data.viewAllButton.link}
            />
          </div>
        )}

      </div>
    </section>
  );
};

export default CertificationCourse;