"use client";
import React, { useState, useEffect } from "react";

const FormStepUniversity = ({ formData, onChange, forceValidation, error }) => {
  const selectedCourse = formData.selectedCourse;



  // In FormStepUniversity.js, update the handleChange function:
  const handleChange = (e) => {
    const selectedSourceId = Number(e.target.value);
   

    if (!selectedSourceId) {
      onChange({
        university: "",
        sourceId: "",
        ProductId: formData.ProductId || formData.productId || "",
        productId: formData.productId || formData.ProductId || "",
      });
      return;
    }

    const selectedUni = selectedCourse?.universities?.find(
      (u) => u.sourceId === selectedSourceId,
    );

    

    if (selectedUni) {
      // Get productId from university, checking both cases
      const productId =
        selectedUni.productId ||
        selectedUni.ProductId ||
        formData.productId ||
        formData.ProductId ||
        "";

      onChange({
        university: selectedUni.universityName || selectedUni.name || "",
        sourceId: selectedUni.sourceId,
        ProductId: productId, // uppercase
        productId: productId, // lowercase
      });
    }
  };

  const isInvalid = (forceValidation && !formData.sourceId) || error;

  if (!selectedCourse) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white mb-1">
          Select Your University *
        </label>
        <div className="text-gray-300 text-sm p-3 bg-gray-800 rounded-md">
          Please select a course first to see available universities.
        </div>
      </div>
    );
  }

  if (
    !selectedCourse.universities ||
    selectedCourse.universities.length === 0
  ) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white mb-1">
          Select Your University *
        </label>
        <div className="text-gray-300 text-sm p-3 bg-gray-800 rounded-md">
          No universities available for the selected course.
          <div className="mt-2">
            Course will use ProductId:{" "}
            <span className="font-semibold">
              {formData.ProductId || "Not available"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const sortedUniversities = [...(selectedCourse.universities || [])].sort(
    (a, b) => {
      const nameA = (a.universityName || a.name || "").toLowerCase();
      const nameB = (b.universityName || b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    },
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white mb-1">
        Select Your University *
      </label>

      <select
        value={formData.sourceId || ""}
        onChange={handleChange}
        className={`w-full h-10 px-4 rounded-md border bg-white text-black ${
          isInvalid ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="" disabled>
          Select University
        </option>

        {sortedUniversities.map((uni, index) => (
          <option
            key={uni.sourceId || index}
            value={uni.sourceId || ""}
            className="text-black"
          >
            {uni.universityName || uni.name || `University ${index + 1}`}
            {/* {uni.productId  } */}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {isInvalid && !error && (
        <p className="text-red-500 text-sm mt-1">Please select a university</p>
      )}
    </div>
  );
};

export default FormStepUniversity;
