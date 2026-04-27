import React from "react";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
import fallbackImg from "@/app/assets/samplebanner/financial.png";

const Specializations = ({ data }) => {
  const service = data?.specializations ?? [];

  function ServiceCardComponent({ service }) {
    let serviceImage = fallbackImg;

    if (typeof service?.image === "object" && service.image?.src) {
      serviceImage = GetData({ url: service.image.src });
    } else if (
      typeof service?.image === "string" &&
      service.image.trim() !== ""
    ) {
      serviceImage = GetData({ url: service.image });
    }

    return (
      <div className="bg-white rounded-2xl p-2 h-32 xl:h-24 cursor-pointer border border-gray-200 hover:border-[#c41e3a] transition-all duration-300 hover:shadow-md shadow-sm flex flex-col justify-between">
        <Link href={service?.link}>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col items-start pl-2 mt-0">
              <h3 className="text-black font-medium text-lglg">
                {service.heading}
              </h3>

              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <div className="text-normal text-sm">Explore</div>
                <GoArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Right side: Image */}
            <div className="w-14 h-14 flex items-center justify-center p-1 rounded-full border border-gray-600 bg-blue-200">
              <Image
                src={serviceImage}
                alt={service.alt || "Specialization Icon"}
                width={50}
                height={50}
                className="object-contain p-1"
              />
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <section id="specializations">
      <div className="   ">
        <div className="max-w-8xl p-3 lg:px-6 xl:px-8  mx-auto  ">
          {/* Header */}
          <div className="text-left mb-6">
            <Heading data={data?.heading} />
            <div className="text-lg text-slate-600">{data?.paragraph}</div>
          </div>

          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.map((item, index) => (
              <ServiceCardComponent key={index} service={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specializations;

