"use client";

import Heading from "@/utility/Heading";
import React from "react";
import GetData from "@/utility/GetData";
import Image from "next/image";

const LogoMarquee = ({ hiringData }) => {
  const companies = hiringData?.companies;

  // ✅ Check if all rows are empty
  const isEmpty =
    !companies ||
    (!companies.row1?.length &&
      !companies.row2?.length &&
      !companies.row3?.length);

  if (isEmpty) {
    return (
      <div className="w-full py-12 px-5 flex justify-center items-center">
        <div className="text-lg text-gray-500">
          No hiring partners data available
        </div>
      </div>
    );
  }

  const heading = ["700+ Hiring", "Partners"];

  // ✅ Bind rows correctly
  const rows = [
    { data: companies.row1 || [], animation: "animate-marquee-left" },
    { data: companies.row2 || [], animation: "animate-marquee-right" },
    { data: companies.row3 || [], animation: "animate-marquee-left-slow" },
  ];

  return (
    <div className="max-w-8xl px-3 py-4 md:px-8 rounded-xl bg-[#fbf5f6] overflow-hidden">
      <div className="pt-5 md:pt-0">
        <Heading data={heading} />
      </div>

      <div className="flex flex-col gap-5">
        {rows.map((row, rowIndex) =>
          row.data.length > 0 ? (
            <div
              key={rowIndex}
              className="relative w-full overflow-hidden group/marquee"
            >
              <div
                className={`flex ${row.animation} space-x-5 w-max marquee`}
              >
                {[...row.data, ...row.data].map((company, index) => (
                  <div
                    key={`${rowIndex}-${index}`}
                    className="relative flex-shrink-0 w-42 h-30 rounded-xl overflow-hidden transition-transform duration-500 group hover:scale-105 cursor-pointer"
                  >
                    <Image
                      src={GetData({ url: company.image?.src })}
                      width={320}
                      height={200}
                      alt={company.image?.alt || company.name}
                      className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                     
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* ---------- Animations ---------- */}
      <style jsx>{`
        .animate-marquee-left {
          animation: marquee-left 100s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 150s linear infinite;
        }

        .animate-marquee-left-slow {
          animation: marquee-left 120s linear infinite;
        }

        .group\\/marquee:hover .marquee {
          animation-play-state: paused;
        }

        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LogoMarquee;
