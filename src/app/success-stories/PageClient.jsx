"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import Loader from "@/components/Loader";

const SuccessStories = () => {
  const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/home/success-stories`);
        const response = await res.json();

        if (response.success && response.data) {
          setData(response.data);

          if (response.data.meta) {
            document.title = response.data.meta.title;
            const metaDescription = document.querySelector(
              'meta[name="description"]'
            );
            if (metaDescription) {
              metaDescription.content = response.data.meta.description;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch success stories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  const currentTab = data?.tabs?.[activeTab];
  const videoCards = currentTab?.videoCards || [];
  const cards = currentTab?.cards || [];
  const alumniCards = currentTab?.alumniCards || [];
console.log(currentTab,"tab")
  // ✅ DO NOT include alumni here
  const allItems = useMemo(() => {
    const items = [];

    videoCards.forEach((card) => {
      items.push({
        ...card,
        hasVideo: true,
        type: "video",
      });
    });

    cards.forEach((card) => {
      items.push({
        ...card,
        hasVideo: false,
        type: "image",
      });
    });

    return items;
  }, [videoCards, cards]);

  const handleVideoClick = (item) => {
    if (item.hasVideo && item.videoUrl) {
      setSelectedVideo(item);
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div>
        <Loader />
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
            <div>
              {heroSection?.badge && (
                <div className="inline-block bg-[#2A619D] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  {heroSection.badge}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {heroSection?.title || "Our Ultimate Goal!"}
              </h1>

              <p className="text-xl text-gray-600 mb-6">
                {heroSection?.subtitle ||
                  "Making Job Cracking- Simple, Smarter and Faster"}
              </p>

              {heroSection?.description && (
                <p className="text-gray-500 mb-6">
                  {heroSection.description}
                </p>
              )}

              {heroSection?.button && (
                <Link href={heroSection.button.link || "/discover/contact-us"}>
                  <button className="bg-[#2A619D] hover:bg-[#2A619D] text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                    {heroSection.button.text ||
                      "Explore Career Transitions"}
                  </button>
                </Link>
              )}
            </div>

            {heroSection?.galleryImages?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6">
                {heroSection.galleryImages.slice(0, 6).map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden bg-white shadow-sm">
                    <Image
                      src={img.src}
                      alt={img.alt || `Gallery ${idx + 1}`}
                      width={200}
                      height={180}
                      className="  w-full h-24 md:h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Heading */}
      <div className="justify-items-center mb-8">
        <Heading data={heading} text={heading || "Success Stories"} />
      </div>

      {/* Tabs */}
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
                ? "bg-[#2A619D] text-white"
                : "border border-[#2A619D] text-[#2A619D]"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* NORMAL CARDS (Tab 1 & 2) */}
      {activeTab !== 2 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-3 px-4">
          {allItems.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-lg bg-white"
              onClick={() => handleVideoClick(item)}
            >
              <Image
                src={item.thumbnail?.src || item.image?.src}
                alt={item.name}
                width={400}
                height={300}
                className="w-full h-56 object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {/* ✅ ALUMNI TAB (3rd TAB UI) */}
      {activeTab === 2 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 px-4">
          {alumniCards.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src={item.image?.src}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-semibold text-gray-900 text-sm">
                {item.name}
              </h3>

              <p className="text-orange-500 text-xs mt-1">
                {item.role}
              </p>

              {item.companyLogo?.src && (
                <div className="mt-3 flex justify-center">
                  <Image
                    src={item.companyLogo.src}
                    alt="company"
                    width={100}
                    height={40}
                    className="object-contain h-6"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div
            className="relative bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute top-2 font-extrabold right-2 text-orange-500"
            >
              ✕
            </button>

            <video
              src={selectedVideo.videoUrl}
              className="w-56"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;