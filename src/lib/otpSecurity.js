import { buildApiUrl } from "./apiBaseUrls";

export const RECAPTCHA_SITE_KEY = (
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  process.env.EXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LcQssgtAAAAAGTQGnMtwm476a1WvK2oQe6PD4-m"
).trim();

/**
 * Sanitize raw mobile number:
 * - Strip all non-digit characters
 * - Strip leading 91 (country code) if length > 10
 * - Strip leading 0 if present
 */
export const sanitizeMobileNumber = (raw) => {
  if (!raw) return "";
  let digits = raw.toString().trim().replace(/\D/g, "");

  // If 12 digits starting with 91, strip the country code
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
};

/**
 * Strict Indian mobile number format validation:
 * - Exactly 10 digits
 * - Starts with 6, 7, 8, or 9
 * - Rejects 10 repetitive digits (e.g., 9999999999)
 * - Rejects dummy test series (e.g., 9876543210)
 */
export const validateIndianMobileNumber = (raw) => {
  const cleaned = sanitizeMobileNumber(raw);

  if (!cleaned) {
    return { valid: false, message: "Mobile number is required" };
  }

  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      message: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9",
    };
  }

  // Reject 10 identical repeated digits
  if (/^([0-9])\1{9}$/.test(cleaned)) {
    return {
      valid: false,
      message: "Please enter a genuine mobile number",
    };
  }

  // Reject known dummy repetitive sequences
  const dummySequences = [
    "9876543210",
    "0123456789",
    "1234567890",
    "9012345678",
    "0987654321",
  ];

  if (dummySequences.includes(cleaned)) {
    return {
      valid: false,
      message: "Please enter a genuine mobile number",
    };
  }

  return { valid: true, cleaned };
};

/**
 * Compute SHA256 dynamic client hash:
 * clientHash = SHA256(`${cleanedNumber}:${timestamp}:${handshakeId}`)
 */
export const computeDynamicClientHash = async (cleanedNumber, timestamp, handshakeId) => {
  const payload = `${cleanedNumber}:${timestamp}:${handshakeId}`;

  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  throw new Error("Cryptography API is not supported in this browser environment.");
};

/**
 * Pre-flight Handshake:
 * Calls GET /lead/otp-handshake to retrieve fresh nonce and signature
 */
export const fetchOtpHandshake = async (baseUrl) => {
  const url = buildApiUrl(baseUrl, "/lead/otp-handshake");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to initialize secure OTP handshake");
  }

  const data = await res.json();
  const handshake = data?.data || data;

  if (!handshake?.handshakeId || !handshake?.timestamp || !handshake?.signature) {
    throw new Error("Invalid handshake response received from server");
  }

  return {
    handshakeId: handshake.handshakeId,
    timestamp: handshake.timestamp,
    signature: handshake.signature,
  };
};
