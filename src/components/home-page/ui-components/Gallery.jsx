'use client'

import GetData from '@/utility/GetData';
import Heading from '@/utility/Heading';
import Image from 'next/image';
import React from 'react'

export default function Gallery({ gallery, data }) {
  const galleryData = gallery || data;
 
  if (!galleryData) return null;
  return (
    
   <div className="">
        <div className="main_container mx-auto mt-4 pt-5">
          <div className="text-center mb-6">
            {/* <h2 className="text-2xl xl:text-4xl sm:text-2xl font-medium  text-black"> */}
              <Heading data={galleryData?.heading}/>
              {/* {gallery?.heading}<span className="text-[#2a619d]"> </span> */}
            {/* </h2> */}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {galleryData?.images?.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-[#EFF6F3] flex justify-center items-center p-2"
              >
                <Image
                  className="rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                  src={GetData({ url:item?.src})}

                  alt={item?.alt || item?.image?.alt || "gallery"}
                  width={300}
                  height={200}
                  
                />
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}



