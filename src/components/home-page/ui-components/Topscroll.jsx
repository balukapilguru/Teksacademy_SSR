import GetData from "@/utility/GetData";
import Image from "next/image";

export default function Topscroll({data}) {
  if (!data) return null;
  const topscroll = data?.list
 
  return (
    <div>
      <div className="container-fluid mx-auto lg:mt-0">
        <div className="main_container overflow-hidden w-full pause-on-hover pb-3">
          <div className="">
            <div className="animate-scroll-left flex lg:w-[3000px] xl:w-[2000px] w-[4000px] gap-4 ">
              {topscroll && topscroll.length > 0 ? (
                <>
                  {/* First set of logos */}
                  {topscroll.map((item, index) => (
                    <div key={`set1-${index}`} className="flex gap-x-5 shrink-0">
                      <Image
                       
                        src={GetData({ url: item.src })}
                        width={200}
                        height={100}
                        alt={item.alt || `Scrolling icon ${index + 1}`}
                        className="object-contain hover:shadow-lg"
                        unoptimized
                      />
                    </div>
                  ))}

                  {/* Third set of logos (optional, extra smooth scroll) */}
                  {topscroll.map((item, index) => (
                    <div key={`set3-${index}`} className="flex gap-x-5  shrink-0">
                      <Image
                        src={GetData({ url: item.src })}
                        width={200}
                        height={150}
                        alt={item.alt || `Scrolling icon duplicate ${index + 1}`}
                        className="object-contain hover:shadow-lg hover:border hover:rounded-lg"
                        unoptimized
                      />
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-gray-500">No logos found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

