"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  Mail,
  X,
  RefreshCw,
  Save,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import ReCAPTCHA from "react-google-recaptcha";
import {
  RECAPTCHA_SITE_KEY,
  sanitizeMobileNumber,
  validateIndianMobileNumber,
  fetchOtpHandshake,
  computeDynamicClientHash,
} from "@/lib/otpSecurity";

const apiUrl = process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL;

export default function RegistrationForm() {
  const { uuid } = useParams();
  const searchParams = useSearchParams();

  const voucherCode = searchParams.get("voucherCode");
  const crmSourceId = searchParams.get("crmSourceId");

  // Email verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailFieldKey, setEmailFieldKey] = useState("");
  const [branches, setBranches] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  // Store OTP verification data
  const [otpVerificationData, setOtpVerificationData] = useState({
    token: "",
    email: "",
  });

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

  // OTP States
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const otpInputRefs = useRef([]);
  const [isVerifyingAndSubmitting, setIsVerifyingAndSubmitting] = useState(false);
  const [otpStatus, setOtpStatus] = useState({
    loading: false,
    verified: false,
    error: "",
    timer: 0,
  });

  // Security & Protection States
  const recaptchaRef = useRef(null);
  const modalRecaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [handshakeData, setHandshakeData] = useState(null);
  const [resendCaptchaToken, setResendCaptchaToken] = useState(null);
  const [resendHandshakeData, setResendHandshakeData] = useState(null);
  const [honeypotValue, setHoneypotValue] = useState("");

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

  const handleOtpDigitChange = (index, val) => {
    const sanitized = val.replace(/\D/g, "");
    if (!sanitized) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    if (sanitized.length > 1) {
      const digits = sanitized.slice(0, 6).split("");
      const updated = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = sanitized[0];
    setOtpDigits(updated);
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const updated = Array(6).fill("");
    pasted.split("").forEach((ch, i) => {
      updated[i] = ch;
    });
    setOtpDigits(updated);
    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // UI States
  const [toastMessages, setToastMessages] = useState([]);

  // ==================== HELPER FUNCTIONS ====================

  const toPascalCaseWithSpaces = (str) => {
    if (!str) return "";
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  };

  const showToast = (message, type = "info", duration = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToastMessages((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToastMessages((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  // ==================== FORM FETCHING ====================

  useEffect(() => {
    if (!uuid) return;

    const fetchForm = async () => {
      try {
        const res = await fetch(`${apiUrl}/demo-enrollment/forms/${uuid}`);
        if (!res.ok) throw new Error();

        const data = await res.json();

        // Flatten fieldsList array
        if (data?.data?.fieldsList) {
          const flattenedFields = data.data.fieldsList.flat();
          data.data.fieldsList = flattenedFields;
        }

        // Merge customFields with fieldsList
        if (data?.data?.customFields && data.data.customFields.length > 0) {
          const customFieldsMapped = data.data.customFields.map((field) => ({
            label: field.label || field.title || toPascalCaseWithSpaces(field.key),
            key: field.key,
            type: field.type,
            required: field.mandatory || false,
            options: field.options,
            description: field.description || field.title || field.label,
            isCustom: true,
          }));
          data.data.fieldsList = [
            ...data.data.fieldsList,
            ...customFieldsMapped,
          ];
        }
        data.data.fieldsList.push({
          label: "Branch",
          key: "branchId",
          type: "select",
          required: true,
        });

        data.data.fieldsList.push({
          label: "Course Name",
          key: "courseName",
          type: "text",
          required: true,
          editable: false,
        });

        data.data.fieldsList.push({
          label: "Available Dates",
          key: "selectedDate",
          type: "select",
          required: true,
        });
        data.data.fieldsList.push({
          label: "Counsellor",
          key: "counsellorId",
          type: "select",
          required: true,
          options:
            data.data.counsellors?.map((c) => ({
              value: c.id,
              label: c.name,
            })) || [],
        });
        setFormData(data?.data);
        validateFormWindow(data);

        // Find email field key
        const emailField = data?.data?.fieldsList?.find(
          (field) =>
            field.type === "email" ||
            field.key?.toLowerCase().includes("email"),
        );
        if (emailField) {
          setEmailFieldKey(emailField.key);
        }

        setStatus((prev) => ({ ...prev, loading: false }));
      } catch {
        setStatus((prev) => ({
          ...prev,
          message: "Failed to load form",
        }));
        setStatus((prev) => ({ ...prev, loading: false }));
        branchId;
      }
    };

    fetchForm();
  }, [uuid]);

  // ==================== INITIALIZE FORM VALUES ====================

  useEffect(() => {
    if (!formData) return;

    const savedData = localStorage.getItem(`form_${uuid}`);
    let initialValues = {};

    // 1. Build defaults
    formData.fieldsList.forEach((field) => {
      if (!field.key) return;
      initialValues[field.key] = field.type === "multiselect" ? [] : "";
    });

    // 2. Override system values
    initialValues.courseName = formData?.curriculumId?.name || "";
    initialValues.branchId = formData?.branchId?.id || "";
    initialValues.batchId = formData?.batchId?.id || "";
    initialValues.counsellorId = "";

    // 3. If saved data exists → restore
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        initialValues = {
          ...initialValues,
          ...parsed.formValues,
        };

        setIsEmailVerified(parsed.isEmailVerified || false);
      } catch (err) {
        // Stored form state restore error silently handled
      }
    }

    setFormValues(initialValues);
  }, [formData, uuid]);
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


  // ==================== batches by brach id  ====================

  // ==================== dates selection ====================

  useEffect(() => {
    if (!formValues.batchId) return;

    const fetchDates = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/batch/getavailabledates/${formValues.batchId}`,
        );
        const data = await res.json();

        if (data?.data) {
          setAvailableDates(data.data);
        }
      } catch (err) {
        // Available dates fetch error silently handled
      }
    };

    fetchDates();
  }, [formValues.batchId]);

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      selectedDate: "",
    }));
  }, [formValues.batchId]);

  // ==================== FORM VALIDATION ====================

  const validateFormWindow = (data) => {
    const today = new Date();
    const start = new Date(data?.data?.activeFrom);
    const end = new Date(data?.data?.activeTo);

    if (today >= start && today <= end) {
      setStatus((prev) => ({ ...prev, formActive: true }));
    } else if (today < start) {
      setStatus((prev) => ({
        ...prev,
        message: `Form opens on ${start.toDateString()}`,
      }));
    } else {
      setStatus((prev) => ({
        ...prev,
        message: "Registration closed",
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ==================== SEND OTP ====================

  const sendOTP = async (email) => {
    setOtpStatus((prev) => ({ ...prev, loading: true, error: "" }));
    setStatus((prev) => ({ ...prev, submitting: true }));

    try {
      let hs = handshakeData;
      if (!hs) {
        hs = await fetchOtpHandshake(apiUrl);
        setHandshakeData(hs);
      }

      const clientHash = await computeDynamicClientHash(
        email.trim().toLowerCase(),
        hs.timestamp,
        hs.handshakeId
      );

      const res = await fetch(`${apiUrl}/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          recaptchaToken: captchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash,
          website_verification_code: honeypotValue || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Store token and email
      setOtpVerificationData({
        email: email.trim().toLowerCase(),
        token: data.token,
      });

      setOtpDigits(Array(6).fill(""));
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
      setOtpStatus({
        loading: false,
        verified: false,
        error: "",
        timer: data.resendAfter || 60,
      });

      setShowOtpModal(true);
      showToast(`Verification code sent to ${email}`, "info");
      setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
    } catch (err) {
      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
      showToast(err.message || "Failed to send OTP", "error");
      setCaptchaToken(null);
      setHandshakeData(null);
      try {
        recaptchaRef.current?.reset();
      } catch {
        // ignore
      }
    } finally {
      setStatus((prev) => ({ ...prev, submitting: false }));
    }
  };

  // ==================== VERIFY OTP & SUBMIT REGISTRATION ====================

  const verifyAndSubmit = async () => {
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setOtpStatus((prev) => ({
        ...prev,
        error: "Please enter the complete 6-digit OTP",
      }));
      return;
    }

    setIsVerifyingAndSubmitting(true);
    setOtpStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      // 1. Verify OTP with teksapi
      let phoneValue = "";
      Object.entries(formValues).forEach(([k, v]) => {
        const kLower = k.toLowerCase();
        if ((kLower.includes("phone") || kLower.includes("mobile")) && v) {
          phoneValue = v;
        }
      });

      const verifyRes = await fetch(`${apiUrl}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpVerificationData.email,
          otp: fullOtp,
          token: otpVerificationData.token,
          phone: phoneValue,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || "Invalid OTP code");
      }

      setIsEmailVerified(true);

      // 2. Submit the registration form
      const payload = {
        ...buildPayload(),
        recaptchaToken: captchaToken || "",
        website_verification_code: honeypotValue || "",
      };

      const regRes = await fetch(`${apiUrl}/demo-enrollment/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regData.message || "Registration submission failed");
      }

      // 3. Clear draft & security state
      localStorage.removeItem(`form_${uuid}`);
      setShowOtpModal(false);
      setCaptchaToken(null);
      setHandshakeData(null);
      setHoneypotValue("");
      try {
        recaptchaRef.current?.reset();
      } catch {
        // ignore
      }

      setStatus((prev) => ({
        ...prev,
        submitted: true,
        submitting: false,
      }));

      showToast("Registration submitted successfully!", "success", 5000);
    } catch (err) {
      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Verification failed",
      }));
      showToast(err.message || "Verification failed", "error", 4000);
    } finally {
      setIsVerifyingAndSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (otpStatus.timer > 0 || otpStatus.loading) return;

    if (!resendCaptchaToken) {
      showToast("Please check 'I am not a robot' to resend OTP", "error");
      return;
    }

    setOtpStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      let hs = resendHandshakeData;
      if (!hs) {
        hs = await fetchOtpHandshake(apiUrl);
        setResendHandshakeData(hs);
      }

      const email = otpVerificationData.email;
      const clientHash = await computeDynamicClientHash(
        email.trim().toLowerCase(),
        hs.timestamp,
        hs.handshakeId
      );

      const res = await fetch(`${apiUrl}/otp/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: otpVerificationData.token,
          recaptchaToken: resendCaptchaToken,
          handshakeId: hs.handshakeId,
          timestamp: hs.timestamp,
          signature: hs.signature,
          clientHash,
          website_verification_code: honeypotValue || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Resend failed");
      }

      setOtpVerificationData((prev) => ({
        ...prev,
        token: data.token,
      }));

      setOtpDigits(Array(6).fill(""));
      setResendCaptchaToken(null);
      setResendHandshakeData(null);
      try {
        modalRecaptchaRef.current?.reset();
      } catch {
        // ignore
      }

      setOtpStatus({
        loading: false,
        verified: false,
        error: "",
        timer: data.resendAfter || 60,
      });

      showToast("OTP resent successfully!", "success");
      setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
    } catch (err) {
      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
      showToast(err.message || "Failed to resend OTP", "error");
    }
  };

  // ==================== INPUT HANDLER ====================
  const [selectedSlot, setSelectedSlot] = useState();
  const handleChange = (key, value) => {
    if (key === emailFieldKey) {
      setIsEmailVerified(false);
    }
    if (key === "selectedDate") {
      const selectedSlotData = availableDates.filter(
        (item) => item.date == value,
      );
      setSelectedSlot(selectedSlotData?.[0] || {});
    }
    let updatedValue = value;
    const newErrors = { ...errors };

    const keyLower = key.toLowerCase();

    if (keyLower.includes("phone") || keyLower.includes("mobile")) {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);

      if (updatedValue) {
        const mobCheck = validateIndianMobileNumber(updatedValue);
        if (!mobCheck.valid) {
          newErrors[key] = mobCheck.message;
        } else {
          delete newErrors[key];
        }
      } else {
        delete newErrors[key];
      }
    }

    if (keyLower.includes("email")) {
      if (updatedValue && !validateEmail(updatedValue)) {
        newErrors[key] = "Please enter a valid email address";
      } else {
        delete newErrors[key];
      }
    }

    if (keyLower.includes("name")) {
      if (value && !/^[A-Za-z\s]*$/.test(value)) {
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

  //   const handleEmailBlur = () => {
  //     const email = formValues[emailFieldKey];
  //     if (email && validateEmail(email) && !isEmailVerified) {
  //       sendOTP(email);
  //     }
  //   };
  useEffect(() => {
    if (!formValues || Object.keys(formValues).length === 0) return;

    localStorage.setItem(
      `form_${uuid}`,
      JSON.stringify({
        formValues,
        isEmailVerified,
      }),
    );
  }, [formValues, isEmailVerified, uuid]);
  const handleBlur = (field) => {
    const value = formValues[field.key];

    if (field.required && (!value || value.trim() === "")) {
      setErrors((prev) => ({
        ...prev,
        [field.key]: `${field.label || field.key} is required`,
      }));
    }
  };

  // ==================== FORM VALIDATION ====================

  const validateForm = () => {
    const newErrors = {};

    formData?.fieldsList?.forEach((field) => {
      const value = formValues[field.key];
      const label = field.label || field.key;
      const labelLower = label.toLowerCase();

      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (field.required && isEmpty) {
        newErrors[field.key] = `${label} is required`;
        return;
      }

      if (isEmpty) return;

      if (labelLower.includes("email")) {
        if (!validateEmail(value)) {
          newErrors[field.key] = "Please enter a valid email address";
        }
      }

      if (labelLower.includes("phone") || labelLower.includes("mobile")) {
        const mobCheck = validateIndianMobileNumber(value);
        if (!mobCheck.valid) {
          newErrors[field.key] = mobCheck.message;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== SUBMIT HANDLER ====================

  // ==================== SUBMIT HANDLER ====================
  const buildPayload = () => {
    // 1. Extract only valid answer fields
    const answers = {};

    formData.fieldsList.forEach((field) => {
      if (!field.key) return;

      // ❌ skip system/internal fields
      if (
        [
          "branchId",
          "batchId",
          "selectedDate",
          "courseName",
          "counsellorId",
        ].includes(field.key)
      ) {
        return;
      }

      answers[field.key] = formValues[field.key];
    });

    // 2. Build final payload
    return {
      formUuid: formData?.uuid,
      answers,
      data: selectedSlot ? [selectedSlot] : [],
      counsellorId: formValues.counsellorId,
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors before submitting", "error", 3000);
      return;
    }

    if (!captchaToken) {
      showToast("Please complete the 'I am not a robot' verification", "error", 4000);
      return;
    }

    const email = formValues[emailFieldKey];
    if (!email || !validateEmail(email)) {
      showToast("Please enter a valid email address", "error", 3000);
      return;
    }

    // Trigger OTP popup with dynamic handshake & reCAPTCHA verification (same UI flow as lead forms)
    await sendOTP(email);
  };

    // ==================== TOAST NOTIFICATION ====================

    const ToastNotification = () => {
      if (toastMessages.length === 0) return null;

      return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toastMessages.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${toast.type === "success"
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
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-12 text-center">
              <Info className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Form Unavailable
              </h2>
              <p className="text-gray-600">{status?.message}</p>
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
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Registration Successful 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for registering. We&apos;ll be in touch shortly.
              </p>

              {formData?.communityLink && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <FaWhatsapp className="text-green-600 text-xl" />
                    <span className="font-medium text-green-700">
                      Join our WhatsApp Community
                    </span>
                  </div>
                  <div className="flex items-center bg-white border rounded-md overflow-hidden">
                    <a
                      href={formData.communityLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm text-blue-600 px-3 py-2 truncate hover:underline"
                    >
                      {formData.communityLink}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(formData.communityLink);
                        showToast("Link copied!", "success", 2000);
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition text-xs"
                    >
                      Copy
                    </button>
                  </div>
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

    // ==================== MAIN FORM RENDER ====================

    return (
      <div className="min-h-screen bg-gray-100 py-6 px-3">
        <ToastNotification />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#2a619d] px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">
                    {toPascalCaseWithSpaces(
                      formData?.registrationformname || formData?.formName,
                    )}
                  </h1>
                  {formData?.description && (
                    <p className="mt-1 text-sm text-blue-100">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              {/* Invisible Honeypot Trap for Bot Blocking */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
                tabIndex={-1}
              >
                <input
                  type="text"
                  name="website_verification_code"
                  id="website_verification_code"
                  value={honeypotValue}
                  onChange={(e) => setHoneypotValue(e.target.value)}
                  tabIndex={-1}
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.fieldsList?.map((field, index) => {
                  if (!field || !field.key) {
                    return null;
                  }

                  const value = formValues[field.key];
                  const isEmail =
                    field.type === "email" ||
                    field.key?.toLowerCase().includes("email");
                  const isPhone =
                    field.key?.toLowerCase().includes("phone") ||
                    field.key?.toLowerCase().includes("mobile") ||
                    false;
                  const isFullWidth =
                    field.type === "textarea" || field.type === "multiselect";
                  const fieldLabel = field.label || field.key;
                  const getPlaceholder = (field) => {
                    const label = (field.label == undefined || field.label == null) ? field.key?.toLowerCase() : field.label?.toLowerCase() || "";

                    if (label.includes("email"))
                      return "Enter your email address";
                    if (label.includes("phone") || label.includes("mobile"))
                      return "Enter your mobile number";
                    if (label.includes("name")) return "Enter your full name";
                    if (label.includes("age")) return "Enter your age";

                    return `Enter ${field.label ?? field.key}`;
                  };

                  return (
                    <div
                      key={field.uuid || field.key || index}
                      className={`flex flex-col gap-1 ${isFullWidth ? "md:col-span-2" : ""}`}
                    >
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2 flex-wrap">
                        {fieldLabel}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {field.type === "select" && (
                        <div className="relative">
                          <select
                            value={value || ""}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                            disabled={
                              field.editable === false ||
                              (isEmail && isEmailVerified) ||
                              field.key === "branchId"
                            }
                            className={`w-full h-10 px-3 pr-10 text-sm rounded-md border bg-white appearance-none ${errors[field.key]
                              ? "border-red-500"
                              : "border-gray-300"
                              } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                          >
                            <option value="" disabled hidden>
                              {field.key === "branchId"
                                ? "Select Branch"
                                : field.key === "batchId"
                                  ? "Select Batch"
                                  : field.key === "selectedDate"
                                    ? "Select Date"
                                    : `Select ${fieldLabel}`}
                            </option>

                            {field.key === "branchId" ? (
                              <option
                                key={formData?.branchId?.id}
                                value={formData?.branchId?.id}
                              >
                                {formData?.branchId?.name}
                              </option>
                            ) : field.key === "selectedDate" ? (
                              availableDates.length > 0 ? (
                                availableDates.map((d, i) => (
                                  <option key={i} value={d.date}>
                                    {`${d.date} (${d.day}) | ${d.startTime} - ${d.endTime}`}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No slots available</option>
                              )
                            ) : field.key === "counsellorId" ? (
                              formData.counsellors?.map((counsellor) => (
                                <option key={counsellor.id} value={counsellor.id}>
                                  {counsellor.name}
                                </option>
                              ))
                            ) : (
                              field.options?.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))
                            )}
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                            <RiArrowDropDownLine />
                          </div>
                        </div>
                      )}

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
                          disabled={field.editable === false}
                          className={`w-full h-20 px-2 py-1 text-sm rounded-md border ${errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                        >
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          value={value || ""}
                          placeholder={getPlaceholder(field)}
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                          onBlur={() => handleBlur(field)}
                          rows={3}
                          disabled={field.editable === false}
                          className={`w-full px-3 py-2 text-sm rounded-md border ${errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                        />
                      )}
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
                              placeholder={getPlaceholder(field)}
                              onChange={(e) =>
                                handleChange(field.key, e.target.value)
                              }
                              onBlur={() => handleBlur(field)}
                              disabled={
                                field.editable === false ||
                                field.key === "courseName"
                              }
                              className={`w-full h-10 px-3 text-sm rounded-md border ${errors[field.key]
                                ? "border-red-500"
                                : "border-gray-300"
                                } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                            />
                          </div>
                        )}
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

              {/* OTP Verification Section */}
              {/* {showOtpInput && !isEmailVerified && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Email Verification
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    value={otpValue}
                    onChange={(e) =>
                      setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    className="flex-1 h-10 px-3 text-sm rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    disabled={otpStatus.loading}
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={otpStatus.loading || otpValue.length !== 6}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {otpStatus.loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={otpStatus.timer > 0 || otpStatus.loading}
                    className={`text-xs flex items-center gap-1 ${
                      otpStatus.timer > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${otpStatus.loading ? "animate-spin" : ""}`}
                    />
                    Resend OTP {otpStatus.timer > 0 && `in ${otpStatus.timer}s`}
                  </button>
                </div>

                {otpStatus.error && (
                  <div className="mt-2 text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{otpStatus.error}</span>
                  </div>
                )}
              </div>
            )} */}

              {/* OTP Verification Modal (Same UI flow as lead forms) */}
              {showOtpModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                >
                  <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-gray-100">
                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpModal(false);
                        setOtpStatus((prev) => ({ ...prev, error: "" }));
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-1 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#2a619d]/10 flex items-center justify-center text-[#2a619d] shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Verify Your Email
                        </h3>
                        <p className="text-xs text-gray-500">
                          Enter the 6-digit code sent to{" "}
                          <span className="font-semibold text-gray-800">
                            {otpVerificationData.email}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* 6 Digit Input Boxes */}
                    <div className="flex justify-between gap-2 my-5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          className={`w-11 h-12 text-center text-xl font-bold rounded-lg border ${digit
                            ? "border-[#2a619d] bg-[#2a619d]/5 text-[#2a619d] ring-2 ring-[#2a619d]/20"
                            : "border-gray-300 bg-white text-gray-900"
                            } focus:border-[#2a619d] focus:ring-2 focus:ring-[#2a619d]/20 outline-none transition-all`}
                        />
                      ))}
                    </div>

                    {/* Error Message */}
                    {otpStatus.error && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs p-2.5 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{otpStatus.error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={verifyAndSubmit}
                      disabled={
                        otpDigits.join("").length !== 6 ||
                        otpStatus.loading ||
                        isVerifyingAndSubmitting
                      }
                      className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${otpDigits.join("").length !== 6 ||
                        otpStatus.loading ||
                        isVerifyingAndSubmitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#2a619d] hover:bg-[#214d7d] text-white shadow-md active:scale-[0.98] cursor-pointer"
                        }`}
                    >
                      {isVerifyingAndSubmitting || otpStatus.loading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Verifying & Submitting...
                        </>
                      ) : (
                        "Verify & Submit Registration"
                      )}
                    </button>

                    {/* Resend Section */}
                    <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                      {otpStatus.timer > 0 ? (
                        <p className="text-xs text-gray-500">
                          Didn&apos;t receive code? Resend in{" "}
                          <span className="font-semibold text-[#2a619d]">
                            {otpStatus.timer}s
                          </span>
                        </p>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500">
                            Didn&apos;t receive code? Verify to resend:
                          </p>
                          <div className="flex justify-center overflow-visible">
                            <ReCAPTCHA
                              ref={modalRecaptchaRef}
                              sitekey={RECAPTCHA_SITE_KEY}
                              onChange={handleResendCaptchaSuccess}
                              onExpired={handleResendCaptchaExpired}
                              onErrored={handleResendCaptchaError}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={resendOTP}
                            disabled={!resendCaptchaToken || otpStatus.loading}
                            className="text-xs font-semibold text-[#2a619d] hover:text-[#214d7d] disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                          >
                            <RefreshCw
                              className={`h-3.5 w-3.5 ${otpStatus.loading ? "animate-spin" : ""}`}
                            />
                            Resend Verification OTP
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {status?.message && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{status?.message}</span>
                </div>
              )}

              {/* Google reCAPTCHA v2 Checkbox right above Register button */}
              <div className="pt-3 pb-2 flex justify-center relative z-10 w-full overflow-visible touch-manipulation">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaSuccess}
                  onExpired={handleCaptchaExpired}
                  onErrored={handleCaptchaError}
                />
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  disabled={status?.submitting || !captchaToken}
                  className={`w-full flex items-center justify-center text-sm font-semibold py-2.5 rounded-md transition-all shadow-md ${status?.submitting || !captchaToken
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#2a619d] hover:bg-[#214d7d] text-white active:scale-[0.98] cursor-pointer hover:shadow-lg"
                    }`}
                >
                  {status?.submitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Register
                    </>
                  )}
                </button>
                {!isEmailVerified && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Please verify your email to enable registration
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
