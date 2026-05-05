"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/utility/Heading";
import CourseCard from "./Coursecards"; // ✅ your existing CourseCard component
import Link from "next/link";
import Popupform from "../clientcomponents/forms/Popupform";
import PrimaryButton from "@/utility/PrimaryButton";

const CertificationCourse = ({ data }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(null);

  // ✅ Priority 1: Use data from props (SSR), Priority 2: Fetch from API if not available
  useEffect(() => {
    const propCourses =
      data?.courses || data?.courseList || data?.coursesList || [];

    if (propCourses && propCourses.length > 0) {
      console.log("Using courses from prop:", propCourses);
      setCourses(propCourses);
      setLoading(false);
      return;
    }

    // Fallback: Fetch certification courses from backend only when prop data is unavailable
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

  // ✅ Same modal handler pattern as Page.jsx
  const handleOpenModal = (courseName, course) => {
    setSelectedCourse(courseName);
    setSelectedCourseName(course);
    setShowModal(true);
  };

  return (
    <section>
      <div className="main_container mx-auto mt-4 pt-5 ">

        {/* Heading from SSR data prop */}
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
        {!loading && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course, idx) => (
              <CourseCard
                key={course.programName || course.id || idx}
                course={course}
                onGetDetailsClick={handleOpenModal}
              />
            ))}
          </div>
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
