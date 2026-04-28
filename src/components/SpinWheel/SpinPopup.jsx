// components/SpinWheel/SpinPopup.jsx
"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import MultiStepForm from "./MultiStepForm";
import SpinAnimation from "./SpinAnimation";
import Congratulations from "./Congratulations";
import { IoCloseSharp } from "react-icons/io5";


const SpinPopup = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("form");
  const [leadId, setLeadId] = useState(null);
  const [spinResult, setSpinResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      setStep("form");
      setLeadId(null);
      setSpinResult(null);
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleSpinComplete = useCallback((result, id) => {
    setSpinResult(result);
    setLeadId(id);
    setStep("congrats");
  }, []);

  const handleFormSubmitSuccess = useCallback((id) => {
    setLeadId(id);
    setStep("spinning");
  }, []);

  const handleClose = () => {
    setStep("form");
    setLeadId(null);
    setSpinResult(null);
    onClose();
  };

  const renderContent = () => {
    switch (step) {
      case "form":
        return <MultiStepForm onSuccess={handleFormSubmitSuccess} onClose={handleClose} />;
      case "spinning":
        return <SpinAnimation leadId={leadId} onSpinComplete={handleSpinComplete} />;
      case "congrats":
        return <Congratulations result={spinResult} onClose={handleClose} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed z-40 inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* MODAL CONTAINER */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="
           rounded-xl shadow-2xl h-auto w-full md:w-1/2 relative overflow-hidden flex   
          "
        >

          {/* ⭐ FULL BACKGROUND IMAGE BEHIND BOTH SIDES */}
          <Image
            src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/formbg.webp"
            alt="Popup Background"
            width={56}
            height={92}
            className="object-cover w-full h-full absolute inset-0 z-0"
          />

          {/* LEFT SIDE IMAGE */}
          <div className="w-1/3 relative hidden lg:block z-10">
            <Image
              src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/spinwheel.webp"
              alt="Side Banner"
              width={100}
              height={100}
              className="object-contain w-full h-full"
            />
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="w-full md:w-2/3 p-6 relative z-20">

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute cursor-pointer top-3 right-3 text-3xl font-bold text-gray-100 hover:text-white"
            >
              <IoCloseSharp />
            </button>

            <h2
              id="spin-wheel-title"
              className="text-2xl font-bold text-white mb-3 pb-2 text-start"
            >
              {step === "form" ? "Unlock Your Discount!" : "Spin to Win!"}
            </h2>

            <div className="overflow-y-auto ">
              {renderContent()}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SpinPopup;

