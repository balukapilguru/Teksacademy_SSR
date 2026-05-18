"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const InterviewQuestionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openQuestions, setOpenQuestions] = useState({});
  
  const API_BASE_URL = "https://0z05cks3-4040.inc1.devtunnels.ms/api/v1";

  useEffect(() => {
    const fetchQuestionDetail = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const apiUrl = `${API_BASE_URL}/interview-questions/${slug}`;
        console.log("Fetching from:", apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setQuestionData(result.data);
          
          if (result.data.meta) {
            document.title = result.data.meta.title;
          }
        } else {
          setError("No data received");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionDetail();
  }, [slug]);

  const toggleQuestion = (questionId) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleCopyCode = (text, questionId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(questionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          {answer.map((point, idx) => (
            <li key={idx} className="text-gray-700 leading-relaxed">{point}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{answer}</p>;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A619D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (error || !questionData) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Interview questions not found"}</p>
          <button
            onClick={() => router.push("/resources/interview-questions")}
            className="px-4 py-2 bg-[#2A619D] text-white rounded mr-2"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-[#2A619D] text-[#2A619D] rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const questions = questionData.interviewQuestionsSection?.questions || [];
  const heroSection = questionData.heroSection;
  const questionsSection = questionData.interviewQuestionsSection;
  const ctaSection = questionData.ctaSection;

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {questionsSection?.heading || "Interview Questions & Answers"}
          </h2>
          <div className="w-20 h-1 bg-[#FE543D] mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-500 mt-3 text-sm">
            Total {questions.length} Questions
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {questions.map((item, index) => (
            <div key={item.id || index} className="bg-white rounded-lg shadow-sm border border-gray-100">
              <button
                onClick={() => toggleQuestion(item.id || index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex-1 pr-4">
                  <span className="text-[#2A619D] font-bold mr-2">Q{index + 1}.</span>
                  <span className="text-gray-800 font-medium">{item.question}</span>
                </div>
                {openQuestions[item.id || index] ? 
                  <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                }
              </button>

              {openQuestions[item.id || index] && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-[#FE543D] font-semibold text-sm">Answer:</h3>
                      {item.code && (
                        <button
                          onClick={() => handleCopyCode(item.code, item.id || index)}
                          className="flex items-center gap-1 text-sm text-[#2A619D] bg-white px-2 py-1 rounded border"
                        >
                          {copiedId === (item.id || index) ? 
                            <><Check className="w-3 h-3" /><span>Copied!</span></> : 
                            <><Copy className="w-3 h-3" /><span>Copy Code</span></>
                          }
                        </button>
                      )}
                    </div>
                    {formatAnswer(item.answer)}
                    {item.code && (
                      <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">{item.code}</code>
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {ctaSection && (
        <div className="bg-gradient-to-r from-[#2A619D] to-[#1e4a7a] text-white py-12">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{ctaSection.heading}</h2>
            <p className="text-blue-100 mb-6">{ctaSection.description}</p>
            <button className="bg-[#FE543D] hover:bg-[#e6442e] text-white font-semibold px-8 py-3 rounded-lg">
              {ctaSection.button?.text || "Enquire Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewQuestionDetailPage;