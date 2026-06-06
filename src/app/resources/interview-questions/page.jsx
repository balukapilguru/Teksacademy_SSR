"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/app/Loading";
import Heading from "@/utility/Heading";
 
const InterviewQuestionsPage = () => {
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // IMPORTANT: Use the correct API URL with /api/v1
  const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL;

  useEffect(() => {
    const fetchInterviewQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/v1/resources/interview-questions`);
       
        console.log("Fetching URL:", `${baseUrl}/api/v1/resources/interview-questions`);
 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
 
        const result = await response.json();
 
        if (result.success && result.data) {
          setInterviewData(result.data);
           if (result.data.meta) {
            document.title = result.data.meta.title;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.content = result.data.meta.description;
            }
          }
          console.log(result.data,"interviewque")
        } else {
          setError("No data received from API");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchInterviewQuestions();
  }, []);
 
  const heroSection = interviewData?.heroSection;
  const interviewCards = interviewData?.interviewQuestions?.cards || [];
 
  const handleCardClick = (card) => {
    const link = card.button?.link;
    if (link) {
      router.push(link);
    }
  };
 
  if (loading) {
    return (
      <div >
       <Loader />
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4 font-semibold">Error Loading Data</p>
          <p className="text-gray-500 text-sm mb-2">{error}</p>
          <p className="text-gray-400 text-xs mb-4 break-all">
            API URL: {API_BASE_URL}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#2A619D] text-white rounded hover:bg-[#1e4a7a]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex justify-center items-center w-full">
        <div className="w-fit flex flex-col mt-2 lg:mt-5">
          <Heading
            data={heroSection?.heading || ["Interview", "Questions"]}
            as="h1"
            className="!text-2xl lg:!text-4xl !font-semibold !text-center !mb-0"
          />
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
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No interview questions available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {interviewCards.map((card, index) => (
              <div
                key={card.slug || index}
                onClick={() => handleCardClick(card)}
                className="bg-[#DFF6F4] rounded-lg shadow-lg p-2 text-center hover:scale-105 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="h-32 flex items-center justify-center">
                  <div className="p-3 md:p-4 h-20 w-20 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20 mx-auto flex items-center justify-center bg-white rounded-full shadow-md">
                    <Image
                      src={`https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com${card.image?.src}`}
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
                <div className="p-4 flex-1">
                  <div className="bg-white h-full w-full text-left p-3 rounded-lg flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm lg:text-base xl:text-lg font-bold text-blue-950 line-clamp-2">
                        {card.title}
                      </h3>
                      <div className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                        {card.description}
                      </div>
                    </div>
                    <div className="flex items-center text-[#FE543D] font-medium text-sm mt-3">
                      <span className="mr-1">{card.button?.text || "Read More"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
 
export default InterviewQuestionsPage;
