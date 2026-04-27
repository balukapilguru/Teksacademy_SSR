"use client";

import { useState } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import Image from "next/image";
import GetData from "@/utility/GetData";

export default function Letstalk({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;

  const imageSrc = data?.callPopup?.image?.src
    ? GetData({ url: data.callPopup.image.src })
    : "";

  return (
    <div className="py-2">
      <div className="bg-[#212121] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between p-8 md:p-12 shadow-lg">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {data.heading?.[0]}
          </h2>
          <p className="text-gray-300">{data.description}</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer mt-6 md:mt-0 inline-flex items-center gap-2 bg-white text-gray-900 font-medium px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
        >
          {data.button?.name} <FaArrowRight />
        </button>
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
          animate-fadeIn"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative 
            animate-scaleUp"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* Heading */}
            <div className="text-lg font-semibold mb-4 text-center">
              {data.callPopup?.heading?.[0]}
            </div>

            {/* Image Section */}
            {imageSrc && (
              <div className="w-full h-64 relative mb-4 rounded-lg overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={data.callPopup?.image?.alt || "Call illustration"}
                  height={320}
                  width={526}
                  className="object-cover"
                />
              </div>
            )}

            {/* Sub Heading */}
            <span className="text-sm text-blue-600 font-medium block text-center mb-2">
              {data.callPopup?.subHeading}
            </span>

            <a
              href={`tel:${data.callPopup?.phoneNumber?.replace(/-/g, "")}`}
              className="bg-[#002b80] text-white px-4 py-2 md:px-6 md:py-3 rounded-full w-full text-center font-semibold text-base md:text-lg shadow hover:bg-blue-700 transition block"
            >
              {data.callPopup?.phoneNumber}
            </a>

            {/* Description */}
            <div className="font-medium mt-4 text-center text-gray-600">
              {data.callPopup?.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

