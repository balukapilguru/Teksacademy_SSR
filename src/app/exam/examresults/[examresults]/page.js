"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trophy,
  Target,
  Percent,
} from "lucide-react";
import { useParams } from "next/navigation";
import { LuRotateCcw } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Brain, CheckCircle2, ClipboardCheck } from "lucide-react";
import { LuBrain } from "react-icons/lu";
import { MdCheckCircleOutline } from "react-icons/md";
import { LuClipboardCheck } from "react-icons/lu";
import { MdMailOutline } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaRegClock } from "react-icons/fa";
import { IoMdHourglass } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";

const rawApiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  process.env.NEXT_BLOGS_APPLY_API_URL ||
  "https://l5h16h96-5060.inc1.devtunnels.ms";
const apiUrl = rawApiUrl.replace(/\/$/, "");

const ExamResults = () => {
  const [examData, setExamData] = useState();
  const [results, setResults] = useState();
  const [formId, setFormId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("");

  useEffect(() => {
    const examTimeAndDate = sessionStorage.getItem("ExamData");
    setExamData(JSON.parse(examTimeAndDate));

    setFormId(localStorage.getItem("formid"));

    setFormId(localStorage.getItem("formid"));

    // Prevent going back
    history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // useEffect(()=>{
  //   if(isLoading == false){
  //     setTimeout(()=>{
  //       router.push(`/`);
  //     }, 10000)

  //   }
  // }, [isLoading])

  const { examresults } = useParams();
  const router = useRouter();

  useEffect(() => {
    const evaluateExam = async () => {
      try {
        const response = await fetch(`${apiUrl}/exam/evaluate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: localStorage.getItem("studentExamAttemptId"),
            examId: examData?.examId,
            studentId: examData?.studentregisteredId,
          }),
        });

        const statusCode = response?.status;
        setApiStatus(statusCode);

        if (!response.ok) {
          throw new Error("Failed to fetch submitted response");
        }

        const data = await response.json();
        // Do something with the response, like setting state if needed
        setResults(data);
        console.log("Evaluation result:", data);
      } catch (error) {
        console.error("Error evaluating exam:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (examData) {
      evaluateExam();
    }
  }, [examData]);

  const getStatusColor = () => {
    if (results?.totalMarks < 0) return "text-red-600";
    if (results?.totalMarks >= results?.totalRewardMarks * 0.75)
      return "text-green-600";
    return "text-yellow-600";
  };

  const getStatusIcon = () => {
    if (results?.totalMarks < 0)
      return <XCircle className="w-12 h-12 text-red-600" />;
    if (results?.totalMarks >= results?.totalRewardMarks * 0.75)
      return <Trophy className="w-12 h-12 text-green-600" />;
    return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
  };

  const calculatePercentage = () => {
    if (results?.percentage !== null) return results?.percentage;
    return ((results?.totalMarks / results?.totalRewardMarks) * 100).toFixed(1);
  };

  const onReattempt = () => {
    // router.push('http://localhost:3000/exam/examresults/213');
    router.push(
      `/exam/${localStorage.getItem("formid")}/${localStorage.getItem(
        "formid"
      )}`
    );
  };

  const backToHome = () => {
    router.push(`/`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="relative">
              {/* Animated brain icon */}
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                <div className="relative bg-blue-50 rounded-full p-4">
                  <LuBrain className="w-12 h-12 text-blue-600" />
                </div>
              </div>

              {/* Progress steps */}
              <div className="max-w-xs mx-auto mb-8">
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <MdCheckCircleOutline className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Answers Collected
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6">
                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">
                        Evaluating Responses
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center opacity-50">
                    <div className="flex-shrink-0">
                      <LuClipboardCheck className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-400">
                        Preparing Results
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heading and message */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Evaluating Your Responses
            </h2>
            <p className="text-gray-600 mb-6">
              Please wait while we analyze your answers and calculate your
              score...
            </p>

            {/* Loading bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-loading" />
            </div>
          </div>
        </div>

        {/* Animation styles */}
        <style>{`
      @keyframes loading {
        0% { width: 0%; }
        50% { width: 70%; }
        75% { width: 85%; }
        90% { width: 95%; }
        100% { width: 100%; }
      }
      .animate-loading {
        animation: loading 2.5s ease-in-out forwards;
      }
    `}</style>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-xl shadow-xl p-8 text-center">
              <div className="relative">
                {/* Animated brain icon */}
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                  <div className="relative bg-blue-50 rounded-full p-4">
                    <LuBrain className="w-12 h-12 text-blue-600" />
                  </div>
                </div>

                {/* Progress steps */}
                <div className="max-w-xs mx-auto mb-8">
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MdCheckCircleOutline className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Answers Collected
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6">
                          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">
                          Evaluating Responses
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center opacity-50">
                      <div className="flex-shrink-0">
                        <LuClipboardCheck className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-400">
                          Preparing Results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heading and message */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Evaluating Your Responses
              </h2>
              <p className="text-gray-600 mb-6">
                Please wait while we analyze your answers and calculate your
                score...
              </p>

              {/* Loading bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-loading" />
              </div>
            </div>
          </div>

          {/* Animation styles */}
          <style>{`
      @keyframes loading {
        0% { width: 0%; }
        50% { width: 70%; }
        75% { width: 85%; }
        90% { width: 95%; }
        100% { width: 100%; }
      }
      .animate-loading {
        animation: loading 2.5s ease-in-out forwards;
      }
    `}</style>
        </div>
      ) : apiStatus === 200 ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white">
              <h2 className="text-3xl font-bold">Exam Results</h2>
              <p className="text-blue-100 mt-2">Your performance summary</p>
            </div>

            <div className="p-8">
              <div className="flex justify-center mb-8">{getStatusIcon()}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Questions Attempted
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {results?.totalQuestionsAttempted}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Trophy className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Total Score
                    </h3>
                  </div>
                  <p className={`text-3xl font-bold ${getStatusColor()}`}>
                    {results?.totalMarks} / {results?.totalRewardMarks}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Percent className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Performance
                    </h3>
                  </div>
                  <span className={`text-2xl font-bold ${getStatusColor()}`}>
                    {calculatePercentage()}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      results?.totalMarks < 0
                        ? "bg-red-500"
                        : results?.totalMarks >=
                          results?.totalRewardMarks * 0.75
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          results?.percentage === null ? 0 : results?.percentage
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {results?.eligibilityStatus && (
                <div
                  className={`rounded-xl p-6 ${
                    results?.totalMarks >= results?.totalRewardMarks * 0.75
                      ? "bg-green-50 border border-green-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <div className="flex items-center">
                    {results?.totalMarks >= results?.totalRewardMarks * 0.75 ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    )}
                    <h3
                      className={`text-lg font-semibold ${
                        results?.totalMarks >= results?.totalRewardMarks * 0.75
                          ? "text-green-800"
                          : "text-yellow-800"
                      }`}
                    >
                      {results?.eligibilityStatus || "Pending Review"}
                    </h3>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center ">
                {results?.currentStudentAttempt < results?.examMaxDetails && (
                  <button
                    onClick={onReattempt}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2"
                  >
                    <LuRotateCcw className="w-5 h-5 mr-2" />
                    Reattempt Exam
                  </button>
                )}
                <button
                  onClick={backToHome}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MdOutlineClose className="w-5 h-5 mr-2" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="p-8">
                <div className="relative mb-8">
                  <div className="absolute inset-0 animate-ping opacity-25">
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-100"></div>
                  </div>
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Brain className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Evaluation in Progress
                  </h2>

                  <p className="text-gray-600 max-w-md mx-auto">
                    Your exam is being evaluated. Results will be sent to your
                    registered mail address.
                  </p>

                  <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-center space-x-3">
                    <MdMailOutline className="w-5 h-5 text-indigo-600" />
                    <p className="text-sm text-indigo-700">
                      Keep an eye on your inbox for the detailed results
                    </p>
                  </div>

                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="flex items-center space-x-3 text-left">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <HiOutlineSparkles className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-green-100 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full w-full"></div>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Answers Collected
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="px-4 bg-white">
                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 space-y-2">
                    <p className="text-xs">
                      You can safely close this window. Results will be mailed
                      to you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 bg-gray-50 flex justify-center space-x-2">
                <div className="mt-8 flex justify-center ">
                  <button
                    onClick={backToHome}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <MdOutlineClose className="w-5 h-5 mr-2" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
