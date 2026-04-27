"use client";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function WorkingProfessionals({ workingProfessionals }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  // Fetch API Data

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1920) setCardsPerView(6);
      else if (width >= 1536) setCardsPerView(6);
      else if (width >= 1280) setCardsPerView(5);
      else if (width >= 1024) setCardsPerView(4);
      else if (width >= 768) setCardsPerView(3);
      else if (width >= 640) setCardsPerView(2);
      else setCardsPerView(2);
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  if (!workingProfessionals) {
    return <div>Loading Working Professionals...</div>;
  }

  const totalProfessionals = workingProfessionals.images.length;
  const totalDots = Math.ceil(totalProfessionals / cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= totalDots - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? totalDots - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className=" w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-5  rounded-xl">
        {/* Heading */}
        <Heading data={workingProfessionals?.heading} />

        {/* Carousel */}
        <div className="relative">
          {/* Prev Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous professionals"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
          >
            <MdChevronLeft
              className="w-6 h-6 text-gray-600"
              aria-hidden="true"
            />
            <span className="sr-only">Previous Slide</span>
          </button>

          {/* Cards */}
          <div className="px-8 sm:px-12 lg:px-16">
            <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3  lg:gap-5 xl:gap-6">
              {workingProfessionals.images.map((item, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    Math.floor(index / cardsPerView) === currentIndex
                      ? "block"
                      : "hidden"
                  }`}
                >
                  <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200 h-full grid grid-col transition-all duration-300 hover:shadow-md">
                    <Image
                      width={100}
                      height={120}
                      src={GetData({ url: item?.image?.src })}
                      alt={item.image?.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      <h3 className="text-center text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 mb-1">
                        {item.heading}
                      </h3>
                      <p className="text-center text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {item.subHeading}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next professionals"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
          >
            <MdChevronRight
              className="w-6 h-6 text-gray-600"
              aria-hidden="true"
            />
            <span className="sr-only">Next Slide</span>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full ${
                index === currentIndex
                  ? "w-6 h-2 bg-[#2a619d]"
                  : "w-3 h-2 bg-gray-300"
              }`}
            >
              <span className="sr-only">{`Go to slide ${index + 1}`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
