"use client";
import React, { useEffect, useState, useRef } from "react";
import Heading from "@/utility/Heading";
import CourseCard from "./Coursecards";
import Link from "next/link";
import Popupform from "../clientcomponents/forms/Popupform";
import PrimaryButton from "@/utility/PrimaryButton";

const Page = ({ data }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // ✅ Sort categories: PG → UG → Others
  const categories = (data?.category || []).sort((a, b) => {
    const order = ["Post Graduation", "Under Graduation"];
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // ✅ Default select PG
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const pg = categories.find((c) => c.name === "Post Graduation");
    return pg?.value || categories?.[0]?.value || "";
  });

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedCourseName, setselectedCourseName] = useState({
    id: 4,
    course: "UG",
    courseName: "Bachelor of Commerce",
    duration: "36 months",
    fee: "75000 - 294000",
    TagNames: ["No Cost EMI", "Placement Assistance"],
    courseRelatedImage:
      "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/full-stack-python.webp",
    specializations: [
      {
        name: "Bachelor of Commerce",
        universities: [
          { ProductId: 31, sourceId: 2, universityname: "Manipal Academy of Higher Education", fee: "2,94,000" },
          { ProductId: 34, sourceId: 4, universityname: "Sikkim Manipal University", fee: "75,000" },
          { ProductId: 37, sourceId: 3, universityname: "Manipal University Jaipur", fee: "99,000" },
        ],
      },
    ],
  });

  // Mobile carousel index — reset when category changes
  const [mobileIndex, setMobileIndex] = useState(0);

  const scrollRef = useRef(null);

  // ✅ Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
        const response = await fetch(
          `${baseUrl}/api/v1/courses?subCategory=${selectedCategory}`,
          { method: "GET", next: { revalidate: 60 } }
        );
        const resData = await response.json();
        console.log(resData?.data, "coursecardss");
        setFilteredCourses(resData?.data || []);
        setMobileIndex(0); // reset carousel on category change
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    if (selectedCategory) fetchCourses();
  }, [selectedCategory]);

  // Optional local filter
  useEffect(() => {
    if (selectedCategory && allCourses.length > 0) {
      const filtered = allCourses.filter(
        (course) => course.subCategory === selectedCategory
      );
      setFilteredCourses(filtered);
      setMobileIndex(0);
    }
  }, [selectedCategory, allCourses]);

  const handleOpenModal = (courseName, course) => {
    setSelectedCourse(courseName);
    setShowModal(true);
    setselectedCourseName(course);
  };

  const visibleCourses = filteredCourses.slice(0, 4);

  // Simple minimal chevron arrow (same style as CertificationCourse)
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
        <Heading data={data?.heading} as="h1" />

        {/* Category Tabs */}
        <div className="w-full my-4">
          {/* Mobile Tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:hidden">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                  selectedCategory === category.value
                    ? "bg-[#ea6329] text-white"
                    : "border border-[#ea6329] text-[#ea6329] hover:bg-[#ea6329] hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-6 my-6 mb-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`text-lg pb-2 border-b-2 ${
                  selectedCategory === category.value
                    ? "text-[#ea6329] border-[#ea6329]"
                    : "border-transparent"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Popup */}
        <Popupform
          source={28}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourseName}
          university={selectedUniversity}
        />

        {/* Course Cards */}
        {visibleCourses.length > 0 ? (
          <>
            {/* DESKTOP: 4-col grid — untouched */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleCourses.map((course, idx) => (
                <CourseCard
                  key={idx}
                  course={course}
                  onGetDetailsClick={handleOpenModal}
                />
              ))}
            </div>

            {/* MOBILE: 1 card at a time, arrows + dots below */}
            <div className="sm:hidden">
              <div className="flex flex-col items-center gap-2">
                {/* Card full width */}
                <div className="w-full">
                  <CourseCard
                    key={mobileIndex}
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
          <p className="flex justify-center h-40">
            No courses found for this category.
          </p>
        )}

        {/* View All */}
        <div className="flex justify-center pt-5">
          <PrimaryButton
            variant="outline"
            label="View All Courses"
            href="/courses"
            onClick={() => {
              localStorage.setItem("selectedCategory", "academics");
              localStorage.setItem("selectedSubCategory", selectedCategory);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;