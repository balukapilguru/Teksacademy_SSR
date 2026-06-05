"use client";

import Image from "next/image";

const Successteam = ({ data }) => {
  const members = data?.successTeam?.members;

  if (!members || members.length === 0) return null;

  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 mb-10">
          Our <span className="text-[#2a619d]">Success Team</span>
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-6">
          {members.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-2 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <div className=" w-24 h-24 sm:w-32 sm:h-32  md:w-36 md:h-32 relative mb-4">
                <Image
                  src={item?.image?.src}
                  alt={item?.name || "team member"}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Name */}
              <h3 className="text-sm md:text-lg font-semibold text-gray-900">
                {item?.name}
              </h3>

              {/* Role */}
              <p className=" text-xs md:text-sm text-gray-500">
                {item?.designation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Successteam;