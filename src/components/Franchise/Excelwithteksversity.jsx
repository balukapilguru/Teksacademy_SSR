"use client";

import Image from "next/image";
import Basicform from '@/components/clientcomponents/forms/Franchiseformm'
import React, { useEffect, useState, useRef } from "react";
import { FaUserGraduate } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";

const Excel = ({ data }) => {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  

  
  const excelData = data || defaultData;

  const getIconComponent = (feature) => {
   
    const iconMap = {
      'Internship': FaUserGraduate,
      'University': SiGoogleclassroom,
      'Dedicated': FaUserGraduate,
      'Online': SiGoogleclassroom,
      '100%': FaUserGraduate,
      'Class': SiGoogleclassroom,
      'Module': FaUserGraduate,
      'Hands On': SiGoogleclassroom,
    };

    // Use mapped icon or fallback to alternating pattern based on ID
    if (iconMap[feature.title]) {
      return iconMap[feature.title];
    }
    
    // Fallback: alternate icons based on ID (odd/even)
    return feature.id % 2 === 0 ? SiGoogleclassroom : FaUserGraduate;
  };

  // Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div className="bg-[#fbf5f6] border border-[#fbf5f6] rounded-lg mt-7 pt-5">
       <section ref={sectionRef} className="py-12  main_container  ">
     <Heading data={excelData.heading} text={excelData.heading}/>

      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-10 gap-10">
        
        {/* Image Section */}
        <div className="md:col-span-2 flex justify-center md:justify-start w-full h-full">
          <Image
           
            src={GetData({url:excelData?.image?.src})}
            width={400}
            height={800}
            alt={excelData.image?.alt || "Excel With Tekacademy"}
            unoptimized
            className="object-cover w-full h-full"
          />
        </div>

        {/* Features Grid */}
        <div className="md:col-span-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-12 relative mt-12">
            {excelData.features.map((feature, index) => {
              const IconComponent = getIconComponent(feature);
              
              return (
                <div key={feature.id} className="relative flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-[#002b81] rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon?.src ? (
                      <Image
                        src={feature.icon.src}
                        width={40}
                        height={40}
                        alt={feature.icon.alt}
                        className="text-white"
                      />
                    ) : (
                      <IconComponent className="text-white w-10 h-10" />
                    )}
                  </div>

                  {/* Title and Subtitle */}
                  <div className="text-xl font-semibold flex justify-center text-black">
                    {feature.title}
                  </div>
                  <div className="text-sm text-gray-600 flex justify-center">
                    {feature.subTitle}
                  </div>

                  {/* Separator line (for desktop only) */}
                  {((index + 1) % 4 !== 0) && (
                    <span className="hidden lg:block absolute right-[-20px] top-1/2 -translate-y-1/2 h-32 border-r-2 border-[#c41e3a] border-dotted"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Section */}
        <div className="md:col-span-3">
          <Basicform 
          source={36}/>
        </div>
      </div>
    </section>
    </div>
   
  );
};

export default Excel;
