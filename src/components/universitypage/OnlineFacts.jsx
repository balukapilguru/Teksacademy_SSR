
import Heading from "@/utility/Heading";
import React from "react";

const OnlineFacts = ({ data }) => {
  if (!data || !data.onlineFactsCards) return null;

  const { heading, onlineFactsCards } = data;

  return (
    <div className="min-h-fit bg-gradient-to-br from-gray-50 to-white pt-10">
    
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <Heading data={heading}/>

        <div className="grid grid-cols-1 gap-6 mb-5 max-w-8xl mx-auto">
          {onlineFactsCards.map((fact, index) => {
            const isEven = index % 2 === 0;
            const isBlue = index % 2 === 0;

            return (
              <div key={index} className="relative group">

                {/* ---------- MOBILE SIMPLE CARD ---------- */}
                <div className="block md:hidden bg-white shadow-md rounded-xl p-5 border">
                  <div className="text-xl font-bold text-gray-800 mb-1">
                    {index + 1}. {fact.heading}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {fact.paragraph}
                  </p>
                </div>

                {/* ---------- DESKTOP FULL DESIGN (md:) ---------- */}
                <div
                  className="hidden md:block relative"
                  style={{
                    paddingLeft: isEven ? "70px" : "0",
                    paddingRight: isEven ? "0" : "70px",
                  }}
                >
                  {/* Badge */}
                  <div
                    className={`absolute ${isEven ? "left-0" : "right-0"}
                    top-1/2 transform -translate-y-1/2 z-10`}
                  >
                    <div
                      className={`w-24 h-24 rounded-full flex items-center 
                      justify-center text-4xl font-bold text-black shadow-xl 
                      border-[6px] border-white ${
                        isBlue
                          ? "bg-gradient-to-br from-[#e9f7ff] to-[#a7e2ff]"
                          : "bg-gradient-to-br from-[#fef2f2] to-[#fbd0d2]"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Arrow Card */}
                  <div
                    className={`
                      ${
                        isBlue
                          ? "bg-gradient-to-r from-[#e9f7ff] to-[#a7e2ff]"
                          : "bg-gradient-to-r from-[#fef2f2] to-[#fbd0d2]"
                      }
                      shadow-xl hover:scale-[1.02] transition-all duration-300 
                      relative overflow-visible flex items-center text-black
                      ${isEven ? "rounded-l-full" : "rounded-r-full"}
                    `}
                    style={{
                      clipPath: isEven
                        ? "polygon(0 0, calc(100% - 40px) 0, 100% 50%, calc(100% - 40px) 100%, 0 100%)"
                        : "polygon(40px 0, 100% 0, 100% 100%, 40px 100%, 0 50%)",
                      minHeight: "105px",
                      paddingLeft: isEven ? "100px" : "60px",
                      paddingRight: isEven ? "60px" : "100px",
                    }}
                  >
                    <div
                      className={`flex-1 py-1 ${
                        isEven ? "text-left" : "text-right"
                      }`}
                    >
                      <h3 className="text-xl font-bold uppercase mb-2 tracking-wide">
                        {fact.heading}
                      </h3>
                      <p className="text-sm leading-relaxed">{fact.paragraph}</p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnlineFacts;

