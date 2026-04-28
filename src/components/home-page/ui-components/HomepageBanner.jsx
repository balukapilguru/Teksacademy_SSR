// app/components/HomepageBanner.tsx (Server Component)
import AdmissionForm from "@/components/clientcomponents/forms/Admissionform";
import BannerVideo from "../../clientcomponents/bannervideo";
import Image from "next/image";
import GetData from "@/utility/GetData";
export default function HomepageBanner({ bannerData }) {
  if (!bannerData) return null; // or return a loading state
  return (
    <div className="pb-4 mt-4">
      <div className="container mx-auto bg-[#e1e7ec] rounded-lg overflow-hidden p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:pl-6 items-start">
          {/* Left Section */}
          <div className="w-full">
            <BannerVideo
              video={bannerData?.video}
              thumbnail={GetData({ url: bannerData?.thumbnail })}
            />


            {/* Logos */}
            <div className="mt-5">
              <div
               className="text-[#c41e3a] text-sm mb-3 font-medium">
                {bannerData?.subHeading}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {bannerData?.recognisedBy?.map((uni, i) => (
                  <div key={i} className="flex justify-center">
                    <Image
                      src={GetData({ url: uni.src })}    
                      width={94}
                      height={37}
                      alt={uni.alt || "Recognised Logo"}
                      className="bg-white rounded-lg p-2 w-36 h-14 md:w-28 md:h-16 shadow object-contain"
                      unoptimized
                    />
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* Right Section: Form */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md sm:max-w-lg">
              <AdmissionForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

