"use client";
import Recruitersform from "@/app/forms/Recruitersform";
import React, { useEffect, useState } from "react";
// import shivaji from "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/shivaji.webp";
const archita_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/archita_placed_card.webp";
const srinivas_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/srinivas_placed_card.webp";
const gayatry_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/gayatry_placed_card.webp";
const lipika_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/lipika_placed_card.webp";
const shivaji_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/shivaji_placed_card.webp";
const krishna_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/krishna_placed_card.webp";
const vaishu_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/vaishu_placed_card.webp";
const vineeth_placed_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/success_Stories/vineeth_placed_card.webp";
// const hr1 =
//   "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/hr1.png";
const hr2 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/hr1.png";
const hr3 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/hr2.png";
const hr4 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/hr3.png";
const hr5 =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/hr4.png";
const galactixhr = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/galactixhr.webp";
const ganesysinfoxhr = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/ganesysinfoxhr.webp";
const pavamanaviationhr = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/pavamanaviationhr.webp";
const sdcmshr = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/recruiters/sdcmshr.webp";


// import metadata from "../../../app/metadata.json";

import { BsPlayCircle } from "react-icons/bs";
import Image from "next/image";

import { FaPlay } from "react-icons/fa6";

const Recruiters = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const recruiterCard = [
    // {
    //   id: 1,
    //   cardImage: hr1,
    //   url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/sucess_stories_videos/HR1.mp4",
    //   alt: "architha",
    // },
    {
      id: 2,
      cardImage: hr2,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/HR1.mp4",
      alt: "vijay kumar video",
    },
    {
      id: 3,
      cardImage: hr5,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/HR2.mp4",
      alt: "akhilesh kumar video",
    },
    {
      id: 4,
      cardImage: hr4,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/HR5.mp4",
      alt: "ashoka video",
    },
    {
      id: 5,
      cardImage: hr3,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/HR4.mp4",
      alt: "kavay video",
    },
    {
      id: 6,
      cardImage: galactixhr,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/galactixvdo.mp4",
      alt: "vijay kumar video",
    },
    {
      id: 7,
      cardImage: ganesysinfoxhr,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/genesysinfoxvdo.mp4",
      alt: "akhilesh kumar video",
    },
    {
      id: 8,
      cardImage: pavamanaviationhr,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/pavamanaviationvdo.mp4",
      alt: "ashoka video",
    },
    {
      id: 9,
      cardImage: sdcmshr,
      url: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/success_stories_videos/sdcmsvdo.mp4",
      alt: "kavay video",
    },
  ];
  // useEffect(() => {
  //   document.title = metadata.recruiters?.dynamicTitle;

  //   let metaDescription = document.querySelector('meta[name="description"]');
  //   if (!metaDescription) {
  //     metaDescription = document.createElement("meta");
  //     metaDescription.name = "description";
  //     document.head.appendChild(metaDescription);
  //   }
  //   metaDescription.content = metadata.recruiters?.description;
  // }, [metadata.recruiters?.dynamicTitle, metadata.recruiters?.description]);
   
  return (
    <>
      <div className="">
        {/* <div className="3xl:text-[2.5rem] 2xl:text-[2rem] xl:text-[1.8rem] lg:text-[1.6rem] text-[1.4rem] font-bold text-center my-4">
      <span className="inline-block border-b-2 border-[#2A619D] text-[#2A619D] px-2">
            Recruiters
          </span>
        </div> */}
        <div className="pb-5 flex justify-center items-center w-full">
          <div className="relative w-fit flex flex-col ">
            <h1 className="mt-6 font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
              <span className="text-[#2A619D]">Recruiters</span>
            </h1>
            <svg
              className="mt-6 absolute top-8 w-full h-auto " // Increased width and height
              viewBox="0 0 110 12"
            >
              <path
                d="M0 10 Q80 -2 190 27"
                stroke="orangered"
                strokeWidth="1.03"
                fill="transparent"
                strokeLinecap="square"
              />
            </svg>
          </div>
        </div>

        <div className="bg-[#2A619D] mt-4 ">
          <div className="main_container ">
            <div className="grid grid-cols-1  lg:grid-cols-2 2xl:gap-x-20 md:grid-cols-1 xl:py-6 lg:py-4 ">
              <div className="flex pt-9 2xl:flex 2xl:flex-col  xl:flex-col lg:flex-col xs:flex-col 2xl:w-4/5 text-[#FFFFFF] ">
                <div className="">
                  <div className="font-semibold xl:text-[2rem] lg:text-[1.5rem] xs:text-[1rem] md:text-[1.2rem] xs:pl-4 md:pl-5 lg:pl-0">
                    Become Hiring Partner with Us{" "}
                  </div>
                  <div className="font-semibold xl:text-[2.rem] lg:text-[1.4rem] xs:text-[1rem] md:text-[1.2rem] xs:pl-4 md:pl-5 lg:pl-0">
                    Build Your Future Workforce!
                  </div>
                </div>
                <div className="xl:text-[1.1rem] text-justify lg:text-[1rem] lg:pt-3 lg:pb-3 xs:text-[0.7rem] md:text-[0.8rem] md:pr-3 xs:pr-3 xs:pl-4 md:pl-5 lg:pl-0">
                  <br></br>
                  Teks Academy bridges the gap between industry and talent with
                  hands-on, job-ready training. 29+ companies trust us for
                  skilled hires in Full Stack, Data Science, GIS, and ERP.
                  Partner with us for free and access trained professionals from
                  30+ courses. Let’s build a future-ready, skilled workforce
                  together!
                </div>
                <div className="bg-[#2C5581] grid-cols-2 px-8 font-bold grid-rows-2 rounded-lg shadow-xl xl:mt-8 text-[#FFFFFF] lg:mt-10 xs:mt-9 xs:ml-4 xs:mr-4 md:mt-9 md:ml-6 lg:ml-0 md:mr-10 lg:mr-0 py-10 grid gap-y-4">
                    <div className="flex justify-start text-center xl:text-[1rem] lg:text-[0.8rem] md:text-[0.8rem] xs:text-[0.7rem]">
                      Hiring Fee for Recruiters – Zero
                      <br />
                    </div>
                    <div className="flex justify-start text-center xl:text-[1rem] lg:text-[0.8rem] md:text-[0.8rem] xs:text-[0.7rem]">
                      Access to Job-Ready Talent Pool
                      <br />
                    </div>
                    <div className="flex justify-start text-center xl:text-[1rem] lg:text-[0.8rem] md:text-[0.8rem] xs:text-[0.7rem]">
                      Flexible Hiring Modes
                      <br />
                    </div>
                    <div className="flex justify-start text-center xl:text-[1rem] lg:text-[0.8rem] md:text-[0.8rem] xs:text-[0.7rem]">
                      Full Placement Support <br />
                    </div>
                </div>
              </div>
              <div className="w-full flex xl:justify-end xs:p-6 xl:p-4 lg:p-5 md:p-10">
                <div className="2xl:w-7/12  bg-white rounded-lg xs:p-3 p-4">
                  <Recruitersform />
                </div>
                {selectedVideo && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className=" absolute w-fit h-[30%] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg">
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="cursor-pointer text-white  text-right w-full p-1 pr-2 text-xl font-bold"
                      >
                        ✖
                      </button>
                      <video autoPlay loop className="">
                        {/* {console.log(selectedVideo,'ieifjdf')} */}
                        <source
                          //  src={selectedVideo}
                          src={selectedVideo}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="main_container  overflow-hidden">
          <div className="mb-8">
            <div className="grid grid-cols-4 bg-white  lg:gap-6 2xl:gap-4 gap-y-0 3xl:gap-x-4 marquee_sucess_content w-full mt-6 lg:mt-8 2xl:mt-12 3xl:mt-14 ">
              {recruiterCard.map((ele) => {
                return (
                  ele.hasOwnProperty("url") && (
                    <div key={ele.id} onClick={() => setSelectedVideo(ele.url)}>
                      <Image
                        src={ele?.cardImage}
                        alt={ele?.alt}
                        width={400}
                        height={100}
                        className="w-full "
                      />
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Recruiters;
