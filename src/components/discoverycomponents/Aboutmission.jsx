import React from "react";

const MissionVision = ({ data }) => {
  const sections = data?.ourVision?.blocks;

  if (!sections) return null;

  return (
    <div className="w-full bg-[#eef3f7] py-4 mt-8 border border-[#eef3f7] rounded-lg mb-8">
      <div className=" mx-auto px-6">

        {sections.map((item, index) => (
          <div key={index} className="">
            {/* Heading */}
            <h2 className="mt-2 text-xl md:text-2xl font-semibold text-gray-900 uppercase mb-3">
              {item.heading}
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-base leading-7 md:leading-8">
              {item.description}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default MissionVision;

