import React from "react";
import Image from "next/image";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import GetData from "@/utility/GetData";
const Artboard1 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/Awards/Artboard1.webp";
const Artboard2 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/Awards/Artboard2.webp";
const Artboard3 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/Awards/Artboard3.webp";
const Artboard4 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/Awards/Artboard4.webp";
const Artboard5 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/Awards/Artboard5.webp";
const Most_trusted = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/Awards/Most_trusted.webp";
const leftleaf = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/left_leaf.webp'
const rightleaf = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/right_leaf.webp'
const Artboard6 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/Awards/teks_pride.webp"
const Awards = (awards) => {
  console.log(awards?.awards?.cards,"awardsdata")
 
  return (
    <>
      <div className="main_container mx-auto py-2 lg:py-4 xl:py-6 2xl:py-8 3xl:py-10 justify-center items-center">
        <div className="h-fit flex flex-col items-center justify-center">
          <div className="relative w-fit 2xl:mb-9 lg:mb-10 xs:mb-5 flex flex-col items-center">
            {" "}
            {/* heading */}
            <div className="font-semibold text-[1rem] lg:text-[1.6rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
              <span className="">Awards </span>
            </div>
            <svg
              className="absolute top-10 w-[140%] h-auto " // Increased width and height
              viewBox="0 0 110 12"
            >
              <path
                d="M0 10 Q80 -2 190 27"
                stroke="orangered"
                strokeWidth="0.8"
                fill="transparent"
                strokeLinecap="square"
              />
            </svg>
          </div>
        </div>
        <div className="grid gap-y-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 px-2 md:px-4 lg:px-0 lg:gap-4 xl:gap-3 2xl:gap-10 pb-4">
   {awards?.awards?.cards?.map((item, index) => (
  <div
    key={index}
    className="w-full flex gap-x-1 md:gap-x-2 xl:gap-x-1 2xl:gap-x-4 justify-center items-center"
  >
    
    {/* LEFT IMAGE */}
    <div className="border-2 w-1/2 flex flex-col justify-center rounded-md bg-[#EFF6F3]">
      <Image
        width={300}
        height={400}
        className="rounded-lg h-auto p-2"
        src={GetData({url:item?.image?.src})}
        alt={item?.image?.alt}
      />
    </div>

    {/* RIGHT LEAF + TEXT */}
    <div className="flex items-center justify-between w-1/2 relative">
      
      <Image
        width={300}
        height={300}
        src={leftleaf}
        alt="Left Leaf"
        className="w-16 xl:w-12 xl:h-28 2xl:w-16 h-28 sm:h-32 md:h-32 lg:h-32 2xl:h-32 3xl:w-20 3xl:h-36"
      />

      <div className="text-[0.62rem] sm:text-[0.68rem] md:text-[0.76rem] lg:text-[0.7rem] xl:text-[0.64rem] 2xl:text-[0.78rem] 3xl:text-[0.9rem] 2xl:leading-5 text-center font-medium w-28 sm:w-36 lg:w-32 px-1 md:px-0 leading-3 sm:leading-4 md:leading-[1.1rem] lg:leading-4 md:w-40 xl:w-32 2xl:w-40 2xl:px-[2px] 3xl:w-56 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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

  </div>
))}
        
        </div>

      </div>
    </>
  );
};
export default Awards;
