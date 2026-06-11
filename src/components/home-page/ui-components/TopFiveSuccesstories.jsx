"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { FaPlay } from "react-icons/fa";

const UnifiedSuccessStories = ({ data }) => {
  const [activeTab, setActiveTab] = useState("placed");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  // Carousel state for Learning tab
  const [learningIndex, setLearningIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Normalize API inconsistency (cards vs Cards)
  const getCards = (section) => section?.cards || section?.Cards || {};

  const placedData = getCards(data?.data?.placedStudents);
//   const learningData = getCards(data?.data?.LearningExperience);

  const placedVideoCards = placedData?.videoCards || [];
  const placedPlacementCards = placedData?.placementCards || [];

  // For Learning tab, we use placementCards as testimonial cards (if available)
  const learningTestimonialCards = placedData?.placementCards || [];

  const heading = data?.heading || ["Our Success", "Stories"];

  const maxLength = placedVideoCards.length;

  // Reset mobile index when tab changes
  useEffect(() => {
    setMobileIndex(0);
  }, [activeTab]);

  // Auto-slide for Learning tab carousel
  useEffect(() => {
    if (isPaused || learningTestimonialCards.length === 0) return;

    const interval = setInterval(() => {
      setLearningIndex((prev) => (prev + 1) % learningTestimonialCards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, learningTestimonialCards]);

  // Helper for image URL
  const getImageUrl = (imageData) => {
    if (!imageData || !imageData.src || imageData.src === "null") {
      return "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/fallback-user.png";
    }
    return GetData({ url: imageData.src });
  };

  // Arrow button component
  const ArrowBtn = ({ direction, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="p-1 text-[#2a619d] disabled:opacity-25 disabled:cursor-not-allowed transition"
    >
      {direction === "prev" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );

  // Get 3 cards for desktop (center + left + right)
  const getTriple = (arr, idx) => {
    if (!arr || arr.length === 0) return [];
    const total = arr.length;
    return [arr[(idx - 1 + total) % total], arr[idx], arr[(idx + 1) % total]];
  };

  const nextLearning = () => {
    setLearningIndex((prev) => (prev + 1) % learningTestimonialCards.length);
  };

  const prevLearning = () => {
    setLearningIndex((prev) =>
      prev === 0 ? learningTestimonialCards.length - 1 : prev - 1
    );
  };

  return (
    <div className="main_container">
      {/* Heading */}
      <div className="justify-items-center mb-8">
        <Heading data={heading} />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        <button
          onClick={() => setActiveTab("placed")}
          className={`px-1 md:px-4 py-2 rounded-md transition ${
            activeTab === "placed"
              ? "bg-[#2a619d] text-white"
              : "border border-[#2a619d] text-[#2a619d] hover:bg-[#2a619d] hover:text-white"
          }`}
        >
          Placed Students
        </button>
        <button
          onClick={() => setActiveTab("learning")}
          className={`px-1 md:px-4 py-2 rounded-md transition ${
            activeTab === "learning"
              ? "bg-[#2a619d] text-white"
              : "border border-[#2a619d] text-[#2a619d] hover:bg-[#2a619d] hover:text-white"
          }`}
        >
          Learning Experience
        </button>
      </div>

      {/* ========== TAB 1: PLACED STUDENTS (SuccessStories design) ========== */}
      {activeTab === "placed" && (
        <div className="space-y-10">
          {/* Video Cards Section */}
          <div>
            {/* DESKTOP: 4-col grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {placedVideoCards.length === 0 ? (
                <p className="col-span-full text-center text-gray-400">
                  No video stories available
                </p>
              ) : (
                placedVideoCards.map((item, index) => (
                  <div
                    key={`video-${index}`}
                    onClick={() =>
                      item?.videoUrl && setSelectedVideo(item?.videoUrl)
                    }
                    className="cursor-pointer group rounded-lg overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={GetData({ url: item.thumbnail?.src })}
                        alt={item.thumbnail?.alt || item.name}
                        fill
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.videoUrl && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <div className="bg-white rounded-full p-3 text-[#2a619d] text-xl">
                            ▶
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* MOBILE: 1 card carousel for videos */}
            <div className="sm:hidden">
              {placedVideoCards.length === 0 ? (
                <p className="text-center text-gray-400">
                  No video stories available
                </p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-full cursor-pointer group rounded-lg overflow-hidden shadow hover:shadow-xl transition"
                    onClick={() =>
                      placedVideoCards[mobileIndex]?.videoUrl &&
                      setSelectedVideo(placedVideoCards[mobileIndex]?.videoUrl)
                    }
                  >
                    <div className="relative aspect-video w-full">
                      <Image
                        src={GetData({
                          url: placedVideoCards[mobileIndex].thumbnail?.src,
                        })}
                        alt={
                          placedVideoCards[mobileIndex].thumbnail?.alt ||
                          placedVideoCards[mobileIndex].name
                        }
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {placedVideoCards[mobileIndex].videoUrl && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <div className="bg-white rounded-full p-3 text-[#2a619d] text-xl">
                            ▶
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <ArrowBtn
                      direction="prev"
                      onClick={() => setMobileIndex((i) => Math.max(0, i - 1))}
                      disabled={mobileIndex === 0}
                    />
                    <div className="flex gap-2">
                      {Array.from({ length: placedVideoCards.length }).map(
                        (_, i) => (
                          <button
                            key={i}
                            onClick={() => setMobileIndex(i)}
                            className={`h-2 rounded-full transition-all duration-200 ${
                              i === mobileIndex
                                ? "bg-[#2a619d] w-5"
                                : "bg-gray-300 w-2"
                            }`}
                          />
                        )
                      )}
                    </div>
                    <ArrowBtn
                      direction="next"
                      onClick={() =>
                        setMobileIndex((i) =>
                          Math.min(placedVideoCards.length - 1, i + 1)
                        )
                      }
                      disabled={mobileIndex === placedVideoCards.length - 1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Placement Cards Section */}
          <div>
            {/* DESKTOP: 4-col grid */}
            {/* <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {placedPlacementCards.length === 0 ? (
                <p className="col-span-full text-center text-gray-400">
                  No placement stories available
                </p>
              ) : (
                placedPlacementCards.map((item, index) => (
                  <div
                    key={`placement-${index}`}
                    className="rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={GetData({ url: item.image?.src })}
                        alt={item.image?.alt || item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))
              )}
            </div> */}

            {/* MOBILE: 1 card carousel for placements */}
            <div className="sm:hidden">
              {placedPlacementCards.length === 0 ? (
                <p className="text-center text-gray-400">
                  No placement stories available
                </p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={GetData({
                          url: placedPlacementCards[mobileIndex].image?.src,
                        })}
                        alt={
                          placedPlacementCards[mobileIndex].image?.alt ||
                          placedPlacementCards[mobileIndex].name
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <ArrowBtn
                      direction="prev"
                      onClick={() => setMobileIndex((i) => Math.max(0, i - 1))}
                      disabled={mobileIndex === 0}
                    />
                    <div className="flex gap-2">
                      {Array.from({ length: placedPlacementCards.length }).map(
                        (_, i) => (
                          <button
                            key={i}
                            onClick={() => setMobileIndex(i)}
                            className={`h-2 rounded-full transition-all duration-200 ${
                              i === mobileIndex
                                ? "bg-[#2a619d] w-5"
                                : "bg-gray-300 w-2"
                            }`}
                          />
                        )
                      )}
                    </div>
                    <ArrowBtn
                      direction="next"
                      onClick={() =>
                        setMobileIndex((i) =>
                          Math.min(placedPlacementCards.length - 1, i + 1)
                        )
                      }
                      disabled={mobileIndex === placedPlacementCards.length - 1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== TAB 2: LEARNING EXPERIENCE (Testimonials design - 3-card carousel) ========== */}
      {activeTab === "learning" && (
        <div
          className="relative w-full flex justify-center items-center min-h-[400px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {learningTestimonialCards.length > 0 ? (
            <>
              {/* LEFT ARROW */}
              <button
                onClick={prevLearning}
                aria-label="Previous testimonial"
                className="absolute -left-2 sm:left-0 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
              >
                <IoIosArrowBack size={24} aria-hidden="true" />
                <span className="sr-only">Previous</span>
              </button>

              {/* RIGHT ARROW */}
              <button
                onClick={nextLearning}
                aria-label="Next testimonial"
                className="absolute -right-2 sm:right-0 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
              >
                <IoIosArrowForward size={24} aria-hidden="true" />
                <span className="sr-only">Next</span>
              </button>

              {/* MOBILE: 1 CARD */}
              <div className="block md:hidden w-full max-w-sm px-4">
                <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col min-h-[360px]">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden border bg-gray-200">
                      <Image
                        src={getImageUrl(learningTestimonialCards[learningIndex]?.image)}
                        alt={learningTestimonialCards[learningIndex]?.name || "Student"}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-start">
                        {learningTestimonialCards[learningIndex]?.name}
                      </div>
                      <div className="text-sm text-gray-600 text-start">
                        {learningTestimonialCards[learningIndex]?.course}
                      </div>
                    </div>
                  </div>
                  <p
                    className="text-gray-600 text-sm leading-relaxed overflow-y-auto pr-2"
                    style={{ maxHeight: "160px" }}
                  >
                    {learningTestimonialCards[learningIndex]?.review}
                  </p>
                </div>
              </div>

              {/* DESKTOP: 3 CARDS with center highlighted */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {getTriple(learningTestimonialCards, learningIndex).map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white p-6 rounded-xl shadow-md border transition-all duration-500 
                      flex flex-col min-h-[360px] max-h-[360px] 
                      ${
                        i === 1
                          ? "border-[#2a619d] scale-105 shadow-xl"
                          : "opacity-80 scale-95 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-[100px] h-[100px] rounded-full overflow-hidden border bg-gray-200">
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.name || "Student"}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-start">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 text-start">
                          {item.course}
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-gray-600 text-sm text-justify leading-relaxed mt-2 overflow-y-auto pr-2"
                      style={{ maxHeight: "160px" }}
                    >
                      {item.review}
                    </p>
                  </div>
                ))}
              </div>

              {/* DOTS NAVIGATION */}
              <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center gap-3 mt-4">
                {learningTestimonialCards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLearningIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`w-3 h-3 rounded-full transition ${
                      learningIndex === i ? "bg-[#2a619d] scale-125" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-10">
              No learning experience stories available
            </div>
          )}
        </div>
      )}

      {/* VIDEO MODAL (for placed tab video clicks) */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-black rounded-xl shadow-xl overflow-hidden">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-3 z-10 text-white text-2xl font-bold hover:scale-110 transition"
            >
              ✖
            </button>
            <div className="w-full aspect-video">
              <video
                key={selectedVideo}
                src={GetData({ url: selectedVideo })}
                autoPlay
                controls
                className="w-full h-full object-contain"
              >
                <source src={GetData({ url: selectedVideo })} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSuccessStories;