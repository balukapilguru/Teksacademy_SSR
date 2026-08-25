"use client";
import React, { useEffect, useState } from 'react';
import { IoAlertCircleOutline } from "react-icons/io5";

export function DescriptiveQuestion({ question, selectedAnswer = '', onAnswerChange }) {
  const wordLimit = question.wordLimit || 500;
  const [localAnswer, setLocalAnswer] = useState('    ');

  useEffect(() => {
    // Load saved answer on mount using question.id
    const savedAnswer = JSON.parse(localStorage.getItem(question.id))?.answerText
    if (savedAnswer !== null) {
      setLocalAnswer(savedAnswer);
      onAnswerChange(question.id, savedAnswer); // Sync with parent
    }
  }, [question.id ]);

  const wordCount = localAnswer ? localAnswer?.trim() === '' ? 0 : localAnswer.trim().split(/\s+/).length : 0

  const handleChange = (value) => {
    setLocalAnswer(value);
    onAnswerChange(question.id, value);

    // Save to localStorage with question.id as key
    // localStorage.setItem(question.id, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{question.questionText}</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-green-600">+{question.rewardMark} marks</span>
          {question.Penality > 0 && (
            <span className="text-sm text-red-600">-{question.Penality} penalty</span>
          )}
        </div>
      </div>

      <div className="mt-2">
        <textarea
          value={localAnswer}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full h-40 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
          placeholder="Type your answer here..."
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className={wordCount > wordLimit ? 'text-red-600' : 'text-gray-600'}>
          Words: {wordCount} / {wordLimit}
        </span>
        {wordCount > wordLimit && (
          <div className="flex items-center text-red-600">
            <IoAlertCircleOutline className="w-4 h-4 mr-1" />
            <span>Exceeded word limit</span>
          </div>
        )}
      </div>
    </div>
  );
}
