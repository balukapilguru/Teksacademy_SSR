// app/components/BannerVideo.tsx (Client Component)
"use client";
import { useState } from "react";
import Image from "next/image";
import { FaRegPlayCircle } from "react-icons/fa";

const BannerVideo = ({ video, thumbnail }) => {
  const [play, setPlay] = useState(false);

  return (
    <div className="w-full">
      {!play ? (
        <div
          className="relative cursor-pointer"
          onClick={() => setPlay(true)}
        >
          <Image
            src={thumbnail || "/fallback-thumbnail.jpg"}
            alt="Homepage Banner"
            width={600}
            height={300}
            className="rounded-lg shadow-lg object-cover w-full border border-[#ea6329]"
          />
          {/* Play Button */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#ea6329] animate-ping opacity-75"></div>
              <div className="relative w-10 h-10 rounded-full bg-[#ea6329]  backdrop-blur-sm flex items-center justify-center">
                <div className="w-10 h-10 rounded-full  flex items-center justify-center transition-all hover:scale-110">
                        <FaRegPlayCircle className="text-white text-xl" />
                      </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
          <iframe
            className="w-full h-full"
            src={video}
            title="Video Player"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default BannerVideo;

