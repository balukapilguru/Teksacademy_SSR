"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Ebooksform from "@/components/clientcomponents/forms/Ebooksform";
import GetData from "@/utility/GetData";

export default function EbookClient({ data, source }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef(null);

  // Extract section safely
  const section = data?.ebookSection || {};
  const courses = section.items || [];

  // Fake loading for SSR → hydration smoothness
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 400);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setSelectedCard(null);
      }
    }
    if (selectedCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCard]);

  if (!data) return null;

  return (
    <div className="main_container">
      <div className="flex justify-center items-center w-full">
        <div className="relative w-fit flex flex-col mt-2 lg:mt-5">
          <h1 className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] text-[#2A619D] text-center">
            {section.heading || "E-Books"}
          </h1>
          <svg className="absolute top-8 lg:top-10 w-full" viewBox="0 0 110 12">
            <path
              d="M0 10 Q80 -2 190 27"
              stroke="#c41e3a"
              strokeWidth="1.3"
              fill="transparent"
            />
          </svg>
        </div>
      </div>

      <div className="px-6 xl:px-20 py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {(isLoading ? Array(8).fill(0) : courses)?.map((course, index) =>
          isLoading ? (
            // Skeleton
            <div
              key={index}
              className="animate-pulse bg-gray-200 h-56 rounded-lg"
            ></div>
          ) : (
            <div
              key={course.productId}
              className="bg-[#DFF6F4] h-56 rounded-lg shadow-lg p-2  hover:scale-105 transition flex flex-col"
              onClick={() => setSelectedCard(course)}
            >
              <div className="h-2/5 flex items-center justify-center">
                <div className="p-5 h-20 w-20 mx-auto flex items-center justify-center bg-white rounded-full">
                  <Image
                    src={GetData({
                      url: course.image?.src || "/icons/default-icon.png",
                    })}
                    alt={course.image?.alt || course.title}
                    width={60}
                    height={60}
                  />
                </div>
              </div>

              <div className="h-3/5 p-3 bg-white rounded-md flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-blue-950">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-xs">{course.description}</p>
                </div>

                <button className="mt-2 p-1 px-4 w-1/2 border text-sm border-[#c41e3a] cursor-pointer text-[#c41e3a] rounded-lg">
                  {course.button?.text || "Download"}
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div
            ref={modalRef}
            className="bg-white p-4 w-96 rounded-lg shadow-lg"
          >
            <Ebooksform
              course={selectedCard.title}
              downloadLink={selectedCard.ebookurl}
              productId={selectedCard.productId}
              sourceId={selectedCard.sourceId}
              source={source} 
              closePopup={() => setSelectedCard(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
