// app/components/BannerVideo.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaRegPlayCircle } from "react-icons/fa";
import GetData from "@/utility/GetData";

const BannerVideo = () => {
  const [play, setPlay] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banner data from backend API
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;
        const response = await fetch(`${baseUrl}/api/v1/home`, {
          method: "GET",
          next: { revalidate: 60 },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch banner data: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Banner API Response:", result);
        
        // Extract banner data from the response
        const banner = result?.data?.banner;
        if (banner) {
          setBannerData(banner);
        } else {
          throw new Error("No banner data found in API response");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching banner data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchBannerData();
  }, []);

  // Get video URL - uses GetData utility which handles S3 protocol
  const getVideoUrl = () => {
    if (!bannerData?.video) {
      // Default video path if API doesn't provide one
      return GetData({ url: "/assets/videossection/glimpse_video_for_website.mp4" });
    }
    return GetData({ url: bannerData.video });
  };

  // Get thumbnail URL - uses local image as default
  const getThumbnailUrl = () => {
    if (!bannerData?.thumbnail) {
      return "/src/assets/Video_thumbnail.jpg";
    }
    return GetData({ url: bannerData.thumbnail });
  };

  // Get offeredBy data (partner logos)
  const getOfferedByData = () => {
    return bannerData?.offeredBy || null;
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="bg-gray-300 rounded-lg h-64 w-full"></div>
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-gray-300 rounded-lg h-12 w-24"></div>
            <div className="bg-gray-300 rounded-lg h-12 w-24"></div>
            <div className="bg-gray-300 rounded-lg h-12 w-24"></div>
            <div className="bg-gray-300 rounded-lg h-12 w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Banner error, showing fallback:", error);
    // Still try to show fallback video even if API fails
  }

  const offeredBy = getOfferedByData();
  const hasOfferedBy = offeredBy && offeredBy.image && offeredBy.image.length > 0;

  return (
    <div className="w-full">
      {/* Video Section */}
      {!play ? (
        <div
          className="relative cursor-pointer group"
          onClick={() => setPlay(true)}
        >
          <Image
            src={getThumbnailUrl()}
            alt="Homepage Banner"
            width={600}
            height={300}
            className="rounded-lg shadow-lg object-cover w-full border border-[#2a619d]"
            unoptimized
          />
          {/* Play Button */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#2a619d] animate-ping opacity-75"></div>
              <div className="relative w-10 h-10 rounded-full bg-[#2a619d] backdrop-blur-sm flex items-center justify-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <FaRegPlayCircle className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
          <video
            className="w-full h-full"
            controls
            autoPlay
            src={getVideoUrl()}
            title="Video Player"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Partner Logos Section - Displayed below the video from API data */}
      {hasOfferedBy && (
        <div className="">
          {/* Heading from API */}
          {offeredBy.heading && offeredBy.heading.length > 0 && (
            <h3 className="mt-4 text-start text-base md:text-lg font-semibold text-gray-700 mb-2">
              {offeredBy.heading[0]}
            </h3>
          )}
          
          {/* Logos Grid/Row - Dynamically from API */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8 items-center">
            {offeredBy.image.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-2 md:p-1 bg-white rounded-lg shadow-sm"
              >
                <Image
                  src={GetData({ url: logo.src })}
                  alt={logo.alt || `Partner logo ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-contain h-12 md:h-16 w-auto"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerVideo;