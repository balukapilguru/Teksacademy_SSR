"use client";
import Image from "next/image";
import React, { useState } from "react";
import { CiStar } from "react-icons/ci";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";

const UniversityCourseCard = ({ data }) => {
  const {heading, description , mbaProgram} = data
  const programs = [
    {
      id: "deakin",
      image:
        "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Jain University",
      title: "1 Year MBA Online From Manipal Jain University",
      rating: 4.2,
      maxRating: 5,
      accreditations: ["WES", "AACSB", "EQUIS"],
      fee: "₹ 4,00,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "op-jindal",
      image:
        "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Manipal UNiversity",
      title: "1 Year MBA Online From Manipal UNiversity",
      rating: 4.3,
      maxRating: 5,
      accreditations: ["UGC", "AIU", "NAAC A", "AACSB", "BCI"],
      fee: "₹ 1,80,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "queen-margaret",
      image:
        "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Amity University",
      title: "1 Year MBA Online From Online Amity University",
      rating: 4.4,
      maxRating: 5,
      accreditations: ["QS World University Rankings"],
      fee: "₹ 2,99,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "london-business",
      image:
        "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Jain University",
      title: "1 Year MBA Online From Online Jain University",
      rating: 4.6,
      maxRating: 5,
      accreditations: ["AACSB", "EQUIS", "AMBA"],
      fee: "₹ 5,50,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "iim-calcutta",
      image:
        "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Manipal UNiversity",
      title: "1 Year MBA Online From Manipal UNiversity",
      rating: 4.8,
      maxRating: 5,
      accreditations: ["AICTE", "UGC", "AACSB"],
      fee: "₹ 7,25,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "wharton",
      image:
        "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "WHARTON BUSINESS SCHOOL ONLINE",
      title: "1 Year MBA Online From Wharton Business School Online",
      rating: 4.9,
      maxRating: 5,
      accreditations: ["AACSB", "EQUIS"],
      fee: "₹ 8,50,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "stanford",
      image:
        "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Jain University",
      title: "1 Year MBA Online From Online Jain University",
      rating: 4.7,
      maxRating: 5,
      accreditations: ["AACSB", "WASC"],
      fee: "₹ 9,75,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "harvard",
      image:
        "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Manipal UNiversity",
      title: "1 Year MBA Online From Manipal UNiversity",
      rating: 4.9,
      maxRating: 5,
      accreditations: ["AACSB", "NEASC"],
      fee: "₹ 12,50,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "mit-sloan",
      image:
        "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "MIT SLOAN SCHOOL ONLINE",
      title: "1 Year MBA Online From MIT Sloan School Online",
      rating: 4.8,
      maxRating: 5,
      accreditations: ["AACSB", "NEASC"],
      fee: "₹ 11,25,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "insead",
      image:
        "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Jain University",
      title: "1 Year MBA Online From Online Jain University",
      rating: 4.5,
      maxRating: 5,
      accreditations: ["AACSB", "EQUIS", "AMBA"],
      fee: "₹ 6,75,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "oxford-said",
      image:
        "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Manipal UNiversity",
      title: "1 Year MBA Online From Manipal UNiversity",
      rating: 4.6,
      maxRating: 5,
      accreditations: ["AACSB", "EQUIS", "AMBA"],
      fee: "₹ 8,25,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "cambridge-judge",
      image:
        "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "CAMBRIDGE JUDGE BUSINESS SCHOOL ONLINE",
      title: "1 Year MBA Online From Cambridge Judge Business School Online",
      rating: 4.7,
      maxRating: 5,
      accreditations: ["AACSB", "EQUIS", "AMBA"],
      fee: "₹ 9,00,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "iim-bangalore",
      image:
        "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "IIM BANGALORE ONLINE",
      title: "1 Year MBA Online From IIM Bangalore Online",
      rating: 4.7,
      maxRating: 5,
      accreditations: ["AICTE", "UGC", "AACSB"],
      fee: "₹ 6,50,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "iim-ahmedabad",
      image:
        "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "IIM AHMEDABAD ONLINE",
      title: "1 Year MBA Online From IIM Ahmedabad Online",
      rating: 4.9,
      maxRating: 5,
      accreditations: ["AICTE", "UGC", "AACSB"],
      fee: "₹ 8,75,000",
      fullFee: "(Full Fee)",
    },
    {
      id: "kellogg",
      image:
        "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      universityName: "Manipal UNiversity",
      title: "1 Year MBA Online From Manipal UNiversity",
      rating: 4.6,
      maxRating: 5,
      accreditations: ["AACSB"],
      fee: "₹ 10,50,000",
      fullFee: "(Full Fee)",
    },
  ];

  function ProgramCard({ program }) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden  transition-all duration-300 h-[360px] flex-shrink-0 w-full max-w-sm mx-auto">
        {/* Image */}
        <div className="relative h-28 overflow-hidden">
          <Image
            src={program.image}
            alt={program.universityName}
            className="w-full h-full object-cover"
            width={400}
            height={112}
          />
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {program.universityName}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-normal text-gray-800 text-lg mb-1 leading-tight">
            {program.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-1">
            <CiStar className="w-4 h-4 text-orange-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {program.rating}/{program.maxRating}
            </span>
          </div>

          {/* Accreditations */}
          <div className="flex items-center mb-2">
            <IoShieldCheckmarkOutline className="w-4 h-4 text-orange-500 mr-2" />
            <span className="text-sm text-gray-600">
              {program.accreditations.join(", ")}
            </span>
          </div>

          {/* Fee */}
          <div className="mb-6">
            <span className="text-lg font-bold text-gray-800">
              {program.fee}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {program.fullFee}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 border  cursor-pointer border-[#002b80]  text-[#002b80] py-2 px-2 rounded-lg font-medium hover:bg-[#002b80] hover:text-white transition-colors duration-200 flex items-center justify-center">
              View More
            </button>
            <button className="flex-1 bg-[#002b80]  cursor-pointer   text-white py-1 px-2 rounded-lg font-medium hover:bg-white hover:text-[#002b80] hover:border hover:border-[#002b80] transition-colors duration-200 flex items-center justify-center">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 4;
  const totalPages = Math.ceil(programs.length / cardsPerPage);
  const autoScrollInterval = 4000; // 4s

  const goToPage = (pageIndex) => setCurrentPage(pageIndex);
  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <div className="py-8">
      <div className="main_container">
        {/* Header */}
        <div className="pt-6 mb-3 text-black text-3xl font-bold">
          {heading}
        </div>
        {/* Carousel */}
        <div className="relative">
          {/* Arrows */}
          <button
            onClick={prevPage}
            className="absolute -left-2 top-20 z-10 cursor-pointer bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <MdChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextPage}
            className="absolute -right-2 top-20  cursor-pointer  z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <MdChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Cards */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out "
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0 ">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-2 pb-2 ">
                    {programs
                      .slice(
                        pageIndex * cardsPerPage,
                        (pageIndex + 1) * cardsPerPage
                      )
                      .map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-4   space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentPage
                  ? "bg-[#012a7f] scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Page Counter */}
        {/* <div className="text-center mt-3">
          <span className="text-sm text-gray-500">
            {currentPage + 1} of {totalPages}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default UniversityCourseCard;

