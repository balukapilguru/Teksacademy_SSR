"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  Mail,
  Shield,
  X,
  RefreshCw,
  Sparkles,
  Zap,
  Clock,
  Database,
  Save,
  Trash2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import {
  RECAPTCHA_SITE_KEY,
  validateIndianMobileNumber,
  fetchOtpHandshake,
  computeDynamicClientHash,
} from "@/lib/otpSecurity";

const apiUrl = process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL;

export default function RegistrationForm() {
  const { urlid } = useParams();
  const searchParams = useSearchParams();

  const voucherCode = searchParams.get("voucherCode");
  const crmSourceId = searchParams.get("crmSourceId");

  // Email verification state - this is the first step
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [emailInputError, setEmailInputError] = useState("");
  const [verifiedUserData, setVerifiedUserData] = useState(null); // Store verified user data from OTP
  const emailRecaptchaRef = useRef(null);
  const modalRecaptchaRef = useRef(null);
  const [emailCaptchaToken, setEmailCaptchaToken] = useState(null);
  const [emailHoneypot, setEmailHoneypot] = useState("");
  const [handshakeData, setHandshakeData] = useState(null);
  const [resendCaptchaToken, setResendCaptchaToken] = useState(null);
  const [resendHandshakeData, setResendHandshakeData] = useState(null);
  const [otpVerificationData, setOtpVerificationData] = useState({
    token: "",
    email: "",
  });

  const handleEmailCaptchaSuccess = async (token) => {
    setEmailCaptchaToken(token);
    if (token) {
      try {
        const hs = await fetchOtpHandshake(apiUrl);
        setHandshakeData(hs);
      } catch (err) {
        // Handshake pre-flight error silently handled
      }
    }
  };

  const handleEmailCaptchaExpired = () => {
    setEmailCaptchaToken(null);
    setHandshakeData(null);
    try {
      emailRecaptchaRef.current?.reset();
    } catch {}
  };

  const handleEmailCaptchaError = () => {
    setEmailCaptchaToken(null);
    setHandshakeData(null);
    try {
      emailRecaptchaRef.current?.reset();
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

  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    loading: true,
    submitting: false,
    submitted: false,
    alreadyRegistered: false,
    formActive: false,
    message: "",
  });

  // Autofill States
  const [autoFillData, setAutoFillData] = useState(null);
  const [autoFillTimestamp, setAutoFillTimestamp] = useState(null);
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState({});
  const [showAutoFillHistory, setShowAutoFillHistory] = useState(false);
  const [autoFillHistory, setAutoFillHistory] = useState([]);

  // OTP States
  const [otpModal, setOtpModal] = useState({ open: false, email: "" });
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [enteredOtp, setEnteredOtp] = useState("");
  const otpInputRefs = useRef([]);
  const [otpStatus, setOtpStatus] = useState({
    loading: false,
    verified: false,
    error: "",
    resentCount: 0,
    timer: 0,
  });
  const [verifiedEmails, setVerifiedEmails] = useState({});

  useEffect(() => {
    if (otpModal.open) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 50);
    }
  }, [otpModal.open]);

  // UI States
  const [toastMessages, setToastMessages] = useState([]);
  const [highlightedFields, setHighlightedFields] = useState({});

  const otpTimerRef = useRef(null);
  const autoSubmitTimeoutRef = useRef(null);

  // ==================== HELPER FUNCTIONS ====================

  // Convert to Pascal Case with Spaces
  const toPascalCaseWithSpaces = (str) => {
    if (!str) return "";
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  };

  // Show Toast Message
  const showToast = (message, type = "info", duration = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToastMessages((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToastMessages((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  // Store Verified User Data in localStorage
  const storeVerifiedUserData = (userData) => {
    const storageData = {
      data: userData,
      timestamp: Date.now(),
    };

    localStorage.setItem("verifiedUserData", JSON.stringify(storageData));

    showToast("User data stored successfully!", "success", 3000);
  };
  // Get Stored Verified User Data
  const getStoredVerifiedUserData = () => {
    const stored = localStorage.getItem("verifiedUserData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const timestamp = new Date(parsed.timestamp);
        const now = new Date();
        const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          return parsed.data;
        }
      } catch (e) {
        // Stored user data parsing error silently handled
      }
    }
    return null;
  };

  // Clear Verified User Data
  const clearVerifiedUserData = () => {
    localStorage.removeItem("verifiedUserData");
    showToast("User data cleared", "info", 3000);
  };

  // Map verified user data to form fields
  const mapUserDataToFormFields = (userData, formFields) => {
    if (!userData || !formFields) return {};

    const mapped = {};

    formFields.forEach((field) => {
      const key = field.key?.toLowerCase();

      if (userData[key] !== undefined && userData[key] !== null) {
        mapped[field.key] = userData[key];

        setAutoFilledFields((prev) => ({
          ...prev,
          [field.key]: {
            value: userData[key],
            timestamp: new Date().toISOString(),
            source: "verified_user",
          },
        }));
      }
    });

    return mapped;
  };
  // Store Autofill Data in localStorage
  const storeAutoFillData = (data, source = "api") => {
    const storageData = {
      data: data,
      timestamp: new Date().toISOString(),
      source: source,
      formId: urlid,
    };

    localStorage.setItem("placementAutofillData", JSON.stringify(storageData));
    localStorage.setItem(
      "placementAutofillTimestamp",
      new Date().toISOString(),
    );

    // Store in history
    const history = JSON.parse(
      localStorage.getItem("placementAutofillHistory") || "[]",
    );
    history.unshift({
      ...storageData,
      id: Date.now(),
      applied: false,
    });
    if (history.length > 10) history.pop();
    localStorage.setItem("placementAutofillHistory", JSON.stringify(history));
    setAutoFillHistory(history);

    setAutoFillTimestamp(storageData.timestamp);
    showToast("Autofill data stored successfully!", "success", 3000);
  };

  // Get Stored Autofill Data
  const getStoredAutoFillData = () => {
    const stored = localStorage.getItem("placementAutofillData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const timestamp = new Date(parsed.timestamp);
        const now = new Date();
        const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

        if (hoursDiff < 24 && parsed.formId === urlid) {
          return parsed;
        }
      } catch (e) {
        // Stored autofill data parsing error silently handled
      }
    }
    return null;
  };

  // Get Autofill History
  const loadAutoFillHistory = () => {
    const history = localStorage.getItem("placementAutofillHistory");
    if (history) {
      setAutoFillHistory(JSON.parse(history));
    }
  };

  // Comprehensive Field Mapping System
  const mapAutoFillDataToForm = (data, formFields) => {
    const mappedData = {};
    const fieldMapping = {
      name: [
        "name",
        "full name",
        "student name",
        "candidate name",
        "applicant name",
        "fullname",
      ],
      email: [
        "email",
        "email address",
        "e-mail",
        "mail id",
        "electronic mail",
        "mail",
      ],
      phone: [
        "phone",
        "mobile",
        "contact",
        "phone number",
        "mobile number",
        "telephone",
        "cell",
        "whatsapp",
      ],
      registrationnumber: [
        "registration number",
        "reg number",
        "registration no",
        "reg no",
        "student id",
        "registration id",
        "enrollment number",
      ],
      coursepackage: [
        "course package",
        "package",
        "coursepack",
        "package name",
        "course bundle",
        "package details",
      ],
    };

    const autofillMap = {};
    Object.keys(data).forEach((key) => {
      autofillMap[key.toLowerCase()] = data[key];
    });

    formFields.forEach((field) => {
      const fieldLabel = field.label.toLowerCase();
      let matchedValue = null;

      for (const [dataKey, possibleLabels] of Object.entries(fieldMapping)) {
        if (
          possibleLabels.some(
            (label) =>
              fieldLabel.includes(label) ||
              label.includes(fieldLabel) ||
              fieldLabel.replace(/\s/g, "") === label.replace(/\s/g, ""),
          )
        ) {
          matchedValue = autofillMap[dataKey.toLowerCase()];
          break;
        }
      }

      if (!matchedValue) {
        for (const [dataKey, dataValue] of Object.entries(autofillMap)) {
          if (fieldLabel.includes(dataKey) || dataKey.includes(fieldLabel)) {
            matchedValue = dataValue;
            break;
          }
        }
      }

      if (matchedValue) {
        mappedData[field.label] = matchedValue;
        setAutoFilledFields((prev) => ({
          ...prev,
          [field.label]: {
            value: matchedValue,
            timestamp: new Date().toISOString(),
          },
        }));
      }
    });

    return mappedData;
  };

  // Apply Autofill to Form
  const applyAutoFill = (dataToApply = null) => {
    const data = dataToApply || autoFillData;
    if (!data || !formData) return;

    const newFormValues = { ...formValues };
    const mappedData = mapAutoFillDataToForm(data, formData.fieldsList || []);
    const newHighlightedFields = {};

    Object.keys(mappedData).forEach((formKey) => {
      if (mappedData[formKey]) {
        newFormValues[formKey] = mappedData[formKey];
        newHighlightedFields[formKey] = true;
      }
    });

    setFormValues(newFormValues);
    setHighlightedFields(newHighlightedFields);

    setTimeout(() => {
      setHighlightedFields({});
    }, 3000);

    setShowAutoFillModal(false);
    showToast(
      `Auto-filled ${Object.keys(mappedData).length} fields successfully!`,
      "success",
      3000,
    );

    const history = JSON.parse(
      localStorage.getItem("placementAutofillHistory") || "[]",
    );
    const updatedHistory = history.map((item) => {
      if (item.timestamp === autoFillTimestamp) {
        return { ...item, applied: true, appliedAt: new Date().toISOString() };
      }
      return item;
    });
    localStorage.setItem(
      "placementAutofillHistory",
      JSON.stringify(updatedHistory),
    );
  };

  // Apply from History
  const applyFromHistory = (historyItem) => {
    applyAutoFill(historyItem.data);
    showToast("Applied autofill from history", "info", 3000);
  };

  // Clear Autofill Data
  const clearAutoFillData = () => {
    localStorage.removeItem("placementAutofillData");
    localStorage.removeItem("placementAutofillTimestamp");
    showToast("Autofill data cleared successfully", "info", 3000);
    setAutoFillData(null);
    setAutoFillTimestamp(null);
    setAutoFilledFields({});
  };

  // Fetch Autofill Details from API
  const fetchAutoFillDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }
      const response = await fetch(
        `${apiUrl}/placement-preparation/autofill-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token: token, // ✅ sending token in body
          }),
        },
      );
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch autofill details");
      }

      if (data.success && data.data) {
        setAutoFillData(data.data);
        storeAutoFillData(data.data, "api");

        if (formData && formData.fieldsList) {
          const matchedData = mapAutoFillDataToForm(
            data.data,
            formData.fieldsList,
          );
          const hasMatches = Object.keys(matchedData).length > 0;

          if (hasMatches) {
            setShowAutoFillModal(true);
            showToast(
              "We found your saved details! Would you like to auto-fill?",
              "info",
              5000,
            );
          }
        }
      }
    } catch (error) {
      showToast(error.message || "Autofill failed", "error", 4000);
    }
  };

  // ==================== FORM FETCHING ====================
// Add this after toPascalCaseWithSpaces or wherever you keep your helpers
const getKeyFromLabel = (label) => {
  const map = {
    'Name': 'name',
    'Email': 'email',
    'Phone': 'phone',
    'Registration Number': 'registrationnumber',
    'Courses': 'courses',
  };
  return map[label] || label.toLowerCase().replace(/\s/g, '');
};
  useEffect(() => {
    if (!urlid) return;

    const fetchForm = async () => {
      try {
        const res = await fetch(`${apiUrl}/placement-preparation/forms/${urlid}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || "No more accepting the registrations");
        }

        const data = await res.json();
        const rawData = data?.data;
        if (rawData?.fieldsList) {
          // Normalize each field: add 'key' and 'uuid'
          const normalizedFields = rawData.fieldsList.map((field, index) => ({
            ...field,
            key: getKeyFromLabel(field.label),
            uuid: field.uuid || `field-${index}`,
          }));
          setFormData({ ...rawData, fieldsList: normalizedFields });
        } else {
          setFormData(rawData);
        }
        validateFormWindow(data);
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          formActive: false,
          message: error?.message || "No more accepting the registrations",
        }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchForm();
  }, [urlid]);

  // ==================== OTP TIMER ====================

  useEffect(() => {
    if (otpStatus.timer <= 0) return;

    const interval = setInterval(() => {
      setOtpStatus((prev) => ({
        ...prev,
        timer: prev.timer - 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpStatus.timer]);

  // useEffect(() => {
  //   if (otpModal.open) {
  //     setTimeout(() => {
  //       otpRefs.current[0]?.focus();
  //     }, 100);
  //   }
  // }, [otpModal.open]);
  // ==================== INITIALIZE FORM VALUES ====================

 useEffect(() => {
  if (!formData) return;

  const stored = localStorage.getItem("verifiedUserData");
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored)?.data;
    if (!parsed) return;

    const mapped = mapUserDataToFormFields(parsed, formData.fieldsList);

    setFormValues((prev) => ({
      ...prev,
      ...mapped,
    }));
  } catch (err) {
    // Mapping error silently handled
  }
}, [formData]);
  // ==================== FORM VALIDATION ====================

  const validateFormWindow = (data) => {
    const formRecord = data?.data;

    // Check if form is inactive
    const isInactive =
      formRecord?.isActive === 0 ||
      formRecord?.isActive === false ||
      formRecord?.isActive === "0" ||
      formRecord?.status === false ||
      formRecord?.status === "inactive";

    if (isInactive) {
      setStatus((prev) => ({
        ...prev,
        formActive: false,
        message: "No more accepting the registrations",
      }));
      return;
    }

    const today = new Date();
    const start = formRecord?.activeFrom ? new Date(formRecord.activeFrom) : null;
    const end = formRecord?.activeTo ? new Date(formRecord.activeTo) : null;

    if (start && !isNaN(start.getTime()) && today < start) {
      setStatus((prev) => ({
        ...prev,
        formActive: false,
        message: `Form opens on ${start.toDateString()}`,
      }));
      return;
    }

    if (end && !isNaN(end.getTime()) && today > end) {
      setStatus((prev) => ({
        ...prev,
        formActive: false,
        message: "No more accepting the registrations",
      }));
      return;
    }

    setStatus((prev) => ({ ...prev, formActive: true }));
  };

  // ==================== EMAIL VALIDATION ====================

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ==================== SEND OTP ====================

  const sendOTP = async (email) => {
    setEmailInputError("");
    setOtpStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      let hs = handshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(apiUrl);
        setHandshakeData(hs);
      }

      const clientHash = await computeDynamicClientHash(
        email.trim().toLowerCase(),
        hs.timestamp,
        hs.handshakeId
      );

      const response = await fetch(`${apiUrl}/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          recaptchaToken: emailCaptchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash,
          website_verification_code: emailHoneypot || "",
          isAutofill: true,
          formId: urlid,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpVerificationData({
        email: email.trim().toLowerCase(),
        token: data.token,
      });

      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        timer: 60,
        resentCount: prev.resentCount + 1,
      }));
      setOtp(["", "", "", "", "", ""]);
      setEnteredOtp("");
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
      setOtpModal({ open: true, email: email.trim().toLowerCase() });

      showToast(`OTP sent to ${email}`, "info", 3000);
    } catch (error) {
      const errMsg = error.message || "Failed to send OTP. Please try again.";
      setEmailInputError(errMsg);
      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        error: errMsg,
      }));
      showToast(errMsg, "error", 4000);
    } finally {
      try {
        emailRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }
      setEmailCaptchaToken(null);
    }
  };

  // ==================== VERIFY OTP ====================
  useEffect(() => {
    if (formData?.fieldsList) {
      // Validate all fields have required properties
      const invalidFields = formData.fieldsList.filter((field) => !field.key);
      if (invalidFields.length > 0) {
        showToast("Form configuration error. Please contact support.", "error");
      }
    }
  }, [formData]);


  const verifyOTP = async (autoSubmit = false, otpOverride = null) => {
    const finalOtp = otpOverride || enteredOtp || otp.join("");

    if (finalOtp.length !== 6) {
      if (!autoSubmit) {
        setOtpStatus((prev) => ({
          ...prev,
          error: "Please enter 6-digit OTP",
        }));
      }
      return;
    }

    setOtpStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const email = (otpVerificationData.email || otpModal.email).trim().toLowerCase();
      const response = await fetch(`${apiUrl}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: finalOtp,
          token: otpVerificationData.token,
          isAutofill: true,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error. Please try again later.");
      }

      // Safely parse JSON (catch parse error)
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Invalid OTP");
      }

      // Store verified user data in state and localStorage
      if (data.data) {
        setVerifiedUserData(data.data);
        storeVerifiedUserData(data.data);

        if (formData?.fieldsList) {
          const mapped = mapUserDataToFormFields(
            data.data,
            formData.fieldsList,
          );

          setFormValues((prev) => ({
            ...prev,
            ...mapped,
          }));
        }
      }

      setOtpStatus((prev) => ({ ...prev, loading: false, verified: true }));
      showToast("Email verified successfully!", "success", 3000);

      // Close modal and show form
      setTimeout(() => {
        setOtpModal({ open: false, email: "" });
        setOtp(["", "", "", "", "", ""]);
        setEnteredOtp("");
        setOtpStatus({
          loading: false,
          verified: false,
          error: "",
          resentCount: 0,
          timer: 0,
        });

        // Set email as verified and show the form
        setIsEmailVerified(true);
        setShowEmailInput(false);
      }, 1000);
    } catch (error) {
      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Invalid OTP. Please try again.",
      }));
      showToast(error.message || "Invalid OTP", "error", 4000);
    }
  };

  // ==================== RESEND OTP ====================

  const resendOTP = async () => {
    if (otpStatus.timer > 0 || otpStatus.loading) return;

    if (!resendCaptchaToken) {
      showToast("Please check 'I am not a robot' to resend OTP", "warning", 3000);
      return;
    }

    setOtpStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      let hs = resendHandshakeData;
      if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
        hs = await fetchOtpHandshake(apiUrl);
        setResendHandshakeData(hs);
      }

      const email = (otpVerificationData.email || otpModal.email).trim().toLowerCase();
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
          website_verification_code: emailHoneypot || "",
          isAutofill: true,
          formId: urlid,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setOtpVerificationData((prev) => ({
        ...prev,
        token: data.token,
      }));

      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        timer: 60,
        resentCount: prev.resentCount + 1,
      }));
      setOtp(["", "", "", "", "", ""]);
      setEnteredOtp("");
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
      try {
        modalRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }

      showToast("OTP resent successfully!", "info", 3000);
    } catch (error) {
      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to resend OTP",
      }));
      showToast(error.message || "Failed to resend OTP", "error", 4000);
    }
  };

  // ==================== HANDLE EMAIL SUBMIT ====================

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (emailHoneypot && emailHoneypot.trim().length > 0) {
      showToast(`OTP sent to ${emailForVerification}`, "info", 3000);
      return;
    }
    if (!validateEmail(emailForVerification)) {
      setEmailInputError("Please enter a valid email address");
      showToast("Please enter a valid email address", "warning", 3000);
      return;
    }
    if (!emailCaptchaToken) {
      setEmailInputError("Please click 'I'm not a robot' before requesting OTP.");
      showToast("Please click 'I'm not a robot' before requesting OTP.", "warning", 3000);
      return;
    }
    setEmailInputError("");
    sendOTP(emailForVerification);
  };

  // ==================== HANDLE OTP INPUT CHANGE ====================
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
      if (digits.length === 6) {
        verifyOTP(true, digits.join(""));
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);
    setEnteredOtp(newOtp.join(""));

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      verifyOTP(true, newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split("");
    const newOtp = ["", "", "", "", "", ""];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    setEnteredOtp(newOtp.join(""));
    const nextIdx = Math.min(digits.length, 5);
    otpInputRefs.current[nextIdx]?.focus();
    if (digits.length === 6) {
      verifyOTP(true, newOtp.join(""));
    }
  };

  // // Focus on the next empty field or last field
  // const nextIndex = Math.min(pasteArray.length, 5);
  // otpRefs.current[nextIndex]?.focus();

  // ==================== INPUT HANDLER ====================

  // const handleChange = (key, label, value) => {
  //   let updatedValue = value;

  //   // Phone validation
  //   if (
  //     label === "Phone Number" ||
  //     label.toLowerCase().includes("phone") ||
  //     label.toLowerCase().includes("mobile")
  //   ) {
  //     updatedValue = value.replace(/\D/g, "").slice(0, 10);

  //     if (updatedValue && updatedValue.length > 0) {
  //       if (!/^[6-9]/.test(updatedValue)) {
  //         setErrors((prev) => ({
  //           ...prev,
  //           [label]: "Must start with 6,7,8, or 9",
  //         }));
  //       } else if (updatedValue.length !== 10) {
  //         setErrors((prev) => ({
  //           ...prev,
  //           [label]:
  //             updatedValue.length < 10 ? "Must be exactly 10 digits" : "",
  //         }));
  //       } else {
  //         setErrors((prev) => ({ ...prev, [label]: "" }));
  //       }
  //     } else {
  //       setErrors((prev) => ({ ...prev, [label]: "" }));
  //     }
  //   }

  //   // Name validation
  //   if (label === "Name" || label.toLowerCase().includes("name")) {
  //     updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
  //     if (
  //       updatedValue &&
  //       updatedValue.length > 0 &&
  //       !/^[A-Za-z\s]+$/.test(updatedValue)
  //     ) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         [label]: "Only letters and spaces allowed",
  //       }));
  //     } else {
  //       setErrors((prev) => ({ ...prev, [label]: "" }));
  //     }
  //   }

  //   // Registration Number validation
  //   if (
  //     label === "Registration Number" ||
  //     label.toLowerCase().includes("registration")
  //   ) {
  //     updatedValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  //     if (
  //       updatedValue &&
  //       updatedValue.length > 0 &&
  //       !/^[A-Z0-9]+$/.test(updatedValue)
  //     ) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         [label]: "Only letters and numbers allowed",
  //       }));
  //     } else {
  //       setErrors((prev) => ({ ...prev, [label]: "" }));
  //     }
  //   }

  //   setFormValues((prev) => ({
  //     ...prev,
  //     [key]: updatedValue,
  //   }));

  //   if (highlightedFields[label]) {
  //     setHighlightedFields((prev) => ({ ...prev, [label]: false }));
  //   }
  // };
  const handleChange = (key, value) => {
    let updatedValue = value;
    const newErrors = { ...errors };

    const keyLower = key.toLowerCase();

    // Phone validation
    if (keyLower.includes("phone") || keyLower.includes("mobile")) {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);

      if (updatedValue) {
        const phoneCheck = validateIndianMobileNumber(updatedValue);
        if (!phoneCheck.valid) {
          newErrors[key] = phoneCheck.message;
        } else {
          delete newErrors[key];
        }
      } else {
        delete newErrors[key];
      }
    }

    // Email validation
    if (keyLower.includes("email")) {
      if (updatedValue && !validateEmail(updatedValue)) {
        newErrors[key] = "Please enter a valid email address";
      } else {
        delete newErrors[key];
      }
    }

    // Name validation
    if (keyLower.includes("name")) {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "");

      if (updatedValue && !/^[A-Za-z\s]+$/.test(updatedValue)) {
        newErrors[key] = "Only letters and spaces allowed";
      } else {
        delete newErrors[key];
      }
    }

    setFormValues((prev) => ({
      ...prev,
      [key]: updatedValue,
    }));

    setErrors(newErrors);
  };

  const handleBlur = (field) => {
    const value = formValues[field.key];

    if (field.required && (!value || value.trim() === "")) {
      setErrors((prev) => ({
        ...prev,
        [field.key]: `${field.label} is required`,
      }));
    }
  };

  // ==================== FORM VALIDATION ====================

  const validateForm = () => {
    const newErrors = {};

    formData?.fieldsList?.forEach((field) => {
      const value = formValues[field.key];
      const label = field.label;
      const labelLower = label.toLowerCase();

      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      // ✅ ONLY validate required fields
      if (field.required && isEmpty) {
        newErrors[field.key] = `${label} is required`;
        return;
      }

      // ✅ Skip further validation if empty and not required
      if (isEmpty) return;

      // Email validation
      if (labelLower.includes("email")) {
        if (!validateEmail(value)) {
          newErrors[field.key] = "Please enter a valid email address";
        }
      }

      // Phone validation
      if (labelLower.includes("phone") || labelLower.includes("mobile")) {
        const phoneCheck = validateIndianMobileNumber(value);
        if (!phoneCheck.valid) {
          newErrors[field.key] = phoneCheck.message;
        }
      }

      // Name validation
      // if (labelLower.includes("name")) {
      //   if (!/^[A-Za-z\s]+$/.test(value)) {
      //     newErrors[field.key] = "Only letters and spaces allowed";
      //   }
      // }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== SUBMIT HANDLER ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors before submitting", "error", 3000);
      return;
    }

    setStatus((prev) => ({ ...prev, submitting: true }));

    const payload = {
      answers: { ...formValues },
      formUuid: formData?.uuid,
    };

    if (voucherCode) {
      payload.registrationNumber = voucherCode;
    }
    if (crmSourceId) {
      payload.source = crmSourceId;
    }

    try {
      const res = await fetch(`${apiUrl}/placement-preparation/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let errorData;
      if (!res.ok) {
        try {
          errorData = await res.json();
        } catch {
          // ignore
        }
      }

      if (res?.status === 400) {
        if (errorData?.message?.toLowerCase().includes("already registered")) {
          setStatus((prev) => ({ ...prev, alreadyRegistered: true }));
          showToast("This email is already registered", "error", 4000);
        } else {
          setStatus((prev) => ({
            ...prev,
            message:
              errorData?.message ||
              "Validation failed. Please check your inputs.",
          }));
          showToast(errorData?.message || "Validation failed", "error", 4000);
        }
        return;
      }

      if (!res.ok) {
        throw new Error(errorData?.message || "Submission failed");
      }
      localStorage.removeItem("verifiedUserData");
      setStatus((prev) => ({ ...prev, submitted: true }));
      showToast("Registration submitted successfully!", "success", 5000);
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        message: err.message || "Submission failed",
      }));
      showToast(err.message || "Submission failed", "error", 4000);
    } finally {
      setStatus((prev) => ({ ...prev, submitting: false }));
    }
  };

  // ==================== AUTO FILL MODAL COMPONENT ====================

  const renderAutoFillModal = () => {
    if (!showAutoFillModal || !autoFillData) return null;

    const getTimeAgo = (timestamp) => {
      if (!timestamp) return "";
      const now = new Date();
      const then = new Date(timestamp);
      const diffMins = Math.floor((now - then) / 60000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      return then.toLocaleDateString();
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Auto-fill Your Details
              </h3>
            </div>
            <button
              onClick={skipAutoFill}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              We found your existing information. Would you like to auto-fill
              the form with your details?
            </p>

            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <div className="space-y-2 text-sm">
                {autoFillData.name && (
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{autoFillData.name}</span>
                  </div>
                )}
                {autoFillData.email && (
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{autoFillData.email}</span>
                  </div>
                )}
                {autoFillData.phone && (
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{autoFillData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={applyAutoFill}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Auto-fill Form
              </button>
              <button
                onClick={skipAutoFill}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Skip
              </button>
            </div>

            <button
              onClick={() => setShowAutoFillHistory(true)}
              className="mt-3 w-full text-center text-xs text-blue-600 hover:text-blue-700"
            >
              View autofill history
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== AUTO FILL HISTORY MODAL ====================

  const renderAutoFillHistoryModal = () => {
    if (!showAutoFillHistory) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Autofill History</h3>
            </div>
            <button
              onClick={() => setShowAutoFillHistory(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {autoFillHistory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No autofill history found
              </p>
            ) : (
              <div className="space-y-3">
                {autoFillHistory.map((item, index) => (
                  <div
                    key={item.id || `history-${index}-${item.timestamp}`}
                    className="border rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      {item.applied && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          Applied
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      {item.data.name && <div>Name: {item.data.name}</div>}
                      {item.data.email && <div>Email: {item.data.email}</div>}
                    </div>
                    <button
                      onClick={() => {
                        applyFromHistory(item);
                        setShowAutoFillHistory(false);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Apply this data
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <button
              onClick={clearAutoFillData}
              className="w-full text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Autofill Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== OTP MODAL COMPONENT ====================

  const renderOTPSection = () => {

    if (!otpModal.open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Verify Your Email</h3>
            </div>
            <button
              onClick={() => {
                setOtpModal({ open: false, email: "" });
                setOtp(["", "", "", "", "", ""]);
                setEnteredOtp("");
                setOtpStatus({
                  loading: false,
                  verified: false,
                  error: "",
                  resentCount: 0,
                  timer: 0,
                });
                setResendCaptchaToken(null);
                setResendHandshakeData(null);
                if (autoSubmitTimeoutRef.current)
                  clearTimeout(autoSubmitTimeoutRef.current);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                We&apos;ve sent a 6-digit verification code to{" "}
                <span className="font-semibold">
                  {otpModal.email || otpVerificationData?.email}
                </span>
              </p>
            </div>

            {/* 6-digit OTP input boxes */}
            <div className="flex justify-center space-x-2 my-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  name={`otp-${index}`}
                  maxLength={6}
                  value={digit}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  disabled={otpStatus?.loading}
                  className="w-11 h-12 sm:w-12 sm:h-12 text-center text-2xl font-bold border-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100"
                />
              ))}
            </div>

            {otpStatus?.error && (
              <div className="mb-4 mt-2 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{otpStatus?.error}</span>
              </div>
            )}

            {otpStatus.verified && (
              <div className="mb-4 mt-2 bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-md flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Email verified successfully! Loading form...</span>
              </div>
            )}

            {/* Modal ReCAPTCHA for Resend */}
            {otpStatus.timer === 0 && !otpStatus.verified && (
              <div className="my-4 flex justify-center scale-90 sm:scale-100">
                <ReCAPTCHA
                  ref={modalRecaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleResendCaptchaSuccess}
                  onExpired={handleResendCaptchaExpired}
                  onErrored={handleResendCaptchaError}
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={resendOTP}
                disabled={
                  otpStatus.timer > 0 ||
                  !resendCaptchaToken ||
                  otpStatus.loading ||
                  otpStatus.verified
                }
                className={`text-sm flex items-center gap-1 ${
                  otpStatus.timer > 0 || !resendCaptchaToken || otpStatus.verified
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                <RefreshCw
                  className={`h-3 w-3 ${otpStatus.loading ? "animate-spin" : ""}`}
                />
                Resend OTP {otpStatus.timer > 0 && `in ${otpStatus.timer}s`}
              </button>

              <button
                type="button"
                onClick={() => verifyOTP(false)}
                disabled={
                  otpStatus.loading ||
                  otpStatus.verified ||
                  (enteredOtp || otp.join("")).length !== 6
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {otpStatus.loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== EMAIL INPUT COMPONENT ====================

  // useEffect(() => {
  //   if (otpModal.open) {
  //     otpRefs.current[0]?.focus();
  //   }
  // }, [otpModal.open]);

  const renderEmailInputScreen = () => {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white text-center">
              <Mail className="h-12 w-12 mx-auto mb-3" />
              <h1 className="text-2xl font-bold">
                Email Verification Required
              </h1>
              <p className="mt-2 text-blue-100">
                Please verify your email to continue
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleEmailSubmit}>
                {/* Honeypot field */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', height: 0, width: 0, overflow: 'hidden' }} aria-hidden="true" tabIndex={-1}>
                  <label htmlFor="website_verification_code_student">Do not fill this</label>
                  <input
                    type="text"
                    id="website_verification_code_student"
                    name="website_verification_code"
                    value={emailHoneypot}
                    onChange={(e) => setEmailHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailForVerification}
                    onChange={(e) => {
                      setEmailForVerification(e.target.value);
                      if (emailInputError) setEmailInputError("");
                    }}
                    placeholder="Enter your email address"
                    className={`w-full h-11 px-3 text-sm rounded-md border ${
                      emailInputError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } focus:ring-1 outline-none transition-colors`}
                    autoFocus
                  />
                  {emailInputError ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                      <span>{emailInputError}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      We&apos;ll send a 6-digit OTP to verify your email{" "}
                    </p>
                  )}
                </div>

                {/* Google reCAPTCHA v2 Checkbox right above Send OTP button */}
                <div className="mb-4 flex justify-center scale-90 sm:scale-100">
                  <ReCAPTCHA
                    ref={emailRecaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleEmailCaptchaSuccess}
                    onExpired={handleEmailCaptchaExpired}
                    onErrored={handleEmailCaptchaError}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                  Send OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== TOAST NOTIFICATION COMPONENT ====================

  const renderToastNotification = () => {
    if (toastMessages.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toastMessages.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-50 border-l-4 border-green-500 text-green-800"
                : toast.type === "error"
                  ? "bg-red-50 border-l-4 border-red-500 text-red-800"
                  : toast.type === "warning"
                    ? "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800"
                    : "bg-blue-50 border-l-4 border-blue-500 text-blue-800"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="h-4 w-4" />}
            {toast.type === "error" && <AlertCircle className="h-4 w-4" />}
            {toast.type === "warning" && <AlertCircle className="h-4 w-4" />}
            {toast.type === "info" && <Info className="h-4 w-4" />}
            <span className="text-sm">{toast.message}</span>
          </div>
        ))}
      </div>
    );
  };

  // ==================== SKIP AUTO FILL ====================

  const skipAutoFill = () => {
    setShowAutoFillModal(false);
  };

  // ==================== CLEANUP ====================

 useEffect(() => {
  const timeoutId = autoSubmitTimeoutRef.current;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, []);

  const mapBackendToForm = (fieldsList, userData) => {
    const mappedValues = {};

    fieldsList?.forEach((field) => {
      mappedValues[field.key] = userData[field.key] || "";
    });

    return mappedValues;
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("verifiedUserData"));

    if (stored?.data) {
      const mapped = mapBackendToForm(formData?.fieldsList, stored.data);
      setFormValues(mapped);
    }
  }, [formData?.fieldsList,formData]);
  // ==================== Auto Mapping Student data ====================

  // useEffect(() => {
  //   const storedData = localStorage.getItem("verifiedUserData");
  //   if (!storedData) return;

  //   const parsed = JSON.parse(storedData);

  //   // Map localStorage keys → form field labels
  //   const mapping = {
  //     name: "Name",
  //     email: "Email",
  //     phone: "Phone",
  //     registrationnumber: "Registration Number",
  //     coursepackage: "Course Package",
  //     courses: "Courses",
  //     branch: "Branch",
  //   };

  //   const updatedValues = {};
  //   const autoFilled = {};
  //   const highlighted = {};

  //   Object.keys(mapping).forEach((key) => {
  //     const fieldLabel = mapping[key];

  //     if (parsed[key]) {
  //       updatedValues[fieldLabel] = parsed[key];
  //       autoFilled[fieldLabel] = true;
  //       highlighted[fieldLabel] = true;

  //       // remove highlight after animation
  //       setTimeout(() => {
  //         setHighlightedFields((prev) => ({
  //           ...prev,
  //           [fieldLabel]: false,
  //         }));
  //       }, 2000);
  //     }
  //   });

  //   setFormValues((prev) => ({ ...prev, ...updatedValues }));
  //   setAutoFilledFields(autoFilled);
  //   setHighlightedFields(highlighted);
  // }, []);

  // ==================== LOADING STATE ====================

  if (status?.loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== FORM UNAVAILABLE STATE ====================

  if (!status?.formActive) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 sm:p-10 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Registration Closed
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {status?.message || "No more accepting the registrations"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ALREADY REGISTERED STATE ====================

  if (status?.alreadyRegistered) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-12 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Already Registered
            </h2>
            <p className="text-gray-600">
              This email has already been used for registration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SUBMITTED STATE ====================

  if (status?.submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Registration Successful 🎉
            </h2>

            <p className="text-gray-600 mb-6">
              Thank you for registering for the batch! 🎉
              <br></br>
              The class joining link will be shared with you via WhatsApp and
              email. Stay tuned and get ready to begin your learning journey!
            </p>

            {/* WhatsApp Section */}
            {formData?.communityLink && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                {/* Label */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FaWhatsapp className="text-green-600 text-xl" />
                  <span className="font-medium text-green-700">
                    Join our WhatsApp Community
                  </span>
                </div>

                {/* Link + Copy */}
                <div className="flex items-center bg-white border rounded-md overflow-hidden">
                  {/* Clickable link */}
                  <a
                    href={formData.communityLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm text-blue-600 px-3 py-2 truncate hover:underline"
                  >
                    {formData.communityLink}
                  </a>

                  {/* Copy button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(formData.communityLink);
                      toast.success("Link copied!");
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition text-xs"
                  >
                    Copy
                  </button>
                </div>

                {/* Join button */}
                <a
                  href={formData.communityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition"
                >
                  <FaWhatsapp />
                  Join Now
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN FORM RENDER (Only after email verification) ====================

  // If email is not verified, show email input screen
  if (!isEmailVerified) {
    return (
      <>
        {renderToastNotification()}
        {renderOTPSection()}
        {renderEmailInputScreen()}
      </>
    );
  }

  // Show the actual form after email verification
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">
      {renderToastNotification()}
      {renderAutoFillModal()}
      {renderAutoFillHistoryModal()}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">
                  {toPascalCaseWithSpaces(formData?.registrationformname)}
                </h1>
                {formData?.description && (
                  <p className="mt-1 text-sm text-blue-100">
                    {formData.description}
                  </p>
                )}
              </div>
              <div className="text-xs text-blue-200 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified: {emailForVerification}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.fieldsList?.map((field) => {
                if (!field || !field.key) {
                  return null;
                }

                const value = formValues[field.key];
                const isEmail =
                  field.key?.toLowerCase().includes("email") || false;
                const isPhone =
                  field.key?.toLowerCase().includes("phone") ||
                  field.key?.toLowerCase().includes("mobile") ||
                  false;
                const isFullWidth =
                  field.type === "textarea" || field.type === "multiselect";

                const isAutoFilled = autoFilledFields[field.key];
                const isHighlighted = highlightedFields[field.key];

                return (
                  <div
                    key={field.uuid || field.key}
                    className={`flex flex-col gap-1 ${
                      isFullWidth ? "md:col-span-2" : ""
                    } ${isHighlighted ? "animate-highlight" : ""}`}
                  >
                    {/* Label */}
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 flex-wrap">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}

                      {/* {isAutoFilled && (
                        <span className="text-xs text-blue-600 inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                          <Sparkles className="h-3 w-3" />
                          Auto-filled
                        </span>
                      )} */}
                    </label>

                    {/* Select */}
                    {field.type === "select" && (
                      <select
                        value={value || ""}
                        onChange={(e) =>
                          handleChange(field.key, e.target.value)
                        }
                        onBlur={() => handleBlur(field)}
                        disabled={!field.editable}
                        className={`w-full h-10 px-3 text-sm rounded-md border ${
                          errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${
                          isAutoFilled ? "bg-blue-50 border-blue-300" : ""
                        }`}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Multi Select */}
                    {field.type === "multiselect" && (
                      <select
                        multiple
                        value={value || []}
                        onChange={(e) =>
                          handleChange(
                            field.key,
                            Array.from(
                              e.target.selectedOptions,
                              (o) => o.value,
                            ),
                          )
                        }
                        onBlur={() => handleBlur(field)}
                        disabled={!field.editable}
                        className={`w-full h-20 px-2 py-1 text-sm rounded-md border ${
                          errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none ${
                          isAutoFilled ? "bg-blue-50" : ""
                        }`}
                      >
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Textarea */}
                    {field.type === "textarea" && (
                      <textarea
                        value={value || ""}
                        placeholder={
                          field.description ||
                          `Enter ${field.label.toLowerCase()}`
                        }
                        onChange={(e) =>
                          handleChange(field.key, e.target.value)
                        }
                        onBlur={() => handleBlur(field)}
                        rows={3}
                        disabled={!field.editable}
                        className={`w-full px-3 py-2 text-sm rounded-md border ${
                          errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${
                          isAutoFilled ? "bg-blue-50 border-blue-300" : ""
                        }`}
                      />
                    )}

                    {/* Input */}
                    {!["select", "multiselect", "textarea"].includes(
                      field.type,
                    ) && (
                      <div className="relative">
                        <input
                          type={
                            isEmail
                              ? "email"
                              : isPhone
                                ? "tel"
                                : field.type || "text"
                          }
                          value={value || ""}
                          placeholder={
                            field.description ||
                            `Enter ${field.label.toLowerCase()}`
                          }
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                          onBlur={() => handleBlur(field)}
                          disabled={
                            !field.editable || (isEmail && isEmailVerified)
                          }
                          className={`w-full h-10 px-3 text-sm rounded-md border ${
                            errors[field.key]
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${
                            isAutoFilled ? "bg-blue-50 border-blue-300" : ""
                          }`}
                        />
                      </div>
                    )}

                    {/* Error */}
                    {errors[field.key] && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors[field.key]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Global Error */}
            {status?.message && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{status?.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-5">
              <button
                type="submit"
                disabled={status?.submitting}
                className={`w-full flex items-center justify-center text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-md transition-all transform hover:scale-[1.02] ${
                  status?.submitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                {status?.submitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Register
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>
        {`
          @keyframes highlight {
            0% {
              background-color: transparent;
            }
            50% {
              background-color: rgba(59, 130, 246, 0.1);
            }
            100% {
              background-color: transparent;
            }
          }

          .animate-highlight {
            animation: highlight 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
}
