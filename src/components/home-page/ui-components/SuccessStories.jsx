"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";

const SuccessStories = ({ successStoriesData }) => {
  const [activeTab, setActiveTab] = useState("placed");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  // Mobile carousel indices
  const [videoIndex, setVideoIndex] = useState(0);
  // const [placementIndex, setPlacementIndex] = useState(0);

  // Normalize API inconsistency (cards vs Cards)
  const getCards = (section) => section?.cards || section?.Cards || {};

  const placed = getCards(successStoriesData?.data?.placedStudents);
  const learning = getCards(successStoriesData?.data?.LearningExperience);

  const currentSection = activeTab === "learning" ? learning : placed;

  const videoCards = currentSection?.videoCards || [];
  const placementCards = currentSection?.placementCards || [];

  const heading = successStoriesData?.heading || ["Our Success", "Stories"];

  const maxLength = Math.min(videoCards.length, placementCards.length);

  // Reset indices when tab changes
  // useEffect(() => {
  //   setVideoIndex(0);
  //   setPlacementIndex(0);
  // }, [activeTab]);
  useEffect(() => {
    setMobileIndex(0);
  }, [activeTab]);

  // Simple minimal chevron arrow (same as CertificationCourse)
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

      <div className="space-y-10">
        {/* ── VIDEO CARDS ── */}

        {/* DESKTOP: 4-col grid — untouched */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {videoCards.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">
              No video stories available
            </p>
          ) : (
            videoCards.map((item, index) => (
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
                    className=" transition-transform duration-300"
                  />
                  {item.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center transition">
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

        {/* MOBILE: 1 card at a time, arrows + dots below */}
        <div className="sm:hidden">
          {videoCards.length === 0 ? (
            <p className="text-center text-gray-400">
              No video stories available
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Card full width */}
              <div
                className="w-full cursor-pointer group rounded-lg overflow-hidden shadow hover:shadow-xl transition"
                onClick={() =>
                  videoCards[mobileIndex]?.videoUrl &&
                  setSelectedVideo(videoCards[mobileIndex]?.videoUrl)
                }
              >
                <div className="relative aspect-video w-full">
                  <Image
                    src={GetData({
                      url: videoCards[mobileIndex].thumbnail?.src,
                    })}
                    alt={
                      videoCards[mobileIndex].thumbnail?.alt ||
                      videoCards[mobileIndex].name
                    }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {videoCards[mobileIndex].videoUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <div className="bg-white rounded-full p-3 text-[#2a619d] text-xl">
                        ▶
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Arrows + Dots row */}
              
            </div>
          )}
        </div>

        {/* ── PLACEMENT CARDS ── */}

        {/* DESKTOP: 4-col grid — untouched */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {placementCards.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">
              No placement stories available
            </p>
          ) : (
            placementCards.map((item, index) => (
              <div
                key={`placement-${index}`}
                className="rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative aspect-video">
                  <Image
                    src={GetData({ url: item.image?.src })}
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
            <p className="text-center text-gray-400">
              No placement stories available
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Card full width */}
              <div className="w-full rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <div className="relative aspect-video w-full">
                  <Image
                    src={GetData({
                      url: placementCards[mobileIndex].image?.src,
                    })}
                    alt={
                      placementCards[mobileIndex].image?.alt ||
                      placementCards[mobileIndex].name
                    }
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Arrows + Dots row */}
           <div className="flex items-center justify-center gap-3 mt-1">
  <ArrowBtn
    direction="prev"
    onClick={() =>
      setMobileIndex((i) => Math.max(0, i - 1))
    }
    disabled={mobileIndex === 0}
  />

  {/* DOTS */}
  <div className="flex gap-2">
    {Array.from({ length: maxLength }).map((_, i) => (
      <button
        key={i}
        onClick={() => setMobileIndex(i)}
        className={`h-2 rounded-full transition-all duration-200 ${
          i === mobileIndex
            ? "bg-[#2a619d] w-5"
            : "bg-gray-300 w-2"
        }`}
      />
    ))}
  </div>

  <ArrowBtn
    direction="next"
    onClick={() =>
      setMobileIndex((i) =>
        Math.min(maxLength - 1, i + 1)
      )
    }
    disabled={mobileIndex === maxLength - 1}
  />
</div>
            </div>
          )}
        </div>
      </div>

      {/* VIDEO MODAL — untouched */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-xs bg-black rounded-lg shadow-xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-3 z-10 text-white text-2xl font-bold hover:scale-110 transition"
            >
              ✖
            </button>

            {/* Video */}
            <div className="w-full aspect-video">
              <video autoPlay controls className="w-full h-auto object-cover">
                <source
                  src={GetData({ url: selectedVideo })}
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;
