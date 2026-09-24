"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import {
  RECAPTCHA_SITE_KEY,
  validateIndianMobileNumber,
  computeDynamicClientHash,
  fetchOtpHandshake,
} from "@/lib/otpSecurity";

export default function OtpVerificationModal({
  isOpen,
  onClose,
  phone,
  onVerified,
  baseUrl = blogsApplyBaseUrl,
}) {
  const otpInputRefs = useRef([]);
  const modalRecaptchaRef = useRef(null);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [resendCaptchaToken, setResendCaptchaToken] = useState(null);
  const [resendHandshakeData, setResendHandshakeData] = useState(null);

  const isOtpComplete = otp.every((digit) => digit !== "");

  // Auto focus first input on open
  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(""));
      setTimer(60);
      setIsResendDisabled(true);
      setOtpError("");
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (isOpen && isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, timer, isResendDisabled]);

  const formatTimer = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  // Resend Captcha handlers
  const handleResendCaptchaSuccess = async (token) => {
    setResendCaptchaToken(token);
    if (!token) return;

    try {
      const hs = await fetchOtpHandshake(baseUrl);
      setResendHandshakeData(hs);
    } catch (err) {
      // Handshake fetch error silently handled
    }
  };

  const handleResendCaptchaExpired = () => {
    setResendCaptchaToken(null);
    setResendHandshakeData(null);
    try {
      modalRecaptchaRef.current?.reset();
    } catch {}
  };

  const handleResendCaptchaError = () => {
    setResendCaptchaToken(null);
    setResendHandshakeData(null);
    try {
      modalRecaptchaRef.current?.reset();
    } catch {}
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResendDisabled || isResending) return;

    const validation = validateIndianMobileNumber(phone);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    const cleanedNumber = validation.cleaned;

    if (!resendCaptchaToken) {
      toast.error("Please click 'I'm not a robot' before resending OTP.");
      return;
    }

    setIsResending(true);
    setOtpError("");

    try {
      let hs = resendHandshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(baseUrl);
        setResendHandshakeData(hs);
      }

      const clientHash = await computeDynamicClientHash(
        cleanedNumber,
        hs.timestamp,
        hs.handshakeId
      );

      const res = await fetch(buildApiUrl(baseUrl, "/lead/send-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: cleanedNumber,
          recaptchaToken: resendCaptchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash: clientHash,
          website_verification_code: "",
        }),
      });

      const data = await res.json();

      if (data?.success) {
        setOtp(Array(6).fill(""));
        setTimer(60);
        setIsResendDisabled(true);
        toast.success("OTP resent successfully via WhatsApp!");
      } else {
        toast.error(data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
      try {
        modalRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    const validation = validateIndianMobileNumber(phone);
    const cleanedNumber = validation.valid ? validation.cleaned : phone;

    setIsLoading(true);
    setOtpError("");

    try {
      const res = await fetch(buildApiUrl(baseUrl, "/lead/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: cleanedNumber,
          otp: finalOtp,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        setIsSubmittingLead(true);
        if (typeof onVerified === "function") {
          await onVerified();
        }
      } else {
        setOtpError(data?.message || "Invalid OTP. Please check and try again.");
        toast.error(data?.message || "Invalid OTP. Please try again.");
        setOtp(Array(6).fill(""));
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setOtpError("Verification failed. Please try again.");
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
      setIsSubmittingLead(false);
    }
  };

  const handleOtpChange = (val, index) => {
    if (!/^\d?$/.test(val)) return;
    setOtpError("");
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      setOtpError("");
    }
    if (e.key === "ArrowLeft" && index > 0)
      otpInputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5)
      otpInputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    setOtpError("");
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => {
      if (index + i < 6) newOtp[index + i] = ch;
    });
    setOtp(newOtp);
    otpInputRefs.current[Math.min(index + pasted.length, 5)]?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          aria-label="Close OTP popup"
        >
          Close
        </button>

        <div className="border-b px-6 py-4 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">
            Verify Mobile Number
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Enter the 6-digit OTP sent via WhatsApp to{" "}
            <span className="font-semibold text-gray-800">+91 {phone}</span>
          </p>
        </div>

        <div className="px-6 py-6">
          {otpError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-center">
              <p className="text-red-600 text-sm font-medium">{otpError}</p>
            </div>
          )}

          <div className="mb-5 flex justify-between gap-2">
            {otp.map((val, i) => (
              <input
                key={i}
                ref={(el) => {
                  otpInputRefs.current[i] = el;
                }}
                value={val}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={(e) => handlePaste(e, i)}
                maxLength={1}
                inputMode="numeric"
                className={`h-12 w-12 rounded-lg border-2 text-center text-lg font-bold focus:outline-none transition-all sm:h-14 sm:w-14
                  ${
                    val
                      ? "border-[#2a619d] bg-blue-50/40 text-[#2a619d]"
                      : "border-gray-300 bg-white text-gray-900"
                  }
                  ${
                    otpError
                      ? "border-red-500"
                      : "focus:border-[#2a619d] focus:ring-2 focus:ring-[#2a619d]/20"
                  }`}
              />
            ))}
          </div>

          {/* Resend reCAPTCHA widget if timer elapsed */}
          {!isResendDisabled && (
            <div className="mb-4 flex justify-center relative z-10">
              <ReCAPTCHA
                ref={modalRecaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleResendCaptchaSuccess}
                onExpired={handleResendCaptchaExpired}
                onErrored={handleResendCaptchaError}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendDisabled || isResending || !resendCaptchaToken}
              className={`flex-1 rounded-md py-3 text-sm font-medium transition-all
                ${
                  isResendDisabled || isResending || !resendCaptchaToken
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "border border-[#2a619d] bg-white text-[#2a619d] hover:bg-blue-50 active:scale-95 cursor-pointer"
                }`}
            >
              {isResending
                ? "Sending..."
                : isResendDisabled && timer > 0
                ? `Resend in ${formatTimer(timer)}`
                : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || isLoading || isSubmittingLead}
              className={`flex-1 rounded-md py-3 text-sm font-semibold transition-all
                ${
                  isOtpComplete && !isLoading && !isSubmittingLead
                    ? "bg-[#2a619d] text-white shadow-sm hover:bg-[#214d7d] active:scale-95 cursor-pointer"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
            >
              {isSubmittingLead ? (
                <span className="flex items-center justify-center gap-1.5">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : isLoading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify & Submit"
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            Please enter the 6-digit code received on your WhatsApp number to complete your submission.
          </p>
        </div>
      </div>
    </div>
  );
}
