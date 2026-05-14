"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

export const MobileOtpField = ({ value, onChange, onVerified, error }) => {
  const prevValueRef = useRef(value);
  const onVerifiedRef = useRef(onVerified);

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [canSendOtp, setCanSendOtp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isOtpComplete = otp.every((digit) => digit !== "");

  // Get API URL from environment variable
  const API_URL = "https://apierp.infozit.com";

  useEffect(() => { onVerifiedRef.current = onVerified; }, [onVerified]);

  // Reset when number changes
  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      setShowOtp(false);
      setOtp(Array(6).fill(""));
      setIsVerified(false);
      setTimer(0);
      setIsResendDisabled(true);
      setCanSendOtp(true);
      if (onVerifiedRef.current) onVerifiedRef.current(false);
    }
  }, [value]);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (showOtp && isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) { clearInterval(interval); setIsResendDisabled(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [showOtp, timer, isResendDisabled]);

  const formatTimer = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Send OTP - using env variable
  const handleSendOtp = useCallback(async () => {
    if (isVerified) return;
    if (!value || !/^\d{10}$/.test(value)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/lead/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: value }),
      });
      const data = await res.json();

      if (data?.success) {
        setShowOtp(true);
        setOtp(Array(6).fill(""));
        setIsVerified(false);
        setCanSendOtp(false);
        setTimer(300);
        setIsResendDisabled(true);
        if (onVerifiedRef.current) onVerifiedRef.current(false);

        toast.success("OTP sent successfully!");
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      toast.error("OTP send failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [value, isVerified, API_URL]);

  // Verify OTP - using env variable
  const handleVerifyOtp = useCallback(async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) { toast.error("Enter the complete 6-digit OTP"); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/lead/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: value, otp: finalOtp }),
      });
      const data = await res.json();

      if (data?.success) {
        setIsVerified(true);
        setShowOtp(false);
        setOtp(Array(6).fill(""));
        toast.success("Mobile number verified successfully!");
        if (onVerifiedRef.current) onVerifiedRef.current(true);
      } else {
        setIsVerified(false);
        if (onVerifiedRef.current) onVerifiedRef.current(false);
        toast.error(data?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [otp, value, API_URL]);

  const handleOtpChange = (val, index) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
      const newOtp = [...otp]; newOtp[index - 1] = ""; setOtp(newOtp);
    }
    if (e.key === "ArrowLeft" && index > 0) document.getElementById(`otp-input-${index - 1}`)?.focus();
    if (e.key === "ArrowRight" && index < 5) document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => { if (index + i < 6) newOtp[index + i] = ch; });
    setOtp(newOtp);
    document.getElementById(`otp-input-${Math.min(index + pasted.length, 5)}`)?.focus();
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Mobile Number <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">+91</span>
          <input
            type="tel"
            value={value}
            onChange={onChange}
            disabled={isVerified}
            maxLength={10}
            inputMode="numeric"
            placeholder="Enter 10-digit mobile number"
            className={`w-full pl-12 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2a619d] focus:border-transparent transition
              ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
              ${isVerified ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
          />
        </div>

        {!isVerified && (
          <button type="button" onClick={handleSendOtp} disabled={!canSendOtp || isLoading}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap
              ${!canSendOtp || isLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#2a619d] text-white hover:bg-[#214d7d] active:scale-95 shadow-sm"}`}>
            {isLoading && !showOtp
              ? <span className="flex items-center gap-1.5">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>Sending...
                </span>
              : "Send OTP"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>{error}
        </p>
      )}

      {isVerified && (
        <div className="mt-2 flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Mobile number verified
        </div>
      )}

      {showOtp && !isVerified && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-700 font-medium mb-3">
            Enter the 6-digit OTP for +91 {value}
          </p>

          <div className="flex gap-2 mb-4">
            {otp.map((val, i) => (
              <input key={i} id={`otp-input-${i}`} value={val}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={(e) => handlePaste(e, i)}
                maxLength={1} inputMode="numeric"
                className={`w-11 h-10 text-center border-2 rounded-lg text-lg font-normal focus:outline-none transition-all
                  ${val ? "border-[#2a619d] bg-white text-[#2a619d]" : "border-gray-300 bg-white"}
                  focus:border-[#2a619d] focus:ring-2 focus:ring-[#2a619d]/20`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleSendOtp} disabled={isResendDisabled || isLoading}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-all
                ${isResendDisabled || isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-[#2a619d] text-[#2a619d] hover:bg-blue-50 active:scale-95"}`}>
              {isResendDisabled && timer > 0 ? `Resend in ${formatTimer(timer)}` : isLoading ? "Sending..." : "Resend OTP"}
            </button>

            <button type="button" onClick={handleVerifyOtp} disabled={!isOtpComplete || isLoading}
              className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all
                ${isOtpComplete && !isLoading ? "bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              {isLoading && showOtp
                ? <span className="flex items-center justify-center gap-1.5">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>Verifying...
                  </span>
                : "Verify OTP"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};