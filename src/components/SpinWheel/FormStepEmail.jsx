
import React, { useState, useEffect } from "react";

const FormStepEmail = ({ formData, onChange, forceValidation }) => {
  // Local state for error and interaction tracking
  const [error, setError] = useState(null);
  const [isTouched, setIsTouched] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation Logic
  const validate = (value) => {
    if (!value.trim()) {
      return "Email address is required.";
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address (e.g., user@domain.com).";
    }
    return null;
  };

  // 1. Handle user input
  const handleChange = (e) => {
    const value = e.target.value.trim();
    
    // Update parent form data immediately
    onChange({ email: value });
    
    // Show error immediately only if the user has already touched/focused the field
    if (isTouched) {
      setError(validate(value));
    }
  };

  // 2. Effect to handle forced validation (Next button click from parent)
  useEffect(() => {
    if (forceValidation) {
      setIsTouched(true);
      setError(validate(formData.email));
    }
  }, [forceValidation, formData.email]); // Re-run when parent forces validation or data changes
  
  // 3. Apply validation check when the input loses focus (onBlur)
  const handleBlur = () => {
    setIsTouched(true);
    setError(validate(formData.email));
  };

  // Determine if error should be visually displayed
  const showError = error && isTouched;

  return (
    <div className="space-y-2">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur} // Attach blur handler
          required
          // Conditional styling for error state
            className={`
  px-2 w-full h-10 rounded-md text-gray-700 p-1
  border bg-white focus:outline-red-500 focus:outline-2 focus:-outline-offset-2
  ${showError ? "border-red-500" : "border-gray-300 hover:border-gray-400"}
`}
          placeholder="example@domain.com"
        />
      </div>
      
      {/* Inline Error Display with smooth transition */}
      <div 
        className={`text-sm text-red-600 overflow-hidden transition-all duration-300 ease-in-out ${
          showError ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {error}
      </div>
    </div>
  );
};

export default FormStepEmail;
