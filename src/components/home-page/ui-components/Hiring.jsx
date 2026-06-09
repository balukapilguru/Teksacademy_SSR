"use client";
import Image from "next/image";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";

export default function Hiringcompanies({ hiringData, courseName }) {
  const headingParts = hiringData?.hiringPartnersHeading || [
    "700+ Hiring",
    "Partners",
  ];
  const subheading =
    hiringData?.hiringPartnersSubheading ||
    "Get ready to grab your dream job! Join the talent pool with access to the world's best hiring companies.";

  const buildMarqueeRows = (companies) => {
    if (!companies) return [];

    const allImages = [];
    ["row1", "row2", "row3"].forEach((rowKey) => {
      const row = companies[rowKey];
      if (Array.isArray(row)) {
        row.forEach((company) => {
          if (company?.image?.src) {
            allImages.push({
              image: company.image.src,
              alt: company.image.alt || company.name || "logo",
            });
          }
        });
      }
    });

    let images = [...allImages];
    while (images.length < 20 && images.length > 0) {
      images = [...images, ...allImages];
    }
    const totalNeeded = 20;
    const finalImages = images.slice(0, totalNeeded);

    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push({
        images: finalImages.slice(i * 5, i * 5 + 5),
      });
    }
    return rows;
  };

  const marqueeRows = buildMarqueeRows(hiringData?.companies);

  return (
    <div className="main_container py-6">
      <div className="bg-red-50 bg-cover bg-center py-4 sm:py-8 overflow-hidden">
        <div className="pl-10">
            <Heading
          data={hiringData?.hiringPartnersHeading}
          text={hiringData?.hiringPartnersHeading}
        />
        </div>
       
        <div className="w-full">
          <div className="flex flex-col sm:gap-y-2 lg:gap-y-6 px-4 sm:px-6 lg:px-8">
            {marqueeRows.map((row, idx) => (
              <div key={idx} className="marquee-container">
                <div
                  className="marquee-track"
                  style={{
                    animation: `marquee ${idx === 0 ? 25 : idx === 1 ? 30 : idx === 2 ? 20 : 35}s linear infinite`,
                  }}
                >
                  {/* Triple the images to ensure no gap */}
                  {[...row.images, ...row.images, ...row.images].map(
                    (img, i) => (
                      <div key={i} className="marquee-item">
                        <Image
                          src={GetData({ url: img.image })}
                          alt={img.alt}
                          width={140}
                          height={70}
                          className="object-contain"
                          priority={false}
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .marquee-track {
          display: flex;
          align-items: center;
          width: fit-content;
          will-change: transform;
        }
        
        .marquee-track:hover {
          animation-play-state: paused;
        }
        
        .marquee-item {
          flex-shrink: 0;
          margin: 0 0.75rem sm:mx-4 md:mx-5 lg:mx-6;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
