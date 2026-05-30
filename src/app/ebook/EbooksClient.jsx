"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import Loader from "@/components/Loader";
import Popupform from "@/components/Popupform";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

export default function EbookClient({ source }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;

  // Fetch API Data
  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/resources/ebooks`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          console.error("API returned unsuccessful:", result.message);
        }
      } catch (error) {
        console.error("Error fetching ebooks:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    fetchEbooks();
  }, []);

  const section = data?.ebookSection || {};
  const courses = section.items || [];

  const handleEbookSubmit = async (formValues, payload) => {
    const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        productId: selectedCard?.productId,
        sourceId: selectedCard?.sourceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Submission failed");
    }

    const ebookPath = selectedCard?.ebookurl || selectedCard?.ebookUrl;
    if (ebookPath) {
      const ebookUrl = resolveEbookUrl(ebookPath);
      if (ebookUrl) {
        window.open(ebookUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const resolveEbookUrl = (path) => {
    if (!path) return "";
    let p = String(path).trim();
    // Fix malformed schemes like "https//host" or "http//host"
    p = p.replace(/^(https?)\/\//i, "$1://");
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith("//")) return `https:${p}`;
    return `${baseUrl}${p.startsWith("/") ? "" : "/"}${p}`;
  };

  // Helper function to get image URL with fallback
  const getImageUrl = (imageSrc, productId) => {
    if (imageErrors[productId]) {
      return "/fallback-image.webp";
    }
    return `https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/api/v1${imageSrc}`;
  };

  if (!data && !isLoading) return null;

  return (
    <div className="main_container">
      {/* Heading Section */}
      <div className="flex justify-center items-center w-full">
        <div className="relative w-fit flex flex-col mt-2 lg:mt-5">
          <h1 className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] text-[#2A619D] text-center">
            {section.heading || "E-Books"}
          </h1>

          <svg
            className="absolute top-8 lg:top-10 w-full"
            viewBox="0 0 110 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 10 Q80 -2 190 27"
              stroke="#2a619d"
              strokeWidth="1.3"
              fill="transparent"
            />
          </svg>
        </div>
      </div>

      {/* Subheading */}
      {section.subHeading && section.subHeading.length > 0 && (
        <div className="text-center px-4">
          <p className="text-gray-600 text-sm md:text-base">
            {section.subHeading[0]}
          </p>
        </div>
      )}

      {/* Stats Section */}
      {section.stats && section.stats.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 px-4 py-6">
          {section.stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#2A619D]">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards Grid */}
      <div className="px-4 md:px-6 xl:px-20 py-6 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {(isLoading ? Array(8).fill(0) : courses)?.map((course, index) =>
          isLoading ? (
            <Loader key={index} />
          ) : (
            <div
              key={course.productId}
              className="bg-[#DFF6F4] h-56 md:h-60 rounded-lg shadow-lg p-2 hover:scale-105 transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => setSelectedCard(course)}
            >
              {/* Image Container */}
              <div className="h-2/5 flex items-center justify-center">
                <div className="p-3 md:p-4 h-16 w-16 md:h-20 md:w-20 mx-auto flex items-center justify-center bg-white rounded-full shadow-sm">
                  <Image
                    src={getImageUrl(course.image?.src, course.productId)}
                    alt={course.image?.alt || course.title}
                    width={60}
                    height={60}
                    className="w-auto h-auto object-contain"
                    style={{ 
                      backgroundColor: 'transparent',
                      padding: 0,
                      margin: 0,
                      boxShadow: 'none',
                      borderRadius: 0
                    }}
                    onError={() => {
                      console.error(`Failed to load image: ${course.image?.src}`);
                      setImageErrors(prev => ({ ...prev, [course.productId]: true }));
                    }}
                    unoptimized={true}
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="h-3/5 p-3 bg-white rounded-md flex flex-col justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-blue-950 line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mt-1">
                    {course.description}
                  </p>
                </div>

                <button className="mt-2 p-1 px-3 md:px-4 w-1/2 border text-xs md:text-sm border-[#2a619d] text-[#2a619d] rounded-lg hover:bg-[#2a619d] hover:text-white transition-colors duration-300">
                  {course.button?.text || "Download"}
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Community Section */}
      {data?.communitySection && (
        <div className="mt-8 mb-12 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#2A619D] to-[#1E4A7A] rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8">
              <div className="text-center md:text-left mb-4 md:mb-0">
                {data.communitySection.heading && (
                  <>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {data.communitySection.heading[0]}
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100">
                      {data.communitySection.heading[1]}
                    </p>
                  </>
                )}
                {data.communitySection.description && (
                  <p className="text-blue-100 text-sm md:text-base mt-2">
                    {data.communitySection.description}
                  </p>
                )}
              </div>
              {data.communitySection.button && (
                <button 
                  className="px-6 py-2 bg-white text-[#2A619D] rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 text-sm md:text-base"
                  onClick={() => {
                    if (data.communitySection.button.name === "Join WhatsApp Community") {
                      window.open("https://chat.whatsapp.com/your-link", "_blank");
                    }
                  }}
                >
                  {data.communitySection.button.name}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      <Popupform
        show={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        course={selectedCard?.title || ""}
        courseName={selectedCard?.title || ""}
        title="Book a live demo for free"
        formType="ebook"
        buttonText="Download E-Book"
        successMessage="Your e-book is opening in a new tab."
        onSubmit={handleEbookSubmit}
      />
    </div>
  );
}