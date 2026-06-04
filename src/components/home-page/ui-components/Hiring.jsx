import Image from "next/image";
import GetData from "@/utility/GetData";

export default function Hiringcompanies({ hiringData, courseName }) {
  // ----- 1. Extract data from backend prop -----
  const headingParts = hiringData?.hiringPartnersHeading || ["700+ Hiring", "Partners"];
  const subheading =
    hiringData?.hiringPartnersSubheading ||
    "Get ready to grab your dream job! Join the talent pool with access to the world's best hiring companies.";
console.log(hiringData?.companies,"companies")

  // ----- 3. Transform backend companies into EXACT 4 rows of 5 images -----
  const buildMarqueeRows = (companies) => {
    if (!companies) return [];

    // Collect all images from row1, row2, row3, row4 (or whatever is sent)
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

    // If less than 20 images, duplicate to fill exactly 4 rows of 5
    let images = [...allImages];
    while (images.length < 20 && images.length > 0) {
      images = [...images, ...allImages];
    }
    // Take first 20 images (4 rows × 5 images)
    const totalNeeded = 20;
    const finalImages = images.slice(0, totalNeeded);

    // Split into 4 rows of 5
    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push({
        images: finalImages.slice(i * 5, i * 5 + 5),
      });
    }
    return rows;
  };

  const marqueeRows = buildMarqueeRows(hiringData?.companies);

  // ----- 4. Render exactly the original UI (no changes) -----
  return (
    <div className="main_container">
      <div className="flex  bg-red-50 bg-cover bg-center">
        <div className="flex flex-col lg:flex-row lg:gap-x-10">
          {/* Left side: heading + person */}
        

          {/* Right side: marquee rows – EXACT original structure */}
          <div className="w-full px-2  flex items-center">
            <div className="flex">
              <div className=" flex flex-col justify-center 2xl:gap-y-6">
                {marqueeRows.map((row, idx) => (
                  <div key={idx} className="marquee lg:h-20 3xl:h-24">
                    <div className="marquee-content flex justify-center items-center">
                      {/* First set of images */}
                      {row.images.map((img, i) => (
                        <span key={`first-${idx}-${i}`}>
                          <Image
                            src={GetData({ url: img.image })}
                            alt={img.alt}
                            width={300}
                            height={70}
                            className="object-contain w-full h-auto"
                          />
                        </span>
                      ))}
                      {/* Duplicate set for seamless scroll (exactly like original) */}
                      {row.images.map((img, i) => (
                        <span key={`second-${idx}-${i}`}>
                          <Image
                            src={GetData({ url: img.image })}
                            alt={img.alt}
                            width={300}
                            height={70}
                            className="object-contain w-full h-auto"
                          />
                        </span>
                      ))}
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}