"use client";

import { useState } from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";

const SuccessStories = ({ successStoriesData }) => {


  const [activeTab, setActiveTab] = useState("placed");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Normalize API inconsistency (cards vs Cards)
  const getCards = (section) => section?.cards || section?.Cards || {};

  const placed = getCards(successStoriesData?.data?.placedStudents);
  const learning = getCards(successStoriesData?.data?.LearningExperience);

  const currentSection = activeTab === "learning" ? learning : placed;

  const videoCards = currentSection?.videoCards || [];
  const placementCards = currentSection?.placementCards || [];

  const heading = successStoriesData?.heading || ["Our Success", "Stories"];
  const headingText = Array.isArray(heading) ? heading.join(" ") : heading;

  // Image URL handler
  const getImageUrl = (path) => {
    if (!path) return "/placeholder-image.webp";
    if (path.startsWith("http")) return path;
    return `https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/${path}`;
  };

  return (
    <div className="main_container">
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
        {/* 🔵 TOP ROW - VIDEO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  xl:grid-cols-4 gap-6">
          {videoCards.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">
              No video stories available
            </p>
          ) : (
            videoCards.map((item, index) => (
              <div
                key={`video-${index}`}
                onClick={() => item?.videoUrl && setSelectedVideo(item?.videoUrl)}
                className="cursor-pointer group rounded-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative aspect-video">
                  <Image
                    src={getImageUrl(item.thumbnail?.src)}
                    alt={item.thumbnail?.alt || item.name}
                    fill
                    className="group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Play Overlay */}
                  {item.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0  flex items-center justify-center transition">
                      <div className="bg-white rounded-full p-3 text-[#002b80] text-xl">
                        ▶
                      </div>
                    </div>
                  )}
                </div>

               
              </div>
            ))
          )}
        </div>

        {/* 🔴 BOTTOM ROW - PLACEMENT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {placementCards.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">
              No placement stories available
            </p>
          ) : (
            placementCards.map((item, index) => (
              <div
                key={`placement-${index}`}
                className="rounded-lg overflow-hidden  hover:shadow-lg transition"
              >
                <div className="relative aspect-video">
                  <Image
                    src={getImageUrl(item.image?.src)}
                    alt={item.image?.alt || item.name}
                    fill
                  />
                </div>

               
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🎥 VIDEO MODAL */}
      {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50">
            <div className="absolute h-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg">
              <button
                onClick={() => setSelectedVideo(null)}
                className="cursor-pointer text-white w-full text-right p-1 pr-2 text-xl font-bold"
              >
                ✖
              </button>
              <video
                autoPlay
                loop
                className="rounded-lg w-full h-full"
              >
                {/* {console.log(selectedVideo,'ieifjdf')} */}
                <source
                  // src={selectedVideo}
                                src={getImageUrl(selectedVideo)}
                  type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
    </div>
  );
};

export default SuccessStories;