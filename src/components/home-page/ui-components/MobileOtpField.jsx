"use client";
import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import {
  RECAPTCHA_SITE_KEY,
  validateIndianMobileNumber,
  computeDynamicClientHash,
  fetchOtpHandshake,
} from "@/lib/otpSecurity";

/**
 * MobileOtpField — Reusable OTP Component for ExcelForm with 4-pillar security
 */
export const MobileOtpField = ({
  value,
  onChange,
  onVerified,
  error,
}) => {
  const API_URL = blogsApplyBaseUrl;
  const recaptchaRef = useRef(null);
  const resendRecaptchaRef = useRef(null);

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [canSendOtp, setCanSendOtp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 4-Pillar Security States
  const [captchaToken, setCaptchaToken] = useState(null);
  const [handshakeData, setHandshakeData] = useState(null);
  const [resendCaptchaToken, setResendCaptchaToken] = useState(null);
  const [resendHandshakeData, setResendHandshakeData] = useState(null);
  const [honeypotValue, setHoneypotValue] = useState("");

  const isOtpComplete = otp.every((digit) => digit !== "");

  // 🔁 Reset when number changes
  useEffect(() => {
    setShowOtp(false);
    setOtp(Array(6).fill(""));
    setIsVerified(false);
    setTimer(0);
    setIsResendDisabled(true);
    setCanSendOtp(true);
    setCaptchaToken(null);
    setHandshakeData(null);
    setResendCaptchaToken(null);
    setResendHandshakeData(null);
    try {
      recaptchaRef.current?.reset();
      resendRecaptchaRef.current?.reset();
    } catch {
      // ignore
    }
    if (typeof onVerified === "function") {
      onVerified(false);
    }
  }, [value]);

  // ⏱ Timer logic
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
    return () => clearInterval(interval);
  }, [showOtp, timer, isResendDisabled]);

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

  const handleResendCaptchaSuccess = async (token) => {
    setResendCaptchaToken(token);
    if (!token) return;

    try {
      const hs = await fetchOtpHandshake(API_URL);
      setResendHandshakeData(hs);
    } catch (err) {
      // Resend handshake error silently handled
    }
  };

  const handleResendCaptchaExpired = () => {
    setResendCaptchaToken(null);
    setResendHandshakeData(null);
    try {
      resendRecaptchaRef.current?.reset();
    } catch {}
  };

  const handleResendCaptchaError = () => {
    setResendCaptchaToken(null);
    setResendHandshakeData(null);
    try {
      resendRecaptchaRef.current?.reset();
    } catch {}
  };

  // 📩 SEND OTP
  const handleSendOtp = async () => {
    if (isVerified) return;

    // Pillar 4: Strict Indian mobile number format validation
    const validation = validateIndianMobileNumber(value);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    const cleanedNumber = validation.cleaned;

    // Pillar 1: Google reCAPTCHA v2 Checkbox guard
    if (!captchaToken) {
      toast.error("Please click 'I'm not a robot' before requesting OTP.");
      return;
    }

    setIsLoading(true);

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
        if (typeof onVerified === "function") onVerified(false);
        toast.success("OTP sent successfully via WhatsApp!");
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.message || "OTP send failed. Please try again.");
    } finally {
      setIsLoading(false);
      try {
        recaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setCaptchaToken(null);
      setHandshakeData(null);
    }
  };

  // 🔄 RESEND OTP
  const handleResendOtp = async () => {
    if (isVerified || isResendDisabled) return;

    const validation = validateIndianMobileNumber(value);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    const cleanedNumber = validation.cleaned;

    if (!resendCaptchaToken) {
      toast.error("Please click 'I'm not a robot' before resending OTP.");
      return;
    }

    setIsLoading(true);

    try {
      let hs = resendHandshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(API_URL);
        setResendHandshakeData(hs);
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
          recaptchaToken: resendCaptchaToken,
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
        toast.success("OTP resent successfully via WhatsApp!");
      } else {
        toast.error(data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error(err.message || "Resend failed. Please try again.");
    } finally {
      setIsLoading(false);
      try {
        resendRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        document.getElementById(`excel-otp-${index - 1}`)?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`excel-otp-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`excel-otp-${index + 1}`)?.focus();
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    const validation = validateIndianMobileNumber(value);
    const cleanedNumber = validation.valid ? validation.cleaned : value;

    setIsLoading(true);

    try {
      const res = await fetch(buildApiUrl(API_URL, "/lead/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: cleanedNumber,
          otp: finalOtp,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        setIsVerified(true);
        setShowOtp(false);
        setOtp(Array(6).fill(""));
        if (typeof onVerified === "function") onVerified(true);
        toast.success("Mobile number verified successfully!");
      } else {
        setIsVerified(false);
        if (typeof onVerified === "function") onVerified(false);
        toast.error(data?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (val, index) => {
    if (!/^\d?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Move forward
    if (val && index < 5) {
      document.getElementById(`excel-otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="w-full relative pb-2 mt-1">
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
        <label htmlFor="website_verification_code_excel">Do not fill this</label>
        <input
          type="text"
          id="website_verification_code_excel"
          name="website_verification_code"
          value={honeypotValue}
          onChange={(e) => setHoneypotValue(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Pillar 1: Google reCAPTCHA v2 Checkbox right above Send OTP */}
      {!isVerified && !showOtp && (
        <div className="mb-2 flex justify-start overflow-hidden">
          <div className="scale-[0.82] origin-left sm:scale-95">
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

      {/* Input + Button */}
      <div className="flex gap-2">
        <input
          type="tel"
          name="number"
          value={value || ""}
          onChange={onChange}
          disabled={isVerified}
          className="border shadow-sm text-black bg-white w-full rounded-lg px-3.5 py-3 text-sm outline-none border-[#e0e0e0] focus:border-[#4B84CB]"
          placeholder="Enter mobile number"
          maxLength={10}
        />

        {!isVerified && (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!canSendOtp || isLoading}
            className={`h-[46px] px-4 rounded-md text-sm font-medium whitespace-nowrap transition-colors
              ${
                !canSendOtp || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#fe543d] text-white hover:bg-[#e04a35]"
              }`}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <div className="text-red-600 text-xs ml-3 mt-1 text-left">{error}</div>}

      {/* Verified */}
      {isVerified && (
        <p className="text-green-600 text-start text-sm mt-1 ml-1 font-medium flex items-center gap-1">
          ✅ Mobile number verified
        </p>
      )}

      {/* OTP Section */}
      {showOtp && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            Enter the 6-digit OTP sent via WhatsApp to +91 {value}
          </p>

          {/* OTP Boxes */}
          <div className="flex gap-2">
            {otp.map((val, i) => (
              <input
                key={i}
                id={`excel-otp-${i}`}
                value={val}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-full h-10 text-[14px] border text-center rounded-md text-black bg-white focus:border-[#4B84CB] outline-none"
                maxLength={1}
                inputMode="numeric"
              />
            ))}
          </div>

          {/* Resend Captcha if timer elapsed */}
          {!isResendDisabled && (
            <div className="mt-3 flex justify-center scale-[0.82] origin-center sm:scale-90">
              <ReCAPTCHA
                ref={resendRecaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleResendCaptchaSuccess}
                onExpired={handleResendCaptchaExpired}
                onErrored={handleResendCaptchaError}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendDisabled || isLoading || !resendCaptchaToken}
              className={`flex-1 text-xs h-[40px] rounded-md transition-colors
                ${
                  isResendDisabled || isLoading || !resendCaptchaToken
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#4a75a3] text-white hover:bg-[#3d6187] cursor-pointer"
                }`}
            >
              {isResendDisabled && timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || isLoading}
              className={`flex-1 text-xs h-[40px] rounded-md transition-colors
                ${
                  !isOtpComplete || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#fe543d] text-white hover:bg-[#e04a35]"
                }`}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
