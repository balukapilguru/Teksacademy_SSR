"use client";

import { useState } from "react";
import Image from "next/image";
import SpinPopup from "./SpinPopup";
import { IoMdClose } from "react-icons/io";

const SpinWheel = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [showBox, setShowBox] = useState(true);

  return (
    <>
      {/* LEFT-BOTTOM SPIN BOX */}
      {showBox && !openPopup && (
        <div className="fixed left-5 bottom-5 z-40">
          {/* Box — add fixed height for background image */}
          <div className="relative w-[300px]  rounded-xl p-4 shadow-2xl overflow-hidden">
            {/* Background Image */}
            <Image
              src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/bgspin.webp"
              alt="Background"
              fill
              className="object-cover rounded-xl"
            />

            {/* CONTENT */}
            <div className="relative z-10">
              {/* Close Button */}
              <button
                onClick={() => setShowBox(false)}
                aria-label="Close Spin Wheel"
                className="cursor-pointer absolute top-0 right-0 bg-white text-black rounded-full p-1 shadow"
              >
                <IoMdClose className="w-4 h-4"  aria-hidden="true"/>
              </button>

              <h3 className="text-white bg-transparent pb-6 text-lg font-bold text-center">
                Spin The Wheel
              </h3>

              <div className="flex justify-center mb-3">
                <Image
                  src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/spin.gif"
                  alt="Spin Wheel"
                  width={160}
                  height={160}
                  className="cursor-pointer"
                  unoptimized
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setOpenPopup(true)}
                  className="cursor-pointer px-6 bg-[#ea6329] text-white font-semibold py-2 rounded-md text-center"
                >
                  Spin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP */}
      <SpinPopup
        isOpen={openPopup}
        onClose={() => {
          setOpenPopup(false);
          setShowBox(true);
        }}
      />
    </>
  );
};

export default SpinWheel;
