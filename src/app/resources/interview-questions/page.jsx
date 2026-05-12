"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const InterviewQuestionsPage = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://0z05cks3-4040.inc1.devtunnels.ms/api/v1/resources/interview-questions");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setInterviewData(result.data);
          // Update metadata from API
          if (result.data.meta) {
            document.title = result.data.meta.title;
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
              metaDescription = document.createElement("meta");
              metaDescription.name = "description";
              document.head.appendChild(metaDescription);
            }
            metaDescription.content = result.data.meta.description;
          }
        } else {
          setError("No data received");
        }
      } catch (err) {
        console.error("Error fetching interview questions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewQuestions();
  }, []);

  const heroSection = interviewData?.heroSection;
  const interviewCards = interviewData?.interviewQuestions?.cards || [];

  // Loading state
  if (loading) {
    return (
      <div className="main_container">
        <div className="min-h-[400px] flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A619D] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Interview Questions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="main_container">
        <div className="min-h-[400px] flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading interview questions: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#2A619D] text-white rounded hover:bg-[#1e4a7a]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main_container">
      {/* Header Section */}
      <div className="flex justify-center items-center w-full">
        <div className=" w-fit flex flex-col mt-2 lg:mt-5">
          <div className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center gap-2">
            <h1 className="text-[#2A619D]">
              {heroSection?.heading?.[0] || "Interview"}
            </h1>
            <h1 className="text-[#2A619D]">
              {heroSection?.heading?.[1] || "Questions"}
            </h1>
          </div>
        
        </div>
      </div>

      {/* Hero Subheading */}
      <div className="text-center px-4 mt-6 mb-10">
        <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
          {heroSection?.subHeading || "Prepare for your dream job with the most asked interview questions across trending technologies and domains."}
        </p>
      </div>

      {/* Cards Grid Section */}
      <div className="w-full pb-12">
        {interviewCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No interview questions available at the moment.</p>
          </div>
        ) : (
          <div className="px-6 sm:px-10 md:px-4 lg:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-8 3xl:gap-14 2xl:px-24 3xl:px-36">
            {interviewCards.map((card, index) => (
              <a
                key={card.slug || index}
                href={card.button?.link || "#"}
                className="bg-[#DFF6F4] h-56 md:h-60 2xl:h-64 3xl:h-72 rounded-lg shadow-lg p-2 text-center hover:scale-105 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="h-2/5 flex items-center justify-center">
                  <div className="p-3 md:p-4 h-20 w-20 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20 3xl:h-[86px] 3xl:w-[86px] mx-auto flex items-center justify-center bg-white rounded-full shadow-md">
                    <Image
                      src={`https://teksacademy.com${card.image?.src}`}
                      alt={card.image?.alt || card.title}
                      width={60}
                      height={60}
                      className="w-auto h-auto"
                      onError={(e) => {
                        e.target.src = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/interview_question/python.webp";
                      }}
                    />
                  </div>
                </div>
                <div className="h-3/5 p-1.5 3xl:py-1 w-full flex justify-center items-center">
                  <div className="bg-white h-full w-full text-left p-3 rounded-lg flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm lg:text-base xl:text-lg 3xl:text-xl font-bold text-blue-950 line-clamp-2">
                        {card.title}
                      </h3>
                      <div className="text-gray-500 text-[10px] 3xl:text-[0.85rem] leading-relaxed line-clamp-3">
                        {card.description}
                      </div>
                    </div>
                    <div className="flex items-center text-[#FE543D] font-medium text-sm mt-2">
                      <span className="mr-1">{card.button?.text || "Read More"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionsPage;