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
          {
            ProductId: 31,
            sourceId: 2,
            universityname: "Manipal Academy of Higher Education",
            fee: "2,94,000",
          },
          {
            ProductId: 34,
            sourceId: 4,
            universityname: "Sikkim Manipal University",
            fee: "75,000",
          },
          {
            ProductId: 37,
            sourceId: 3,
            universityname: "Manipal University Jaipur",
            fee: "99,000",
          },
        ],
      },
    ],
  });

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
        console.log(resData?.data,"coursecardss")
        setFilteredCourses(resData?.data || []);
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
    }
  }, [selectedCategory, allCourses]);

  const handleOpenModal = (courseName, course) => {
    setSelectedCourse(courseName);
    setShowModal(true);
    setselectedCourseName(course);
  };

  return (
    <section>
      <div className="main_container mx-auto mt-4 pt-5">
        <Heading data={data?.heading} as="h1" />

        {/* Category Tabs */}
        <div className="w-full my-4">
          {/* Mobile Tabs */}
          <div className="flex items-center justify-center gap-5 md:hidden">
            <button
              onClick={() => {
                const index = categories.findIndex(
                  (c) => c.value === selectedCategory
                );
                if (index > 0)
                  setSelectedCategory(categories[index - 1].value);
              }}
              className="p-2 bg-[#c41e3a] text-white rounded-full"
            >
              ◀
            </button>

            <span className="text-md font-medium border-b-2 border-[#c41e3a] px-3">
              {categories.find((c) => c.value === selectedCategory)?.name}
            </span>

            <button
              onClick={() => {
                const index = categories.findIndex(
                  (c) => c.value === selectedCategory
                );
                if (index < categories.length - 1)
                  setSelectedCategory(categories[index + 1].value);
              }}
              className="p-2 bg-[#c41e3a] text-white rounded-full"
            >
              ▶
            </button>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-6 my-6 mb-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`text-lg pb-2 border-b-2 ${
                  selectedCategory === category.value
                    ? "text-[#c41e3a] border-[#c41e3a]"
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
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.slice(0, 4).map((course, idx) => (
              <CourseCard
                key={idx}
                course={course}
                onGetDetailsClick={handleOpenModal}
              />
            ))}
          </div>
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