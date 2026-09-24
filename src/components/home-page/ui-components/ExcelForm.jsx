'use client'
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast"; 
import ReCAPTCHA from "react-google-recaptcha";
import OtpVerificationModal from "@/components/OtpVerificationModal";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import {
  RECAPTCHA_SITE_KEY,
  validateIndianMobileNumber,
  computeDynamicClientHash,
  fetchOtpHandshake,
} from "@/lib/otpSecurity";
import { storeBranchData } from "@/lib/branchStorage";

const ExcelForm = () => {
    const router = useRouter();
    const recaptchaRef = useRef(null);

    const [formValues, setFormValues] = useState({ name: '', email: '', number: '', message: '', source: 'Request Callback—Website' });
    const [formErrors, setFormErrors] = useState({});
    const [isOtpVerified, setIsOtpVerified] = useState(false);  

    // 4-Pillar Security States
    const [captchaToken, setCaptchaToken] = useState(null);
    const [handshakeData, setHandshakeData] = useState(null);
    const [honeypotValue, setHoneypotValue] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const API_URL = blogsApplyBaseUrl;

    useEffect(() => {
        try {
            router.prefetch("/thankyou");
        } catch {}
    }, [router]);

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

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
        if (name === "number" && value.length > 10) {
            return;
        }
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const submitLeadData = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formValues,
                website_verification_code: honeypotValue || "",
                ...(captchaToken ? { recaptchaToken: captchaToken } : {})
            };
            const { data, status } = await axios.post(
                buildApiUrl(blogsApplyBaseUrl, "/lead/create"),
                payload
            );

            if (status === 201 || status === 200) {
                if (formValues.branch) {
                    storeBranchData(formValues.branch);
                }
                toast.success("Thank you! We'll contact you soon.", {
                    duration: 4000,
                    icon: "🎉",
                    style: {
                        background: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                    },
                });
                router.push('/thankyou');
                return;
            }
        } catch (error) {
            toast.error("Form submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (honeypotValue && honeypotValue.trim().length > 0) {
            toast.success("Thank you! We'll contact you soon.");
            router.push('/thankyou');
            return;
        }

        if (!formValues.name.trim()) {
            setFormErrors((prev) => ({
                ...prev,
                name: "Name is required"
            }));
            return;
        } else if (formValues.name.trim().length <= 3) {
            setFormErrors((prev) => ({
                ...prev,
                name: "Name must be at least 3 characters long"
            }));
            return;
        }

        if (!formValues.email.trim()) {
            setFormErrors((prev) => ({
                ...prev,
                email: "Email is required"
            }));
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            setFormErrors((prev) => ({
                ...prev,
                email: "Enter a valid email address"
            }));
            return;
        }

        const phoneValidation = validateIndianMobileNumber(formValues.number);
        if (!phoneValidation.valid) {
            setFormErrors((prev) => ({
                ...prev,
                number: phoneValidation.message
            }));
            return;
        }
        const cleanedNumber = phoneValidation.cleaned;

        if (!formValues.message.trim()) {
            setFormErrors((prev) => ({
                ...prev,
                message: "Please enter your message"
            }));
            return;
        }

        if (isOtpVerified) {
            await submitLeadData();
            return;
        }

        if (!captchaToken) {
            toast.error("Please click 'I'm not a robot' before submitting.");
            return;
        }

        // Send OTP & Open Modal
        setIsSendingOtp(true);
        try {
            let hs = handshakeData;
            if (!hs?.handshakeId || !hs?.timestamp || !hs?.signature) {
                hs = await fetchOtpHandshake(API_URL);
                setHandshakeData(hs);
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
                setShowOtpModal(true);
                toast.success("OTP sent successfully via WhatsApp!");
            } else {
                toast.error(data?.message || "Failed to send OTP");
            }
        } catch (err) {
            toast.error(err.message || "OTP send failed. Please try again.");
        } finally {
            setIsSendingOtp(false);
            try {
                recaptchaRef.current?.reset();
            } catch {
                // ignore
            }
            setCaptchaToken(null);
            setHandshakeData(null);
        }
    };

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                containerStyle={{
                    zIndex: 999999,
                }}
                toastOptions={{
                    duration: 5000,
                    style: {
                        borderRadius: "8px",
                        fontSize: "14px",
                        padding: "10px 14px",
                    },
                }}
            />

            <form onSubmit={handleSubmit} className="text-[#6C727F]">
                {/* Honeypot */}
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

                <div className="grid grid-cols-1 sm:grid-cols-10 gap-x-4">
                    {/* name */}
                    <div className="w-full relative mt-4">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-300"
                            placeholder="Enter your name"
                            value={formValues.name}
                            onChange={handleChange}
                        />
                        <div className="text-red-600 min-h-4 text-xs ml-3">{formErrors.name != ' ' && formErrors.name}</div>
                    </div>

                    {/* email */}
                    <div className="w-full relative mt-4">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-300"
                            placeholder="Enter your email address"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        <div className="text-red-600 min-h-4 text-xs ml-3">{formErrors.email != ' ' && formErrors.email}</div>
                    </div>

                    {/* phone number - clean full-width input */}
                    <div className="relative group col-span-12 sm:col-span-10 mt-4">
                        <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-400 text-sm font-medium select-none pointer-events-none">
                                +91
                            </span>
                            <input
                                type="tel"
                                id="number"
                                name="number"
                                value={formValues.number}
                                onChange={(e) => {
                                    handleChange({ target: { name: 'number', value: e.target.value.replace(/\D/g, "").slice(0, 10) } });
                                    setIsOtpVerified(false);
                                }}
                                className="w-full text-sm pl-12 pr-4 py-3 bg-white text-black outline-none border border-[#e0e0e0] rounded-lg focus:border-[#4B84CB] transition-colors"
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                            />
                        </div>
                        <div className="text-red-600 min-h-4 text-xs ml-3">{formErrors.number != ' ' && formErrors.number}</div>
                    </div>

                    {/* message */}
                    <div className="sm:col-span-10 mt-2">
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            className="border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-300 resize-none overflow-y-auto min-h-[6rem] max-h-[12rem]"
                            placeholder="Enter your message here..."
                            value={formValues.message}
                            onChange={handleChange}
                        ></textarea>
                        {formErrors.message && <div className="text-red-500 text-xs">{formErrors.message}</div>}
                    </div>
                </div>

                {/* reCAPTCHA at bottom right above submit button */}
                {!isOtpVerified && (
                    <div className="flex justify-center pt-4 relative z-10">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaSuccess}
                            onExpired={handleCaptchaExpired}
                            onErrored={handleCaptchaError}
                        />
                    </div>
                )}

                {/* Submit button */}
                <div className='flex justify-center pt-4'>
                    <button
                        type="submit"
                        disabled={isSubmitting || isSendingOtp}
                        className={`w-full cursor-pointer bg-[#FE543D] text-white py-3 rounded-lg shadow transition font-semibold flex items-center justify-center gap-2
                            ${isSubmitting || isSendingOtp ? "opacity-60 cursor-not-allowed" : "hover:bg-[#e04a35]"}`}
                    >
                        {isSendingOtp ? "Sending OTP..." : isSubmitting ? "Submitting..." : "Request Call Back"}
                    </button>
                </div>
            </form>

            {/* OTP Verification Modal */}
            <OtpVerificationModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                phone={formValues.number || ""}
                onVerified={async () => {
                    setIsOtpVerified(true);
                    setShowOtpModal(false);
                    await submitLeadData();
                }}
                baseUrl={API_URL}
            />
        </>
    );
};

export default ExcelForm;
