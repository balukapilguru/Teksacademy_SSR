'use client';

import GetData from '@/utility/GetData';
import Heading from '@/utility/Heading';
import React from 'react';

const ExploreBranch = ({ branchLocation, data }) => {
  // Handle both prop names (branchLocation or data)
  const branchData = branchLocation || data;
  
  // If no data is provided, return null
  if (!branchData) return null;

  // Extract data with fallbacks
  const heading = branchData.heading || branchData.title || "Explore Branch";
  const description = branchData.description || branchData.desc;
  const address = branchData.address || "";
  const mapImage = branchData.mapImage || branchData.map;
  const link = branchData.link || branchData.mapLink;
  
  // Handle description - could be array or object
  const firstDescription = Array.isArray(description) 
    ? description[0]?.firstDescription || description[0]
    : description?.firstDescription;
    
  const secondDescription = Array.isArray(description) 
    ? description[1]?.secondDescription || description[1]
    : description?.secondDescription;

  return (
    <div className="main_container mx-auto px-4 lg:px-6 py-5 lg:py-3">
      {/* Heading Section */}
      <div className="flex justify-center items-center w-full mb-3">
        <div className="flex flex-col items-center">
          <Heading
            data={heading}
            as="h2"
            className="!text-3xl lg:!text-4xl !font-semibold !text-center"
          />
      
        </div>
      </div>
      
      {/* Map and Description Section - 50/50 Layout */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Description Text Section - Left Side (50%) */}
        <div className="w-full lg:w-1/2">
          {(firstDescription || secondDescription) && (
            <div>
              {firstDescription && (
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-4 text-justify">
                  {typeof firstDescription === 'string' 
                    ? firstDescription 
                    : firstDescription.firstDescription}
                </p>
              )}
              {secondDescription && (
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed text-justify">
                  {typeof secondDescription === 'string' 
                    ? secondDescription 
                    : secondDescription.secondDescription}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Map Section - Right Side (50%) */}
   {/* <div className="w-full lg:w-1/2">
  <div className="h-full min-h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
    <iframe
      src={link}
      className="w-full h-full"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
    />
  </div>
</div> */}
<div className="flex justify-center lg:w-1/2">
                    <iframe
                        title="title"
                        src={link}
                        width="100%"
                        height="350"
                        loading="lazy"
                        className="rounded-xl shadow-lg border-2 w-full border-gray-200 "
                        allowFullScreen=""
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
      </div>
    </div>
  );
};

export default ExploreBranch;
