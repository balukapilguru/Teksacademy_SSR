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
    data?.category?.[0]?.value || ""
  );
  
  const categories = data?.category || [];
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
    <div className="to-blue-50 py-7 ">
      <div className="pl-3 md:pl-6">
        <Heading data={data?.heading} />
      </div>

      {/* Category Tabs */}
      <div className="max-w-8xl mt-10 md:mt-0 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-6 my-4 scrollbar-hide mb-6">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`cursor-pointer md:px-0 py-2 text-md lg:text-lg font-normal transition-colors border-b-2 ${
                selectedCategory === category.value
                  ? "text-[#c41e3a] border-b-[#c41e3a] font-normal"
                  : "text-black border-transparent"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <Freecoursesform
      source={28}
        show={showModal}
        onClose={() => setShowModal(false)}
        course={selectedCourse?.universities ? selectedCourse : null}
      />

      {/* Courses Section */}
      {filteredCourses.length > 0 ? (
        <div className="max-w-8xl mt-10 md:mt-0 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.slice(0, 4).map((course, idx) => (
              <CourseCard
                key={idx}
                course={course}
                onGetDetailsClick={() => handleOpenModal(course)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center h-40 w-full">
          No courses found for this category Refresh once.
        </div>
      )}
      <div className="flex justify-center pt-5">
        <PrimaryButton
                   variant="outline"
                   label="View All Courses"
                   href="/courses"
            onClick={() => {
                localStorage.setItem("selectedCategory", "selfLearning");
                localStorage.setItem("selectedSubCategory", selectedCategory);
                // localStorage.setItem("selectedProgram", "");
              }}
         />
           
      </div>
    </div>
  );
};

export default Page;

