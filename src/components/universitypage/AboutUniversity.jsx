import Heading from "@/utility/Heading";
import React from "react";

const AboutUniversity = ({ data }) => {
  if (!data) return null;

  const heading = data.heading?.[0];
  const { subHeading1, subHeading2, subHeading3, aboutCards } = data;

  // ✅ Background colors for cards
  const cardBg = [
    "bg-[#F4E7A1]",
    "bg-[#FCE3C2]",
    "bg-[#F5F1C8]",
  ];

  return (
    <div className="py-4 lg:pl-3">
      {/* Heading */}
   <Heading data={data} as="h2"/>

      {/* Paragraphs */}
      <div className="space-y-2 text-gray-700 leading-relaxed text-justify text-base sm:text-lg">
        <p>{subHeading1}</p>
        <p>{subHeading2}</p>
        <p>{subHeading3}</p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
        {Object.values(aboutCards || {}).map((card, index) => (
          <div
            key={index}
            className={`p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition ${cardBg[index]}`}
          >
            <h3 className="font-semibold text-lg mb-2 text-[#0b0033]">
              {card.heading}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUniversity;

