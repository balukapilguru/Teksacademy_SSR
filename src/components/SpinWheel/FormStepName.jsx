
import React, { useState, useEffect } from "react";

const FormStepName = ({ formData, onChange, forceValidation, error }) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    onChange({ name: value });
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const showError = (forceValidation || touched) && error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white mb-1">
        Full Name*
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`
  px-2 w-full h-10 rounded-md text-gray-700 p-1
  border bg-white focus:outline-red-500 focus:outline-2 focus:-outline-offset-2
  ${showError ? "border-red-500" : "border-gray-300 hover:border-gray-400"}
`}
        placeholder="Enter your full name"
        autoComplete="name"
      />

      {showError && (
        <p className="text-sm text-red-600 mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

    </div>
  );
};
export default FormStepName;

