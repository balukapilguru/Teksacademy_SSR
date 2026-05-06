"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";

const SuccessStories = () => {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Helper function to extract raw S3 URL from Next.js proxy URLs
  const getRawImageUrl = (src) => {
    if (!src) return "";
    
    // Check if it's a teksacademy.com proxy URL
    if (src.includes("teksacademy.com/_next/image") && src.includes("url=")) {
      try {
        const urlParams = new URLSearchParams(src.split("?")[1]);
        const encodedUrl = urlParams.get("url");
        if (encodedUrl) {
          return decodeURIComponent(encodedUrl);
        }
      } catch (e) {
        console.error("Failed to parse image URL", e);
      }
    }
    return src;
  };

  // Fetch data on client
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/home/success-stories`);
        const response = await res.json();

        if (response?.success && response?.data) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch success stories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  // Get current tab data
  const currentTab = data?.tabs?.[activeTab];
  const videoCards = currentTab?.videoCards || [];
  const cards = currentTab?.cards || [];

  // Combine video cards and regular cards for display
  const allItems = useMemo(() => {
    const items = [];
    
    // Add video cards with video flag
    videoCards.forEach(card => {
      items.push({
        ...card,
        hasVideo: true,
        type: "video"
      });
    });
    
    // Add regular cards
    cards.forEach(card => {
      items.push({
        ...card,
        hasVideo: false,
        type: "image"
      });
    });
    
    return items;
  }, [videoCards, cards]);

  // Handle video click
  const handleVideoClick = (item) => {
    if (item.hasVideo && item.videoUrl) {
      setSelectedVideo(item);
    }
  };

  // Close video modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="main_container">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="mt-2 text-gray-600">Loading success stories...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="main_container">
        <div className="text-center py-20 text-gray-500">
          <p>Unable to load success stories. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { heroSection, heading, tabs } = data;

  return (
    <div className="main_container py-12">
      {/* Hero Section */}
      {heroSection && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <div>
              {heroSection?.badge && (
                <div className="inline-block bg-[#002b80] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  {heroSection.badge}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {heroSection?.title || "Our Ultimate Goal!"}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {heroSection?.subtitle || "Making Job Cracking- Simple, Smarter and Faster"}
              </p>
              
              {heroSection?.description && (
                <p className="text-gray-500 mb-6">
                  {heroSection.description}
                </p>
              )}
              
              {heroSection?.button && (
                <Link href={heroSection.button.link || "/success-stories"}>
                  <button className="bg-[#002b80] hover:bg-[#113c92] text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                    {heroSection.button.text || "Explore Career Transitions"}
                  </button>
                </Link>
              )}
            </div>
            
            {/* Right Gallery Images */}
            {heroSection?.galleryImages && heroSection.galleryImages.length > 0 && (
              <div className="grid sm:grid-cols-1 md:grid-cols-3  gap-2">
                {heroSection.galleryImages.slice(0, 6).map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden bg-white shadow-sm">
                    <Image
                      src={getRawImageUrl(img.src)}
                      alt={img.alt || `Gallery ${idx + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-24 md:h-32 object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Heading */}
      <div className="justify-items-center mb-8">
        <Heading data={heading} text={heading || "Success Stories"} />
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setSelectedVideo(null);
              }}
              className={`px-6 py-2 rounded-md transition font-medium ${
                activeTab === index
                  ? "bg-[#002b80] text-white shadow-md"
                  : "border border-blue-700 text-blue-700 hover:bg-blue-50"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {allItems.map((item, index) => (
          <div 
            key={index} 
            className={`group cursor-pointer rounded-lg bg-white ${
              item.hasVideo ? "relative" : ""
            }`}
            onClick={() => handleVideoClick(item)}
          >
            <div className="relative">
              <Image
                src={getRawImageUrl(item.thumbnail?.src || item.image?.src)}
                alt={item.thumbnail?.alt || item.name || item.image?.alt || "success story"}
                width={400}
                height={300}
                className="w-full h-56"
              />
              
             
            </div>
            
            {/* {item.name && (
              <div className="p-3 bg-white border-t border-gray-100">
                <p className="text-sm font-medium text-gray-800 text-center truncate">
                  {item.name}
                </p>
              </div>
            )} */}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {allItems.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>No stories available at the moment.</p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div 
            className="relative  w-auto bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition z-10"
              aria-label="Close video"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <video
              src={selectedVideo.videoUrl}
              className="w-56 h-auto bg-black"
              controls
              autoPlay
              playsInline
            />
            
            <div className="p-4 bg-gray-900">
              <h3 className="text-white font-semibold text-lg">{selectedVideo.name}</h3>
              <p className="text-gray-400 text-sm mt-1">Student Success Story</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;