"use client";

import { useState, useRef } from "react";

export default function SignupPage() {
  const [step, setStep] = useState("signup");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    } else if (formData.name.trim().length < 3) {
      errs.name = "Name must be at least 3 characters.";
    }

    if (!formData.email) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address.";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits) {
      errs.phone = "Phone number is required.";
    } else if (phoneDigits.length !== 10) {
      errs.phone = "Phone number must be exactly 10 digits.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validate()) return;

    setSendingOtp(true);
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await fetch(`${baseUrl}/users/entityUserSignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone_number: formData.phone, // IMPORTANT: backend key
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send OTP");
      }

      // ✅ success flow
      setStep("otp");
      startTimer();

      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (err) {
      console.error("OTP error:", err);

      // ⚠️ don’t be lazy here — show user something meaningful
      alert(err.message || "Something went wrong");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(Array(6).fill(""));
    setOtpError(false);

    startTimer();
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError(false);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = Array(6).fill("");
    pasted.split("").forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    setVerifying(true);

    setVerifying(false);
  };

  const otpComplete = otp.every((d) => d !== "");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <BoltIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Start Your Journey With us</span>
        </div>

        <div className="flex gap-1.5 mb-7">
          <div className="h-1 flex-1 rounded-full bg-gray-900" />
          <div
            className={`h-1 flex-1 rounded-full ${step === "otp" ? "bg-gray-900" : "bg-gray-200"}`}
          />
        </div>

        {step === "signup" && (
          <>
            <h1 className="text-2xl font-semibold mb-1">Create account</h1>
            <p className="text-sm text-gray-500 mb-6">
              Fill in your details to get started.
            </p>

            <div className="mb-5">
              <input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="Full Name"
                className={`w-full p-3 border rounded-xl ${
                  errors.name ? "border-red-500" : ""
                }`}
              />

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-5">
              <input
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="Email"
                className={`w-full p-3 border rounded-xl ${
                  errors.email ? "border-red-500" : ""
                }`}
              />

              {errors.email && (
                <p className="text-xs text-red-500 mb-3 h-2">{errors.email}</p>
              )}
            </div>

            <div className="mb-5">
              <input
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // only digits

                  if (value.length > 10) return; // hard stop

                  setFormData({ ...formData, phone: value });

                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="Phone"
                className={`w-full p-3 border rounded-xl ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />

              {errors.phone && (
                <p className="text-xs text-red-500 mb-3 h-2">{errors.phone}</p>
              )}
            </div>

            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="w-full h-11 bg-gray-900 text-white rounded-xl disabled:opacity-50"
            >
              {sendingOtp ? "Sending..." : "Send verification code"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <button onClick={() => setStep("signup")} className="mb-4">
              Back
            </button>

            <div className="flex gap-2 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                  maxLength={1}
                  className="w-10 h-10 text-center border rounded"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={!otpComplete}
              className="w-full h-11 bg-gray-900 text-white rounded-xl"
            >
              Verify
            </button>
          </>
        )}
      </div>
    </main>
  );
}

/* Icons */
const BoltIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
  >
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
