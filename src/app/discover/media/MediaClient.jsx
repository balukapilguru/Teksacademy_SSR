"use client";
import { useEffect, useState } from "react";
import { LuNewspaper } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { MdOndemandVideo } from "react-icons/md";
import Image from "next/image";
import Loader from "@/components/Loader";
import Heading from "@/utility/Heading";

const Media = () => {
  const [activeTab, setActiveTab] = useState("news-papers");
  const [activeInfluencerTab, setActiveInfluencerTab] = useState("youtube");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [influencerData, setInfluencerData] = useState({
    youtube: [],
    instagram: [],
    subTabs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch API
  useEffect(() => {
    const fetchMediaData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;

      try {
        const res = await fetch(`${baseUrl}/api/v1/discover/media`);
        const data = await res.json();
        console.log(data,"mediaa")
        if (data.success && data.data?.mediaSection) {
          const section = data.data.mediaSection;
          setMediaData(section);

          const firstActive =
            section.tabs?.find((t) => t.active) || section.tabs?.[0];

          if (firstActive) setActiveTab(firstActive.id);
        } else {
          setError("Failed to load media data");
        }
      } catch (err) {
        setError("Failed to load media data");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  // 🔥 STABLE influencer data (fix)
  useEffect(() => {
    if (!mediaData?.tabs) return;

    const influencerTab = mediaData.tabs.find(
      (tab) => tab.id === "influencer"
    );

    if (!influencerTab?.mediacards) return;

    const youtube = influencerTab.mediacards.youtube || [];

    const instagramRaw = influencerTab.mediacards.instagram || [];
    const instagram = Array.isArray(instagramRaw)
      ? instagramRaw.flat()
      : [];

    const subTabs = [];
    if (youtube.length) subTabs.push({ id: "youtube", label: "YouTube" });
    if (instagram.length) subTabs.push({ id: "instagram", label: "Instagram" });

    setInfluencerData({ youtube, instagram, subTabs });
  }, [mediaData]);

  const tabs =
    mediaData?.tabs?.map((tab) => ({
      id: tab.id,
      label: tab.label,
      icon: getIconComponent(tab.icon)
    })) || [];

  const getTabData = () => {
    if (!mediaData?.tabs) return [];

    const currentTab = mediaData.tabs.find((t) => t.id === activeTab);
    if (!currentTab) return [];

    if (activeTab === "influencer") {
      if (activeInfluencerTab === "youtube")
        return influencerData.youtube;
      if (activeInfluencerTab === "instagram")
        return influencerData.instagram;

      return influencerData.youtube.length
        ? influencerData.youtube
        : influencerData.instagram;
    }

    return currentTab.mediaCards || [];
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
      <div className="main_container">
        <div className="flex justify-center items-center h-64">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main_container">
      <div className="text-center mt-6">
        <Heading
          data={mediaData?.title || "Media"}
          as="h1"
          className="!text-2xl !font-semibold !mb-0"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 border-b mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "influencer") {
                setActiveInfluencerTab(
                  influencerData.subTabs[0]?.id || "youtube"
                );
              }
            }}
            className={`flex items-center text-sm md:text-md xl:text-xl md:gap-2 pb-2  ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Influencer sub tabs */}
      {activeTab === "influencer" &&
        influencerData.subTabs.length > 1 && (
          <div className="flex justify-center text-sm md:text-md xl:text-xl md:gap-6 lg:gap-8 mt-4">
            {influencerData.subTabs.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveInfluencerTab(sub.id)}
                className={`pb-1 ${
                  activeInfluencerTab === sub.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 mb-10">
        {getTabData().map((item) => {
          const imageUrl =
            activeTab === "news-papers"
              ? item.cardImage
              : item.thumbnail;

          if (activeTab === "news-papers") {
            return (
              <Image
                key={item.id}
                src={imageUrl}
                alt={item.alt}
                width={400}
                height={400}
                className="rounded shadow"
              />
            );
          }
          

        if (
          activeTab === "influencer" &&
          activeInfluencerTab === "instagram"
        ) {
          return (
            <a
              key={item.id}
              href={item.videoUrl}
              target="_blank"
              className="relative group"
            >
              <Image
                src={imageUrl}
                alt={item.alt}
                width={400}
                height={400}
                className="rounded shadow"
              />

              {/* SAME overlay as YouTube */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/40 rounded-lg opacity-100 transition">
                <div className="flex items-center justify-center w-10 h-10 xl:w-16 xl:h-16 border-4 border-gray-300 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6 xl:w-8 xl:h-8 opacity-80"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
          );
        }
        return (
          <button
            key={item.id}
            onClick={() => setSelectedVideo(item.videoUrl)}
            className="relative group"
          >
            <Image
              src={imageUrl}
              alt={item.alt}
              width={400}
              height={240}
              className="rounded shadow"
            />

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950/40 rounded-lg opacity-100 transition">
              <div className="flex items-center justify-center w-10 h-10 xl:w-16 xl:h-16 border-4 border-gray-300 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6 xl:w-8 xl:h-8 opacity-80"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        );
        })}
      </div>

      {/* Video Modal - Updated with better height and responsive design */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="bg-white rounded-lg relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold z-10"
            >
              ✖
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={selectedVideo}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
