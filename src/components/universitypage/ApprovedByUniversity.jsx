"use client";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import Image from "next/image";

export default function ApprovedByUniversity({ data }) {
  if (!data) return null;

  const { heading, images } = data;
  return (
    <section className="w-full py-6">
      <div className=" mx-auto px-4">

        {/* ✅ Heading */}
       <Heading data={heading}/>

        {/* ✅ Images Grid */}
        {images && images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {images.map((item, index) => (
              <div
                key={index}
                className="bg-white border shadow-sm rounded-xl p-4 flex flex-col items-center"
              >
                {item?.link?.src && item.link.src !== "null" ? (
                  <Image
                        src={GetData({ url: item.link.src })}

                    
                    alt={item.link.alt || item.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}

                <p className="mt-3 text-sm font-semibold text-gray-700 text-center">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

