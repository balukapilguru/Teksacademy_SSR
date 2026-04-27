"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/utility/Heading";
import CourseCard from "./Coursecards";
import Link from "next/link";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import PrimaryButton from "@/utility/PrimaryButton";

const Page = ({ data }) => {
  const [allCourses, setAllCourses] = useState([]); // store all data
  const [filteredCourses, setFilteredCourses] = useState([]); // store filtered list
  const [selectedCategory, setSelectedCategory] = useState(
    data?.subCategory?.[0]?.value || ""
  );


  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = data?.subCategory || [];
  // ✅ Fetch all courses only once
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
        const response = await fetch(
          `${baseUrl}/api/v1/courses?subCategory=${selectedCategory}`,
          { method: "GET", next: { revalidate: 60 } }
        );
        const resData = await response.json();
        setFilteredCourses(resData?.data || []);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    if (selectedCategory) fetchCourses();
  }, [selectedCategory]);

  // ✅ Filter when category changes
  useEffect(() => {
    if (selectedCategory && allCourses.length > 0) {
      const filtered = allCourses.filter(
        (course) => course.subCategory === selectedCategory
      );
      setFilteredCourses(filtered);
    }
  }, [selectedCategory, allCourses]);

  const handleOpenModal = (course) => {
    setSelectedCourse(course);

    setShowModal(true);
  };

  return (
    <section className="">
      <div className="max-w-8xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <Heading data={data?.heading} />

        {/* Category Tabs Navbar */}
        <div className="w-full my-4">
          {/* Mobile View: Single Center Tab with Arrows */}
          <div className="flex items-center justify-center gap-3 md:hidden ">
            <button
              onClick={() => {
                const currentIndex = categories.findIndex(
                  (c) => c.value === selectedCategory
                );
                if (currentIndex > 0)
                  setSelectedCategory(categories[currentIndex - 1].value);
              }}
              aria-label="Previous category"
              className="p-2 bg-[#c41e3a] text-white cursor-pointer rounded-full md:hidden"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <span className="text-md font-medium whitespace-nowrap md:hidden border-b-2 border-[#c41e3a] px-3">
              {categories.find((c) => c.value === selectedCategory)?.name}
            </span>

            <button
              onClick={() => {
                const currentIndex = categories.findIndex(
                  (c) => c.value === selectedCategory
                );
                if (currentIndex < categories.length - 1)
                  setSelectedCategory(categories[currentIndex + 1].value);
              }}
              aria-label="Next category"
              className="p-2 bg-[#c41e3a] text-white cursor-pointer rounded-full md:hidden"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Desktop & Tablet View: Full Tabs */}
        <div className="relative md:flex items-center mb-6 hidden">
          <button
            onClick={() => {
              document.getElementById("categoryScroll").scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }}
            aria-label="Scroll categories left"
            className="absolute left-0 z-10 hover:bg-white border cursor-pointer border-[#c41e3a] hover:text-[#c41e3a] bg-[#c41e3a] text-white w-8 h-8 flex items-center justify-center rounded-full xl:hidden shadow-sm transition"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <div
            id="categoryScroll"
            className="flex overflow-x-auto gap-8 my-2 scrollbar-hide mx-10  xl:mx-0 scroll-smooth"
          >
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`cursor-pointer hover:text-[#c41e3a]  w-full xl:px-0 py-2 text-md sm:text-md md:text-lg font-normal whitespace-nowrap border-b-2 transition-colors ${selectedCategory === category.value
                  ? "text-[#c41e3a] border-b-[#c41e3a] font-normal"
                  : "text-black border-transparent"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              document.getElementById("categoryScroll").scrollBy({
                left: 200,
                behavior: "smooth",
              });
            }}
              aria-label="Scroll categories right"
            className="absolute right-0 z-10 hover:bg-white border cursor-pointer border-[#c41e3a] xl:hidden hover:text-[#c41e3a] bg-[#c41e3a] text-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <Freecoursesform
        source={28}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse?.universities ? selectedCourse : null}
        />

        {/* Courses Section */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.slice(0, 4).map((course, idx) => (
              <CourseCard
                key={idx}
                course={course}
                onGetDetailsClick={() => handleOpenModal(course)}
              />
            ))}
          </div>
        ) : (
          <p className="flex justify-center h-40 w-full">
            No courses found for this category.
          </p>
        )}
        <div className="flex justify-center pt-5">
          <PrimaryButton
            variant="outline"
            label="View All Courses"
            href="/courses"
            onClick={() => {
              localStorage.setItem("selectedCategory", "certifications");
              localStorage.setItem("selectedSubCategory", selectedCategory);
            }}
          />
        </div>


      </div>
    </section>
  );
};

export default Page;

