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
  const [verifiedUserData, setVerifiedUserData] = useState(null); // Store verified user data from OTP

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
  const [otpValue, setOtpValue] = useState("");
  const otpRefs = useRef([]);
  const [otpStatus, setOtpStatus] = useState({
    loading: false,
    verified: false,
    error: "",
    resentCount: 0,
    timer: 0,
  });
  const [verifiedEmails, setVerifiedEmails] = useState({});

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
        console.error("Error parsing stored user data:", e);
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
        console.error("Error parsing stored autofill data:", e);
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

      // ❌ Don't call API if no token
      if (!token) {
        console.warn("No token found, skipping autofill API");
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
      console.error("Autofill error:", error);
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
    if (!res.ok) throw new Error();

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
    console.log(data, "Verifieddata");
    validateFormWindow(data);
  } catch {
    setStatus((prev) => ({
      ...prev,
      message: "Failed to load form",
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
    console.log(mapped, ...prev,"mapped");   // ❌ This line causes error
  } catch (err) {
    console.error("Mapping error:", err);
  }
}, [formData]);
  // ==================== FORM VALIDATION ====================

  const validateFormWindow = (data) => {
    const today = new Date();
    const start = new Date(data?.data?.activeFrom);
    const end = new Date(data?.data?.activeTo);


    if (today >= start && today <= end) {
      // console.log("OkayData");
      setStatus((prev) => ({ ...prev, formActive: true }));
    } else if (today < start) {
      // console.log("OkayData 2");
      setStatus((prev) => ({
        ...prev,
        message: `Form opens on ${start.toDateString()}`,
      }));
    } else {
      console.log(
       
        today >= start,
        today <= end,
        today,
        end,
       
        data,
      );
      setStatus((prev) => ({
        ...prev,
        message: "Registration closed",
      }));
    }
  };

  // ==================== EMAIL VALIDATION ====================

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ==================== SEND OTP ====================

  const sendOTP = async (email) => {
    setOtpStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const response = await fetch(`${apiUrl}/student/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, isAutofill: true }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        timer: 60,
        resentCount: prev.resentCount + 1,
      }));
      setOtpModal({ open: true, email: emailForVerification });

      showToast(`OTP sent to ${email}`, "info", 3000);
    } catch (error) {
      setOtpStatus((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to send OTP. Please try again.",
      }));
      showToast(error.message || "Failed to send OTP", "error", 4000);
    }
  };

  // ==================== VERIFY OTP ====================
  useEffect(() => {
    if (formData?.fieldsList) {
      // Validate all fields have required properties
      const invalidFields = formData.fieldsList.filter((field) => !field.key);
      if (invalidFields.length > 0) {
        console.error("Fields missing key property:", invalidFields);
        showToast("Form configuration error. Please contact support.", "error");
      }
    }
  }, [formData]);

  useEffect(() => {
    if (formData?.fieldsList) {
      console.log(
        "Fields List:",
        formData.fieldsList.map((f) => ({
          uuid: f.uuid,
          key: f.key,
          label: f.label,
        })),
      );
    }
  }, [formData]);

  const verifyOTP = async (autoSubmit = false, otpOverride = null) => {
    const finalOtp = otpOverride || otpValue; // otpValue is a string

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
      const response = await fetch(`${apiUrl}/student/validateotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpModal.email,
          emailOtp: finalOtp,
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

      if (!response.ok) {
        throw new Error(data?.message || "Invalid OTP");
      }

      // Store verified user data in state and localStorage
      if (data.success && data.data) {
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

      showToast("Email verified successfully!", "success", 3000);

      // Close modal and show form
      setTimeout(() => {
        setOtpModal({ open: false, email: "" });
        setOtpValue("");
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

        // Fetch autofill details after successful verification
        fetchAutoFillDetails();
      }, 1500);
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

  const resendOTP = () => {
    if (otpStatus.timer > 0) return;
    sendOTP(otpModal.email);
  };

  // ==================== HANDLE EMAIL SUBMIT ====================

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(emailForVerification)) {
      showToast("Please enter a valid email address", "warning", 3000);
      return;
    }
    // setOtpModal({ open: true, email: emailForVerification });
    sendOTP(emailForVerification);
  };

  // ==================== HANDLE OTP INPUT CHANGE ====================
  const handleOtpChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "");
    const newOtp = [...otpValue];

    if (val.length > 1) {
      // handle autofill/paste
      const digits = val.slice(0, OTP_LENGTH).split("");
      newOtp.splice(0, digits.length, ...digits);
      setOtpValue(newOtp);
      otpRefs.current[digits.length - 1]?.focus();

      if (digits.length === OTP_LENGTH) verifyOTP(true, newOtp.join(""));
      return;
    }

    newOtp[index] = val;
    setOtpValue(newOtp);

    if (val && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) verifyOTP(true, newOtp.join(""));
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key !== "Backspace") return;

    const newOtp = [...otpValue];

    if (newOtp[index]) {
      newOtp[index] = "";
      setOtpValue(newOtp);
    } else if (index > 0) {
      otpRefs.current[index - 1]?.focus();
      newOtp[index - 1] = "";
      setOtpValue(newOtp);
    }
  };
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!paste) return;

    const newOtp = paste.split("");
    while (newOtp.length < OTP_LENGTH) newOtp.push("");

    setOtpValue(newOtp);

    // focus last filled input
    const focusIndex = Math.min(paste.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
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

      if (updatedValue && !/^[6-9]\d{9}$/.test(updatedValue)) {
        newErrors[key] =
          "Must be a valid 10-digit mobile number starting with 6-9";
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
        if (!/^[6-9]\d{9}$/.test(value)) {
          newErrors[field.key] =
            "Must be a valid 10-digit mobile number starting with 6-9";
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

  const AutoFillModal = () => {
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

  const AutoFillHistoryModal = () => {
    if (!showAutoFillHistory) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

  const OTPSection = () => {
    const inputRefOTP = useRef(null);

   useEffect(() => {
  inputRefOTP.current?.focus();
}, []);

    if (!otpModal.open) return null;

    const handleChange = (e) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
      setOtpValue(value);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Verify Your Email</h3>
            </div>
            <button
              onClick={() => {
                setOtpModal({ open: false, email: "" });
                setOtpValue("");
                setOtpStatus({
                  loading: false,
                  verified: false,
                  error: "",
                  resentCount: 0,
                  timer: 0,
                });
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
                <strong>Important:</strong> Please verify your email first to
                continue with the registration.
              </p>
            </div>

            {/* <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={10}
              placeholder="Enter 6-digit OTP"
              value={otpValue || ""}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
              className="w-full h-12 text-center text-xl border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
              disabled={!!otpStatus?.error}
            /> */}

            <input
              ref={inputRefOTP}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit OTP"
              value={otpValue}
              onChange={handleChange}
              // onPaste={handlePaste}
              maxLength={6}
              className="w-full h-12 text-center text-xl border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={otpStatus?.loading} // ONLY loading disables
            />

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

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={resendOTP}
                disabled={
                  otpStatus.timer > 0 || otpStatus.loading || otpStatus.verified
                }
                className={`text-sm flex items-center gap-1 ${
                  otpStatus.timer > 0 || otpStatus.verified
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
                  otpValue.length !== 6
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

  const EmailInputScreen = () => {
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailForVerification}
                    onChange={(e) => setEmailForVerification(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-11 px-3 text-sm rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We&apos;ll send a 6-digit OTP to verify your email{" "}
                  </p>
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

  const ToastNotification = () => {
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

    // console.log(fieldsList, "kjfskdfjsldfjls");

    fieldsList?.forEach((field) => {
      mappedValues[field.key] = userData[field.key] || "";
    });

    return mappedValues;
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("verifiedUserData"));

    if (stored?.data) {
      // console.log(formData, "kjfslkdfjlskdjfl");
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
        <ToastNotification />
        <OTPSection />
        <EmailInputScreen />
      </>
    );
  }

  // Show the actual form after email verification
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">
      <ToastNotification />
      <AutoFillModal />
      <AutoFillHistoryModal />

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
                // Add this safety check at the beginning
                if (!field || !field.key) {
                  console.warn("Invalid field object:", field);
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
