
import GetData from "@/utility/GetData";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaBuilding } from "react-icons/fa";

const LocationDetails = ({ data }) => {
  const branches = data?.locationDetails?.branches;
  if (!branches) return null;

  return (
    <section className="bg-[#0E2849] py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-white mb-10">
          {data.locationDetails.heading[0]}{" "}
          <span className="text-white">{data.locationDetails.heading[1]}</span>
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.branchId}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Branch Image */}
              <div className="relative w-full h-56">
                <Image src={GetData({ url: branch.image.src })}
                  alt={branch.image.alt}
                  height={350}
                  width={524}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="text-xl font-semibold flex items-center gap-2 text-[#e63946] mb-3">
                  <FaBuilding />
                  {branch.label}
                </h3>

                {/* Address */}
                <p className="text-gray-700 text-sm leading-6 mb-5">
                  {branch.address}
                </p>

                {/* Phone + Map */}
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={`tel:${branch.phone}`}
                    className="flex items-center justify-center gap-2 bg-white border px-4 py-2 rounded-xl text-gray-800 shadow"
                  >
                    <FaPhoneAlt className="text-[#e63946]" />
                    {branch.phone}
                  </a>

                  <a
                    href={branch.mapLink}
                    target="_blank"
                    className="bg-blue-50 p-3 rounded-xl"
                  >
                    <FaMapMarkerAlt className="text-[#e63946] text-xl" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationDetails;

