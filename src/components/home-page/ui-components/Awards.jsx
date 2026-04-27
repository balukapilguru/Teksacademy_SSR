import React from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";

export default function Awards({ awardsData }) {
  return (
    <div className=" rounded-2xl">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-7">
        {/* Section Heading */}
        <Heading data={awardsData?.heading} />

        {/* Awards List */}
        <div className="mb-10 overflow-hidden w-full pause-on-hover">
          <div className="flex   items-center justify-center  animate-scroll-left">
            {awardsData.images?.map((award, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer w-[200px] lg:w-[400px]  text-center"
              >
                <Image
                  className="border-2 border-stone-900 rounded-md"
                  alt={award.alt || "award"}
                  src={GetData({ url: award?.image })}
                  width={150}
                  height={100}
                />
                <div className="font-semibold mt-3 dark:text-black w-sm">
                  {award.heading}
                </div>
                <div className="font-normal dark:text-black">
                  {award.subHeading}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

