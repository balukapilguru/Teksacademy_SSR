"use client";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
import { useRouter } from "next/navigation";

export default function CollegeList({ areaOfInterest }) {
  const router = useRouter();

  const handleCardClick = (card) => {
    if (card.category) {
      localStorage.setItem("selectedCategory", card.category);
    } else {
      localStorage.removeItem("selectedCategory");
    }

    if (card.subCategory) {
      localStorage.setItem("selectedSubCategory", card.subCategory);
    } else {
      localStorage.removeItem("selectedSubCategory");
    }

    router.push("/courses");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div>
      <div className="max-w-8xl mx-auto mb-12 px-4 mt-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Heading data={areaOfInterest?.heading} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {areaOfInterest?.areaOfInterestCards?.length > 0 ? (
            areaOfInterest.areaOfInterestCards.map((card, index) => {
              const cols = 4;
              const row = Math.floor(index / cols);
              const col = index % cols;
              const isBlue = (row + col) % 2 === 0;

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(card)}
                  className={`
                    relative cursor-pointer flex flex-col justify-between p-4 rounded-2xl 
                    shadow-sm transition-all duration-200
                    ${isBlue ? "bg-blue-50 hover:border-blue-400" : "bg-red-50 hover:border-red-400"}
                    border border-transparent
                  `}
                >
                  <div className="w-full h-36">
                    <h3 className="text-lg xl:text-xl font-semibold text-gray-900">
                      {card.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{card.count}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 opacity-90">
                    <Image
                      src={GetData({ url: card.image?.src })}
                      alt={card?.image?.alt || card.name}
                      width={100}
                      height={100}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-4 text-center">
              No interests found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

