"use client";
import React, { useState, useEffect } from "react";
import { FaRegClock } from "react-icons/fa6";
const rawApiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  process.env.NEXT_BLOGS_APPLY_API_URL ||
  "https://l5h16h96-5060.inc1.devtunnels.ms";
const apiUrl = rawApiUrl.replace(/\/$/, "");

export function ExamTimer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (duration !== undefined && duration !== null) {
      setTimeLeft(duration);
    }
  }, [duration]);

  useEffect(() => {
    const fetchRefreshStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/exam/externalsendRefresh/${JSON.parse(localStorage.getItem("studentExamAttemptId"))}`);
        if (!response.ok) {
          throw new Error("Failed to fetch refresh status");
        }
  
        const data = await response.json();
        setTimeLeft(data?.remainingTime ?? duration);
        // duration = data?.remainingTime
        // duration = 3000
        console.log("Refresh status response:", data);
  
        
      } catch (error) {
        console.error("Error fetching refresh status:", error);
      }
    };
  
    fetchRefreshStatus();
  }, [duration]);


  useEffect(() => {
    if (timeLeft === undefined || timeLeft === null) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;


  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadowre-md p-4 flex items-center space-x-2">
      <FaRegClock className="w-5 h-5 text-blue-600" />
      <span className="font-mono text-xl">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
