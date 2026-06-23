"use client";
import React, { useEffect, useState, useRef } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import metadata from "../../app/metadata.json";

import Link from "next/link";
import Image from "next/image";

const courseList = [
  "Full Stack Python",
  "Full Stack Java",
  "Data Science",
  "AWS DevOps",
  "Digital Marketing",
  "Data Analytics",
  "SalesForce",
  "BIM",
  "SAP",
  "Medical Coding",
  "Testing Tools",
  "VLSI",
  "Multimedia",
  "Advanced Excel",
  "AutoCAD",
  "Revit MEP",
  "Business Analytics",
  "Generative AI",
  "SAP MM",
  "Cyber Security",
];

const BlogPaginationPage = () => {
  const api =
    process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
    process.env.NEXT_BLOGS_APPLY_API_URL;

  const [bannerData, setBannerData] = useState({});
  const [getBlog, setGetBlog] = useState([]);
  const [currentBlog, setCurrentBlog] = useState([]);
  const firstFiveCourses = courseList.slice(0, 5);
  const remainingCourses = courseList.slice(5);

  const [activeCourse, setActiveCourse] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [noBlogs, setNoBlogs] = useState(6);
  const [maxBlogs, setMaxBlogs] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchPass, SetSearchPass] = useState("");

  const dropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [thMaxBlogs, setThMaxBlogs] = useState(0);
  const blogsPerPage = 6;

  useEffect(() => {
    document.title = metadata.blogs?.dynamicTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = metadata.blogs?.description;
  }, [metadata.blogs?.dynamicTitle, metadata.blogs?.description]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (values) => {
    setSearchTerm(values);
    SetSearchPass(values);
  };

  const handleCourseClick = (course) => {
    setActiveCourse(course);
    setIsDropdownOpen(false);
  };

  const handleDropdownClick = (course) => {
    setActiveCourse(course);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const getBannerData = async () => {
      const apiUrl = `${api}/blogs/getbanner`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching banner data:", error);
        throw error;
      }
    };
    getBannerData()
      .then((data) => { if (data) setBannerData(data); })
      .catch((error) => console.error("Failed to get banner data:", error));
  }, []);

  useEffect(() => {
    const getBlog = async () => {
      const apiUrl = `${api}/blogs/getAll?pageSize=${blogsPerPage}&page=${currentPage}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        if (data?.totalBlogs) {
          setThMaxBlogs(data.totalPages);
          setGetBlog(data);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    getBlog();
  }, [currentPage]);

  useEffect(() => {
    const updatedNoBlogs = 6;
    setNoBlogs(updatedNoBlogs);

    const getBlog = async () => {
      const apiUrl =
        activeCourse === "All"
          ? `${api}/blogs/getAll?search=${searchPass}&pageSize=${updatedNoBlogs}`
          : `${api}/blogs/blogcategory?category=${activeCourse}&search=${searchPass}&pageSize=${updatedNoBlogs}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching blog data:", error);
        throw error;
      }
    };

    getBlog()
      .then((data) => {
        if (data) {
          setMaxBlogs(data);
          setCurrentBlog(activeCourse === "All" ? data.blogPosts : data.categoryBlogs);
        }
      })
      .catch((error) => console.error("Failed to get blog data:", error));
  }, [activeCourse, searchPass]);

  useEffect(() => {
    const getBlog = async () => {
      const apiUrl =
        activeCourse === "All"
          ? `${api}/blogs/getAll?search=${searchPass}&pageSize=${noBlogs < 6 ? 6 : noBlogs}`
          : `${api}/blogs/blogcategory?category=${activeCourse}&search=${searchPass}&pageSize=${noBlogs < 6 ? 6 : noBlogs}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching blog data:", error);
        throw error;
      }
    };

    if (noBlogs) {
      getBlog()
        .then((data) => {
          if (data) {
            setMaxBlogs(data);
            setCurrentBlog(activeCourse === "All" ? data.blogPosts : data.categoryBlogs);
          }
        })
        .catch((error) => console.error("Failed to get blog data:", error));
    }
  }, [noBlogs, searchPass]);

  const setBlogItem = (blog) => {
    localStorage.setItem("blog", JSON.stringify(blog));
  };

  return (
    <div className="main_container">
      <div className="lg:flex">
        <div className="py-8 w-full 2xl:w-11/12 mx-auto px-4 lg:w-[75%]">
          <h1
            className="text-2xl lg:text-4xl font-bold mb-6 text-[#2a619d]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Category
          </h1>

          {/* ── Filter bar ── */}
          <div className="mb-6">

            {/* Row 1 (mobile): scrollable pill strip — full-bleed so it reaches screen edges */}
            <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-5 w-max pr-4">
                {/* All */}
                <button
                  onClick={() => handleCourseClick("All")}
                  className={`text-xs font-bold whitespace-nowrap pb-1 shrink-0 ${
                    activeCourse === "All" ? "text-[#2a619d]" : "text-gray-600"
                  }`}
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  All
                </button>

                {/* First 5 courses */}
                {firstFiveCourses.map((course, index) => (
                  <button
                    key={index}
                    onClick={() => handleCourseClick(course)}
                    className={`text-xs font-bold whitespace-nowrap pb-1 shrink-0 ${
                      activeCourse === course ? "text-[#2a619d]" : "text-gray-600"
                    }`}
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {course}
                  </button>
                ))}

                {/* More dropdown (mobile) */}
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`text-xs font-medium border flex items-center gap-1 p-1 px-2 rounded ${
                      remainingCourses.includes(activeCourse)
                        ? "text-[#2a619d] border-b-2 border-b-[#2a619d]"
                        : "text-gray-600"
                    }`}
                  >
                    {remainingCourses.includes(activeCourse) ? activeCourse : "More"}
                    {isDropdownOpen ? (
                      <FaChevronUp className="text-xs" />
                    ) : (
                      <FaChevronDown className="text-xs" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-40 bg-white border-t border-gray-200 rounded shadow-md z-10">
                      <div className="h-72 overflow-y-auto [scrollbar-width:thin]">
                        {remainingCourses.map((course, index) => (
                          <button
                            key={index}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              course === activeCourse
                                ? "text-[#2a619d] font-semibold"
                                : "text-gray-600"
                            } hover:bg-gray-100 hover:text-[#2a619d]`}
                            onClick={() => handleDropdownClick(course)}
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {course}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2 (mobile): search — always full width below the scroll strip */}
            <div className="lg:hidden mt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 pr-10 text-sm py-1.5 border border-gray-300 rounded shadow-sm text-gray-700 placeholder-gray-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <IoIosSearch className="text-xl" />
                </button>
              </div>
            </div>

            {/* Desktop layout: single row, existing behaviour unchanged */}
            <div className="hidden lg:flex justify-between gap-3 items-center">
              <div className="flex space-x-7 items-center overflow-x-auto">
                <button
                  onClick={() => handleCourseClick("All")}
                  className={`relative text-xs pb-2 font-bold whitespace-nowrap ${
                    activeCourse === "All" ? "text-[#2a619d]" : "text-gray-600"
                  }`}
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  All
                </button>
                {firstFiveCourses.map((course, index) => (
                  <button
                    key={index}
                    onClick={() => handleCourseClick(course)}
                    className={`relative text-xs font-bold pb-2 whitespace-nowrap ${
                      activeCourse === course ? "text-[#2a619d]" : "text-gray-600"
                    }`}
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {course}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* More dropdown (desktop) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`text-sm sm:text-xs font-medium border flex justify-between p-1 px-2 rounded h-[33px] ${
                      remainingCourses.includes(activeCourse)
                        ? "text-[#2a619d] border-b-2 border-b-[#2a619d]"
                        : "text-gray-600"
                    } hover:text-[#2a619d] flex items-center`}
                  >
                    {remainingCourses.includes(activeCourse) ? activeCourse : "More"}
                    {isDropdownOpen ? (
                      <FaChevronUp className="ml-2 text-xs" />
                    ) : (
                      <FaChevronDown className="ml-2 text-xs" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-40 bg-white border-t border-gray-200 rounded shadow-md z-10">
                      <div className="h-72 overflow-y-auto [scrollbar-width:thin]">
                        {remainingCourses.map((course, index) => (
                          <button
                            key={index}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              course === activeCourse
                                ? "text-[#2a619d] font-semibold"
                                : "text-gray-600"
                            } hover:bg-gray-100 hover:text-[#2a619d]`}
                            onClick={() => handleDropdownClick(course)}
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {course}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search (desktop) */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 pr-10 text-xs py-1 border border-gray-300 rounded shadow-sm text-gray-700 placeholder-gray-400 h-[33px]"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <IoIosSearch className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ── End Filter bar ── */}

          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 2xl:gap-10">
              {currentBlog.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center min-h-80">
                  <p
                    className="text-2xl font-semibold text-gray-700 mb-4"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    No blogs found.
                  </p>
                  <p
                    className="text-gray-500"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    Please check back later for more updates!
                  </p>
                </div>
              ) : (
                currentBlog.map((article) => (
                  <div
                    key={article?.id}
                    className="flex flex-col gap-1 min-h-80 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <p
                      className="text-xs font-semibold text-[#2a619d] uppercase"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {article?.category}
                    </p>
                    <img
                      src={`https://teksacademy.s3.ap-south-1.amazonaws.com/website/blogs/${article?.image_url}`}
                      alt={article?.title}
                      className="w-full h-48 rounded-md"
                    />
                    <div className="px-1 flex flex-col gap-3 mt-2">
                      <Link
                        href={`/blogs/${article?.meta_url}`}
                        className="text-[22px] cursor-pointer font-bold hover:underline line-clamp-2 leading-snug text-gray-800"
                        onClick={() => setBlogItem(article)}
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {article?.title}
                      </Link>
                      <div
                        style={{ fontFamily: "Roboto, sans-serif" }}
                        className="prose max-w-none text-[15px] min-h-16 text-[#252525] font-light line-clamp-3 leading-[1.5]"
                        dangerouslySetInnerHTML={{
                          __html: article?.blogsimages[0]?.data,
                        }}
                      />
                      <p
                        className="text-xs text-[#252525] font-normal flex items-center gap-x-2 mt-auto"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        <SlCalender />
                        {article?.postdate.split("T")[0]}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex w-full justify-end mt-6">
              <button
                onClick={() => setNoBlogs(noBlogs + 6)}
                disabled={maxBlogs?.totalBlogs == maxBlogs?.endBlogs}
                className={`flex items-center justify-center min-w-28 gap-2 px-2 py-1 font-normal text-lg rounded-md transition 
                ${
                  maxBlogs?.totalBlogs == maxBlogs?.endBlogs
                    ? "bg-[#fe543d]/50 text-white cursor-not-allowed"
                    : "bg-[#fe543d]/90 hover:bg-[#fe543d] text-white"
                }`}
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                More
                <MdKeyboardDoubleArrowRight className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Latest sidebar */}
        <div className="w-full xl:w-[40%] flex justify-center py-8">
          <div className="xl:w-[80%] w-full flex flex-col gap-y-0 bg-gray-50/20 px-4">
            <div className="space-y-3">
              <div>
                <h1
                  className="text-2xl lg:text-4xl font-bold mb-4 text-[#2a619d]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  Latest
                </h1>
              </div>
              <div className="flex flex-col gap-y-4">
                {getBlog.blogPosts && getBlog.blogPosts.length > 0 ? (
                  getBlog.blogPosts.map((article, index) => (
                    <div
                      key={index}
                      className="space-y-1 lg:space-y-0.5 flex items-center gap-3"
                    >
                      <img
                      
                        src={`https://teksacademy.s3.ap-south-1.amazonaws.com/website/blogs/${article?.image_url}`}
                        alt={article?.title}
                        className="w-full h-20 rounded-md"
                      />
                      <div>
                        <p
                          className="text-[#2a619d] text-xs font-semibold"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {article?.category}
                        </p>
                        <Link
                          href={`blogs/${article?.meta_url}`}
                          className="text-[17px] lg:text-[20px] cursor-pointer font-bold hover:underline line-clamp-2 leading-snug"
                          onClick={() => setBlogItem(article)}
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {article?.title}
                        </Link>
                        <p
                          className="text-gray-500 text-xs"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {article?.postdate.split("T")[0]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-100 rounded-xl shadow-md">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 14v.01M12 10.75h.01M12 6.5h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                      />
                    </svg>
                    <p
                      className="text-lg font-semibold text-gray-700"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      No blogs found
                    </p>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      Check back later for new posts.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 justify-start pt-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <MdKeyboardDoubleArrowLeft className="text-2xl" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= thMaxBlogs}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                  currentPage >= thMaxBlogs
                    ? "bg-[#fe543d]/50 text-white cursor-not-allowed"
                    : "bg-[#fe543d]/90 hover:bg-[#fe543d] text-white"
                }`}
              >
                <MdKeyboardDoubleArrowRight className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full xl:flex-row justify-center lg:px-10 p-5"></div>
    </div>
  );
};

export default BlogPaginationPage;