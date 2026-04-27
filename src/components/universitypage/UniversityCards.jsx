"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";

import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import PrimaryButton from "@/utility/PrimaryButton";

export default function UniversityCards({ params,data }) {
  const { universityname } = params;
  const heading=data
  const [cards, setCards] = useState([]);
 
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null);

  useEffect(() => {
    if (!universityname) return;

    setLoading(true);

    axios
      .get(
        `https://apissr.teksversity.com/api/v1/university/universitiesCards/${universityname}`
      )
      .then((res) => {
        const list = res.data.data || [];
        setCards(list);
       
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, [universityname,heading]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const showCarousel = cards.length > 4;

  return (
    <div className="mx-auto px-4 py-10 relative">
      <Heading data={heading} />

      {/* If cards > 4 → Carousel */}
      {showCarousel ? (
        <div className="relative w-full">

          {/* LEFT ARROW */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full"
          >
            <IoChevronBackOutline size={24} />
          </button>

          {/* CAROUSEL CONTAINER */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-4 px-10"
          >
            {cards.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[260px] snap-start border rounded-xl shadow-sm hover:shadow-lg transition bg-white"
              >
                <div className="flex items-center justify-center">
                  <Image
                    src={GetData({ url: item?.image?.src })}
                    alt={item?.image?.alt || ""}
                    width={100}
                    height={100}
                    className="w-full object-contain h-32 border-b-2 border-gray-100"
                  />
                </div>

                <div className="p-3">
                  <p className="text-lg font-bold text-black mb-3">
                    {item.courses?.join(", ")}
                  </p>
                  <div className="font-normal text-lg mb-1">{item.title}</div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                  <div className="flex gap-3 mt-4">
                    <div className="flex gap-3 mt-4">
                      {item.button?.map((btn, index) => (
                        <div key={index} className="flex-1">
                          <PrimaryButton
                            type={btn.form ? "form" : "link"}
                            label={btn.name}
                            href={btn.link}
                            className="w-full justify-center"
                          />
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* <div className="flex justify-between gap-3">
                    {item.button?.map((btn, i) => (
                      <Link key={i} href={btn.link ? "#" : btn.link || "/"}>
                        <button
                          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                            btn.link
                              ? "bg-[#c41e3a] text-white"
                              : "border border-[#c41e3a] text-[#c41e3a]"
                          }`}
                        >
                          {btn.name}
                        </button>
                      </Link>
                    ))}
                  </div> */}
                  {/* <PrimaryButton /> */}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full"
          >
            <IoChevronForwardOutline size={24} />
          </button>
        </div>
      ) : (
        // If cards <= 4 → normal grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {cards.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-xl shadow-sm hover:shadow-lg transition bg-white"
            >
              <div className="flex items-center justify-center">
                <Image
                  src={GetData({ url: item?.image?.src })}
                  alt={item?.image?.alt || ""}
                  width={80}
                  height={80}
                  className="w-full h-auto  object-scale-down border-b-2 border-gray-100"
                />
              </div>
              <div className="p-2">
                <p className="text-lg font-bold text-black mb-2">
                  {item.courses?.join(", ")}
                </p>
                <div className="font-normal text-lg mb-1">{item.title}</div>
                <p className="text-gray-600 text-sm mb-1">{item.description}</p>
              </div>
              
                    <div className="flex gap-3 mt-1 p-3 ">
                      {item.button?.map((btn, index) => (
                        <div key={index} className="flex-1 ">
                          <PrimaryButton
                    type={btn.form ? "form" : "link"}
                    label={btn.name}
                    href={btn.link}
                    onClick={() =>
                      btn.form && onGetDetailsClick(course.heading, course)
                    }
                    className="w-full justify-center "
                  />
                        </div>
                      ))}
                   

                  </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

