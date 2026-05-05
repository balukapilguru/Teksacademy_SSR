import React from 'react';
import { FaApple } from "react-icons/fa";
import { BsAndroid } from "react-icons/bs";

import { TiStar } from 'react-icons/ti';
import Image from 'next/image';
import Link from "next/link";

const FinanceApp = () => {
  return (
    <div className="main_container pt-6 pb-6">
      <div className="flex flex-col lg:flex-row gap-y-4 items-center justify-between">
        {/* Left Section */}
        <div className="text-center w-full md:text-left xl:w-[60%] space-y-3 xl:space-y-6 2xl:space-y-8">
          {/* <h1 className="text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-[42px] text-start font-bold text-[#2A619D] leading-normal">
            The Future of Learning is Here <br />
            Teks Academy E-Learning App
          </h1> */}
          <div className="font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-start">
            <h2 className="text-[#2A619D]"> The Future of Learning is Here <br />
              <div className='text-black'>Teks Academy E-Learning App</div></h2>
          </div>
          <div className='2xl:w-4/5'>
            <p className="text-gray-600  3xl:leading-relaxed font-normal tracking-[-0.020em] text-justify xl:leading-6 text-[0.8rem] xl:text-lg lg:text-md 2xl:text-[1.2rem] 3xl:text-[1.6rem]">
              Hello technophiles, are you ready to learn 30+ IT & Non-IT advanced courses at your fingertips? Get the Teks Academy’s advanced E-Learning mobile app offers the opportunity to learn from expert mentors, track your progress, practice with real-time projects, and ace interviews – all in one powerful app.
            </p>
            <div className="flex flex-col items-start 3xl:leading-9 text-gray-600 font-normal mt-2 text-[0.8rem] xl:text-lg lg:text-md 2xl:text-[1.2rem] 3xl:text-[1.5rem]">
              <div className='flex items-center gap-1'><TiStar className='text-[#fe543d]' /> Interactive video lessons</div>
              <div className='flex items-center gap-1'><TiStar className='text-[#fe543d]' /> Mock interviews & assessments</div>
              <div className='flex items-center gap-1'><TiStar className='text-[#fe543d]' /> Real-time project tracking</div>
              <div className='flex items-center gap-1'><TiStar className='text-[#fe543d]' /> Certification & placement support</div>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-start xl:flex-row space-y-4 xl:space-y-0 xl:space-x-6 mt-6">
            <Link href='https://apps.apple.com/in/app/teks-academy/id6741759994' target='_blank' className="flex items-center w-fit justify-center border gap-x-2 px-4 2xl:px-6 2xl:py-3 py-2 bg-[#2A619D] text-white rounded-lg shadow hover:bg-white hover:text-[#2A619D] hover:border-[#2A619D]">
              <FaApple className='h-6 w-6' />
              <div className='flex justify-center font-semibold items-center text-[0.8rem] xl:text-lg lg:text-md 2xl:text-[1rem]'>Download for iOS</div>
            </Link>
            <Link href='https://play.google.com/store/apps/details?id=com.teksacademystudentmobile&pcampaignid=web_share' target='_blank' className="flex items-center w-fit justify-center gap-x-2 px-4 2xl:px-6 2xl:py-3 py-2 bg-[#2A619D] text-white rounded-lg shadow hover:bg-white hover:text-[#2A619D] border  hover:border-[#2A619D]">
              <BsAndroid className='h-6 w-6' />
              <div className='flex justify-center items-center font-semibold text-[0.8rem] xl:text-lg lg:text-md 2xl:text-[1rem]'>Download for Android</div>
            </Link>

          </div>
        </div>

        {/* Right Section */}
        <div className='w-full xl:w-1/2 lg:w-[70%] px-3 2xl:px-0 flex justify-start'>
          <Image
          width={560}
          height={250}
          src="https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/mobile_download.webp" alt="download app image" className='object-cover xl:w-[65vh] w-auto h-auto' />
        </div>
      </div>
    </div>
  );
};

export default FinanceApp;