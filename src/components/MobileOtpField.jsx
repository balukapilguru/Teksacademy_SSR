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

export const MobileOtpField = ({ value, onChange, onVerified, error }) => {
  const prevValueRef = useRef(value);
  const onVerifiedRef = useRef(onVerified);
  const otpInputRefs = useRef([]);
  const recaptchaRef = useRef(null);
  const modalRecaptchaRef = useRef(null);

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [canSendOtp, setCanSendOtp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // 4-Pillar Security States
  const [captchaToken, setCaptchaToken] = useState(null);
  const [handshakeData, setHandshakeData] = useState(null);
  const [modalCaptchaToken, setModalCaptchaToken] = useState(null);
  const [modalHandshakeData, setModalHandshakeData] = useState(null);
  const [honeypotValue, setHoneypotValue] = useState("");

  const isOtpComplete = otp.every((digit) => digit !== "");
  const API_URL = blogsApplyBaseUrl;

  // Toast options with very high z-index to appear above modal
  const errorToastOptions = {
    duration: 4000,
    position: "top-right",
    style: {
      background: "#ef4444",
      color: "#fff",
      zIndex: 999999,
      fontSize: "14px",
      padding: "12px 16px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    icon: "❌",
  };

  const successToastOptions = {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#10b981",
      color: "#fff",
      zIndex: 999999,
      fontSize: "14px",
      padding: "12px 16px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    icon: "✅",
  };

  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  useEffect(() => {
    if (showOtp && !isVerified) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
    }
  }, [showOtp, isVerified]);

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
      setOtpError("");
      setCaptchaToken(null);
      setHandshakeData(null);
      setModalCaptchaToken(null);
      setModalHandshakeData(null);
      try {
        recaptchaRef.current?.reset();
        modalRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      if (onVerifiedRef.current) onVerifiedRef.current(false);
    }
  }, [value]);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (showOtp && isResendDisabled && timer > 0) {
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
  }, [showOtp, timer, isResendDisabled]);

  const formatTimer = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  // ==================== PILLAR 2: PRE-FLIGHT HANDSHAKE ON CAPTCHA ====================
  const handleCaptchaSuccess = async (token) => {
    setCaptchaToken(token);
    if (!token) return;

    try {
      const hs = await fetchOtpHandshake(API_URL);
      setHandshakeData(hs);
    } catch (err) {
      // Handshake error silently handled
    }
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
    setHandshakeData(null);
    try {
      recaptchaRef.current?.reset();
    } catch {}
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setHandshakeData(null);
    try {
      recaptchaRef.current?.reset();
    } catch {}
  };

  const handleModalCaptchaSuccess = async (token) => {
    setModalCaptchaToken(token);
    if (!token) return;

    try {
      const hs = await fetchOtpHandshake(API_URL);
      setModalHandshakeData(hs);
    } catch (err) {
      // Modal handshake error silently handled
    }
  };

  const handleModalCaptchaExpired = () => {
    setModalCaptchaToken(null);
    setModalHandshakeData(null);
    try {
      modalRecaptchaRef.current?.reset();
    } catch {}
  };

  const handleModalCaptchaError = () => {
    setModalCaptchaToken(null);
    setModalHandshakeData(null);
    try {
      modalRecaptchaRef.current?.reset();
    } catch {}
  };

  // ==================== SEND OTP ====================
  const handleSendOtp = useCallback(async () => {
    if (isVerified) return;

    // Pillar 4: Strict Indian mobile number format validation
    const validation = validateIndianMobileNumber(value);
    if (!validation.valid) {
      toast.error(validation.message, errorToastOptions);
      return;
    }
    const cleanedNumber = validation.cleaned;

    // Pillar 1: Google reCAPTCHA v2 Checkbox guard
    if (!captchaToken) {
      toast.error(
        "Please click 'I'm not a robot' before requesting OTP.",
        errorToastOptions
      );
      return;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      // Pillar 2: Pre-flight handshake (use existing or fetch fresh)
      let hs = handshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(API_URL);
        setHandshakeData(hs);
      }

      // Compute dynamic clientHash
      const clientHash = await computeDynamicClientHash(
        cleanedNumber,
        hs.timestamp,
        hs.handshakeId
      );

      // Submit POST /lead/send-otp
      const res = await fetch(buildApiUrl(API_URL, "/lead/send-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: cleanedNumber,
          recaptchaToken: captchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash: clientHash,
          website_verification_code: honeypotValue || "",
        }),
      });

      const data = await res.json();

      if (data?.success) {
        setShowOtp(true);
        setOtp(Array(6).fill(""));
        setIsVerified(false);
        setCanSendOtp(false);
        setTimer(60);
        setIsResendDisabled(true);
        setOtpError("");
        if (onVerifiedRef.current) onVerifiedRef.current(false);
        toast.success("OTP sent successfully via WhatsApp!", successToastOptions);
      } else {
        toast.error(data?.message || "Failed to send OTP", errorToastOptions);
      }
    } catch (err) {
      toast.error(err.message || "OTP send failed. Please try again.", errorToastOptions);
    } finally {
      setIsLoading(false);
      // Reset reCAPTCHA after attempt so it cannot be replayed
      try {
        recaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setCaptchaToken(null);
      setHandshakeData(null);
    }
  }, [value, isVerified, API_URL, captchaToken, handshakeData, honeypotValue]);

  // ==================== RESEND OTP (Inside Modal) ====================
  const handleResendOtp = useCallback(async () => {
    if (isVerified || isResendDisabled) return;

    const validation = validateIndianMobileNumber(value);
    if (!validation.valid) {
      toast.error(validation.message, errorToastOptions);
      return;
    }
    const cleanedNumber = validation.cleaned;

    if (!modalCaptchaToken) {
      toast.error(
        "Please click 'I'm not a robot' before resending OTP.",
        errorToastOptions
      );
      return;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      let hs = modalHandshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(API_URL);
        setModalHandshakeData(hs);
      }

      const clientHash = await computeDynamicClientHash(
        cleanedNumber,
        hs.timestamp,
        hs.handshakeId
      );

      const res = await fetch(buildApiUrl(API_URL, "/lead/send-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: cleanedNumber,
          recaptchaToken: modalCaptchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash: clientHash,
          website_verification_code: honeypotValue || "",
        }),
      });

      const data = await res.json();

      if (data?.success) {
        setOtp(Array(6).fill(""));
        setTimer(60);
        setIsResendDisabled(true);
        setOtpError("");
        toast.success("OTP resent successfully via WhatsApp!", successToastOptions);
      } else {
        toast.error(data?.message || "Failed to resend OTP", errorToastOptions);
      }
    } catch (err) {
      toast.error(err.message || "Resend failed. Please try again.", errorToastOptions);
    } finally {
      setIsLoading(false);
      try {
        modalRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setModalCaptchaToken(null);
      setModalHandshakeData(null);
    }
  }, [value, isVerified, isResendDisabled, API_URL, modalCaptchaToken, modalHandshakeData, honeypotValue]);

  // ==================== VERIFY OTP ====================
  const handleVerifyOtp = useCallback(async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setOtpError("Enter the complete 6-digit OTP");
      return;
    }

    const validation = validateIndianMobileNumber(value);
    const cleanedNumber = validation.valid ? validation.cleaned : value;

    setIsLoading(true);
    setOtpError("");

    try {
      const res = await fetch(buildApiUrl(API_URL, "/lead/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: cleanedNumber, otp: finalOtp }),
      });
      const data = await res.json();

      if (data?.success) {
        setIsVerified(true);
        setShowOtp(false);
        setOtp(Array(6).fill(""));
        setOtpError("");
        setCanSendOtp(false);
        toast.success("Mobile number verified successfully!", successToastOptions);
        if (onVerifiedRef.current) onVerifiedRef.current(true);
      } else {
        setIsVerified(false);
        setOtpError(data?.message || "Invalid OTP. Please try again.");
        toast.error(data?.message || "Invalid OTP. Please try again.", errorToastOptions);
        if (onVerifiedRef.current) onVerifiedRef.current(false);
        setOtp(Array(6).fill(""));
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setOtpError("Verification failed. Please try again.");
      toast.error("Verification failed. Please try again.", errorToastOptions);
    } finally {
      setIsLoading(false);
    }
  }, [otp, value, API_URL]);

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

  const handleCloseOtpModal = () => {
    setShowOtp(false);
    setOtp(Array(6).fill(""));
    setOtpError("");
    setTimer(0);
    setIsResendDisabled(true);
    setCanSendOtp(true);
    setModalCaptchaToken(null);
    setModalHandshakeData(null);
    try {
      modalRecaptchaRef.current?.reset();
    } catch {
      // ignore
    }
    try {
      if (typeof onChange === "function") {
        onChange(value);
      }
      if (onVerifiedRef.current) onVerifiedRef.current(isVerified);
    } catch (e) {
      // Change callback error silently handled
    }
  };

  return (
    <div className="w-full">
      {/* Pillar 3: Invisible Honeypot trap field */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
          height: 0,
          width: 0,
          overflow: "hidden",
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <label htmlFor="website_verification_code">Do not fill this</label>
        <input
          type="text"
          id="website_verification_code"
          name="website_verification_code"
          value={honeypotValue}
          onChange={(e) => setHoneypotValue(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="block text-xs font-medium text-gray-700 mb-1">
        Mobile Number <span className="text-red-500">*</span>
      </label>

      {/* Pillar 1: Google reCAPTCHA v2 Checkbox right above Send OTP */}
      {!isVerified && !showOtp && (
        <div className="mb-2 flex justify-start overflow-hidden">
          <div className="scale-[0.85] origin-left sm:scale-95">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaSuccess}
              onExpired={handleCaptchaExpired}
              onErrored={handleCaptchaError}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
            +91
          </span>
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
              ${
                isVerified
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-white"
              }`}
          />
        </div>

        {!isVerified && (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!canSendOtp || isLoading}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap h-[38px]
              ${
                (!canSendOtp || isLoading) && !showOtp
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#2a619d] text-white hover:bg-[#214d7d] active:scale-95 shadow-sm"
              }
              ${showOtp ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading && !showOtp ? (
              <span className="flex items-center gap-1.5">
                <svg
                  className="animate-spin w-4 h-4"
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
                Sending...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <svg
            className="w-3 h-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {isVerified && (
        <div className="mt-2 flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <svg
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Mobile number verified
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtp && !isVerified && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={handleCloseOtpModal}
              className="absolute right-4 top-4 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              aria-label="Close OTP verification popup"
            >
              Close
            </button>
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Verify Mobile Number
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Enter the 6-digit OTP sent via WhatsApp to +91 {value}
              </p>
            </div>

            <div className="px-6 py-5">
              {otpError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm text-center">{otpError}</p>
                </div>
              )}

              <div className="mb-5 flex justify-between gap-2">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    ref={(element) => {
                      otpInputRefs.current[i] = element;
                    }}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={(e) => handlePaste(e, i)}
                    maxLength={1}
                    inputMode="numeric"
                    className={`h-12 w-12 rounded-lg border-2 text-center text-lg font-semibold focus:outline-none transition-all sm:h-14 sm:w-14
                      ${
                        val
                          ? "border-[#2a619d] bg-white text-[#2a619d]"
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

              {/* Resend Captcha Checkbox if cooldown timer elapsed */}
              {!isResendDisabled && (
                <div className="mb-4 flex justify-center scale-[0.85] origin-center sm:scale-95">
                  <ReCAPTCHA
                    ref={modalRecaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleModalCaptchaSuccess}
                    onExpired={handleModalCaptchaExpired}
                    onErrored={handleModalCaptchaError}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || isLoading || !modalCaptchaToken}
                  className={`flex-1 rounded-md py-3 text-sm font-medium transition-all
                    ${
                      isResendDisabled || isLoading || !modalCaptchaToken
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border border-[#2a619d] bg-white text-[#2a619d] hover:bg-blue-50 active:scale-95"
                    }`}
                >
                  {isResendDisabled && timer > 0
                    ? `Resend in ${formatTimer(timer)}`
                    : isLoading
                    ? "Sending..."
                    : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!isOtpComplete || isLoading}
                  className={`flex-1 rounded-md py-3 text-sm font-semibold transition-all
                    ${
                      isOtpComplete && !isLoading
                        ? "bg-green-600 text-white shadow-sm hover:bg-green-700 active:scale-95"
                        : "cursor-not-allowed bg-gray-200 text-gray-400"
                    }`}
                >
                  {isLoading && showOtp ? (
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
                    "Verify OTP"
                  )}
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-gray-500">
                Complete OTP verification to continue filling the form.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};