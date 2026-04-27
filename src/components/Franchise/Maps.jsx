import Heading from "@/utility/Heading";
import React from "react";

const MapSection = ({ data }) => {
  const sectionData = data?.exploreMapsSection || data;
  
  if (!sectionData) return null;

  const heading = sectionData?.heading || "";
  const description = sectionData?.content?.description || "";
  const mapSrc = sectionData?.map?.src || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.0539372119906!2d82.23685907497538!3d16.968589083848947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a38297bce9325f5%3A0xcfc4d3cfdcf8105c!2sTEKSVERSITY!5e1!3m2!1sen!2sin!4v1765024660355!5m2!1sen!2sin";
  const mapTitle = sectionData?.map?.alt || "Teksversity Location Map";

  // Function to split description into 3 roughly equal paragraphs
  const splitDescriptionIntoThree = (text) => {
    if (!text) return ["", "", ""];
    
    const sentences = text.split('. ');
    const sentenceCount = sentences.length;
    
    if (sentenceCount <= 3) {
      return sentences;
    }
    
    // Calculate roughly equal chunks
    const chunkSize = Math.ceil(sentenceCount / 3);
    
    return [
      sentences.slice(0, chunkSize).join('. ') + '.',
      sentences.slice(chunkSize, chunkSize * 2).join('. ') + '.',
      sentences.slice(chunkSize * 2).join('. ') + '.'
    ];
  };

  const paragraphs = splitDescriptionIntoThree(description);

  return (
    <div className="py-10 bg-[#fbf5f6] border border-[#fbf5f6] rounded-lg main-container mt-7">
      <div className="pl-2 lg:pl-6">
        <Heading data={heading} />
      </div>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start main_container">
        
       
        <div className="text-justify leading-normal">
          {description ? (
            <>
              <p>{paragraphs[0]}</p>
              <br />
              <p>{paragraphs[1]}</p>
              <br />
              <p>{paragraphs[2]}</p>
            </>
          ) : (
            <div className="text-gray-500 italic">Content loading...</div>
          )}
        </div>

        {/* ---------- RIGHT MAP ---------- */}
        <div className="w-full h-80 md:h-[380px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={mapTitle}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
