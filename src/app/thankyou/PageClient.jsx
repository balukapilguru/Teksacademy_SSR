"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { FaLocationDot, FaHouse } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { getBranchData, clearBranchData } from "@/lib/branchStorage";

const Thank_you =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/thank_you.webp";

const Thankyou = () => {
  const [branchData, setBranchData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get branch data from sessionStorage if coming from a branch page or form submission
    const storedBranchData = getBranchData();
    setBranchData(storedBranchData);

    // Show success toast on immediate landing if coming from submission
    const justSubmitted = typeof window !== "undefined" && sessionStorage.getItem("just_submitted");
    if (justSubmitted) {
      sessionStorage.removeItem("just_submitted");
      toast.success("Thank you! We'll contact you soon.", {
        duration: 4000,
        icon: "🎉",
        style: {
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
    }

    // Clear the stored branch data after reading
    // This ensures map link won't show on subsequent direct visits to /thankyou
    clearBranchData();

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // 🎉 burst effect on page load
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#FE543D", "#2A619D", "#FCD503", "#ffffff"],
    });

    // 🌸 continuous falling effect for 3 seconds
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FE543D", "#2A619D"],
      });

      confetti({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FE543D", "#2A619D"],
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="flex justify-center relative overflow-hidden py-8">
        <div className="flex justify-center items-center w-[90%] md:w-[80%] lg:w-[70%]">
          <div className="flex justify-center items-center flex-col w-full p-4 md:p-6">
            {/* Thank You Image - Always displayed */}
            <Image
              height={90}
              width={1500}
              src={Thank_you}
              alt="Thank you for choosing Teks Academy"
              className="w-full h-auto object-contain"
              priority
            />

            {/* Action Buttons: Home Button & Branch Direction */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2.5 bg-[#2A619D] hover:bg-[#214d7d] text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-base"
              >
                <FaHouse className="text-lg" />
                Back to Home
              </Link>

              {branchData && branchData.mapLink && (
                <Link
                  href={branchData.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#FE543D] hover:bg-[#e84c1f] text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-base"
                >
                  <FaLocationDot className="text-lg" />
                  Get Direction to Our {branchData.name} Branch
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thankyou;