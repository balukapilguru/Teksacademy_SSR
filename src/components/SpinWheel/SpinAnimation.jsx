"use client";
import React, { useState, useEffect } from "react";
// import { versityApi } from "../../serviceLayer/interseptor";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const SpinAnimation = ({ leadId, onSpinComplete, formData }) => {
  const [rotation, setRotation] = useState(0);
  const [showWheel, setShowWheel] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [randomValue, setRandomValue] = useState(0);
  const [discount, setDiscount] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  

  const values = ["1000", "2000", "3000", "4000", "5000", "6000", "7000", "10000"];
  
  
  const REGULAR_MIN = 1000;
  const REGULAR_MAX = 2000;
  const RARE_VALUE = 3000; 

  const spinWheel = async () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setHasSpun(true);

   
    const shouldGiveRareValue = Math.random() < 0.05; 
    
    let selectedValue;
    let randomIndex;

    if (shouldGiveRareValue) {
     
      selectedValue = "3000";
      randomIndex = values.indexOf("3000");
    } else {
     
      const regularValues = values.filter(val => {
        const numVal = parseInt(val);
        return numVal >= REGULAR_MIN && numVal <= REGULAR_MAX;
      });
      
     
      selectedValue = regularValues[Math.floor(Math.random() * regularValues.length)];
      randomIndex = values.indexOf(selectedValue);
    }

  
    if (!selectedValue) {
      selectedValue = "1000"; 
      randomIndex = values.indexOf("1000");
    }

    setRandomValue(selectedValue);

    const slice = 360 / values.length;
    const extraSpins = 10;
    const newRotation =
      extraSpins * 360 + (360 - (randomIndex * slice + slice / 2)) - 90;

    setRotation(newRotation);

    setTimeout(async () => {
  const discountValue = parseInt(selectedValue) || 0;

  setDiscount(discountValue.toString());
  setSpinning(false);

  const { ProductId, sourceId, name, mobile, email } = formData;
  const baseUrl = "https://apierp.teksversity.com";

  try {
    const payload = {
      email,
      discount: discountValue.toString(),
      university: sourceId,
      course: ProductId,
      name,
      mobile,
      sourceType: 34,
    };

    const res = await fetch(`${baseUrl}/lead/spinwheel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    await res.json();

    // ✅ THIS NOW FIRES
    onSpinComplete(discountValue);

  } catch (error) {
    console.error("Spin Result API Error:", error);
    toast.error("Failed to record spin result.");
    onSpinComplete(0);
  }
}, 5000);

  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <div
        className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[55]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-md shadow-lg p-6 w-[500px] text-center relative">
          {/* Wheel */}
          <div className="relative w-59 h-59 mx-auto mt-4">
            <div
              className="absolute w-full h-full rounded-full transition-transform duration-[5000ms] ease-out flex items-center justify-center border-[6px] border-[#ea6329] shadow-lg"
              style={{
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(
                        #ff5722 0deg 45deg,
                        #03a9f4 45deg 90deg,
                        #ffc107 90deg 135deg,
                        #009688 135deg 180deg,
                        #9c27b0 180deg 225deg,
                        #e91e63 225deg 270deg,
                        #8bc34a 270deg 315deg,
                        #3f51b5 315deg 360deg
                      )`,
              }}
            >
              {values.map((val, i) => {
                const numVal = parseInt(val);
                const isRegular = numVal >= REGULAR_MIN && numVal <= REGULAR_MAX;
                const isRare = numVal === RARE_VALUE;
                
                return (
                  <div
                    key={i}
                    className={`absolute font-bold text-lg ${
                      isRare ? 'text-yellow-300' : 
                      isRegular ? 'text-green-300' : 'text-white'
                    }`}
                    style={{
                      transform: `
                            rotate(${
                              i * (360 / values.length) +
                              360 / values.length / 2
                            }deg)
                            translate(85px)
                            rotate(-${
                              i * (360 / values.length) +
                              360 / values.length / 2
                            }deg)
                          `,
                    }}
                    title={
                      isRare ? "Rare Jackpot!" : 
                      isRegular ? "Regular Discount" : "Not in current discount range"
                    }
                  >
                    {val}
                  </div>
                );
              })}
            </div>

            <div
              onClick={spinWheel}
              className={`absolute inset-0 flex items-center justify-center cursor-pointer`}
            >
              <div
                className={`cursor-pointer w-20 h-20 bg-[#ea6329] border-[4px] border-white text-white font-extrabold flex items-center justify-center rounded-full shadow-xl transition-all duration-300 
                      ${
                        spinning || hasSpun
                          ? " cursor-not-allowed scale-90"
                          : "hover:scale-110"
                      }`}
              >
                {spinning ? "Spinning" : "SPIN"}
              </div>
            </div>

            {/* Pointer Arrow */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 
                      border-l-[15px] border-r-[15px] border-b-[25px] 
                      border-l-transparent border-r-transparent border-b-[#ea6329] drop-shadow-lg"
            ></div>
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default SpinAnimation;