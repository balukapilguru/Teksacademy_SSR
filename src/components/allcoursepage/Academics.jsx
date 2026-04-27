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
  const [selectedCategory, setSelectedCategory] = useState(
    data?.category?.[0]?.value || ""
  );



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
      {
        name: "Bachelor of Commerce in Corporate Accounting",
        universities: [
          {
            ProductId: 40,
            sourceId: 1,
            universityname: "Jain University",
            fee: "90,000",
          },
        ],
      },
      {
        name: "Bachelor of Commerce in International Finance & Accounting",
        universities: [
          {
            ProductId: 43,
            sourceId: 1,
            universityname: "Jain University",
            fee: "2,28,000",
          },
          {
            ProductId: 44,
            sourceId: 5,
            universityname: "Amity University",
            fee: "2,50,000",
          },
        ],
      },
    ],
  });

  const categories = data?.category || [];
  const scrollRef = useRef(null);

  // Fetch filtered courses
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

  // Optional local filter
  useEffect(() => {
    if (selectedCategory && allCourses.length > 0) {
      const filtered = allCourses.filter(
        (course) => course.subCategory === selectedCategory
      );
      setFilteredCourses(filtered);
    }
  }, [selectedCategory, allCourses]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handleOpenModal = (courseName, course) => {
    setSelectedCourse(courseName);
    setShowModal(true);
    setselectedCourseName(course);
  };

  return (
    <section>
      <div className="max-w-8xl mx-auto mt-4 px-4 sm:px-6 pt-5 md:pt-0 pb-4 md:pb-0 lg:px-8">
        
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
                if (index > 0) setSelectedCategory(categories[index - 1].value);
              }}
              aria-label="Previous category"
              className="p-2 bg-[#c41e3a] text-white cursor-pointer rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

            <span className="text-md font-medium whitespace-nowrap border-b-2 border-[#c41e3a] px-3">
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
              aria-label="Next category"
              className="p-2 bg-[#c41e3a] text-white cursor-pointer rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-6 my-6 mb-8 items-start justify-start overflow-x-auto scrollbar-hide scroll-smooth">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`cursor-pointer text-lg whitespace-nowrap pb-2 border-b-2 transition-colors ${selectedCategory === category.value
                    ? "text-[#c41e3a] border-b-[#c41e3a] font-normal"
                    : "text-black border-transparent"
                  }`}
                    
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        {
          /* Scroll Buttons for Desktop */
        }

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
              localStorage.setItem("selectedCategory", "academics");
              localStorage.setItem("selectedSubCategory", selectedCategory);
              // localStorage.setItem("selectedProgram", "");
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;

