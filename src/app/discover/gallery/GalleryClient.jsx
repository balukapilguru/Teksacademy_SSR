"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GetData from "@/utility/GetData";

export default function GalleryClient() {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;

  const [galleryData, setGalleryData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/discover/gallery`);
        const data = await res.json();
        setGalleryData(data?.data?.gallery?.images || []);
      } catch (error) {}
    };

    fetchGallery();
  }, [baseUrl]);

  const openModal = (index) => setActiveIndex(index);
  const closeModal = () => setActiveIndex(null);
  const showNext = () =>
    setActiveIndex((prev) => (prev + 1) % galleryData.length);
  const showPrev = () =>
    setActiveIndex((prev) => (prev - 1 + galleryData.length) % galleryData.length);

  return (
    <div className="w-full min-h-screen bg-white py-10">
      <h1 className="text-center text-4xl font-bold text-[#0E2849] mb-10">
        Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5 lg:px-20">
        {galleryData.map((img, index) => (
          <div key={img.id} onClick={() => openModal(index)}>
            <Image
              src={GetData({ url: img.imgsrc })}
              alt={img.alt}
              width={400}
              height={300}
              className="w-full h-60 object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999]">
          <button onClick={closeModal} className="absolute top-6 right-6 text-white text-4xl">×</button>
          <button onClick={showPrev} className="absolute left-6 text-white text-5xl">‹</button>

          <Image
            src={GetData({ url: galleryData[activeIndex]?.imgsrc })}
            alt={galleryData[activeIndex]?.alt}
            width={1200}
            height={1200}
            className="w-[300px] lg:w-[480px] rounded-lg"
          />

          <button onClick={showNext} className="absolute right-6 text-white text-5xl">›</button>
        </div>
      )}
    </div>
  );
}