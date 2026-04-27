"use client";
import React, { useState, useRef, useEffect } from "react";

import { FaBriefcase } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { FaVideo } from "react-icons/fa";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import Heading from "@/utility/Heading";
import PrimaryButton from "@/utility/PrimaryButton";

const Platform = ({ data }) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);


  const defaultData = {
    heading: ["Platform That Supports You", "End-to-End"],
    services: {
      items: [
        { id: 1, heading: ["CV Job Portal"], icon: { src: "", alt: "" } },
        { id: 2, heading: ["CV Internship Portal"], icon: { src: "", alt: "" } },
        { id: 3, heading: ["Video Counselling"], icon: { src: "", alt: "" } },
        { id: 4, heading: ["CV Edu Loans"], icon: { src: "", alt: "" } },
        { id: 5, heading: ["CV Q&A Panel"], icon: { src: "", alt: "" } },
        { id: 6, heading: ["Post Admission Services"], icon: { src: "", alt: "" } },
        { id: 7, heading: ["Verify Your University"], icon: { src: "", alt: "" } },
        { id: 8, heading: ["Create Resume"], icon: { src: "", alt: "" } },
      ],
      button: {
        text: "View all →",
        icon: { src: "", alt: "" },
        link: null
      }
    }
  };


  const componentData = data || defaultData;

  const heading = componentData.heading || defaultData.heading;
  const services = componentData.services?.items || defaultData.services.items;
  const buttonText = componentData.services?.button?.text || defaultData.services.button.text;


  const getIconComponent = (iconName, index) => {
    const iconMap = {
      FaBriefcase: <FaBriefcase className="w-10 h-10 text-[#c41e3a]" />,
      FiFileText: <FiFileText className="w-10 h-10 text-[#c41e3a]" />,
      FaVideo: <FaVideo className="w-10 h-10 text-[#c41e3a]" />,
      HiOutlineBanknotes: <HiOutlineBanknotes className="w-10 h-10 text-[#c41e3a]" />,
      FaUsers: <FaUsers className="w-10 h-10 text-[#c41e3a]" />,
      FiTarget: <FiTarget className="w-10 h-10 text-[#c41e3a]" />,
      FaBuilding: <FaBuilding className="w-10 h-10 text-[#c41e3a]" />,
      LuClipboardList: <LuClipboardList className="w-10 h-10 text-[#c41e3a]" />,
    };


    if (iconName?.src && !iconName.src.includes("apple.webp")) {
      return (
        <Image
          src={iconName.src}
          alt={iconName.alt || "service icon"}
          className="w-10 h-10 object-contain"
          width="100"
          height="100"
        />
      );
    }


    const fallbackIcons = [
      <FaBriefcase className="w-10 h-10 text-[#c41e3a]" />,
      <FiFileText className="w-10 h-10 text-[#c41e3a]" />,
      <FaVideo className="w-10 h-10 text-[#c41e3a]" />,
      <HiOutlineBanknotes className="w-10 h-10 text-[#c41e3a]" />,
      <FaUsers className="w-10 h-10 text-[#c41e3a]" />,
      <FiTarget className="w-10 h-10 text-[#c41e3a]" />,
      <FaBuilding className="w-10 h-10 text-[#c41e3a]" />,
      <LuClipboardList className="w-10 h-10 text-[#c41e3a]" />,
    ];

    return fallbackIcons[index % fallbackIcons.length];
  };


  const allServices = services;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <section className="px-5 py-8">
      <div className="text-left">
        <Heading data={heading} />
      </div>

      {/* Service List */}
      <div className="mt-6 bg-white border-2 border-gray-100 shadow-md rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-8 gap-6 text-center">
          {services.slice(0, 8).map((service, i) => (
            <div key={service.id || i} className="flex flex-col items-center">
              {getIconComponent(service.icon, i)}
              <div
                className="mt-4 text-md">{service.heading?.[0] || service.title}</div>
            </div>
          ))}
        </div>
      </div>


      {services.length > 8 && (
        <div className="flex justify-center mt-6">
          <PrimaryButton
            onClick={() => setOpen(true)}
            variant="outline"
          >
            {buttonText}
          </PrimaryButton>
        </div>
      )}

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div ref={modalRef} className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-2xl flex flex-col p-10 justify-between shadow-lg relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✖
            </button>
            <div className="text-xl font-semibold mb-4">More Services</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {allServices.map((service, i) => (
                <div key={service.id || i} className="flex flex-col items-center">
                  {getIconComponent(service.icon, i)}
                  <p className="mt-2 text-sm">{service.heading?.[0] || service.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Platform
