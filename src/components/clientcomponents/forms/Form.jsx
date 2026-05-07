"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Confetti from "react-confetti";

export default function Form({
  show,
  onClose,
  course,
  onDiscount,
  courseName,
}) {
  const [showWheel, setShowWheel] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  const [randomValue, setRandomValue] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [leadEmail, setLeadEmail] = useState("");

  // const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const baseUrl = "https://apierp.teksversity.com";

  const values = [
    "1000",
    "2000",
    "3000",
    "4000",
    "5000",
    "6000",
    "7000",
    "10000",
  ];

  const price = course?.defaultFee || 10000;

  const router = useRouter();

  // ✅ Bind default values from props
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: courseName || "",
    university: course?.universityName || "",
    ProductId: course?.productId || "",
    sourceId: course?.sourceId || "",
    source: "getDetails",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    if (course) {
      setFormData((prev) => ({
        ...prev,
        course: courseName || "",
        university: course?.universityName || "",
        ProductId: course?.productId || "",
        sourceId: course?.sourceId || "",
      }));
    }
  }, [course]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const spinWheel = async () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    setHasSpun(true);

    // ✅ Only allowed winning discounts
    const allowedDiscounts = ["1000", "2000", "3000"];

    // Find their indices on the wheel
    const allowedIndices = values
      .map((val, index) => (allowedDiscounts.includes(val) ? index : null))
      .filter((v) => v !== null);

    // Pick one index randomly
    const randomIndex =
      allowedIndices[Math.floor(Math.random() * allowedIndices.length)];

    const selectedValue = values[randomIndex];
    setRandomValue(selectedValue);

    const slice = 360 / values.length;
    const extraSpins = 8;

    const newRotation =
      extraSpins * 360 + (360 - (randomIndex * slice + slice / 2)) - 90;

    setRotation(newRotation);

    setTimeout(async () => {
      const discountValue = Number(selectedValue);
      const final = price - discountValue;

      setDiscount(discountValue);
      setFinalAmount(final);
      setSpinning(false);

      try {
        const payload = {
          discount: discountValue.toString(),
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          course: formData.ProductId,
          university: formData.sourceId,
          sourceType: 34,
        };

        const response = await fetch(`${baseUrl}/lead/spinwheel`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setShowCongrats(true);
          onDiscount?.({ discount: discountValue, finalAmount: final });
        } else {
          toast.error("Something went wrong.");
          onClose();
        }
      } catch {
        toast.error("Server error occurred.");
        onClose();
      }
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, mobile } = formData;

    const errorMessages = {
      name: !name?.trim()
        ? "Please enter your name."
        : /\d/.test(name)
          ? "Name should not contain numbers."
          : name.trim().length <= 2
            ? "Name must be at least 3 characters."
            : "",
      email: !email?.trim()
        ? "Please enter your email ID."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Please enter a valid email ID."
          : "",
      mobile: (() => {
        const cleaned = mobile.replace(/\D/g, "");
        if (!cleaned) return "Please enter your phone number.";
        if (cleaned.length !== 10)
          return "Please enter a valid 10-digit mobile number.";
        if (!/^[6-9]\d{9}$/.test(cleaned))
          return "Mobile number must start with 6, 7, 8, or 9.";
        return "";
      })(),
    };

    const hasError = Object.values(errorMessages).some((msg) => msg !== "");

    if (hasError) {
      setError(errorMessages);
      setIsLoading(false);
      return;
    } else {
      // setShowWheel(true);

      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          course: formData.ProductId,
          university: formData.sourceId,
          // discount: discountValue.toString()
          sourceType: 34,
        };

        const response = await fetch(`${baseUrl}/lead/userspin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success(
            "Registration successful! Proceeding..." || response?.statusText,
          );
          setShowWheel(true);
        } else {
          const errorData = await response.json();
          toast.error(errorData?.message || "Failed to submit form.");
          onClose();
        }
      } catch (error) {
        if (error?.response) {
          toast.error(error.response.data?.message || "Server error occurred");
        } else if (error?.request) {
          toast.error("No response from server. Check your network.");
        } else {
          toast.error("Something went wrong.");
        }
        onClose();
      }
    }
  };

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center z-50 bg-[#2f3032]/80 transition-all duration-300 ease-out ${
        show ? "opacity-100 backdrop-blur-sm" : "opacity-0"
      }`}
    >
      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="bg-white rounded-xl shadow-2xl p-8 w-[90%] max-w-md text-center relative animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-[#ea6329] mb-4">
              🥳 Congratulations! 🥳
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              You won a discount of{" "}
              <span className="text-green-600 font-bold">₹{discount}</span>!
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-500 line-through">
                Original Price: ₹{price.toLocaleString()}
              </p>
              <p className="text-xl font-bold text-gray-800">
                Your New Price: ₹{finalAmount?.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                setShowCongrats(false);
                onClose();
                setShowWheel(false);
              }}
              className="w-full bg-[#ea6329] text-white h-10 rounded-md font-bold hover:bg-white hover:text-[#ea6329] hover:border-2 hover:border-[#ea6329] transition-all"
            >
              Close and Proceed
            </button>
          </div>
        </div>
      )}

      {/* 🌀 Spin Wheel */}
      {showWheel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-md shadow-lg p-6 w-[400px] text-center relative">
            <button
              onClick={() => {
                setShowWheel(false);
                setHasSpun(false);
                setSpinning(false);
                onClose();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 cursor-pointer"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-[#ea6329]">
              Spin the Wheel 🎡
            </h2>
            <p className="text-gray-600 mb-4">
              Click "SPIN" to win your discount!
            </p>

            {/* Wheel */}
            <div className="relative w-64 h-64 mx-auto">
              <div
                className="absolute w-full h-full rounded-full transition-transform duration-[5000ms] ease-out flex items-center justify-center border-[6px] border-[#ea6329] shadow-lg"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: `conic-gradient(
                    #ff5722 0deg 45deg,
                    #03a9f4 45deg 90deg,
                    #ffc107 90deg 135deg,
                    #009688 135deg 180deg,
                    #9c27b0 180deg 225deg,
                    #e91e63 225deg 270deg,
                    #8bc34a 270deg 315deg,
                    #3f51b5 315deg 360deg
                  )`,
                }}
              >
                {values.map((val, i) => (
                  <div
                    key={i}
                    className="absolute text-white font-bold text-lg"
                    style={{
                      transform: `
                        rotate(${
                          i * (360 / values.length) + 360 / values.length / 2
                        }deg)
                        translate(85px)
                        rotate(-${
                          i * (360 / values.length) + 360 / values.length / 2
                        }deg)
                      `,
                    }}
                  >
                    {val}
                  </div>
                ))}
              </div>

              <div
                onClick={spinWheel}
                className={`absolute inset-0 flex items-center justify-center cursor-pointer`}
              >
                <div
                  className={`cursor-pointer w-20 h-20 bg-[#ea6329] border-[4px] border-white text-white font-extrabold flex items-center justify-center rounded-full shadow-xl transition-all duration-300
                  ${
                    spinning || hasSpun
                      ? " cursor-not-allowed scale-90"
                      : "hover:scale-110"
                  }`}
                >
                  {spinning ? "Spinning" : "SPIN"}
                </div>
              </div>

              {/* Pointer Arrow */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0
                  border-l-[15px] border-r-[15px] border-b-[25px]
                  border-l-transparent border-r-transparent border-b-[#ea6329] drop-shadow-lg"
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Form */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl border w-[95%] max-w-sm relative shadow-2xl transform transition-all duration-500 ease-out flex flex-col ${
          show
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-75 opacity-0 translate-y-8"
        } hover:shadow-3xl`}
      >
        <div className="w-full p-5 overflow-y-auto flex flex-col justify-center">
          <h2 className="text-2xl font-medium text-gray-800 grid justify-center mb-5">
            Get Your Discount
          </h2>

          <form className="space-y-2" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Full Name<span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
              />
              <div className="">
                {error.name && (
                  <p className="text-red-400 text-xs mt-1">{error.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Email<span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
              />
              <div className="">
                {error.email && (
                  <p className="text-red-400 text-xs mt-1">{error.email}</p>
                )}
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Phone Number<span className="text-red-600">*</span>
              </label>
              <input
                id="mobile"
                type="tel"
                name="mobile"
                placeholder="Enter your phone number"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    handleChange({ target: { name: "mobile", value } });
                  }
                }}
                maxLength={10}
                className="w-full px-2 h-10 dark:text-black border border-gray-300 rounded-md focus:border-1 focus:border-[#981b1b] focus:ring-0 outline-none"
              />
              <div className="">
                {error.mobile && (
                  <p className="text-red-400 text-xs mt-1">{error.mobile}</p>
                )}
              </div>
            </div>

            {/* Course (auto-filled) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Course<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                disabled
                className="w-full px-2 h-10 border border-gray-300 rounded-md bg-gray-200 text-gray-600"
              />
            </div>

            {/* University (auto-filled) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                University/Institute<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                disabled
                className="w-full px-2 h-10 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`cursor-pointer mt-5 w-full bg-[#ea6329] text-white h-10 rounded-md font-bold hover:bg-white hover:text-[#ea6329] hover:border-2 hover:border-[#ea6329] transition-all ${
                isLoading ? "animate-pulse" : ""
              }`}
              disabled={isLoading}
            >
              Submit and Spin
            </button>
          </form>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-800 text-xl 
                     font-medium rounded-full p-2 flex items-center justify-center hover:bg-gray-100 
                     transition-all duration-200"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
