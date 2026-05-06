// components/FeatureItem.jsx

import Image from "next/image";

export default function FeatureItem({ item, color }) {
  return (
    <div className="flex items-center">
      <div className="h-16 3xl:h-20 border-r-4 border-teal-400 rounded-sm flex items-center justify-center pr-3 3xl:pr-4 flex-shrink-0">
        <Image
          width={220}
          height={260}
          src={item.imgSrc}
          className="scale-75 md:scale-100 w-14 h-12 3xl:w-16 3xl:h-14"
          alt={item.alt}
        />
      </div>

      <div className="ml-3 3xl:ml-4 flex flex-col 3xl:gap-y-2">
        <div
          className={`font-semibold xs:text-[11px] sm:text-sm xl:text-xl 2xl:text-2xl 3xl:text-3xl ${
            color === "orange" ? "text-[#FE543D]" : "text-[#2A619D]"
          }`}
        >
          {item.title}
        </div>

        <div className="text-[#52525B] font-normal xs:text-[10px] sm:text-xs 2xl:text-[14px] 3xl:text-[1rem]">
          {item.description}
        </div>
      </div>
    </div>
  );
}