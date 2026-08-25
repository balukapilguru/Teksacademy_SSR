"use client";
import React, { useEffect, useState } from "react";

export function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
}) {
  const [localAnswer, setLocalAnswer] = useState(selectedAnswer || null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAnswer = JSON.parse(localStorage.getItem(question.id))?.selectedOptionId
    
    if (savedAnswer !== null) {
      setLocalAnswer(savedAnswer);
      onAnswerSelect(question.id, savedAnswer); // Sync with parent
    }
  }, [question.id]);

  const handleOptionClick = (optionId) => {
    // const newAnswer = localAnswer === optionId ? null : optionId;
    // console.log("hvgsjd", newAnswer)
    setLocalAnswer(optionId);
    onAnswerSelect(question.id, optionId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {question.questionText}
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

      <div className="space-y-3">
        {question.questionOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              localAnswer == option.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleOptionClick(option.id);
            }}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={localAnswer == option.id}
              onChange={() => {}}
              className="h-3 w-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">{option.optionText}</span>
          </label>
        ))}
      </div>

      {/* {localAnswer === null && (
        <div className="mt-4 text-sm text-gray-500 italic">
          Click an option to select it. Click again to deselect.
        </div>
      )} */}
    </div>
  );
}
