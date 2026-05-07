import GetData from '@/utility/GetData';
import Heading from '@/utility/Heading';
import Image from 'next/image';
import React from 'react'

export  default async function Gallery ({gallery})  {
 
  if (!gallery) return null;
  return (
    
   <div className="">
        <div className="main_container mx-auto mt-4 pt-5">
          <div className="text-start mb-6">
            {/* <h2 className="text-2xl xl:text-4xl sm:text-2xl font-medium  text-black"> */}
              <Heading data={gallery?.heading}/>
              {/* {gallery?.heading}<span className="text-[#ea6329]"> </span> */}
            {/* </h2> */}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {gallery?.images?.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-[#EFF6F3] flex justify-center items-center p-2"
              >
                <Image
                  className="rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                  src={GetData({ url:item?.src})}

                  alt={item.images?.alt|| "gallery"}
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



