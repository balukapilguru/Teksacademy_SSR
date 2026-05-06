"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import GetData from "@/utility/GetData";

const leftleaf =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/left_leaf.webp";
const rightleaf =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/right_leaf.webp";

const Awards = (awards) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const intervalRef = useRef(null);
  const isPausedRef = useRef(false);

  const cards = awards?.awards?.cards || [];

  // 🔥 central control
  const goToIndex = (index) => {
    setCurrentIndex(index);
    resetAutoScroll();
  };

  const nextSlide = () => {
    goToIndex((currentIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    goToIndex(currentIndex === 0 ? cards.length - 1 : currentIndex - 1);
  };

  const startAutoScroll = () => {
    if (!cards.length) return;

    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;

      setCurrentIndex((prev) =>
        prev === cards.length - 1 ? 0 : prev + 1
      );
    }, 3000);
  };

  const resetAutoScroll = () => {
    clearInterval(intervalRef.current);
    startAutoScroll();
  };

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, [cards.length]);

  // 🔴 DO NOT TOUCH CARD STRUCTURE
  const renderCard = (item, index) => (
    <div
      key={index}
      className="w-full flex flex-col md:flex-row gap-x-1 md:gap-x-2 xl:gap-x-1 2xl:gap-x-4 justify-center items-center"
    >
      {/* LEFT IMAGE */}
      <div className="w-1/2 flex flex-col justify-center rounded-md bg-[#EFF6F3] hidden md:block">
        <Image
          width={300}
          height={400}
          className="rounded-lg h-auto p-2"
          src={GetData({ url: item?.image?.src })}
          alt={item?.image?.alt}
        />
      </div>

      {/* RIGHT LEAF + TEXT */}
      <div className="flex items-center justify-between w-1/2 relative mt-5 md:mt-0">
        <Image
          width={300}
          height={300}
          src={leftleaf}
          alt="Left Leaf"
          className="w-16 xl:w-12 xl:h-28 2xl:w-16 h-28 sm:h-32 md:h-32 lg:h-32 2xl:h-32 3xl:w-20 3xl:h-36"
        />

        <div className="text-[0.62rem] sm:text-[0.68rem] md:text-[0.76rem] lg:text-[0.7rem] xl:text-[0.64rem] 2xl:text-[0.78rem] 3xl:text-[0.9rem] text-center font-medium w-28 sm:w-36 lg:w-32 px-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {item.description}
        </div>

        <Image
          width={300}
          height={300}
          src={rightleaf}
          alt="Right Leaf"
          className="w-16 xl:w-12 xl:h-28 2xl:w-16 h-28 sm:h-32 md:h-32 lg:h-32 2xl:h-32 3xl:w-20 3xl:h-36"
        />
      </div>

      {/* MOBILE IMAGE */}
      <div className="w-1/2 flex flex-col justify-center rounded-md bg-[#EFF6F3] mt-5 md:hidden">
        <Image
          width={300}
          height={400}
          className="rounded-lg h-auto p-2"
          src={GetData({ url: item?.image?.src })}
          alt={item?.image?.alt}
        />
      </div>
    </div>
  );

  return (
    <div className="main_container mx-auto py-2 lg:py-4 xl:py-6 2xl:py-8 3xl:py-10 justify-center items-center">

      {/* 🔴 MOBILE CAROUSEL */}
      <div
        className="lg:hidden pb-4"
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
        onTouchStart={() => (isPausedRef.current = true)}
        onTouchEnd={() => (isPausedRef.current = false)}
      >
        {cards.length === 0 ? (
          <p className="text-center text-gray-400">No data</p>
        ) : (
          <div className="flex flex-col items-center gap-2">

            {/* Card */}
            <div className="w-full">
              {renderCard(cards[currentIndex], currentIndex)}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mt-1">

              {/* Prev */}
              <button
                onClick={prevSlide}
                className="p-1 text-[#002b80]"
              >
                ◀
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex
                        ? "bg-[#002b80] w-5"
                        : "bg-gray-300 w-2"
                    }`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={nextSlide}
                className="p-1 text-[#002b80]"
              >
                ▶
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🟢 DESKTOP GRID */}
      <div className="hidden lg:grid gap-y-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 px-2 md:px-4 lg:px-0 lg:gap-4 xl:gap-3 2xl:gap-10 pb-4">
        {cards.map((item, index) => renderCard(item, index))}
      </div>

    </div>
  );
};

export default Awards;