import GetData from "@/utility/GetData";
import Image from "next/image";
import React from "react";
import Bannerheading from "@/utility/Bannerheading";
import Heading from "@/utility/Heading";

const Aboutbanner = (data) => {
  let aboutusdata = data?.data?.aboutUS;
  let mapData = data?.data?.mapSection;
  return (
    <div className="xl:mt-4 2xl:mt-4 mt-4 w-[94%] lg:w-[76%] xl:w-[70%] 2xl:w-[60%] 3xl:w-[960px]  mx-auto  ">
      <div className="justify-items-center">
        <Heading text={aboutusdata?.heading} data={aboutusdata?.heading} />

        <p className="text-lg text-white leading-7 mb-6 text-justify bg-[#002b80] p-3 border border-[#002b80] rounded-lg ">
          {aboutusdata?.description}
        </p>
        <div className="w-[78%] mx-auto flex  justify-center items-center">
          <Image
            src={GetData({ url: aboutusdata?.image?.src })}
            alt={aboutusdata?.image?.alt}
            width={1200}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div>
        <div className="text-center  mt-7 ">
          <Heading text={mapData?.heading} data={mapData?.heading} />
        </div>

        {/* Description */}

        {/* Google Map */}
        <div className="flex justify-center main_container h-[350px] lg:h-[500px]">
          <iframe
            title={mapData?.map?.title}
            src={mapData?.map?.src}
            className="w-full h-full rounded-xl shadow-lg border-2 border-gray-200"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Aboutbanner;
