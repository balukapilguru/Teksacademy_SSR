import Heading from "@/utility/Heading";
import React from "react";

const Examinationpattern = ({ data }) => {
  if (!data) return null;

 
 
  // ✅ Background colors for cards
 

  return (
    <div className="py-4 lg:pl-3 main_container">
      {/* Heading */}
   <Heading data={data?.heading}/>

      {/* Paragraphs */}
      <div className="space-y-2 p-1 text-gray-700 leading-relaxed text-justify text-base sm:text-lg">
        <p>{data?.description}</p>
       
      </div>

      {/* Cards Section */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
        {Object.values(aboutCards || {}).map((card, index) => (
          <div
            key={index}
            className={`p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition ${cardBg[index]}`}
          >
            <h3 className="font-semibold text-lg mb-2 text-[#0b0033]">
              {card.heading}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {card.discription}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Examinationpattern;

