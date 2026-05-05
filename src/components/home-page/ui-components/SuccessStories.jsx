"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";

const SuccessStories = ({ successStoriesData }) => {
  const [activeTab, setActiveTab] = useState("placed");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Mobile carousel indices
  const [videoIndex, setVideoIndex] = useState(0);
  const [placementIndex, setPlacementIndex] = useState(0);

  // Normalize API inconsistency (cards vs Cards)
  const getCards = (section) => section?.cards || section?.Cards || {};

  const placed = getCards(successStoriesData?.data?.placedStudents);
  const learning = getCards(successStoriesData?.data?.LearningExperience);

  const currentSection = activeTab === "learning" ? learning : placed;

  const videoCards = currentSection?.videoCards || [];
  const placementCards = currentSection?.placementCards || [];

  const heading = successStoriesData?.heading || ["Our Success", "Stories"];
  const headingText = Array.isArray(heading) ? heading.join(" ") : heading;



  // Reset indices when tab changes
  useEffect(() => {
    setVideoIndex(0);
    setPlacementIndex(0);
  }, [activeTab]);

  // Simple minimal chevron arrow (same as CertificationCourse)
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
    <div className="main_container py-4">
      {/* Heading */}
      <div className="justify-items-center mb-8">
        <Heading data={headingText} text={headingText} />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        <button
          onClick={() => setActiveTab("placed")}
          className={`px-6 py-2 rounded-md transition ${
            activeTab === "placed"
              ? "bg-[#002b80] text-white"
              : "border border-[#002b80] text-[#002b80] hover:bg-[#002b80] hover:text-white"
          }`}
        >
          Placed Students
        </button>
        <button
          onClick={() => setActiveTab("learning")}
          className={`px-6 py-2 rounded-md transition ${
            activeTab === "learning"
              ? "bg-[#002b80] text-white"
              : "border border-[#002b80] text-[#002b80] hover:bg-[#002b80] hover:text-white"
          }`}
        >
          Learning Experience
        </button>
      </div>

      <div className="space-y-10">

        {/* ── VIDEO CARDS ── */}

        {/* DESKTOP: 4-col grid — untouched */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {videoCards.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">No video stories available</p>
          ) : (
            videoCards.map((item, index) => (
              <div
                key={`video-${index}`}
                onClick={() => item?.videoUrl && setSelectedVideo(item?.videoUrl)}
                className="cursor-pointer group rounded-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative aspect-video">
                  <Image
                    src={GetData({url:item.thumbnail?.src})}
                    alt={item.thumbnail?.alt || item.name}
                    fill
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center transition">
                      <div className="bg-white rounded-full p-3 text-[#002b80] text-xl">▶</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* MOBILE: 1 card at a time, arrows + dots below */}
        <div className="sm:hidden">
          {videoCards.length === 0 ? (
            <p className="text-center text-gray-400">No video stories available</p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Card full width */}
              <div
                className="w-full cursor-pointer group rounded-lg overflow-hidden shadow hover:shadow-xl transition"
                onClick={() => videoCards[videoIndex]?.videoUrl && setSelectedVideo(videoCards[videoIndex]?.videoUrl)}
              >
                <div className="relative aspect-video w-full">
                  <Image
                    src={GetData({url:videoCards[videoIndex].thumbnail?.src})}
                    alt={videoCards[videoIndex].thumbnail?.alt || videoCards[videoIndex].name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {videoCards[videoIndex].videoUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <div className="bg-white rounded-full p-3 text-[#002b80] text-xl">▶</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Arrows + Dots row */}
              <div className="flex items-center justify-center gap-3 mt-1">
                <ArrowBtn
                  direction="prev"
                  onClick={() => setVideoIndex((i) => Math.max(0, i - 1))}
                  disabled={videoIndex === 0}
                />
                <div className="flex gap-2">
                  {videoCards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVideoIndex(i)}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        i === videoIndex ? "bg-[#002b80] w-5" : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
                <ArrowBtn
                  direction="next"
                  onClick={() => setVideoIndex((i) => Math.min(videoCards.length - 1, i + 1))}
                  disabled={videoIndex === videoCards.length - 1}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── PLACEMENT CARDS ── */}

        {/* DESKTOP: 4-col grid — untouched */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {placementCards.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">No placement stories available</p>
          ) : (
            placementCards.map((item, index) => (
              <div key={`placement-${index}`} className="rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="relative aspect-video">
                  <Image
                    src={GetData({url:item.image?.src})}
                    alt={item.image?.alt || item.name}
                    fill
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* MOBILE: 1 card at a time, arrows + dots below */}
        <div className="sm:hidden">
          {placementCards.length === 0 ? (
            <p className="text-center text-gray-400">No placement stories available</p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Card full width */}
              <div className="w-full rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <div className="relative aspect-video w-full">
                  <Image
                    src={GetData({url:placementCards[placementIndex].image?.src})}
                    alt={placementCards[placementIndex].image?.alt || placementCards[placementIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Arrows + Dots row */}
              <div className="flex items-center justify-center gap-3 mt-1">
                <ArrowBtn
                  direction="prev"
                  onClick={() => setPlacementIndex((i) => Math.max(0, i - 1))}
                  disabled={placementIndex === 0}
                />
                <div className="flex gap-2">
                  {placementCards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPlacementIndex(i)}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        i === placementIndex ? "bg-[#002b80] w-5" : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
                <ArrowBtn
                  direction="next"
                  onClick={() => setPlacementIndex((i) => Math.min(placementCards.length - 1, i + 1))}
                  disabled={placementIndex === placementCards.length - 1}
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* VIDEO MODAL — untouched */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50">
          <div className="absolute h-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg">
            <button
              onClick={() => setSelectedVideo(null)}
              className="cursor-pointer text-white w-full text-right p-1 pr-2 text-xl font-bold"
            >
              ✖
            </button>
            <video autoPlay loop className="rounded-lg w-full h-full">
              <source src={GetData({url:selectedVideo})} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;