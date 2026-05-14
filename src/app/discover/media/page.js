"use client";
import { useEffect, useState } from "react";
import { LuNewspaper } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { MdOndemandVideo } from "react-icons/md";
import Image from "next/image";

const Media = () => {
  const [activeTab, setActiveTab] = useState("news-papers");
  const [activeInfluencerTab, setActiveInfluencerTab] = useState("youtube");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map icon names to components
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "newspaper":
        return <LuNewspaper />;
      case "mic":
        return <IoMicOutline />;
      case "video":
        return <MdOndemandVideo />;
      default:
        return <LuNewspaper />;
    }
  };

  // Fetch media data from API
  useEffect(() => {
    const fetchMediaData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(`${baseUrl}/api/v1/discover/media`, {
          next: { revalidate: 60 },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        
        console.log("API Response:", data);
        
        if (data.success && data.data?.mediaSection) {
          setMediaData(data.data.mediaSection);
          
          // Find the first active tab to set as default
          const firstActiveTab = data.data.mediaSection.tabs?.find(tab => tab.active === true);
          if (firstActiveTab) {
            setActiveTab(firstActiveTab.id);
          } else if (data.data.mediaSection.tabs?.length > 0) {
            setActiveTab(data.data.mediaSection.tabs[0].id);
          }
        } else {
          setError("Failed to load media data");
        }
      } catch (err) {
        console.error("Error fetching media data:", err);
        setError("Failed to load media data");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  // Generate tabs from API data
  const tabs = mediaData?.tabs?.map(tab => ({
    id: tab.id,
    label: tab.label,
    icon: getIconComponent(tab.icon)
  })) || [];

  // Get influencer sub-tabs (for Instagram and YouTube)
  const getInfluencerSubTabs = () => {
    if (!mediaData?.tabs) return [];
    
    const influencerTab = mediaData.tabs.find(tab => tab.id === "influencer");
    if (!influencerTab?.mediaCards) return [];
    
    // Separate YouTube and Instagram videos
    const youtubeVideos = influencerTab.mediaCards.filter(card => 
      card.videoUrl && card.videoUrl.includes("youtube.com")
    );
    const instagramVideos = influencerTab.mediaCards.filter(card => 
      card.videoUrl && card.videoUrl.includes("instagram.com")
    );
    
    // Only show sub-tabs if both types exist
    const subTabs = [];
    if (youtubeVideos.length > 0) subTabs.push({ id: "youtube", label: "YouTube" });
    if (instagramVideos.length > 0) subTabs.push({ id: "instagram", label: "Instagram" });
    
    return subTabs;
  };

  const influencerSubTabs = getInfluencerSubTabs();

  const getTabData = () => {
    if (!mediaData?.tabs) return [];
    
    const currentTab = mediaData.tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return [];
    
    if (activeTab === "influencer") {
      const videos = currentTab.mediaCards || [];
      if (activeInfluencerTab === "youtube") {
        return videos.filter(card => card.videoUrl && card.videoUrl.includes("youtube.com"));
      } else if (activeInfluencerTab === "instagram") {
        return videos.filter(card => card.videoUrl && card.videoUrl.includes("instagram.com"));
      }
      return videos;
    }
    
    return currentTab.mediaCards || [];
  };

  if (loading) {
    return (
      <div className="main_container">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">Loading media content...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main_container">
        <div className="flex justify-center items-center h-64">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main_container">
      <div className="pb-7 flex justify-center items-center w-full">
        <div className="relative w-fit flex flex-col ">
          <h1 className="mt-6 font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
          <span className="text-[#2A619D]">{mediaData?.title || "Media"}</span>
          </h1>    
          <svg
            className="mt-6 absolute top-9 w-full h-auto"
            viewBox="0 0 110 12"
          >
            <path
              d="M0 10 Q80 -2 190 27"
              stroke="orangered"
              strokeWidth="1.5"
              fill="transparent"
              strokeLinecap="square"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-center w-11/12 xl:w-full mx-auto gap-4 lg:gap-16 3xl:gap-x-24 border-b-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // Reset influencer tab when switching to influencer tab
              if (tab.id === "influencer" && influencerSubTabs.length > 0) {
                setActiveInfluencerTab(influencerSubTabs[0].id);
              }
            }}
            className={`flex items-center gap-1 lg:px-4 py-1 lg:py-2 2xl:gap-2 transition ${
              activeTab === tab.id
                ? "text-[#2c5ea4] border-b-2 border-[#2c5ea4]"
                : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span className="text-[0.7rem] lg:text-base xl:text-lg 3xl:text-xl">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "influencer" && influencerSubTabs.length > 1 && (
        <div className="flex justify-center gap-4 lg:gap-8 mt-2 lg:mt-4">
          {influencerSubTabs.map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setActiveInfluencerTab(subTab.id)}
              className={`px-4 py-1 lg:py-2 text-[0.7rem] lg:text-base xl:text-lg 3xl:text-xl transition border-b-2 ${
                activeInfluencerTab === subTab.id
                  ? "text-[#2c5ea4] border-[#2c5ea4]"
                  : "text-gray-500"
              }`}
            >
              {subTab.label}
            </button>
          ))}
        </div>
      )}

      <div className="py-6 mb-4 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 w-11/12 xl:w-full mx-auto gap-3 lg:gap-6 2xl:gap-8 3xl:gap-10 mt-6">
        {getTabData().map((item) => {
          // For digital media and influencer tabs, use thumbnail field
          // For news-papers tab, use cardImage field
          let imageUrl = "";
          if (activeTab === "news-papers") {
            imageUrl = item.cardImage;
          } else {
            imageUrl = item.thumbnail;
          }
          
          console.log(`Item ${item.id} - Tab: ${activeTab}, Image URL:`, imageUrl); // Debug log
          
          return activeTab === "news-papers" ? (
            <Image
              key={item.id}
              src={imageUrl}
              alt={item.alt}
              width={500}
              height={500}
              className="rounded-lg shadow-md"
              onError={(e) => {
                console.error(`Failed to load image: ${imageUrl}`);
                e.target.style.display = 'none';
              }}
            />
          ) : activeTab === "influencer" && activeInfluencerTab === "instagram" ? (
            <a
              key={item.id}
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.alt}
                  width={400}
                  height={400}
                  className="rounded-lg shadow-md cursor-pointer"
                  onError={(e) => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-[400px] h-[400px] bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 rounded-lg bg-gray-950">
                <div className="flex items-center justify-center w-8 h-8 xl:w-16 xl:h-16 border-4 border-white rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-10 h-10"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
          ) : (
            <button
              key={item.id}
              onClick={() => setSelectedVideo(item.videoUrl)}
              className="relative"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.alt}
                  width={400}
                  height={240}
                  className="rounded-lg shadow-md cursor-pointer"
                  onError={(e) => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-[400px] h-[240px] bg-gray-200 rounded-lg shadow-md cursor-pointer flex items-center justify-center">
                  <span className="text-gray-500">No thumbnail available</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-40 rounded-lg bg-gray-950">
                <div className="flex items-center justify-center w-8 h-8 xl:w-16 xl:h-16 border-4 border-gray-300 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-16 h-16 opacity-80"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-50 z-30">
          <div className="bg-white p-2 pt-10 rounded-lg shadow-lg relative">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              ✖
            </button>
            <iframe
              width="600"
              height="360"
              src={selectedVideo}
              title="Video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;