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
    <div className="main_container mx-auto px-4 lg:px-6 py-8 lg:py-12">
      {/* Heading Section */}
      <div className="flex justify-center items-center w-full mb-8">
        <div className="flex flex-col items-center">
          <div className="font-semibold leading-tight tracking-[-0.014em] flex justify-center gap-1">
            <Heading 
              className="text-[#2A619D]" 
              data={Array.isArray(heading) ? heading[0] : heading?.split(' ')[0]} 
            />
            <Heading 
              className="text-[#e84c1f]" 
              data={Array.isArray(heading) ? heading[1] : heading?.split(' ').slice(1).join(' ')} 
            />
          </div>
      
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
        <div className="w-full lg:w-1/2">
          <div className="h-[300px] lg:h-[350px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <iframe
              src={link || mapImage || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4751492379924!2d78.44713050000001!3d17.436957799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91afbd479595%3A0x15a95bea860888d8!2sTeks%20Academy!5e0!3m2!1sen!2sin!4v1745987449870!5m2!1sen!2sin"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Branch Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreBranch;