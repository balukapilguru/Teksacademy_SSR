import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import Blueribbonform from "@/components/clientcomponents/forms/Blueribbonform";
import Heading from "@/utility/Heading";
import { TiArrowForward } from "react-icons/ti";
import Head from "next/head";

export default async function BlueribbonSection({blueribbon}) {
  

  return (
    <div className="">
      <div className=" rounded-2xl mx-auto px-4 sm:px-6 lg:px-8  mt-5 pb-5 mb-5">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
          {/* Left Side - Content */}
          <div className="space-y-8 pt-5 md:pt-0 ">
           <Heading data={blueribbon?.heading}/>
         

            <div className="space-y-4 mt-2">
              {blueribbon.keyPoints?.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start xs:pl-3 lg:pl-3"
                >
                  <TiArrowForward className="lg:w-5 lg:h-5 xs:w-6 xs:h-6 text-[#002b80] font-bold flex-shrink-0 mt-1" />
                  <div className="pl-3 text-sm xl:text-lg lg:text-md 2xl:text-[1.2rem] dark:text-black">
                    {point}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="lg:sticky lg:top-8 xl:w-[70%] lg:w-[60%] md:w-[100%]">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full -ml-12 -mb-12"></div>

                <div className="text-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    🚀 Start Your Journey Today
                  </h3>
                </div>

                <Blueribbonform />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

