"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  Clock,
  Info,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { CgCalendarDates } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import ReCAPTCHA from "react-google-recaptcha";
import {
  RECAPTCHA_SITE_KEY,
  validateIndianMobileNumber,
  fetchOtpHandshake,
  computeDynamicClientHash,
} from "@/lib/otpSecurity";

import { useParams } from "next/navigation";

const rawApiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  "https://l5h16h96-5060.inc1.devtunnels.ms";
const apiUrl = rawApiUrl.replace(/\/$/, "");

function RegistrationForm() {
  const [isFormActive, setIsFormActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60s cooldown
  const [isVerifying, setIsVerifying] = useState(false);
  const [examDate, setEaxmDate] = useState(false);
  const [custom, setCustom] = useState([]);

  // 4-Pillar Security & OTP state
  const recaptchaRef = useRef(null);
  const modalRecaptchaRef = useRef(null);
  const otpInputRefs = useRef([]);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [handshakeData, setHandshakeData] = useState(null);
  const [resendCaptchaToken, setResendCaptchaToken] = useState(null);
  const [resendHandshakeData, setResendHandshakeData] = useState(null);
  const [honeypotValue, setHoneypotValue] = useState("");
  const [otpVerificationData, setOtpVerificationData] = useState({
    token: "",
    email: "",
  });

  const { urlid } = useParams();

 

  useEffect(() => {
    const fetchExamData = async (urlid) => {
      try {
        const response = await fetch(
          `${apiUrl}/registrationform/getbyId/${urlid.split("%")[0]}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Exam data");
        }
        const data = await response.json();
        setFormData(data);

        // setIsLoading(false);
      } catch (error) {
        setError(error);
        // setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (urlid) {
      fetchExamData(urlid);
    }
  }, [urlid]);

  useEffect(() => {
    // const checkFormActive = () => {
    //   const now = new Date(
    //     new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    //   );

    //   // const now = new Date().toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" });



    //   if (now >= activeFrom && now <= activeTo) {
    //     setIsFormActive(true);
    //   } else if (now < activeFrom) {
    //     setIsFormActive(false);
    //     setDateError(
    //       "Form will open on " + activeFrom.toLocaleString().split(",")[0]
    //     );
    //   } else {
    //     setIsFormActive(false);
    //     setDateError("Form registration period has expired.");
    //   }
    // };

    const checkFormActive = () => {
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      // Remove time part by resetting time to midnight
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const activeFromDate = new Date(formData?.activeFrom);
      const activeToDate = new Date(formData?.activeTo);

      const activeFrom = new Date(
        activeFromDate.getFullYear(),
        activeFromDate.getMonth(),
        activeFromDate.getDate()
      );
      const activeTo = new Date(
        activeToDate.getFullYear(),
        activeToDate.getMonth(),
        activeToDate.getDate()
      );

      
      if (today >= activeFrom && today <= activeTo) {
        setIsFormActive(true);
      } else if (today < activeFrom) {
        setIsFormActive(false);
        setDateError(
          "Form will open on " + activeFrom.toLocaleDateString("en-IN")
        );
      } else {
        setIsFormActive(false);
        setDateError("Form registration period has expired.");
      }
    };

    if (formData) {
      checkFormActive();
    }

    setUserDetails((prev) => ({
      ...prev,
      ["formId"]: urlid.split("%")[0],
    }));
  }, [formData, urlid]);



  const handleCaptchaSuccess = async (token) => {
    setCaptchaToken(token);
    if (token) {
      try {
        const hs = await fetchOtpHandshake(apiUrl);
        setHandshakeData(hs);
      } catch (err) {
        // Handshake pre-flight error silently handled
      }
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
    if (token) {
      try {
        const hs = await fetchOtpHandshake(apiUrl);
        setResendHandshakeData(hs);
      } catch (err) {
        // Resend handshake error silently handled
      }
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

  useEffect(() => {
    let timer;
    if (isResendDisabled && resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [isResendDisabled, resendTimer]);

  const handleResendOtp = async () => {
    if (isResendDisabled || resendTimer > 0) return;

    if (!resendCaptchaToken) {
      setError("Please complete 'I am not a robot' to resend verification code.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      let hs = resendHandshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(apiUrl);
        setResendHandshakeData(hs);
      }

      const email = otpVerificationData.email;
      const clientHash = await computeDynamicClientHash(
        email,
        hs.timestamp,
        hs.handshakeId
      );

      const response = await fetch(`${apiUrl}/otp/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: otpVerificationData.token,
          recaptchaToken: resendCaptchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash,
          website_verification_code: honeypotValue || "",
          formId: urlid?.split("%")[0],
          isExam: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setOtpVerificationData((prev) => ({
        ...prev,
        token: data.token,
      }));

      setOtp(["", "", "", "", "", ""]);
      setEnteredOtp("");
      setIsResendDisabled(true);
      setResendTimer(60);
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
      try {
        modalRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message || "Error resending OTP");
    } finally {
      setIsVerifying(false);
    }
  };



  const handleInputChange = (label, value) => {
    if (label === "Phone Number") {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, "");

      // Limit to 10 digits
      if (numericValue.length > 10) return;

      setUserDetails((prev) => ({
        ...prev,
        [label]: numericValue,
      }));
    } else {
      setUserDetails((prev) => ({
        ...prev,
        [label]: value,
      }));
    }
  };

  const handleCustomChange = (questionId, value) => {
    setCustom((prev) => {
      const others = prev.filter((q) => q.questionId !== questionId);
      return [...others, { questionId, answer: value }];
    });
  };

  

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setIsSubmitting(true);

    const submitTheUserDetails = async (userDetails) => {
      const payload = {
        ...Object.entries(userDetails).reduce((acc, [key, value]) => {
          const formattedKey =
            key === "formId" ? key : key.toLowerCase().replace(/\s+/g, "");
          acc[formattedKey] = value;
          return acc;
        }, {}),
        extraquestions: custom, // 👈 Add the `custom` array here
      };

      payload.collegeName = payload.collegename;
      payload.website_verification_code = honeypotValue || "";
      payload.isExam = true;

      try {
        const response = await fetch(`${apiUrl}/registrationform/studentform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.status === 400) {
          const data = await response.json();
          setIsAlreadyRegistered(true);
          setShowOtpVerification(false);
        } else if (!response.ok) {
          throw new Error("Failed to submit");
        } else {
          const data = await response.json();
          setIsSubmitted(true);
          setShowOtpVerification(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        // setIsSubmitting(false);
        setIsVerifying(false);
      }
    };

    if (userDetails) {
      submitTheUserDetails(userDetails);
    }
  };

  const handleStartOver = () => {
    window.location.reload();
    setIsSubmitted(false);
    setIsAlreadyRegistered(false);
    setUserDetails({});
  };

  const backtoRegisterForm = () => {
    setIsSubmitted(false);
    setShowOtpVerification(false);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setEnteredOtp("");
    setResendCaptchaToken(null);
    setResendHandshakeData(null);
  };

  const sendOtpToMail = async (e) => {
    e.preventDefault();
    setError("");

    // Bot honeypot trap
    if (honeypotValue && honeypotValue.trim().length > 0) {
      setShowOtpVerification(true);
      return;
    }

    const email = userDetails?.["Email"]?.trim()?.toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const phone = userDetails?.["Phone Number"];
    if (phone) {
      const phoneValidation = validateIndianMobileNumber(phone);
      if (!phoneValidation.valid) {
        setError(phoneValidation.message);
        return;
      }
    }

    if (!captchaToken) {
      setError("Please click 'I am not a robot' before submitting.");
      return;
    }

    setIsSubmitting(true);
    checkExamDate();

    try {
      let hs = handshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(apiUrl);
        setHandshakeData(hs);
      }

      const clientHash = await computeDynamicClientHash(
        email,
        hs.timestamp,
        hs.handshakeId
      );

      const response = await fetch(`${apiUrl}/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          recaptchaToken: captchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash,
          website_verification_code: honeypotValue || "",
          formId: urlid?.split("%")[0],
          isExam: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpVerificationData({
        email,
        token: data.token,
      });

      setOtp(["", "", "", "", "", ""]);
      setEnteredOtp("");
      setShowOtpVerification(true);
      setIsResendDisabled(true);
      setResendTimer(60);
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
      try {
        recaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setCaptchaToken(null);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setEnteredOtp(newOtp.join(""));
      return;
    }

    if (sanitized.length > 1) {
      const digits = sanitized.slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      setEnteredOtp(newOtp.join(""));
      const nextIdx = Math.min(digits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);
    setEnteredOtp(newOtp.join(""));

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = enteredOtp || otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/otp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: otpVerificationData.email,
          otp: fullOtp,
          token: otpVerificationData.token,
          phone: userDetails?.["Phone Number"] || "",
          isExam: true,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid verification code");
      }

      await handleSubmit(true);
    } catch (error) {
      setError(error.message || "Invalid OTP code");
      setIsVerifying(false);
    }
  };

  const toPascalCaseWithSpaces = (sentence) => {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatDate = (dateString) => {
    let [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const convertTo12HourFormat = (timeString) => {
    let [hour, minute] = timeString.split(":");
    hour = parseInt(hour);

    // Determine AM or PM
    let period = hour >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12; // Midnight case
    }

    return `${hour}:${minute} ${period}`;
  };

  const checkExamDate = () => {
    // e.preventDefault()
    setEaxmDate(false);
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const givenExamDate = new Date(formData.examDate);
    const examLiveDate = new Date(
      givenExamDate.getFullYear(),
      givenExamDate.getMonth(),
      givenExamDate.getDate()
    );


    if (today.toDateString() == examLiveDate.toDateString()) {
      setEaxmDate(true);
    } else {
      setEaxmDate(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 text-gray-600 text-lg font-medium">
          Loading...
        </div>
      </div>
    );
  }

  if (!isFormActive) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <Info className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Registration Closed
            </h2>
            <p className="mt-2 text-gray-600">{dateError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 inline-block">
              <MdOutlineEmail className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Verify Your Mail
            </h2>
            <p className="mt-4 text-gray-600">
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className="font-semibold">{userDetails?.["Email"]}</span>
            </p>

            <form onSubmit={handleOtpSubmit} className="mt-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    name={`otp-${index}`}
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg focus:border-blue-500 focus:ring-blue-500 outline-none"
                  />
                ))}
              </div>

              {error && (
                <div className="mt-3 text-center text-xs text-red-500 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className={`w-full mt-6 flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md transition-colors
    ${isVerifying ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}
  `}
              >
                {isVerifying ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>
            </form>

            {/* Modal ReCAPTCHA for Resend */}
            {!isResendDisabled && (
              <div className="mt-4 flex justify-center">
                <ReCAPTCHA
                  ref={modalRecaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleResendCaptchaSuccess}
                  onExpired={handleResendCaptchaExpired}
                  onErrored={handleResendCaptchaError}
                />
              </div>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled || !resendCaptchaToken || isVerifying}
                className={`text-sm font-medium transition-colors ${
                  isResendDisabled || !resendCaptchaToken || isVerifying
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800 cursor-pointer"
                }`}
              >
                {isResendDisabled
                  ? `Resend code in ${resendTimer}s`
                  : "Resend verification code"}
              </button>
            </div>

            <button
              onClick={backtoRegisterForm}
              className="mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAlreadyRegistered) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-3 inline-block">
              <AlertCircle className="h-12 w-12 text-yellow-500" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Already Registered
            </h2>
            <p className="mt-4 text-gray-600">
              An account with the email address{" "}
              <span className="font-semibold">{userDetails?.["Email"]}</span>{" "}
              has already been registered for this exam.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Need Help?</h3>
                <p className="mt-2 text-sm text-gray-600">
                  If you think this is a mistake or need assistance, please
                  contact support.
                </p>
              </div>
              <button
                onClick={handleStartOver}
                className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Try Different Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 inline-block">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Registration Successful!
            </h2>
            <p className="mt-4 text-gray-600">
              {examDate
                ? "Thank you for registering for the exam. Today is the exam day, and we have sent the exam link to your mail. Please check your mailbox for the link."
                : ` Thank you for registering for the exam. We have sent a
              confirmation mail to ${userDetails?.Email}.`}
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Exam Details</h3>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <p>Exam Date: {formatDate(formData?.examDate)}</p>
                  {formData?.examEndDate && (
                    <p>Exam End Date: {formatDate(formData?.examEndDate)}</p>
                  )}
                  {formData?.examTime && (
                    <p>Time: {convertTo12HourFormat(formData?.examTime)}</p>
                  )}
                  {/* <p>Time: {convertTo12HourFormat(formData?.examTime)}</p> */}
                  <p>Duration: {formData?.time} minutes</p>
                </div>
              </div>
              {/* <button
                onClick={handleStartOver}
                className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Register Another Student</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // const inputFields = formData.fieldsList.slice(8);
  const inputFields = formData.fieldsList.slice(8, 13);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {toPascalCaseWithSpaces(formData?.registrationformname)}
            </h1>
            {/* <p className="mt-2">{formData?.description}</p> */}
          </div>

          <div className="p-6 border-b">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Exam Start Date</p>
                  <p className="font-medium">
                    {formatDate(formData?.examDate)}
                  </p>
                </div>
              </div>
              {formData?.examTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Exam Time</p>
                    <p className="font-medium">
                      {convertTo12HourFormat(formData?.examTime)}
                    </p>
                  </div>
                </div>
              )}

              {formData?.examEndDate && (
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Exam End Date</p>
                    <p className="font-medium">
                      {formatDate(formData?.examEndDate)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{formData?.time} minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CgCalendarDates className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Form Closing</p>
                  <p className="font-medium">
                    {formatDate(formData?.activeTo)}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={sendOtpToMail} className="p-6 space-y-6">
            {inputFields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm custom-question-field h-10"
                    value={userDetails?.[field.label] || ""}
                    onChange={(e) =>
                      handleInputChange(field.label, e.target.value)
                    }
                    required
                  >
                    <option className="custom-question-field" value="">
                      Select {field.label}
                    </option>
                    {field.label === "Gender" && (
                      <>
                        <option className="custom-question-field" value="male">
                          Male
                        </option>
                        <option
                          className="custom-question-field"
                          value="female"
                        >
                          Female
                        </option>
                        <option className="custom-question-field" value="other">
                          Other
                        </option>
                      </>
                    )}
                    {field.label === "Working Professional" && (
                      <>
                        <option className="custom-question-field" value="1">
                          Yes
                        </option>
                        <option className="custom-question-field" value="0">
                          No
                        </option>
                      </>
                    )}
                    {/* Add more conditionals if needed for other select types */}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm custom-question-field h-10 pl-2"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    value={userDetails?.[field.label] || ""}
                    onChange={(e) =>
                      handleInputChange(field.label, e.target.value)
                    }
                    required
                  />
                )}
              </div>
            ))}

            {/* {formData?.studentexamsQuestions.map((field) => {
              const { id, title, type, description, options, manderatory } =
                field;
              // assume mandatory if you want, e.g.: jobsandcustoms.isMandatory
              const required = manderatory == 1;

              return (
                <div key={id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {title}
                    {required && <span className="text-red-500"> *</span>}
                  </label>

                  {type === "select" ? (
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm custom-question-field"
                      value={
                        custom.find((c) => c.questionId === id)?.answer || ""
                      }
                      onChange={(e) => handleCustomChange(id, e.target.value)}
                      required={required}
                    >
                      <option value="">Select {title}</option>
                      {options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm custom-question-field"
                      placeholder={description || `Enter ${title}`}
                      value={
                        custom.find((c) => c.questionId === id)?.answer || ""
                      }
                      onChange={(e) => handleCustomChange(id, e.target.value)}
                      required={required}
                    />
                  ) : (
                    <input
                      type={type} // "text", "email", "date", "time", "number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm custom-question-field"
                      placeholder={description || `Enter ${title}`}
                      value={
                        custom.find((c) => c.questionId === id)?.answer || ""
                      }
                      onChange={(e) => handleCustomChange(id, e.target.value)}
                      required={required}
                    />
                  )}
                </div>
              );
            })} */}

            {/* /// add here given studentexamsQuestions based on type // */}

            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="website_verification_code"
              value={honeypotValue}
              onChange={(e) => setHoneypotValue(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              style={{ display: "none" }}
              aria-hidden="true"
            />

            {/* Google reCAPTCHA v2 Checkbox */}
            <div className="flex justify-center my-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaSuccess}
                onExpired={handleCaptchaExpired}
                onErrored={handleCaptchaError}
              />
            </div>

            {error && (
              <div className="text-center text-sm text-red-500 font-medium my-2">
                {error}
              </div>
            )}

            <div className="mt-6">
              {/* <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Submit Registration
              </button> */}
              <button
                type="submit"
                disabled={isSubmitting || !captchaToken}
                className={`w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md transition-colors
    ${isSubmitting || !captchaToken ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}
  `}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
