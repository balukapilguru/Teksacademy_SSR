"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
const rawApiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||NEXT_PUBLIC_BLOGS_APPLY_API_URL || 
  "https://l5h16h96-5060.inc1.devtunnels.ms";
const apiUrl = rawApiUrl.replace(/\/$/, "");

// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ExamPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { exam, examId } = useParams();
  const router = useRouter();

  console.log("mnxsnmx", exam)

  useEffect(()=>{
    localStorage.setItem("formid", exam)

  }, [exam])

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    localStorage.clear();
    sessionStorage.clear();

    try {
      const response = await fetch(`${apiUrl}/exam/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, formId: exam }),
      });

      const data = await response.json();
      console.log(data?.examId);
      if (response.ok) {
        sessionStorage.setItem("ExamData", JSON.stringify(data));
        localStorage.setItem("formid", exam)
        setTimeout(() => {
          router.push(`/exam/${data.examId}`);
        }, 200);
      } else {
        // console.log("sjacns,acm",)
        setErrorMessage(
          data?.message || "You're not registered for this Exam."
        );
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to verify email");
      setIsLoading(false);
    } finally {
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="text-center">
          <div className="verification-icon-wrapper">
            <HiOutlineMail size={32} className="verification-icon" />
          </div>
        </div>
        <h5 className="verification-title bg-blue">Student Verification</h5>
        <p className="verification-text">
        Enter your student mail to verify your account
        </p>
        <form onSubmit={handleVerify}>
          <input
            type="email"
            className="verification-input"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="verification-button"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Mail"}
          </button>
          {errorMessage && (
            <div className="verification-error text-xs text-red-400 mt-2">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ExamPage;
