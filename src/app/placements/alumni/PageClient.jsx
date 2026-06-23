"use client";
import Loader from "@/components/Loader";
import GetData from "@/utility/GetData";
import Image from "next/image";
import { useEffect, useState } from "react";

const circle_80_alumni =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/circle_80_alumni.webp";
const man_using_tech =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/man_using_tech.webp";
const Rectangle_profile_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Rectangle_profile_card.webp";
const uil_comment =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/uil_comment.webp";

const Alumni = () => {
  const [alumniData, setAlumniData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alumniImages, setAlumniImages] = useState([]);

  useEffect(() => {
    const fetchAlumniData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;
      try {
        const response = await fetch(`${baseUrl}/api/v1/placements/alumni`);
        const result = await response.json();
        console.log(result, "alumni");
        
        if (result.success && result.data?.alumniSection) {
          setAlumniData(result.data.alumniSection);
          
          // ✅ FIX: alumniCards is an array of arrays, flatten it
          const cards = result.data.alumniSection.networkSection.alumniCards || [];
          const flattenedCards = cards.flat(); // Flatten nested arrays
          
          // ✅ Transform to match expected format with imgUrl
          const transformedCards = flattenedCards.map(card => ({
            id: card.id,
            name: card.name,
            course: card.course,
            imgUrl: card.image?.src || "", // Use image.src from API
            alt: card.image?.alt || card.name
          }));
          
          setAlumniImages(transformedCards);
        }
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const heroContent = alumniData?.heroSection?.content;
  const floatingCards = alumniData?.heroSection?.floatingCards || [];
  const networkHeading = alumniData?.networkSection?.heading || "Our Global Alumni Network";

  const getFloatingCardStyle = (id) => {
    if (id === 1) {
      return "bg-white border border-black flex h-12 w-36 md:w-40 lg:h-20 lg:w-60 xl:w-64 xl:h-20 2xl:h-[70px] 2xl:w-64 3xl:h-24 3xl:w-72 rounded-t-lg rounded-l-lg absolute top-[36%] 2xl:top-[40%] -left-4";
    } else if (id === 2) {
      return "bg-white border border-black h-12 w-32 md:w-36 lg:h-20 lg:w-56 xl:w-64 xl:h-20 2xl:h-[70px] 2xl:w-64 3xl:h-[74px] 3xl:w-72 rounded-t-lg rounded-r-lg absolute top-[15%] left-[70%] md:left-[80%] lg:left-[80%] xl:left-[80%] 2xl:left-[70%] flex";
    } else {
      return "bg-white border border-black flex h-14 w-44 md:w-52 lg:h-20 lg:w-80 xl:w-80 xl:h-20 2xl:h-[70px] 2xl:w-80 3xl:h-24 3xl:w-96 rounded-b-lg rounded-r-lg absolute top-[65%] 2xl:left-[56%] lg:left-[53%] xs:left-[54%] xl:left-[62%]";
    }
  };

  const renderFloatingCardIcon = (card) => {
    if (card.icon === "verified" && card.title === "Successful Verified") {
      return (
        <div className="w-1/4 h-full flex justify-center items-center">
          <Image
            width={400}
            height={100}
            className="w-2/3 h-2/3"
            src={uil_comment}
            alt="icon"
          />
        </div>
      );
    } else if (card.icon === "profile") {
      return (
        <div className="w-1/3 h-full flex justify-center items-center">
          <Image
            width={400}
            height={100}
            className="w-4/5 h-5/6"
            src={Rectangle_profile_card}
            alt="icon"
          />
        </div>
      );
    } else if (card.progress) {
      return (
        <div className="w-1/4 lg:w-1/3 2xl:w-[30%] h-full flex justify-center items-center">
          <div className="w-10 h-10 lg:w-14 lg:h-14 relative">
            <Image
              width={400}
              height={100}
              src={circle_80_alumni}
              className="w-full h-full"
              alt="progress"
            />
            <div className="text-[12px] lg:text-base absolute top-1/2 left-1/2 text-[#5E549B] -translate-x-1/2 -translate-y-1/2">
              {card.progress || "80%"}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderFloatingCardContent = (card) => {
    if (card.icon === "verified" && card.title === "Successful Verified") {
      return (
        <div className="w-2/3 flex flex-col justify-center items-start xl:pl-2">
          <div className="font-bold text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl tracking-normal text-[#FC7C05]">
            {card.title}
          </div>
          <div className="text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-lg">
            {card.description}
          </div>
        </div>
      );
    } else if (card.icon === "profile") {
      return (
        <div className="w-2/3 flex flex-col justify-center items-start xl:pl-2">
          <div className="font-bold text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl tracking-normal">
            {card.title}
          </div>
          <div className="text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl">
            {card.description}
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-3/4 lg:w-2/3 xl:w-[70%] 3xl:w-[62%] flex flex-col justify-center items-start">
          <div className="font-bold text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl tracking-normal text-[#FC7C05]">
            {card.title}
          </div>
          <div className="text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-lg">
            {card.description}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="main_container flex flex-col mb-8">
        <div className="text-center flex flex-col items-center gap-y-6 lg:gap-y-10">
          <div className="flex justify-center items-center w-full">
            <div className="relative w-fit flex flex-col">
              <h1 className="mt-6 font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
                <span className="text-[#2A619D]"> {alumniData?.title || "Alumni"}</span>
              </h1>
              <svg
                className="mt-6 absolute top-9 w-full h-auto"
                viewBox="0 0 110 12"
              >
                <path
                  d="M0 10 Q80 -2 190 27"
                  stroke="orangered"
                  strokeWidth="1.2"
                  fill="transparent"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-11 w-full">
            <div className="col-span-11 xl:col-span-10 2xl:col-span-6">
              <div className="w-[80%] 2xl:w-[68%] mx-auto h-full relative">
                <Image
                  className="w-full h-full"
                  width={400}
                  height={100}
                  src={GetData({url: alumniData?.heroSection?.image?.src || man_using_tech})}
                  alt={alumniData?.heroSection?.image?.alt || "Teks Academy Alumni"}
                />
                {floatingCards.map((card) => (
                  <div key={card.id} className={getFloatingCardStyle(card.id)}>
                    {renderFloatingCardIcon(card)}
                    {renderFloatingCardContent(card)}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-11 xl:col-span-10 2xl:col-span-5 lg:col-span-10 xs:w-[100%] xs:p-4 3xl:mt-14 main_container">
              <div className="w-full mt-4">
                <div className="mb-1 font-bold lg:text-[32px] xs:text-[20px] sm:px-6 xl:px-16 2xl:px-0 text-left">
                  {heroContent?.heading || "Teks Offers India's No. 1 Alumni Network"}
                </div>
                {heroContent?.description?.map((desc, index) => (
                  <div
                    key={index}
                    className="lg:text-[18px] sm:text-[12px] p-2 font-normal sm:px-6 xl:px-16 2xl:px-0 text-justify"
                  >
                    {desc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center flex flex-col items-center mt-4 gap-y-8 mb-6">
          <div className="3xl:text-[2.5rem] 2xl:text-[2rem] xl:text-[1.8rem] lg:text-[1.6rem] text-[1.4rem] font-bold text-center my-4">
            <span className="inline-block border-b-2 border-[#2A619D] text-[#2A619D] px-2">
              {networkHeading}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 px-6 sm:px-2 lg:px-0 lg:gap-x-5 xl:gap-x-4 2xl:gap-x-6 3xl:gap-x-10 w-full pb-6">
            {alumniImages.map((ele) => (
              <div
                key={ele.id}
                className="mb-2 xl:gap-y-2 w-full flex justify-center items-center flex-col"
              >
                <div className="w-full ">
                  <Image
                    src={ele.imgUrl}
                    className="h-auto   w-full rounded-xl object-cover"
                    alt={ele.alt}
                    width={300}
                    height={180}
                  />
                </div>
                <div className="w-full flex flex-col justify-around">
                  <div className="text-[12px] font-bold">{ele.name}</div>
                  <div className="text-[12px] text-[#FC7C05] font-bold">
                    {ele.course}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center text-xl font-normal">
            <button className="bg-[#FE543D] text-white text-md flex justify-center items-center w-fit h-10 p-6 rounded-lg cursor-default">
              we have created 48K+ Trained students...
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alumni;