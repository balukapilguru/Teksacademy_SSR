import GetData from "@/utility/GetData";
import Image from "next/image";

export default function Hiring({ hiringData }) {
  // Transform the companies data from JSON structure into marquee rows
  const transformCompaniesToMarqueeData = (companies) => {
    if (!companies) return [];
    
    // Combine all rows into one array of images
    const allImages = [];
    
    if (companies.row1 && Array.isArray(companies.row1)) {
      companies.row1.forEach(company => {
        if (company.image && company.image.src) {
          allImages.push({ 
            image: company.image.src, 
            alt: company.image.alt || company.name,
            name: company.name 
          });
        }
      });
    }
    if (companies.row2 && Array.isArray(companies.row2)) {
      companies.row2.forEach(company => {
        if (company.image && company.image.src) {
          allImages.push({ 
            image: company.image.src, 
            alt: company.image.alt || company.name,
            name: company.name 
          });
        }
      });
    }
    if (companies.row3 && Array.isArray(companies.row3)) {
      companies.row3.forEach(company => {
        if (company.image && company.image.src) {
          allImages.push({ 
            image: company.image.src, 
            alt: company.image.alt || company.name,
            name: company.name 
          });
        }
      });
    }
    
    // Split into chunks of 5-6 images per row for marquee
    const chunkSize = Math.ceil(allImages.length / 4); // Create ~4 rows
    const marqueeRows = [];
    
    for (let i = 0; i < allImages.length; i += chunkSize) {
      marqueeRows.push({
        images: allImages.slice(i, i + chunkSize)
      });
    }
    
    return marqueeRows;
  };
  
  // Get heading text from props
  const headingText = hiringData?.hiringPartnersHeading || ["700+ Hiring", "Partners"];
  const subheadingText = hiringData?.hiringPartnersSubheading || "Get ready to grab your dream job! Join the talent pool with access to the world's best hiring companies.";
  const personImage = hiringData?.image?.src || "/home/hiring_companies/business_person.webp";
  const personImageAlt = hiringData?.image?.alt || "business_person";
  
  // Transform companies data
  const marqueeData = hiringData?.companies 
    ? transformCompaniesToMarqueeData(hiringData.companies)
    : [];
  
  // Check if heading indicates BFSI course (150+ instead of 700+)
  const isBFSICourse = headingText[0]?.includes("150");

  return (
    <div className="main_container">
      <div className="flex xs:bg-[url('https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/hiring_companies/hiring_bg.webp')] bg-cover bg-center">
        <div className="flex flex-col lg:flex-row lg:gap-x-10">
          <div className="w-full lg:w-[33%] 2xl:w-[26%] flex justify-center 2xl:justify-start">
            <div className="flex flex-col justify-between h-full px-2 lg:px-0 pt-2 lg:pt-3 xl:pt-4 2xl:pt-6 3xl:pt-8">
              <div className="w-full px-2 flex justify-start md:px-6 lg:px-0">
                <div className="relative lg:pb-3 xl:mb-[6px] w-fit flex flex-col items-center justify-center">
                  <div className="font-semibold text-[1rem] lg:text-[1.4rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center xl:mt-2">
                    <span className="text-[#2A619D]">
                      {headingText[0]}&nbsp;
                    </span>
                    <span>{headingText[1]}</span>
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
                {isBFSICourse ? (
                  <div className="text-sm">
                    {headingText[0]} Bank & NBFC Hiring Partners
                  </div>
                ) : (
                  subheadingText
                )}
              </div>
              <div className="flex justify-center">
                <Image
                  width={280}
                  height={430}
                  src={GetData({url:personImage})}
                  alt={personImageAlt}
                  className="h-[16.25rem] md:h-[16rem] md:w-[11rem] w-[12.5rem] lg:h-[14rem] lg:w-[10.25rem] xl:h-[20.375rem] xl:w-[13.125rem] 3xl:h-[26rem] 3xl:w-[17rem]"
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[70%] lg:px-5 flex items-center">
            <div className="flex">
              <div className="marquee-container flex flex-col justify-center 2xl:gap-y-6">
                {marqueeData.length > 0 ? (
                  marqueeData.map((marquee, index) => (
                    <div key={index} className="marquee lg:h-20 3xl:h-24">
                      <div className="marquee-content flex justify-center items-center">
                        {marquee.images.map((item, idx) => (
                          <span key={`first-${index}-${idx}`}>
                            <Image
                              src={GetData({url:item?.image})}
                              alt={item.alt}
                              width={200}
                              height={70}
                              className="object-contain w-full h-auto"
                            />
                          </span>
                        ))}
                        {marquee.images.map((item, idx) => (
                          <span key={`second-${index}-${idx}`}>
                            <Image
                              src={GetData({url:item?.image})}
                              alt={item.alt}
                              width={200}
                              height={70}
                              className="object-contain w-full h-auto"
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback content if no data
                  <div className="text-center text-gray-500 py-8">
                    No hiring partners data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}