"use client";

import GetData from "@/utility/GetData";
import Image from "next/image";
import Link from "next/link";
import { FaArrowDownLong } from "react-icons/fa6";

export default function Nutshell({ data, courseData }) {
  const { title, services, button, image } = data || {};

  const isBFSI = courseData?.coursename === "BFSI-Course";
console.log(data,"nutsheel")
  return (
    <div className="main_container">
      <div className="flex flex-col items-center">

        {/* Heading */}
        <div className="relative my-6 text-center">
          <h2 className="text-xl md:text-3xl font-semibold">
            {title?.[0]}
            <span className="text-[#2A619D]">{title?.[1]}</span>
          </h2>

          <svg className="absolute left-0 right-0 mx-auto top-8 w-40">
            <path
              d="M0 10 Q80 -4 190 27"
              stroke="orangered"
              strokeWidth="0.6"
              fill="transparent"
            />
          </svg>
        </div>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-6 px-4 w-full">

          {/* LEFT SIDE */}
          <div className="space-y-6 xl:mt-10">

            {services?.map((item, index) => {
              const words = item.title.split(" ");

              return (
                <div key={index} className="flex items-center gap-3">

                  <Image
                    src={GetData({url:item.icon.url})}
                    alt={item.icon.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 object-fill"
                  />

                  {/* Text Logic */}
                  <div className="flex flex-wrap items-end text-sm md:text-xl">

                    {words.map((word, i) => {
                      const highlight =
                        word.toLowerCase().includes("technical") ||
                        word.toLowerCase().includes("interviews") ||
                        word.toLowerCase().includes("job") ||
                        word.toLowerCase().includes("portal") ||
                        word.toLowerCase().includes("it");

                      return (
                        <span
                          key={i}
                          className={`mr-1 ${
                            highlight ? "text-[#FE543D] font-medium" : ""
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}

                    {/* Arrow except last */}
                    {index !== services.length - 1 && (
                      <FaArrowDownLong className="ml-2 text-[#FE543D]" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Button */}
            <Link
              href={
                courseData?.coursename
                  ? `/forms/request-call-back?course=${encodeURIComponent(
                      courseData.coursename
                    )}`
                  : button?.link
              }
            >
              <button className="mt-6 px-6 py-2 border border-[#2a619d] text-[#2a619d] rounded-lg hover:bg-[#2a619d] hover:text-white transition">
                {button?.text}
              </button>
            </Link>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="flex justify-center items-center">
            <Image
              src={GetData({url:image?.mobile})}
              alt={image?.alt}
              width={500}
              height={500}
              className="lg:hidden w-[80%]"
            />

            <Image
              src={GetData({url:isBFSI ? image?.desktop : image?.desktop})}
              alt={image?.alt}
              width={700}
              height={700}
              className="hidden lg:block w-[90%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}