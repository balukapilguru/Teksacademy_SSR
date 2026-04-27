"use client";
import React, { createContext, useContext, useRef, useState } from "react";
 
const CourseFlowContext = createContext(null);
 
export const useCourseFlow = () => useContext(CourseFlowContext);
 
export default function CourseFlowProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const programRef = useRef(null);
 
  const handleCourseSelect = (course) => {
    setSelectedItem(course);
 
    programRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
 
  return (
    <CourseFlowContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        handleCourseSelect,
        programRef,
      }}
    >
      {children}
    </CourseFlowContext.Provider>
  );
}
