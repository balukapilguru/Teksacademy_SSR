"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const SelectedCourseContext = createContext({
  selectedCategory: "",
  setSelectedCategory: () => {},
  selectedSubCategory: "",
  setSelectedSubCategory: () => {},
  selectedProgram: "",
  setSelectedProgram: () => {},
});

export const SelectedCourseProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  // Load values from localStorage on mount
  useEffect(() => {
    setSelectedCategory(localStorage.getItem("selectedCategory") || "");
    setSelectedSubCategory(localStorage.getItem("selectedSubCategory") || "");
    setSelectedProgram(localStorage.getItem("selectedProgram") || "");
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    if (selectedCategory)
      localStorage.setItem("selectedCategory", selectedCategory);
    if (selectedSubCategory)
      localStorage.setItem("selectedSubCategory", selectedSubCategory);
    if (selectedProgram)
      localStorage.setItem("selectedProgram", selectedProgram);
  }, [selectedCategory, selectedSubCategory, selectedProgram]);

  return (
    <SelectedCourseContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        selectedProgram,
        setSelectedProgram,
      }}
    >
      {children}
    </SelectedCourseContext.Provider>
  );
};

export const useSelectedCourse = () => useContext(SelectedCourseContext);

