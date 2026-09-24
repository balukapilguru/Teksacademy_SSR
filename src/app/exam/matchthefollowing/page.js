"use client";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { ArrowRight, GripHorizontal, CheckCircle } from "lucide-react";

export function MatchingQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  clearAnswer,
}) {
  const leftOptions = question.questionOptions.filter(
    (opt) => opt.side === "Left"
  );
  const rightOptions = question.questionOptions.filter(
    (opt) => opt.side === "Right"
  );

  const [pairs, setPairs] = useState(selectedAnswer ?? []);

  console.log("cvnxzbnzbc", question, selectedAnswer);

  const [draggingId, setDraggingId] = useState(null);
  const [draggingOption, setDraggingOption] = useState(null);
  console.log(pairs, "pairs");

  useEffect(() => {
    if (selectedAnswer) {
      setPairs(selectedAnswer); // 👈 Also update if prop changes
    }
    if (clearAnswer) {
      setPairs(selectedAnswer ?? []);
    }
  }, [selectedAnswer]);

  useEffect(() => {
    if (selectedAnswer) {
      setPairs(selectedAnswer); // 👈 Also update if prop changes
    }
  }, [selectedAnswer]);

  useEffect(() => {
    if (pairs?.length) {
      localStorage.setItem(`match-${question.id}`, JSON.stringify(pairs));
    } else {
      // localStorage.removeItem(`match-${question.id}`);
    }
  }, [question.id, pairs]);

  // Handle clearAnswer externally
  useEffect(() => {
    if (clearAnswer) {
      // setPairs([]);
      // localStorage.removeItem(`match-${question.id}`);
    }
  }, [clearAnswer]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setDraggingId(Number(active.id));
    const option = leftOptions.find((opt) => opt.id === Number(active.id));
    setDraggingOption(option || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const leftId = Number(active.id);
    const rightId = Number(over.id);

    const existingPairWithLeft = pairs.find((p) => p.left === leftId);
    const existingPairWithRight = pairs.find((p) => p.right === rightId);

    if (existingPairWithLeft) {
      const newPairs = pairs.map((p) =>
        p.left === leftId ? { ...p, right: rightId } : p
      );
      setPairs(newPairs);
      onAnswerSelect(question.id, newPairs);
    } else if (!existingPairWithRight) {
      const newPairs = [...pairs, { left: leftId, right: rightId }];
      setPairs(newPairs);
      onAnswerSelect(question.id, newPairs);
    }

    setDraggingId(null);
    setDraggingOption(null);
  };

  const isMatched = (optionId, side) => {
    return pairs.some((p) =>
      side === "left" ? p.left === optionId : p.right === optionId
    );
  };

  const getMatchedPair = (optionId, side) => {
    const pair = pairs.find((p) =>
      side === "left" ? p.left === optionId : p.right === optionId
    );
    if (!pair) return null;

    const matchedOption =
      side === "left"
        ? rightOptions.find((o) => o.id === pair.right)
        : leftOptions.find((o) => o.id === pair.left);

    return matchedOption;
  };

  const removePair = (leftId) => {
    const newPairs = pairs.filter((p) => p.left !== leftId);
    setPairs(newPairs);
    onAnswerSelect(question.id, newPairs);
  };

  const DraggableItem = ({ option }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: option.id,
    });

    const matched = isMatched(option.id, "left");
    const matchedOption = getMatchedPair(option.id, "left");

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="relative group"
      >
        <div
          className={`p-4 rounded-lg transition-all duration-200 ${
            isDragging
              ? "opacity-50"
              : matched
              ? "bg-green-50 border-2 border-green-500 shadow-sm"
              : "bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-md cursor-grab active:cursor-grabbing"
          }`}
          style={{ boxSizing: "border-box" }}
        >
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3">
              <GripHorizontal
                className={`w-4 h-4 ${
                  matched ? "text-green-500" : "text-blue-400"
                }`}
              />
              <span
                className={`font-medium ${
                  matched ? "text-green-700" : "text-gray-700"
                }`}
              >
                {option.optionText}
              </span>
            </div>
            {matched && matchedOption && (
              <div className="flex items-center">
                <ArrowRight className="w-4 h-4 text-green-500 mx-2" />
                <span className="text-green-700 font-medium">
                  {matchedOption.optionText}
                </span>
                <button
                  onClick={() => removePair(option.id)}
                  className="ml-3  text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DroppableItem = ({ option }) => {
    const { setNodeRef } = useDroppable({
      id: option.id,
    });

    const matched = isMatched(option.id, "right");
    const isDragTarget = !!draggingId && !matched;

    return (
      <div
        ref={setNodeRef}
        className={`p-4 rounded-lg transition-all duration-200 ${
          matched
            ? "bg-green-50 border-2 border-green-500"
            : isDragTarget
            ? "bg-blue-50 border-2 border-blue-300 border-dashed shadow-md transform scale-105"
            : "bg-white border-2 border-gray-200 hover:border-blue-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-2 h-2 rounded-full ${
              matched ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span
            className={matched ? "text-green-700 font-medium" : "text-gray-600"}
          >
            {option.optionText}
          </span>
        </div>
        {!matched && isDragTarget && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="text-blue-500 font-medium"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 w-full">
     <div className="flex flex-col lg:flex-row justify-between gap-4 items-start mb-6">

        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
            {question.questionText}
          </h3>
          <p className="text-xs text-gray-500">
            Drag items from the left column and drop them onto matching items in
            the right column
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-green-600">
            +{question.rewardMark} marks
          </span>
          {question.Penality > 0 && (
            <span className="text-red-600">-{question.Penality} penalty</span>
          )}
          <span className="text-gray-500">
            {pairs.length}/{leftOptions.length} matched
          </span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Left Column */}
          <div>
            <h4 className="font-medium text-gray-700 flex items-center mb-4">
              <span>Drag these items</span>
              <div className="flex-1 h-px bg-gray-200 ml-4" />
            </h4>
            <div className="space-y-4">
              {leftOptions.map((option) => (
                <DraggableItem key={option.id} option={option} />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h4 className="font-medium text-gray-700 flex items-center mb-4">
              <span>Drop to match</span>
              <div className="flex-1 h-px bg-gray-200 ml-4" />
            </h4>
            <div className="space-y-4">
              {rightOptions.map((option) => (
                <DroppableItem key={option.id} option={option} />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {draggingOption && (
            <div className="p-4 rounded-lg bg-white border-2 border-blue-400 shadow-lg">
              <div className="flex items-center space-x-3">
                <GripHorizontal className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-gray-700">
                  {draggingOption.optionText}
                </span>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {pairs.length === leftOptions.length && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>All items have been matched successfully!</span>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h5 className="font-medium text-blue-700 mb-2">How to match items:</h5>
        <ol className="list-decimal list-inside text-blue-600 space-y-1 text-sm">
          <li>Click and hold any item from the left column</li>
          <li>Drag it to the matching item in the right column</li>
          <li>Release to create a match</li>
          <li>Click the × button to remove a match if needed</li>
        </ol>
      </div>
    </div>
  );
}
