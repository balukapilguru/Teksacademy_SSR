"use client";
import React, { useEffect, useState } from "react";
const ebookbanner =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/ebookbanner.webp";
import Image from "next/image";
import Loader from "@/components/Loader";
import Popupform from "@/components/Popupform";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";

const baseUrl =
  process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;

const S3_BASE_URL = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com";

const Ebook = () => {
  const [ebookData, setEbookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/resources/ebook`);

        if (!response.ok) {
          throw new Error(`Failed to fetch ebooks: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setEbookData(result.data);
          if (result.data.meta) {
            document.title = result.data.meta.title;
            const metaDescription = document.querySelector(
              'meta[name="description"]',
            );
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

  const resolveEbookUrl = (path) => {
    if (!path) return "";
    let p = String(path).trim();
    p = p.replace(/^(https?)\/\//i, "$1://");
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith("//")) return `https:${p}`;
    return `${S3_BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`;
  };

  const handleDownload = (course) => {
    setSelectedCard(course);
  };

  // Handle form submission - opens syllabus in new tab
  const handleFormSubmit = async (formValues) => {
    if (!selectedCard) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the syllabus/ebook URL
      const syllabusUrl = selectedCard?.ebookurl || selectedCard?.button?.ebookurl || selectedCard?.brochureLink;
      
      // Store the URL to open after submission
      if (syllabusUrl) {
        const resolvedUrl = resolveEbookUrl(syllabusUrl);
        sessionStorage.setItem('pendingSyllabusUrl', resolvedUrl);
      }

      // Prepare the payload
      const payload = {
        name: formValues.name?.trim() || "",
        email: formValues.email?.trim() || "",
        number: formValues.phone?.trim() || "",
        branch: formValues.branch || "",
        city: formValues.city || "",
        course: selectedCard.title || "",
        productId: selectedCard.productId || "",
        sourceId: selectedCard.sourceId || "",
        source: "Ebook—Website",
        crm_source: "Ebook—Website",
        form_type: "ebook",
        referredby: "website",
      };

      // Submit the lead
      const response = await fetch(
        buildApiUrl(blogsApplyBaseUrl, "/lead/create"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Submission failed");
      }

      // Open syllabus in new tab
      const savedUrl = sessionStorage.getItem('pendingSyllabusUrl');
      if (savedUrl) {
        window.open(savedUrl, "_blank", "noopener,noreferrer");
        sessionStorage.removeItem('pendingSyllabusUrl');
      }

      // Close popup after successful submission
      setSelectedCard(null);
      
      return { success: true };
      
    } catch (error) {
      console.error("Ebook submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
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
        <p className="text-red-500 text-lg">
          Failed to load eBooks. Please try again later.
        </p>
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
      <div className="flex flex-col xl:flex-row justify-center gap-6 xl:gap-12 px-4 lg:px-16 py-3 xl:py-12">
        <div className="relative w-full max-w-lg hidden md:block">
          <Image
            src={ebookbanner}
            alt="Ebook Preview image"
            className="w-full h-auto"
            width={500}
            height={500}
          />
        </div>
        <div className="text-black max-w-lg">
          <h4 className="text-[16px] font-semibold text-[#2a619d] hidden md:block">
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
                    onClick={() => handleDownload(course)}
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
                <p className="text-gray-200 mb-6">
                  {communitySection.description}
                </p>
                {communitySection.button && (
                  <a
                    href={communitySection.button.ebookurl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 
                               bg-[#FE543D] text-white 
                               px-4 py-2.5 sm:px-5 sm:py-3 
                               text-sm sm:text-base font-semibold
                               rounded-lg 
                               hover:bg-[#e04a35] 
                               transition-all duration-200 
                               whitespace-nowrap"
                  >
                    <span>{communitySection.button.name}</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
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
              <div className="lg:w-1/2 w-full p-2 lg:p-12 flex justify-center items-center">
                <div className="relative w-full max-w-[520px] aspect-[16/9]">
                  <Image
                    src={`${S3_BASE_URL}${communitySection.image?.src}`}
                    alt={communitySection.image?.alt || "Community"}
                    width={1400}
                    height={600}
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Form */}
      <Popupform
        show={!!selectedCard}
        onClose={() => {
          if (!isSubmitting) {
            setSelectedCard(null);
            sessionStorage.removeItem('pendingSyllabusUrl');
          }
        }}
        course={selectedCard?.title || ""}
        courseName={selectedCard?.title || ""}
        source="Ebook—Website"
        title="Download E-Book"
        subtitle={`Fill in your details to download "${selectedCard?.title || ''}"`}
        formType="ebook"
        buttonText="Download E-Book"
        successMessage="Your e-book is opening in a new tab."
        redirectToThankYou={true}
        onSubmit={handleFormSubmit}
        // Pass the syllabus URL to be opened after submission
        extraData={{
          syllabusUrl: selectedCard?.ebookurl || selectedCard?.button?.ebookurl || selectedCard?.brochureLink,
        }}
      />
    </div>
  );
};

export default Ebook;