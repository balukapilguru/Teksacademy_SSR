"use client";
import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import Form from "../clientcomponents/forms/Form";
import Heading from "../../utility/Heading";
import { useCourseFlow } from "./CourseFlowProvider";
import Image from "next/image";
import GetData from "@/utility/GetData";

// Helper function to format fee range
const formatFeeRange = (feeRange) => {
  if (!feeRange) return { formatted: "N/A", numbers: [0, 0] };

  try {
    const rangeParts = feeRange.split("-");
    const cleanNumbers = rangeParts
      .map((item) => parseInt(item?.replace(/[,\s`]/g, "") || "0", 10))
      .filter((num) => !isNaN(num));

    if (cleanNumbers.length === 0) return { formatted: "N/A", numbers: [0, 0] };

    const [first] = cleanNumbers;
    const second = cleanNumbers[1] || cleanNumbers[0];

    if (first === second || cleanNumbers.length === 1) {
      return {
        formatted: `₹${first.toLocaleString("en-IN")}`,
        numbers: [first, second],
      };
    } else {
      return {
        formatted: `₹${first.toLocaleString(
          "en-IN"
        )} - ₹${second.toLocaleString("en-IN")}`,
        numbers: [first, second],
      };
    }
  } catch (error) {
    console.error("Error formatting fee range:", error);
    return { formatted: "N/A", numbers: [0, 0] };
  }
};

export default function Programfee({ data, onSelect, universityLsit }) {
  const { selectedItem, programRef } = useCourseFlow();
  const sectionRef = useRef(null); // Add a ref for the section

  const { getDiscount, button } = data;
  const { universities = [] } = universityLsit || {};
  const [selectedUniversity, setSelectedUniversity] = useState(
    universities[0] || null
  );
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  // === Handle University Selection ===
  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
    setPrice(university.defaultFee || 0);
    setFinalAmount((university.defaultFee || 0) - discount);
  };

  // === Open Form Modal ===
  const handleOpenModal = (course) => {
    if (!selectedUniversity) {
      alert("Please select a university first!");
      return;
    }
    setSelectedCourse(course);
    setShowModal(true);
  };

  useEffect(() => {
    const course = universities?.find(
      (uni) => uni.sourceId === selectedItem?.sourceId
    );
    if (course) {
      setSelectedUniversity(course);
      setPrice(course.defaultFee || 0);
      setDiscount(0);
      setFinalAmount(course.defaultFee || 0);
      setHasSpun(false);
    }

    if (typeof window !== "undefined" && selectedUniversity) {
      const savedCourse = localStorage.getItem(selectedUniversity);
      if (savedCourse) setSelectedCourse(savedCourse);
    }
  }, [selectedItem, universities]);

  const fireConfetti = () => {
    const duration = 2 * 2000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: randomInRange(0.2, 0.8),
        },
      });
    }, 250);
  };

  useEffect(() => {
    if (hasSpun) {
      fireConfetti();
    }
  }, [hasSpun]);

  // Add a debug log to check when component mounts
  useEffect(() => {
  }, []);

  return (
    <section 
      id="spinAndWin" 
      ref={sectionRef}
      className="scroll-mt-20" // Add scroll margin for better scrolling
    >
      <div
        ref={programRef}
        className="flex items-center justify-center py-6 px-4 main_container bg-white rounded-2xl shadow-lg mx-auto my-8"
        style={{ maxWidth: "1200px" }} // Add max width for consistency
      >
        {showModal && (
          <Form
            show={showModal}
            onClose={() => setShowModal(false)}
            course={selectedUniversity}
            onDiscount={({ discount: d, finalAmount: f }) => {
              setDiscount(parseInt(d, 10) || 0);
              setFinalAmount(f || 0);
              setHasSpun(true);
              setShowModal(false);
            }}
            courseName={universityLsit?.courseName}
          />
        )}

        {/* === Main Card === */}
        <div className="w-full p-6 py-6 px-4 space-y-8">
          {/* === Fee Progress === */}
          <div className="w-full mb-6">
            <div className="text-left mb-4">
              <Heading data={getDiscount} />
            </div>
            {!selectedUniversity && (
              <p className="text-sm text-[#ea6329] mt-2">
                Select a university to view fee
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {universities.map((uni) => {
              const feeInfo = formatFeeRange(uni.courseFee?.range);
              const isSameFee = feeInfo.numbers[0] === feeInfo.numbers[1];

              return (
                <div
                  key={uni.sourceId || uni.id || Math.random()}
                  onClick={() => handleUniversitySelect(uni)}
                  className={`${
                    uni.bgColor || "bg-white"
                  } flex flex-col p-4 rounded-lg shadow-sm w-full dark:text-black cursor-pointer transition-all border-2 relative ${
                    selectedUniversity?.sourceId === uni.sourceId
                      ? "border-[#ea6329] ring-1 ring-[#ea6329]/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedUniversity?.sourceId === uni.sourceId
                        ? "border-[#ea6329] bg-[#ea6329]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedUniversity?.sourceId === uni.sourceId && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>

                  <div className="flex items-center space-x-5">
                    <div className="w-36 h-22 flex-shrink-0">
                      <Image
                        src={GetData({ url: uni?.image?.src })}
                        alt={uni.image?.alt || uni.university}
                        width={100}
                        height={60}
                        className="object-contain w-full h-full border-2 p-1 border-gray-100 shadow-sm rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/144x88?text=University";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-base mb-1 truncate">
                        {uni?.university || "University"}
                      </h2>
                      <div className="flex flex-wrap">
                        <p className="font-bold">
                          {isSameFee ? "Fee: " : "Fee Range: "}
                        </p>
                        <p className="ml-1">{feeInfo.formatted}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedUniversity && (
            <div className="mx-auto bg-gray-100 space-y-4 p-4 rounded-xl text-lg font-medium">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price of Course:</span>
                <span className="font-bold text-lg">
                  {(() => {
                    const feeInfo = formatFeeRange(
                      selectedUniversity.courseFee?.range
                    );
                    return `₹${feeInfo.numbers[1].toLocaleString("en-IN")}`;
                  })()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount:</span>
                <div>
                  {!hasSpun ? (
                    <button
                      onClick={() => handleOpenModal(selectedCourse)}
                      className={`px-5 h-10 font-semibold rounded-sm cursor-pointer ${
                        !selectedUniversity
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#ea6329] text-white hover:bg-[#ea6329]"
                      }`}
                      disabled={!selectedUniversity}
                    >
                      {!selectedUniversity
                        ? "Select University First"
                        : "Get Discount"}
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold animate-bounce">
                      🎉 - ₹{discount.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {hasSpun && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Final Price</span>
                  <span className="text-blue-900 font-extrabold text-lg">
                    {(() => {
                      const feeInfo = formatFeeRange(
                        selectedUniversity.courseFee?.range
                      );
                      const finalPrice = feeInfo.numbers[1] - discount;
                      return `₹${Math.max(0, finalPrice).toLocaleString(
                        "en-IN"
                      )}`;
                    })()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* === University Cards === */}
        </div>
      </div>
    </section>
  );
}
