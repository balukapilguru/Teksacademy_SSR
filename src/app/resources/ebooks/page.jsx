"use client";
import React, { useEffect, useState } from "react";
const ebookbanner =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/ebookbanner.webp";
import Image from "next/image";
import Loader from "@/components/Loader";

const API_BASE_URL = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

const S3_BASE_URL = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com";

const Ebook = () => {
  const [ebookData, setEbookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/resources/ebooks`);

        if (!response.ok) {
          throw new Error(`Failed to fetch ebooks: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setEbookData(result.data);
          if (result.data.meta) {
            document.title = result.data.meta.title;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.content = result.data.meta.description;
            }
          }
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching ebooks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  const ebookSection = ebookData?.ebookSection;
  const communitySection = ebookData?.communitySection;
  const courses = ebookSection?.items || [];

  const handleDownload = (ebookurl) => {
    if (ebookurl) {
      window.open(`${API_BASE_URL}${ebookurl}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500 text-lg">Failed to load eBooks. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="main_container">
      {/* Header Section */}
      <div className="flex justify-center items-center w-full">
        <div className="relative w-fit flex flex-col mt-2 lg:mt-5">
          <div className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
            <h1 className="text-[#2A619D]">E-Book</h1>
          </div>
          <svg
            className="absolute top-8 lg:top-10 w-full h-auto"
            viewBox="0 0 110 12"
          >
            <path
              d="M0 10 Q80 -2 190 27"
              stroke="orangered"
              strokeWidth="1.3"
              fill="transparent"
              strokeLinecap="square"
            />
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col xl:flex-row justify-center gap-6 xl:gap-12 px-6 lg:px-16 py-8 xl:py-12">
        <div className="relative w-full max-w-lg">
          <Image
            src={ebookbanner}
            alt="Ebook Preview image"
            className="w-full h-auto"
            width={500}
            height={500}
          />
        </div>
        <div className="text-black max-w-lg">
          <h4 className="text-[16px] font-semibold text-[#2a619d]">
            Best {ebookSection?.heading || "E-Books"}
          </h4>
          <h2 className="sm:text-2xl text-2xl font-bold py-2">
            {ebookSection?.subHeading?.[0] ||
              "Improve learning with Comprehensive E-Books"}
          </h2>
          <div className="text-gray-600 mt-2 text-justify text-sm sm:text-base">
            {ebookSection?.description}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {ebookSection?.stats?.map((stat, idx) => (
              <div key={idx}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="w-full pb-12">
        <div className="px-6 sm:px-10 md:px-4 lg:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-8 3xl:gap-14 2xl:px-24 3xl:px-36">
          {courses.map((course, index) => (
            <div
              key={course.productId || index}
              className="bg-[#DFF6F4] h-56 md:h-60 2xl:h-64 3xl:h-72 rounded-lg shadow-lg p-2 text-center hover:scale-105 transition flex flex-col"
            >
              <div className="h-2/5 flex items-center justify-center">
                <div className="p-3 md:p-4 h-20 w-20 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20 3xl:h-[86px] 3xl:w-[86px] mx-auto flex items-center justify-center bg-white rounded-full">
                  {/* ✅ Same S3 image pattern as InterviewQuestionsPage */}
                  <Image
                    src={`${S3_BASE_URL}${course.image?.src}`}
                    alt={course.image?.alt || course.title}
                    width={60}
                    height={60}
                    className="w-auto h-auto"
                    onError={(e) => {
                      e.target.src = `${S3_BASE_URL}/assets/img/interview_question/python.webp`;
                    }}
                  />
                </div>
              </div>
              <div className="h-3/5 p-1.5 w-full flex justify-center items-center">
                <div className="bg-white h-full w-full text-left p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm lg:text-base xl:text-lg font-bold text-blue-950">
                      {course.title}
                    </h3>
                    <div className="text-gray-500 text-[10px]">
                      {course.description}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(course.ebookurl)}
                    className="p-1.5 px-4 border text-sm border-red-400 text-[#FE543D] rounded-lg hover:bg-red-100 self-start"
                  >
                    {course.button?.text || "Download"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      {communitySection && (
        <div className="py-12 px-6 lg:px-16">
          <div className="bg-gradient-to-r from-[#2A619D] to-[#1e4a7a] rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2 p-8 lg:p-12 text-white">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  {communitySection.heading?.[0]}
                </h2>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-[#FE543D]">
                  {communitySection.heading?.[1]}
                </h3>
                <p className="text-gray-200 mb-6">{communitySection.description}</p>
                {communitySection.button && (
                  <a
                    href={communitySection.button.ebookurl || "#"}
                    className="inline-flex items-center bg-[#FE543D] text-white px-6 py-3 rounded-lg hover:bg-[#e04a35] transition-colors"
                  >
                    {communitySection.button.name}
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="relative h-64 lg:h-80">
                  {/* ✅ Community image also uses S3 pattern */}
                  <Image
                    src={`${S3_BASE_URL}${communitySection.image?.src}`}
                    alt={communitySection.image?.alt || "Community"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ebook;