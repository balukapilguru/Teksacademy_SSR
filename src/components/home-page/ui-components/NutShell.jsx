const vector = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/vector.webp";
import Image from "next/image";
const nutshell1 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell-1.webp";
const nutshell2 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell-2.webp";
const nutshell3 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell-3.webp";
const nutshell4 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell-4.webp";
const nutshell5 = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell-5.webp";
const nutshell = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell.webp";
const nutshell_mobile = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell_mobile.webp"
const nutshell_BFSI = "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/nutshell/nutshell_BFSI.webp"
const bfsimnutshellmobile = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/courses/bfsiimages/bfsimnutshellmobile.webp'

import { FaArrowDownLong } from "react-icons/fa6";
import Link from "next/link";

export default function Nutshell({ courseData }) {

  return (
    <>
      <div className="main_container ">
        <div className='flex flex-col items-center '>
          {/* Heading */}
          <div className="w-full flex justify-center">
            <div className="relative my-4 2xl:mt-[2.5rem] w-fit px-2 flex flex-col items-center">
              <div className="text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] font-semibold leading-[48px] tracking-[-0.014em] flex">
                <span className="">Career Services&nbsp;</span><span className="text-[#2A619D]">in&nbsp;a&nbsp;Nutshell</span>
              </div>
              <svg className="absolute top-8 w-full h-auto" // Increased width and height
                viewBox="0 0 110 12">
                <path
                  d="M0 10 Q80 -4 190 27"
                  stroke="orangered"
                  strokeWidth="0.4"
                  fill="transparent"
                  strokeLinecap="square" />
              </svg>
            </div>
          </div>
          {/* grid */}
          <div className="px-4 ">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-4 ">
              <div className="xl:mt-14 ">
                <div className="flex flex-row items-center gap-3 h-16 sm:h-14 md:h-16 lg:h-20">
                  <Image
                    width={50}
                    height={60}
                    src={nutshell1} className=" scale-50 sm:scale-75  md:scale-100 lg:scale-100 w-12 h-12" alt="Technical  Seminars image" />
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-end justify-end text-[#FE543D] leading-tight 2xl:ml-4">
                      <span className="sm:mt-0 md:mt-0  xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium leading-[90px] tracking-[-0.01em]">Technical&nbsp;</span>
                    </div>
                    <div className="xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-light items-center justify-center gap-x-2 mt-12">&nbsp;Seminars
                      <FaArrowDownLong className="h-7 mr-12 mb-5 text-[#FE543D] text-[16px] " />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 h-12 sm:h-12 md:h-16 lg:h-20 ">
                  <Image
                    width={50}
                    height={60} src={nutshell2} className="scale-50 sm:scale-75 md:scale-100 lg:scale-100  w-12 h-12" alt="Mock  Interviews image" />
                  <div className="flex justify-center items-center sm:h-10">
                    <div className=" xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-light flex items-center 2xl:ml-5">
                      Mock&nbsp;
                    </div>
                    <div className="flex flex-col items-center justify-center  xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl mt-[30px] sm:mt-6 space-x-4 font-semibold text-[#FE543D] leading-tight ">
                      <span className="sm:mt-1 font-medium md:mt-1 ">&nbsp;Interviews</span>
                      <FaArrowDownLong className="ml-14 h-7 text-[16px]" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 h-16 sm:h-12 md:h-16 lg:h-20">
                  <Image
                    width={50}
                    height={60} src={nutshell3} className="scale-50 sm:scale-75  md:scale-100 lg:scale-100 w-12 h-12" alt="CRT &  Job Ready  Skills image" />
                  <div className="flex justify-center items-center">
                    <div className="flex items-center xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-light 2xl:ml-5">
                      CRT &&nbsp;
                    </div>
                    <div className="flex flex-col items-center justify-center  xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl 2xl:mt-12 mt-12 sm:mt-12 lg:mt-12 space-x-4 font-semibold text-[#FE543D] leading-tight ">
                      <span className="sm:mt-0 md:mt-0 font-medium ">&nbsp;Job Ready&nbsp;</span>
                      <FaArrowDownLong className=" ml-11 mb-5 h-7 text-[16px]" />
                    </div>
                    <div className="flex items-center  xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-light">&nbsp;Skills
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 h-14 sm:h-12 md:h-16 lg:h-20">
                  <Image
                    width={850}
                    height={900} src={nutshell4} className="scale-50 sm:scale-75  md:scale-100 lg:scale-100  w-12 h-12" alt="Dedicated  Job Portal image " />
                  <div className="flex justify-center items-center">
                    <div className="flex items-center  xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-light 2xl:ml-5">
                      Dedicated&nbsp;
                    </div>
                    <div className="flex flex-col items-center justify-center  xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl  sm:mt-0 lg:mb-0 2xl:mb-2   font-semibold text-[#FE543D] leading-tight ">
                      <span className="sm:mt-0 md:mt-0 font-medium  2xl:mt-2">&nbsp;Job Portal&nbsp;</span>
                      {/* <FaArrowDownLong className="mt-1 h-7 text-[16px]" /> */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3  h-16 sm:h-12 md:h-16 lg:h-20">
                  <Image
                    width={850}
                    height={900} src={nutshell5} className=" scale-50 sm:scale-75  md:scale-100 lg:scale-100 w-12 h-12" alt="Internship opportunity in a  IT Company image" />
                  <div className="flex justify-center items-center">
                    <div className=" xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-light flex items-center 2xl:ml-6">
                      Internship opportunity in &nbsp;
                    </div>
                    
                    <div className="mb-5 sm:mb-7 lg:mb-6 flex flex-col items-center justify-center  xs:text-[10px] sm:text-xs md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-[#FE543D] leading-tight">
                      <FaArrowDownLong className=" mr-7  h-7 text-[16px]" />
                      {
                        courseData?.coursename === 'BFSI-Course' ? (
                          <span className="mb-1 sm:mt-1 md:mt-0  font-medium  2xl:mb-1">
                            Finance&nbsp;Sectors
                          </span>
                        ) : (
                          <span className="mb-1 sm:mt-1 md:mt-0 font-medium 2xl:mb-1">
                           a &nbsp;IT&nbsp;Company
                          </span>
                        )
                        }

                    </div>
                  </div>
                </div>
                {/* button */}
                <div className="w-full flex justify-center lg:justify-start lg:pl-8 2xl:pl-0">
<Link
  href={
    courseData?.coursename
      ? `/forms/request-call-back?course=${encodeURIComponent(courseData?.coursename)}`
      : '/forms/request-call-back'
  }
>
                    <div className="lg:px-8 2xl:px-1 px-7">
                      <button
                        className="xs:w-[10.5rem] lg:w-[10.5rem] lg:h-9 xl:mb-10 xl:mt-4 2xl:ml-20 3xl:ml-4 2xl:mt-5 2xl:mb-14 w-36 h-8 rounded-lg font-medium 
                        text-[12px] md:text-[13px] lg:text-[14px]  2xl:h-10 2xl:w-[12rem] 2xl:text-[1rem] 3xl:h-11 3xl:w-[14rem] 3xl:text-[1.2rem]
                        shadow-md transition bg-white text-[#2a619d] hover:bg-[#2a619d] 
                        border-[#2a619d] border hover:text-white"
                      >
                        Request Call Back
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
              <div>
              <div className="flex sm:justify-center mb-8 justify-center lg:pb-5 md:justify-center lg:justify-left xl:justify-left 2xl:justify-left">
  {courseData?.coursename === 'BFSI-Course' ? (
    <>
      {/* BFSI Course – Mobile Image */}
      <Image
        width={850}
        height={900}
        src={bfsimnutshellmobile}
        className="w-[80%] h-[70%] lg:hidden"
        alt="BFSI Mobile Image"
      />

      {/* BFSI Course – Desktop Image */}
      <Image
        width={850}
        height={900}
        src={nutshell_BFSI}
        className="w-[95%] h-[70%] hidden lg:block"
        alt="BFSI Desktop Image"
      />
    </>
  ) : (
    <>
      {/* Other Course – Mobile Image */}
      <Image
        width={850}
        height={900}
        src={nutshell_mobile}
        className="w-[80%] h-[70%] lg:hidden"
        alt="Other Mobile Image"
      />

      {/* Other Course – Desktop Image */}
      <Image
        width={850}
        height={900}
        src={nutshell}
        className="w-[95%] h-[70%] hidden lg:block"
        alt="Other Desktop Image"
      />
    </>
  )}
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}