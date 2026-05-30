import Image from "next/image";
import GetData from "@/utility/GetData";

export default function Hiringcompanies({ hiringData, courseName }) {
  // ----- 1. Extract data from backend prop -----
  const headingParts = hiringData?.hiringPartnersHeading || ["700+ Hiring", "Partners"];
  const subheading =
    hiringData?.hiringPartnersSubheading ||
    "Get ready to grab your dream job! Join the talent pool with access to the world's best hiring companies.";
  const personImageSrc = hiringData?.image?.src || "/home/hiring_companies/business_person.webp";
  const personImageAlt = hiringData?.image?.alt || "business_person";

  // ----- 2. Determine if BFSI course (preserves original behaviour) -----
  const isBFSI = courseName === "BFSI-Course" || headingParts[0]?.includes("150");

  // ----- 3. Transform backend companies into EXACT 4 rows of 5 images -----
  const buildMarqueeRows = (companies) => {
    if (!companies) return [];

    // Collect all images from row1, row2, row3, row4 (or whatever is sent)
    const allImages = [];
    ["row1", "row2", "row3", "row4"].forEach((rowKey) => {
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
      <div className="flex bg-[url('https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/hiring_companies/hiring_bg.webp')] bg-cover bg-center">
        <div className="flex flex-col lg:flex-row lg:gap-x-10">
          {/* Left side: heading + person */}
          <div className="w-full lg:w-[33%] 2xl:w-[26%] flex justify-center 2xl:justify-start">
            <div className="flex flex-col justify-between h-full px-2 lg:px-0 pt-2 lg:pt-3 xl:pt-4 2xl:pt-6 3xl:pt-8">
              <div className="w-full px-2 flex justify-start md:px-6 lg:px-0">
                <div className="relative lg:pb-3 xl:mb-[6px] w-fit flex flex-col items-center justify-center">
                  <div className="font-semibold text-[1rem] lg:text-[1.4rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center xl:mt-2">
                    <span className="text-[#2A619D]">{headingParts[0]}&nbsp;</span>
                    <span>{headingParts[1]}</span>
                  </div>
                  <svg
                    className="absolute top-[1.8rem] md:top-[1.8rem] lg:top-[2rem] xl:top-10 2xl:top-[2.6rem] w-full h-auto"
                    viewBox="0 0 110 12"
                  >
                    <path
                      d="M0 10 Q80 -4 190 27"
                      stroke="orangered"
                      strokeWidth="0.4"
                      fill="transparent"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-xs md:px-6 px-2 lg:px-0 2xl:pr-10 pt-1 xl:pt-0 2xl:pt-4 3xl:text-sm lg:text-xs font-normal mb-3">
                {isBFSI ? (
                  <div className="text-sm">{headingParts[0]} Bank & NBFC Hiring Partners</div>
                ) : (
                  subheading
                )}
              </div>

              <div className="flex justify-center">
                <Image
                  width={280}
                  height={430}
                  src={GetData({ url: personImageSrc })}
                  alt={personImageAlt}
                  className="h-[16rem] md:h-[16rem] md:w-[11rem] w-[12rem] lg:h-[14rem] lg:w-[10.25rem] xl:h-[20.375rem] xl:w-[13.125rem] 3xl:h-[26rem] 3xl:w-[17rem]"
                />
              </div>
            </div>
          </div>

          {/* Right side: marquee rows – EXACT original structure */}
          <div className="w-full lg:w-[70%] lg:px-5 flex items-center">
            <div className="flex">
              <div className="marquee-container flex flex-col justify-center 2xl:gap-y-6">
                {marqueeRows.map((row, idx) => (
                  <div key={idx} className="marquee lg:h-20 3xl:h-24">
                    <div className="marquee-content flex justify-center items-center">
                      {/* First set of images */}
                      {row.images.map((img, i) => (
                        <span key={`first-${idx}-${i}`}>
                          <Image
                            src={GetData({ url: img.image })}
                            alt={img.alt}
                            width={200}
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
                            width={200}
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