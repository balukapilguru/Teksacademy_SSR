
import React from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
export default  function Whyteksversity({whyTeksversity}) {
  

  return (
    <div className="">
      <div className="max-w-9xl rounded-2xl mx-auto px-4 sm:px-6 lg:px-8 ">
        
        {/* Heading */}
        <div className="pt-5 pl-2">
           <Heading data={whyTeksversity?.heading} />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-x-0 gap-y-6  sm:p-6 lg:p-8 mx-auto rounded-2xl">
          
          {/* Left stats */}
          <div className="grid grid-cols-2 gap-2 px-4 lg:grid-cols-1 text-left">
            {whyTeksversity.stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl lg:text-4xl font-bold text-black">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-gray-600 mt-1">
                  {stat.name}
                </div>
              </div>
            ))}
          </div>

          {/* Center image */}
          <div className="relative w-full max-w-[360px] h-[300px] sm:h-[360px] md:h-[400px] lg:h-[420px] mx-auto col-span-2">
            <Image
              
             src={GetData({ url: whyTeksversity?.image?.src })}
            width={420}
            height={420}
              alt={whyTeksversity?.image?.alt || "Why Teksversity"}
            
               className="w-full h-full rounded-lg object-cover"
              unoptimized
            />
          </div>

          {/* Right content */}
          <div className="flex-1 text-left self-start lg:pl-4 items-start col-span-2">
            <h2 className="text-2xl lg:text-4xl font-medium text-gray-900 leading-snug">
              {whyTeksversity.secondHeading}
            </h2>
            <div className="text-md md:text-[16px] lg:text-lg  mb-4  text-gray-600 mt-2">
              {whyTeksversity.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-gray-700 text-md md:text-[16px] lg:text-lg font-normal">
              {whyTeksversity.keyPoints.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-1.5 sm:gap-2 text-md sm:text-base"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#a12524] mt-2.5"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

