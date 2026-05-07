"use client";
import GetData from "@/utility/GetData";
import React, { useEffect, useState } from "react";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import UniversityForm from "../clientcomponents/forms/Universityform";
import Image from "next/image";

const BottomNavbar = ({ data }) => {
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { instituteName, image, rating, buttons } = data || {};

   const getUniversityName = () => {

    if (data?.formDetails?.universityName) return data.formDetails.universityName;
   
    if (formDetails?.universityName) return formDetails.universityName;
    
 
    
    
    
    if (data?.secondNavbar?.university?.name) return data.secondNavbar.university.name;
    
    return "University";
  };


  const universityName = getUniversityName();

  useEffect(() => {
    const bannerElement =
      document.querySelector(".banner-section") ||
      document.querySelector("[data-banner-section]") ||
      document.querySelector("section:first-of-type");

    const footerElement =
      document.querySelector(".footer-section") ||
      document.querySelector("[data-footer-section]") ||
      document.querySelector("footer") ||
      document.querySelector("section:last-of-type");

    const handleScroll = () => {
      const bannerBottom =
        bannerElement?.getBoundingClientRect().bottom + window.scrollY || 0;
      const footerTop =
        footerElement?.getBoundingClientRect().top + window.scrollY ||
        document.body.scrollHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY > bannerBottom && scrollY + windowHeight < footerTop - 10) {
        setShowBottomNav(true);
        document.body.classList.add("hide-main-navbar");
      } else {
        setShowBottomNav(false);
        document.body.classList.remove("hide-main-navbar");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("hide-main-navbar");
    };
  }, []);

  return (
    <>
      {/* Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full z-50 transform transition-transform duration-500 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white max-w-8xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-16 py-3 sm:py-4 shadow-2xl gap-3 sm:gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
            {image?.src && (
              <Image
                src={GetData({ url: data?.image.src })}
                alt={image?.alt || instituteName}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                width={160}
                height={40}
              />
            )}
            <div className="text-center sm:text-left">
              <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                {instituteName}
              </div>
              {rating && (
                <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-600">
                  <span className="text-yellow-500">
                    {"★".repeat(rating?.stars || 0)}
                    {"☆".repeat(5 - (rating?.stars || 0))}
                  </span>
                  <span className="ml-1 sm:ml-2">
                    ({rating?.reviews} Reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
            {buttons?.map((btn, index) => (
              <button
                key={index}
                onClick={() => {
                  if (btn.text === "Enquire Now") {
                    setShowForm(true);
                  } else if (btn.action?.src && btn.action?.src !== "null") {
                    window.open(btn.action.src, "_blank");
                  }
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-semibold shadow transition-all ${
                  btn.text === "Enquire Now"
                    ? "bg-[#ea6329] text-white hover:bg-white hover:text-[#ea6329]"
                    : btn.text === "Video Call"
                    ? "bg-[#012a7f] text-white hover:bg-white hover:text-[#012a7f]"
                    : btn.text === "WhatsApp"
                    ? "bg-green-700 text-white hover:bg-white hover:text-green-700"
                    : "bg-white border text-blue-700 hover:bg-[#012a7f] hover:text-white"
                }`}
              >
                {btn.text === "CV SARA" ? "🤖 " : ""}
                {btn.text}
              </button>
            ))}
          </div>
        </div>
      </div>
     
      {showForm && (
        <UniversityForm
          show={showForm}
          onClose={() => setShowForm(false)}
           universityData={{
            instituteName: universityName, 
          }}
          course={{
           
            specializations: data?.formDetails?.specializations || [],
          }}
        />
      )}
    </>
  );
};

export default BottomNavbar;

