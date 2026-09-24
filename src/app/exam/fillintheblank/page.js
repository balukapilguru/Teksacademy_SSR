"use client";
import React, { useEffect, useState } from "react";

export function FillInTheBlanksQuestion({
  question,
  selectedAnswer = "",
  onAnswerChange,
}) {
  const [localAnswer, setLocalAnswer] = useState("");

  useEffect(() => {
    // Load individual answer using question.id as the key
    const savedAnswer = JSON.parse(localStorage.getItem(question.id))?.answerText
    if (savedAnswer !== null) {
      setLocalAnswer(savedAnswer);
      onAnswerChange(question.id, savedAnswer); // Sync with parent
    }
  }, [question.id]);

  const handleInputChange = (value) => {
    setLocalAnswer(value);
    onAnswerChange(question.id, value);

    // Save answer directly with question.id as the key
    // localStorage.setItem(question.id, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Fill in the blanks:
        </h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-green-600">
            +{question.rewardMark} marks
          </span>
          {question.Penality > 0 && (
            <span className="text-sm text-red-600">
              -{question.Penality} penalty
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-gray-700">
        <span>{question.questionText}</span>
        <input
          type="text"
          value={localAnswer}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-32 px-2 py-1 border-2 border-gray-200 rounded focus:outline-none focus:border-blue-400 transition"
          placeholder="Answer"
        />
      </div>
    </div>
  );
}
