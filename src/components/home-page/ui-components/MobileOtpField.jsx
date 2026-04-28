"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * MobileOtpField — Reusable OTP Component
 */
export const MobileOtpField = ({
  value,
  onChange,
  onVerified,
  error,
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [canSendOtp, setCanSendOtp] = useState(true); // ✅ controls top Send OTP button

  const isOtpComplete = otp.every((digit) => digit !== "");

  // 🔁 Reset when number changes
  useEffect(() => {
    setShowOtp(false);
    setOtp(Array(6).fill(""));
    setIsVerified(false);
    setTimer(0);
    setIsResendDisabled(true);
    setCanSendOtp(true); // ✅ re-enable Send OTP when number changes
    onVerified(false);
  }, [value]);

  // ⏱ Timer logic
  useEffect(() => {
    let interval;
    if (showOtp && isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false); // ✅ only Resend OTP becomes active after 300s
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer, isResendDisabled]);

  // 📩 SEND OTP
  const handleSendOtp = async () => {
    if (isVerified) return;

    if (!value || value.length !== 10) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/lead/send-otp`, {
        number: value,
      });

      if (res?.data?.success) {
        setShowOtp(true);
        setOtp(Array(6).fill(""));
        setIsVerified(false);
        setCanSendOtp(false);      // ✅ disable top Send OTP button after first send
        setTimer(300);
        setIsResendDisabled(true); // ✅ disable Resend until 300s pass
        toast.success("OTP sent successfully via WhatsApp");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP send failed");
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();

        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/lead/verify-otp`, {
        number: value,
        otp: finalOtp,
      });

      if (res?.data?.success) {
        setIsVerified(true);
        setShowOtp(false);
        setOtp(Array(6).fill(""));
        onVerified(true);
        toast.success("OTP Verified");
      } else {
        setIsVerified(false);
        onVerified(false);
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    }
  };

  const handleOtpChange = (val, index) => {
    if (!/^\d?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Move forward
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="w-full relative pb-2 mt-3">

      {/* Input + Button */}
      <div className="flex gap-2">
        <input
          type="tel"
          name="number"
          value={value}
          onChange={onChange}
          disabled={isVerified}
          className="border shadow-sm text-black bg-white w-full rounded-lg px-3.5 py-3 text-sm outline-none"
          placeholder="Enter mobile number"
          maxLength={10}
        />

        {/* ✅ Top Send OTP — disabled permanently once OTP is sent */}
        {!isVerified && (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!canSendOtp}
            className={`h-[46px] px-3 rounded-md text-sm font-medium
              ${!canSendOtp
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#fe543d] text-white"
              }`}
          >
            Send&nbsp;OTP
          </button>
        )}
      </div>

      {/* Error */}
      <div className="text-red-600 text-xs ml-3 text-left">{error}</div>

      {/* Verified */}
      {isVerified && (
        <p className="text-green-600 text-start text-sm mt-1 ml-1 font-medium">
          ✅ Mobile number verified
        </p>
      )}

      {/* OTP Section */}
      {showOtp && (
        <div className="mt-3">

          {/* OTP Boxes */}
          <div className="flex gap-2">
            {otp.map((val, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                value={val}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-full h-10 text-[14px] border text-center rounded-md text-black bg-white"
                maxLength={1}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            {/* ✅ Resend OTP — disabled during 300s timer, enabled only after timer ends */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isResendDisabled}
              className={`flex-1 text-xs h-[40px] rounded-md
                ${isResendDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#4a75a3] text-white cursor-pointer"
                }`}
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="flex-1 bg-[#fe543d] text-white text-xs h-[40px] rounded-md"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};