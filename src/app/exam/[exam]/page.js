"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LuGraduationCap } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";
import { ExamInterface } from "../examinterface/page";
import { FiBookOpen } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { LuMousePointer2 } from "react-icons/lu";
const rawApiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||NEXT_PUBLIC_BLOGS_APPLY_API_URL || 
  "https://l5h16h96-5060.inc1.devtunnels.ms";
const apiUrl = rawApiUrl.replace(/\/$/, "");

// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Exam = () => {
  const [examData, setExamData] = useState();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const { exam } = useParams();
  const [timeCurrent, setTimeCurrent] = useState();
  const [examStatus, setExamStatus] = useState(null);
  const [examTime, setExamTime] = useState();
  const [studentAttempId, setStudentAttemptId] = useState();

  useEffect(() => {
    if(examData && isLoading==false){
      const a = localStorage.getItem("examStarted");
    setExamStarted(a);
    console.log("mncxbnmzx", a)
    }
    
  }, [examData]);


  useEffect(() => {
    const examTimeAndDate = sessionStorage.getItem("ExamData");
    setExamTime(JSON.parse(examTimeAndDate));
    console.log("examTimeAndDate", JSON.parse(examTimeAndDate));
  }, [exam]);


  useEffect(() => {
    if (examTime) {
      const status = getExamStatus(examTime);
      setExamStatus(status);

      if (status.status === "countdown") {
        const interval = setInterval(() => {
          const newStatus = getExamStatus(examTime);
          setExamStatus(newStatus);
          if (newStatus.status !== "countdown") {
            clearInterval(interval);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [examTime]);

  useEffect(() => {
    const fetchExamData = async (exam) => {
      setError("");
      try {
        const response = await fetch(
          `${apiUrl}/exam/getExamByIdForStudent/${exam}`
        );
        const data = await response.json();
        if (!response.ok) {
          setError(
            data?.message ||
              "Error in fetching exam data. Please contact support."
          );
          throw new Error("Failed to fetch Exam data");
        }

        setExamData(data?.exam);
        setIsLoading(false);
      } catch (error) {
        console.error("Error caught:", error); // Log the entire error object for debugging.
        setError(error?.message || "An unexpected error occurred"); // Safely access the message.
        setIsLoading(false);
      }
    };

    if (exam) {
      fetchExamData(exam);
    }
  }, [exam]);

  const toPascalCaseWithSpaces = (sentence) => {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleStartExam = async () => {
    const startExamById = {
      examId: examTime?.examId,
      studentregisteredId: examTime?.studentregisteredId,
    };

    try {
      const response = await fetch(`${apiUrl}/exam/startExam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(startExamById),
      });

      if (!response.ok) {
        {
          response?.status === 400
            ? setError(
                "You already have an ongoing exam attempt. Complete it before starting a new one."
              )
            : setError("Failed to start exam");
        }
        throw new Error("Please try again after some time.");
      }

      const data = await response.json();
      setStudentAttemptId(data?.studentExamAttemptId);
      setExamStarted(true);
      localStorage.setItem("examStarted", true)
      localStorage.setItem("studentExamAttemptId", data?.studentExamAttemptId)
    } catch (error) {
      console.error("Error caught:", error); // Log the entire error object for debugging.
      setError(error?.message || "An unexpected error occurred");
      console.error("Error:", error);
    }
  };

  const handleSubmitExam = (answers) => {
    console.log("Submitted answers:", answers);
    // Handle exam submission
  };

  if (examStarted) {
    return (
      <ExamInterface
        exam={examData}
        onSubmit={handleSubmitExam}
        studentAttemp={studentAttempId}
        studentregisteredId={examTime?.studentregisteredId}
        examId={examTime?.examId}
      />
      
     
    );
  }
  

  // const getExamStatus = (examTime) => {
  //   const now = new Date(
  //     new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  //   );
  //   const [year, month, day] = examTime?.examDate?.split("-");
  //   const [endYear, endMonth, endDay] = examTime?.examEndDate?.split("-");
  //   const [hour, minute, second] = examTime?.examTime?.split(":");

  //   const start = new Date(year, month - 1, day, hour, minute, second);

  //   console.log("hcbsahj", start, now);
  //   // const startIST = new Date(
  //   //   start.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  //   // );

  //   const endIST = new Date(start.getTime() + examTime.time * 60 * 1000);

  //   if (now < start) {
  //     const diffMs = start - now;
  //     const diffMins = Math.floor(diffMs / 60000);
  //     const diffHrs = Math.floor(diffMs / (60 * 60 * 1000));
  //     const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  //     if (diffDays > 0)
  //       return { status: "waiting", value: `${diffDays} day(s) left` };
  //     if (diffHrs > 0)
  //       return { status: "waiting", value: `${diffHrs} hour(s) left` };
  //     if (diffMins > 5)
  //       return { status: "waiting", value: `${diffMins} minute(s) left` };
  //     return { status: "countdown", value: Math.floor(diffMs / 1000) }; // seconds
  //   }

  //   if (now > endIST) {
  //     return { status: "over", value: "Exam time is over" };
  //   }

  //   return { status: "ongoing", value: "Exam is ongoing" };
  // };

  const getExamStatus = (examTime) => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const [year, month, day] = examTime?.examDate?.split("-");

    // Case 1: examTime is null -> allow anytime between examDate and examEndDate
    if (!examTime?.examTime) {
      const [endYear, endMonth, endDay] = examTime?.examEndDate?.split("-");

      const examStartDate = new Date(year, month - 1, day);
      const examEndDate = new Date(endYear, endMonth - 1, endDay);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (today < examStartDate) {
        return { status: "waiting", value: "Exam has not started yet" };
      }

      if (today > examEndDate) {
        return { status: "over", value: "Exam time is over" };
      }

      return { status: "ongoing", value: "Exam is available today" };
    }

    // Case 2: examTime is present -> use examDate + examTime
    const [hour, minute, second] = examTime.examTime.split(":");
    const start = new Date(year, month - 1, day, hour, minute, second);
    const end = new Date(start.getTime() + examTime.time * 60 * 1000);
    if (now < start) {
      const diffMs = start - now;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMs / (60 * 60 * 1000));
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
      if (diffDays > 0)
        return { status: "waiting", value: `${diffDays} day(s) left` };
      if (diffHrs > 0)
        return { status: "waiting", value: `${diffHrs} hour(s) left` };
      if (diffMins > 5)
        return { status: "waiting", value: `${diffMins} minute(s) left` };
      return { status: "countdown", value: Math.floor(diffMs / 1000) }; // seconds
    }
    if (now > end) {
      return { status: "over", value: "Exam time is over" };
    }
  
    return { status: "ongoing", value: "Exam is ongoing" };
  };
  
  

  return (
    <div>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-6 text-gray-600 text-lg font-medium">
            Loading...
          </div>
        </div>
      ) : (
        <div>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LuGraduationCap className="h-8 w-8 text-blue-600" />
                    <h1 className="ml-2 text-2xl font-bold text-gray-900">
                      Student Exam Portal
                    </h1>
                  </div>
                </div>
              </div>
            </header>

            {/* Conditional Rendering */}
            {!examStarted ? (
              <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {examTime?.examTitle &&
                      toPascalCaseWithSpaces(examTime?.examTitle)}
                  </h2>
                  <div className="space-y-4 text-gray-600">
                    {/* <p>{examTime?.description}</p> */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Duration:</strong> {examTime?.time} minutes
                      </div>
                      <div>
                        <strong>Total Questions:</strong>{" "}
                        {examTime?.totalQuestions}
                      </div>
                      <div>
                        <strong>Passing Percentage:</strong>{" "}
                        {examTime?.passPercentage}%
                      </div>
                      <div>
                        <strong>Total Marks:</strong> {examTime?.totalMarks}
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="mt-8 bg-blue-50 rounded-lg p-6 mb-3">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                          <FiBookOpen className="w-5 h-5 mr-2" />
                          Important Instructions
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <FiAlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                            <p className="text-gray-700">
                              Do not open any other browser tabs or windows
                              during the exam. Doing so may result in the exam
                              being discarded.
                            </p>
                          </div>
                          <div className="flex items-start">
                            <LuMousePointer2 className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                            <p className="text-gray-700">
                              Ensure you have a stable internet connection
                              before starting the exam.
                            </p>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-md mt-4">
                            <p className="text-amber-800 text-sm">
                              By clicking &quot;Start Exam&quot;, you agree to these
                              conditions and understand that the timer will
                              begin immediately.
                            </p>
                          </div>
                        </div>
                      </div>
                      {examStatus?.status === "waiting" && (
                        <p className="text-yellow-600 text-lg font-medium">
                           {examStatus.value}
                        </p>
                      )}

                      {examStatus?.status === "countdown" && (
                        <div className="flex items-center space-x-2 text-red-600 font-mono text-xl">
                          <FaRegClock />
                          <span>{`${Math.floor(examStatus.value / 60)
                            .toString()
                            .padStart(2, "0")}:${(examStatus.value % 60)
                            .toString()
                            .padStart(2, "0")}`}</span>
                        </div>
                      )}

                      {examStatus?.status === "over" && (
                        <p className="text-red-600 text-lg font-semibold">
                          {examStatus.value}
                        </p>
                      )}

                      {examStatus?.status === "ongoing" && !examStarted && (
                        <>
                          <button
                            onClick={handleStartExam}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Start Exam
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {error && (
                    <span className="text-xs text-red-500">{error}</span>
                  )}
                </div>
              </main>
            ) : (
              // Exam Interface when examStarted is true
              <div>
                <h2 className="text-3xl font-semibold text-center">
                  Exam Started
                </h2>
                {/* Render the actual exam interface or questions here */}
                <div className="mt-8">
                  {/* Placeholder for exam content */}
                  <p>Here will be the exam questions and interface...</p>
                  {/* Call handleSubmitExam with the exam answers */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;