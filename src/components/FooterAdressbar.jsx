import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { IoMdMail } from "react-icons/io";

export default function FooterAdressbar({ branchData }) {
  return (
    <div className="bg-[#0E2849]">
      <div className="main_container mx-auto py-4 lg:py-4 xl:py-5">
        <div className="w-full lg:w-11/12 xl:w-11/12 xs:p-4 lg:p-0 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-5 md:gap-y-0 md:gap-x-6 lg:gap-x-8">
            <div className="cursor-pointer w-full md:w-auto">
              <div className="flex items-start md:items-center space-x-2">
                <span className="text-xl flex items-center mt-1 md:mt-0">
                  <FaLocationDot className="w-5 h-5 text-[#fff]" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] text-[#FE543D] mb-1">
                    Address:
                  </span>

                  <Link
                    href={branchData?.address?.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="font-normal text-[14px] lg:text-[1rem] 2xl:text-[1.2rem] text-white hover:text-[#FE543D] transition-colors">
                      {branchData?.address?.title}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="cursor-pointer w-full md:w-auto">
              <div className="flex items-start md:items-center space-x-2">
                <span className="text-xl flex items-center mt-1 md:mt-0">
                  <IoIosCall className="w-5 h-5 text-[#fff]" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] text-[#FE543D] mb-1">
                    Phone:
                  </span>

                  <span className="font-medium text-[14px] lg:text-[1rem] 2xl:text-[1.2rem] text-white whitespace-nowrap">
                    {branchData?.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="cursor-pointer w-full md:w-auto">
              <div className="flex items-start md:items-center space-x-2">
                <span className="text-xl flex items-center mt-1 md:mt-0">
                  <IoMdMail className="w-5 h-5 text-[#fff]" />
                </span>

                <div className="flex flex-col">
                  <span className="text-[14px] text-[#FE543D] mb-1">
                    Email:
                  </span>

                  <div className="break-keep whitespace-nowrap">
                    <a
                      href={`mailto:${branchData?.email}`}
                      className="font-normal text-[14px] lg:text-[1rem] 2xl:text-[1.2rem] text-white hover:text-[#FE543D] transition-colors"
                    >
                      {branchData?.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}