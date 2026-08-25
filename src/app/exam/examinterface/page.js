"use client";
import React, { useEffect, useState } from "react";
import { ExamTimer } from "../examtimer/page";
import { TbAlertTriangle } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import { IoAlertCircleOutline } from "react-icons/io5";
import { MultipleChoiceQuestion } from "../mcq/page";
import { MatchingQuestion } from "../matchthefollowing/page";
import { IoTimeOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { BsSend } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";
import { TfiSave } from "react-icons/tfi";
import { FaArrowRightLong } from "react-icons/fa6";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import { DescriptiveQuestion } from "../descriptivequestion/page";
import { FillInTheBlanksQuestion } from "../fillintheblank/page";
import { MdClear } from "react-icons/md";
// import ExamPreview from "../exampreview/page";

const rawApiUrl =
  process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL ||
  process.env.NEXT_BLOGS_APPLY_API_URL ||
  "https://l5h16h96-5060.inc1.devtunnels.ms";
const apiUrl = rawApiUrl.replace(/\/$/, "");

export function ExamInterface({
  exam,
  onSubmit,
  studentAttemp,
  studentregisteredId,
  examId,
}) {
  const [currentSection, setCurrentSection] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // srinu
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [examTime, setExamTime] = useState();
  const [timeExpired, setTimeExpired] = useState(false);
  const [initialAnswers, setinitialAnswers] = useState();
  const [examResults, setExamResults] = useState(null);
  const [tabisredirected, setTabresdirected] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState(() => new Set());
  const [clearAnswer, setClearAnswer] = useState(false);
  const [clearMCQ, setClearMCQ] = useState(false);
  const [clearFIB, setClearFIB] = useState(false);
  const [clearDISCRIP, setClearDISCRIP] = useState(false);

  const [match, setMatch] = useState([]);
  const [hydrated, setHydrated] = useState(false); // Controls render
  const sectionsOfExam = [
    ...new Set(exam.examQuestions.map((q) => q.sectionId)),
  ];

  const [reviewedQuestions, setReviewedQuestions] = useState(() => new Set());
  const [isSaved, setIsSaved] = useState(0);

  const { id } = useParams();

  const isLastSection = currentSection === Math.max(...sectionsOfExam);
  const isFirstSection = currentSection === Math.min(...sectionsOfExam);

  // Get questions for current section
  const currentSectionQuestions = exam.examQuestions.filter(
    (q) => q.sectionId === currentSection
  ); // srinu

  console.log("hfjdhfgsdh", currentSectionQuestions);

  // Get current question
  const currentQuestion = currentSectionQuestions[currentQuestionIndex]; // srinu

  // Check if current question is first or last in section
  const isFirstQuestionInSection = currentQuestionIndex === 0; // srinu
  const isLastQuestionInSection =
    currentQuestionIndex === currentSectionQuestions.length - 1; // srinu

  const transformExamQuestions = (examQuestions) => {
    const result = {};

    examQuestions.forEach((question) => {
      if (question.questionType === "Multiple Choice") {
        result[question.id] = null;
      } else if (question.questionType === "Match the Following") {
        const matchPairs = question.questionOptions
          .filter((option) => option.side === "Left")
          .map((leftOption) => ({
            left: leftOption.id,
            right: null,
          }));

        result[question.id] = matchPairs;
      }
    });

    return result;
  };

  // useEffect(() => {
  //   // Prevent going back
  //   history.pushState(null, "", window.location.href);
  //   const handlePopState = () => {
  //     history.pushState(null, "", window.location.href);
  //   };
  //   window.addEventListener("popstate", handlePopState);
  //   return () => window.removeEventListener("popstate", handlePopState);
  // }, []);

  // useEffect(() => {
  //   let savedQuestions = [];
  //   let reviewedQuestions = [];
  //   try {
  //     const saved = localStorage.getItem("savedQuestions");
  //     const reviewed = localStorage.getItem("reviewedQuestions");

  //     savedQuestions = saved ? new Set(JSON.parse(saved)) : new Set();
  //     reviewedQuestions = reviewed ? new Set(JSON.parse(reviewed)) : new Set();

  //     if (savedQuestions) {
  //       setSavedQuestions(savedQuestions);
  //     } else if (reviewedQuestions) {
  //       setReviewedQuestions(reviewedQuestions);
  //     }
  //   } catch {
  //     console.log("Error");
  //   }
  //   setHydrated(true); // Now it's safe to render
  // });

  // const ahsdhsfa = localStorage.getItem("savedQuestions")

  // console.log("dhfaf", ahsdhsfa)

  const toPascalCaseWithSpaces = (sentence) => {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const examTimeAndDate = sessionStorage.getItem("ExamData");
    setExamTime(JSON.parse(examTimeAndDate));
    setinitialAnswers(transformExamQuestions(exam?.examQuestions));
    // transformExamQuestions(exam)
  }, [exam]);

  // useEffect(() => {
  //   localStorage.setItem("savedQuestions", [...savedQuestions]);
  //   localStorage.setItem(
  //     "reviewedQuestions",
  //     [...reviewedQuestions]   );
  // }, [savedQuestions || reviewedQuestions]);

  const mergeAnswers = (a, b) => {
    const merged = {};
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

    for (const key of allKeys) {
      const fromA = a[key];
      const fromB = b[key];

      // Match the Following: array of { left, right }
      if (
        Array.isArray(fromB) &&
        fromB.every((item) => typeof item === "object" && "left" in item)
      ) {
        merged[key] = fromB.map((pair) => {
          const matchFromA = Array.isArray(fromA)
            ? fromA.find((item) => item.left === pair.left)
            : null;

          return matchFromA
            ? { left: pair.left, right: matchFromA.right }
            : pair;
        });

        // Fill in the Blanks: array of strings
      } else if (Array.isArray(fromA) && typeof fromA[0] === "string") {
        merged[key] = fromA;

        // Descriptive / Multiple Choice
      } else if (fromA !== undefined) {
        merged[key] = fromA;
      } else {
        merged[key] = fromB;
      }
    }

    return merged;
  };

  const handleTimeUp = () => {
    setTimeExpired(true);
    handleFinalSubmit({ autosubmit: true });
  };

  const handleMultipleChoiceAnswer = (questionId, optionId) => {
    if (timeExpired) return;
    setClearMCQ(false);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    setShowWarning(false);

    console.log("hsjadhds", answers);
  };

  const handleMatchingAnswer = (questionId, pairs) => {
    if (timeExpired) return;
    setClearAnswer(false);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: pairs,
    }));
    setShowWarning(false);
  };

  const handleFillTheBlankAnswer = (questionId, newAnswers) => {
    if (timeExpired) return;
    setClearFIB(false);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: newAnswers,
    }));
    setShowWarning(false);
  };

  const handleDescriptiveAnswer = (questionId, value) => {
    if (timeExpired) return;
    setClearDISCRIP(false);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setShowWarning(false);
  };

  const isCurrentSectionComplete = () => {
    const currentQuestions = exam.examQuestions.filter(
      (q) => q.sectionId === currentSection
    );
    return currentQuestions.every((question) => {
      const answer = answers[question.id];
      if (question.questionType === "Multiple Choice") {
        return answer !== undefined;
      } else {
        return (
          answer &&
          Array.isArray(answer) &&
          answer.length ===
            question.questionOptions.filter((o) => o.side === "Left").length
        );
      }
    });
  };

  const isAllQuestionsAnswered = () => {
    return exam.examQuestions.every((question) => {
      const answer = answers[question.id];
      if (question.questionType === "Multiple Choice") {
        return answer !== undefined;
      } else {
        return (
          answer &&
          Array.isArray(answer) &&
          answer.length ===
            question.questionOptions.filter((o) => o.side === "Left").length
        );
      }
    });
  };

  const handleSectionChange = (newSection) => {
    if (timeExpired) return;
    setCurrentSection(newSection);
    setCurrentQuestionIndex(0); // srinu
  };

  const handleNextQuestion = () => {
    if (timeExpired) return;

    if (isLastQuestionInSection) {
      // If last question in section, move to next section
      if (!isLastSection) {
        const nextSection =
          sectionsOfExam[sectionsOfExam.indexOf(currentSection) + 1];
        if (nextSection) {
          setCurrentSection(nextSection);
          setCurrentQuestionIndex(0); // Start at first question of new section
        }
      }
    } else {
      // Move to next question in current section
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (timeExpired) return;

    if (isFirstQuestionInSection) {
      // If first question in section, move to previous section's last question
      if (!isFirstSection) {
        const prevSection =
          sectionsOfExam[sectionsOfExam.indexOf(currentSection) - 1];
        if (prevSection) {
          const prevSectionQuestions = exam.examQuestions.filter(
            (q) => q.sectionId === prevSection
          );
          setCurrentSection(prevSection);
          setCurrentQuestionIndex(prevSectionQuestions.length - 1); // Go to last question of previous section
        }
      }
    } else {
      // Move to previous question in current section
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelection = (questionId, index) => {
    if (timeExpired) return;

    const saved = localStorage.getItem(`match-${questionId}`);

    if (saved) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: JSON.parse(saved),
      }));
    }

    // Find the question in the exam
    const question = exam.examQuestions.find((q) => q.id === questionId);
    if (!question) return;

    // Change to the section containing this question
    if (question.sectionId !== currentSection) {
      setCurrentSection(question.sectionId);

      // Find the index of this question within its section
      const sectionQuestions = exam.examQuestions.filter(
        (q) => q.sectionId === question.sectionId
      );
      const questionIndexInSection = sectionQuestions.findIndex(
        (q) => q.id === questionId
      );
      setCurrentQuestionIndex(
        questionIndexInSection >= 0 ? questionIndexInSection : 0
      );
    } else {
      // If already in the correct section, just update the question index
      const questionIndexInSection = currentSectionQuestions.findIndex(
        (q) => q.id === questionId
      );
      setCurrentQuestionIndex(
        questionIndexInSection >= 0 ? questionIndexInSection : 0
      );
    }
  };

  const updateTheObj = (data) => {
    const responses = [];

    for (const key in data) {
      const questionId = parseInt(key);
      const question = exam.examQuestions.find((q) => q.id === questionId);

      if (!question) continue; // Safety check

      const answerValue = data[key];

      switch (question.questionType) {
        case "Multiple Choice":
          responses.push({
            questionsId: questionId,
            selectedOptionId: answerValue !== undefined ? answerValue : null,
          });
          break;

        case "Descriptive":
          responses.push({
            questionsId: questionId,
            answerText: answerValue || "", // Store the full text
          });
          break;

        case "Fill in the Blanks":
          responses.push({
            questionsId: questionId,
            answerText: typeof answerValue === "string" ? answerValue : "", // plain string only
          });
          break;

        case "Match the Following":
          if (Array.isArray(answerValue)) {
            const questionPairs = answerValue.map((pair) => [
              pair.left,
              pair.right,
            ]);
            responses.push({
              questionsId: questionId,
              questionPairs,
            });
          } else {
            responses.push({
              questionsId: questionId,
              questionPairs: [],
            });
          }
          break;

        default:
          // Handle unknown question types if needed
          console.warn(`Unknown question type for questionId ${questionId}`);
      }
    }

    const finalResult = {
      studentExamId: studentAttemp,
      responses,
    };

    return finalResult;
  };

  const router = useRouter();

  const handleFinalSubmit = (autosubmit = false) => {
    const unansweredCount = Object.keys(answers).filter(
      (key) => answers[key] === null || answers[key] === ""
    ).length;

    if (!autosubmit) {
      console.log("Not Auto func Run")
      if (!isAllQuestionsAnswered()) {
        console.log("Not Auto func Run 2")
        Swal.fire({
          title: "Are you sure?",
          text: "You haven't answered all questions. Are you sure you want to submit?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Submit!",
          cancelButtonText: "No, Go Back",
        }).then((result) => {
          if (result.isConfirmed) {
            console("routing to results of exam")
            // submitToApi(); // Only submit if user confirmed
            // router.push(`/exam/examresults/${studentAttemp}`);
          }
        });
      } else {        
        console.log("Not Auto Else func Run 1")
        
        // submitToApi();
        router.push(`/exam/examresults/${studentAttemp}`);
      }
    } else {
      // All questions answered, submit directly
      console.log("Not Auto Else func Run 2")
      // submitToApi();
      router.push(`/exam/examresults/${studentAttemp}`);
    }
  };

  const sectionMap = new Map();
  exam.examQuestions.forEach((q) => {
    if (!sectionMap.has(q.sectionId)) {
      sectionMap.set(q.sectionId, q.sectionName);
    }
  });

  const sections = Array.from(sectionMap.entries()).map(([id, name]) => ({
    id,
    name,
  }));

  const handleShowPreview = async (questionId) => {
    if (timeExpired || submitted) return;

    setSavedQuestions((prev) => new Set([...prev, questionId]));

    const transformedData = mergeAnswers(answers, initialAnswers);
    const payloadData = updateTheObj(transformedData);

    const url = `${apiUrl}/exam/getPreview/${localStorage.getItem(
      "studentExamAttemptId"
    )}?examId=${examId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Debugging help
        throw new Error(`Failed to fetch preview: ${errorText}`);
      }

      const data = await response.json();

      const resultData = data?.result || [];

      const answered = resultData.find((item) => item.saved === 1)?.Count || 0;
      const review = resultData.find((item) => item.saved === 0)?.Count || 0;
      const unanswered =
        resultData.find((item) => item.saved === null)?.Count || 0;
      const total = answered + review + unanswered;

      setPreviewData({
        answered,
        review,
        unanswered,
        total,
      });
      setShowPreview(true);
    } catch (error) {
      console.error("❌ Error fetching preview:", error.message);
    }
  };

  // Now process the questions

  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestions = exam.examQuestions.length;

  const handleBackToExam = () => {
    setShowPreview(false);
  };

  const nullifyAllValues = (obj) => {
    const updated = {};

    for (const key in obj) {
      if (key === "questionsId") {
        updated[key] = obj[key]; // keep original value
      } else if (Array.isArray(obj[key]) && key === "questionPairs") {
        // Special handling for questionPairs
        updated[key] = obj[key].map(([left, _]) => [left, null]);
      } else {
        updated[key] = null;
      }
    }

    return updated;
  };

  const handleConfirmAnswer = (questionId) => {
    console.log(
      "svsdnfv",
      Boolean(
        answers?.hasOwnProperty(questionId) &&
          answers[questionId]?.toString().trim().length > 0
      )
    );
    if (timeExpired || submitted) return;
    setSavedQuestions((prev) => new Set([...prev, questionId]));
    setReviewedQuestions((prev) => {
      const updated = new Set(prev);
      updated.delete(questionId); // remove from review if saved
      return updated;
    });

    const transformedData = mergeAnswers(answers, initialAnswers); //api
    const payloadData = updateTheObj(transformedData);
    const obj = payloadData.responses.find(
      (item) => item.questionsId === questionId
    );

    const sending = {
      studentExamId: localStorage.getItem("studentExamAttemptId"),

      responses: { ...obj, saved: 1 },
    };

    fetch(`${apiUrl}/exam/saveExamResponse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sending),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit response");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ API Success Response:", data);
        localStorage.setItem(
          sending?.responses?.questionsId,
          JSON.stringify(sending?.responses)
        );
      });

    localStorage.setItem("savedQuestions", [...savedQuestions]);
  };

  const handleReviewAnswer = (questionId) => {
    if (timeExpired || submitted) return;
    setReviewedQuestions((prev) => new Set([...prev, questionId]));
    setSavedQuestions((prev) => {
      const updated = new Set(prev);
      updated.delete(questionId); // remove from saved if reviewed
      return updated;
    });

    const transformedData = mergeAnswers(answers, initialAnswers); //api
    const payloadData = updateTheObj(transformedData);
    const obj = payloadData.responses.find(
      (item) => item.questionsId === questionId
    );

    const review = {
      studentExamId: localStorage.getItem("studentExamAttemptId"),

      responses: { ...obj, saved: 0 },
    };

    console.log("hdhgasa", review?.responses);

    fetch(`${apiUrl}/exam/saveExamResponse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit response");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ API Success Response:", data);
        localStorage.setItem(
          review?.responses?.questionsId,
          JSON.stringify(review?.responses)
        );
      });
  };

  const handleRemoveAnswer = (questionId) => {
    if (timeExpired || submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: null,
    }));
    setClearAnswer(true);
    localStorage.removeItem(questionId);

    setReviewedQuestions((prev) => {
      const updated = new Set(prev);
      updated.delete(questionId); // remove from review
      return updated;
    });
    setSavedQuestions((prev) => {
      const updated = new Set(prev);
      updated.delete(questionId); // remove from saved
      return updated;
    });

    const transformedData = mergeAnswers(answers, initialAnswers); //api
    const payloadData = updateTheObj(transformedData);
    const obj = payloadData.responses.find(
      (item) => item.questionsId === questionId
    );

    const updated = nullifyAllValues(obj);

    const review = {
      studentExamId: localStorage.getItem("studentExamAttemptId"),

      responses: { ...updated, saved: null },
    };

    fetch(`${apiUrl}/exam/saveExamResponse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit response");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ API Success Response:", data);
      });
  };

  if (timeExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <IoTimeOutline className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Time&apos;s Up!
            </h2>
            <p className="text-gray-600 mb-6">
              Your exam has been automatically submitted as the allocated time
              has expired.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <span>Questions Answered:</span>
                <span className="font-semibold">
                  {answeredQuestionsCount}/{totalQuestions}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${
                      (answeredQuestionsCount / totalQuestions) * 100
                    }%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Your responses have been recorded and will be evaluated.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <ExamTimer
        duration={parseInt(examTime?.time) * 60}
        onTimeUp={handleTimeUp}
      />

      <div className="main_container px-4 py-8">
        {showPreview ? (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 rounded-lg p-4 flex items-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">
                    {previewData?.answered} Questions Answered
                  </span>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
                  <IoAlertCircleOutline className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-800">
                    {previewData?.review} Marked for Review
                  </span>
                </div>

                <div className="bg-red-50 rounded-lg p-4 flex items-center">
                  <IoAlertCircleOutline className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">
                    {previewData?.unanswered} Questions Unanswered
                  </span>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                  <span className="text-blue-600 font-bold text-lg mr-2">
                    Total:
                  </span>
                  <span className="font-medium text-blue-800">
                    {previewData?.total} Questions
                  </span>
                </div>
              </div>

              {/* Warning */}
              {(previewData?.review > 0 || previewData?.unanswered > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                  <div className="flex items-start">
                    <IoAlertCircleOutline className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                    <p className="text-amber-800 text-sm">
                      {previewData?.review > 0 ? (
                        <>
                          You have {previewData.review} questions marked for
                          review. Are you sure you want to submit the exam?
                        </>
                      ) : (
                        <>
                          You have {previewData.unanswered} unanswered
                          questions. Are you sure you want to submit the exam?
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={handleBackToExam}
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  <FaArrowLeft className="w-5 h-5 mr-2" />
                  Back to Exam
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <BsSend className="w-5 h-5 mr-2" />
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            {/* Sidebar */}
            <div className="hidden xl:flex xl:w-64 bg-white shadow-lg rounded-2xl flex-col max-h-[560px]">
              <div className="text-center font-medium border-b p-3">
                Questions
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2">
                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-3">
                  {exam.examQuestions.map((question, index) => {
                    const isAnswered =
                      answers[question.id] !== undefined &&
                      answers[question.id] !== null;
                    const isActive = question.id === currentQuestion?.id;

                    return (
                      <div key={question.id} className="flex justify-center">
                        <div
                          onClick={() => handleQuestionSelection(question.id)}
                          className={`w-9 h-9 flex justify-center items-center text-sm rounded-full border cursor-pointer transition
                          ${
                            isActive
                              ? "bg-blue-500 text-white border-blue-600 ring-2 ring-offset-1 ring-blue-300"
                              : reviewedQuestions.has(question.id) ||
                                JSON.parse(localStorage.getItem(question.id))
                                  ?.saved == 0
                              ? "bg-yellow-100 border-yellow-500 text-yellow-800 ring-1 ring-yellow-300"
                              : isAnswered ||
                                savedQuestions.has(question.id) ||
                                JSON.parse(localStorage.getItem(question.id))
                                  ?.saved == 1
                              ? "bg-green-100 border-green-500 text-green-800 ring-1 ring-green-300"
                              : "bg-white border-gray-300 text-gray-700"
                          }
                          hover:shadow-md`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="p-3 border-t text-xs space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>{" "}
                  <span>Attempted</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>{" "}
                  <span>Saved</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-3 h-3 rounded-full border border-gray-300 bg-white"></span>{" "}
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Main Exam Area */}
            <div className="flex-1">
              {/* Question bar at top for mobile and tablets */}
              <div className="block xl:hidden mb-4">
                <div className="bg-white shadow-lg rounded-2xl p-3">
                  <div className="text-center font-medium border-b p-2 ">
                    Questions
                  </div>
                  <div className="overflow-x-auto  pb-2">
                    <div className="flex gap-2 pt-3">
                      {exam.examQuestions.map((question, index) => {
                        const isAnswered =
                          answers[question.id] !== undefined &&
                          answers[question.id] !== null;
                        const isActive = question.id === currentQuestion?.id;

                        return (
                          <div key={question.id} className="flex-shrink-0">
                            <div
                              onClick={() =>
                                handleQuestionSelection(question.id)
                              }
                              className={`w-9 h-9 flex justify-center items-center text-sm rounded-full border cursor-pointer transition
                  ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-600 ring-2 ring-offset-1 ring-blue-300"
                      : reviewedQuestions.has(question.id) ||
                        JSON.parse(localStorage.getItem(question.id))?.saved ==
                          0
                      ? "bg-yellow-100 border-yellow-500 text-yellow-800 ring-1 ring-yellow-300"
                      : isAnswered ||
                        savedQuestions.has(question.id) ||
                        JSON.parse(localStorage.getItem(question.id))?.saved ==
                          1
                      ? "bg-green-100 border-green-500 text-green-800 ring-1 ring-green-300"
                      : "bg-white border-gray-300 text-gray-700"
                  } hover:shadow-md`}
                            >
                              {index + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Info */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                {examTime?.examTitle && (
                  <p className="text-gray-600 text-base font-semibold">
                    {toPascalCaseWithSpaces(examTime?.examTitle)}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>Total Questions: {exam.noOfQuestions}</span>
                  <span>Total Marks: {exam.marks}</span>
                  <span>Pass Percentage: {exam.passingPercentage}%</span>
                </div>
              </div>

              {/* Sections */}
              <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section?.id)}
                      className={`px-4 py-2 rounded-md text-sm whitespace-nowrap transition
                      ${
                        currentSection === section?.id
                          ? "bg-blue-500 text-white"
                          : section > currentSection &&
                            !isCurrentSectionComplete()
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {section?.name || `Section ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>

              {showWarning && (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 flex items-center text-sm text-yellow-800 mb-4">
                  <IoAlertCircleOutline className="w-5 h-5 mr-2" />
                  Please complete all questions before proceeding.
                </div>
              )}

              {/* Current Question */}
              {currentQuestion && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-4 space-y-4">
                  {currentQuestion.questionType === "Multiple Choice" && (
                    <MultipleChoiceQuestion
                      question={currentQuestion}
                      selectedAnswer={answers[currentQuestion.id] || null}
                      onAnswerSelect={handleMultipleChoiceAnswer}
                    />
                  )}
                  {currentQuestion.questionType === "Match the Following" && (
                    <MatchingQuestion
                      question={currentQuestion}
                      onAnswerSelect={handleMatchingAnswer}
                      savedQuestions
                      selectedAnswer={answers[currentQuestion.id]}
                      clearAnswer
                    />
                  )}
                  {currentQuestion.questionType === "Fill in the Blanks" && (
                    <FillInTheBlanksQuestion
                      question={currentQuestion}
                      selectedAnswer={answers[currentQuestion.id] || []}
                      onAnswerChange={handleFillTheBlankAnswer}
                    />
                  )}
                  {currentQuestion.questionType === "Descriptive" && (
                    <DescriptiveQuestion
                      question={currentQuestion}
                      selectedAnswer={answers[currentQuestion.id] || ""}
                      onAnswerChange={handleDescriptiveAnswer}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      disabled={
                        !(
                          answers?.hasOwnProperty(currentQuestion.id) &&
                          answers[currentQuestion.id]?.toString().trim()
                            .length > 0
                        )
                      }
                      onClick={() => handleConfirmAnswer(currentQuestion.id)}
                      className={`flex items-center px-4 py-2 rounded-md transition
                      ${
                        savedQuestions.has(currentQuestion.id) ||
                        JSON.parse(localStorage.getItem(currentQuestion.id))
                          ?.saved == 1
                          ? "bg-green-100 border border-green-500 text-green-800"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }
                      ${
                        !(
                          answers?.hasOwnProperty(currentQuestion.id) &&
                          answers[currentQuestion.id]?.toString().trim()
                            .length > 0
                        )
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <TfiSave className="w-4 h-4 mr-2" />
                      Answer Saved
                    </button>

                    <button
                      disabled={
                        !(
                          answers?.hasOwnProperty(currentQuestion.id) &&
                          answers[currentQuestion.id]?.toString().trim()
                            .length > 0
                        )
                      }
                      onClick={() => handleReviewAnswer(currentQuestion.id)}
                      className={`flex items-center px-4 py-2 rounded-md transition
                      ${
                        reviewedQuestions.has(currentQuestion.id) ||
                        JSON.parse(localStorage.getItem(currentQuestion.id))
                          ?.saved == 0
                          ? "bg-yellow-100 border border-yellow-500 text-yellow-800"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }
                      ${
                        !(
                          answers?.hasOwnProperty(currentQuestion.id) &&
                          answers[currentQuestion.id]?.toString().trim()
                            .length > 0
                        )
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <TfiSave className="w-4 h-4 mr-2" />
                      Mark for Review
                    </button>
                  </div>
                </div>
              )}
               <div className="mt-8 flex items-center justify-between">
          {!(isFirstQuestionInSection && isFirstSection) ? (
            <button
              onClick={handlePreviousQuestion}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
          ) : (
            <div></div>
          )}
          {isLastQuestionInSection && isLastSection ? (
            <button
              onClick={handleShowPreview}
              disabled={submitted}
              className={`px-6 py-3 rounded-md text-white font-medium flex items-center
                              ${
                                submitted
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
            >
              <BsSend className="w-4 h-4 mr-2" />
              Submit
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
              <FaArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
            </div>
            
          </div>
          
        )}
       
      </div>
    </div>
  );
}
