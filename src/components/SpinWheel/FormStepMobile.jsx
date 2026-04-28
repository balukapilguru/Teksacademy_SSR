// components/SpinWheel/FormStepMobile.jsx
import React, { useState, useEffect } from "react"; // 💡 FIX 1: Import useState and useEffect

const FormStepMobile = ({ formData, onChange, forceValidation }) => {
    // 💡 FIX 2: Moved state definitions inside the component function
    const [error, setError] = useState(null); 
    const [isTouched, setIsTouched] = useState(false);

   const validate = (value) => {
    const cleanedValue = value.replace(/\D/g, '');

    if (!cleanedValue) {
        return "Mobile number is required.";
    }
    else if (cleanedValue.length !== 10) {
        return "Please enter a valid 10-digit mobile number.";
    }
    else if (!/^[6-9]\d{9}$/.test(cleanedValue)) {
        return "Mobile number must start with 6, 7, 8, or 9.";
    }
    return null;
};

   
    // 1. Handle user input
    const handleChange = (e) => {
        // Prevent non-numeric input and limit length in the component logic
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        
        onChange({ mobile: value });
        
        // Show error immediately only if the user has already touched the field
        if (isTouched) {
            setError(validate(value));
        }
    };
    
    // 2. Effect to handle forced validation (Next/Submit button click)
    useEffect(() => {
        if (forceValidation) {
            setIsTouched(true);
            setError(validate(formData.mobile));
        }
    }, [forceValidation, formData.mobile]); // Added dependencies for useEffect
    
    // 3. Apply immediate validation check when the input loses focus
    const handleBlur = () => {
        setIsTouched(true);
        setError(validate(formData.mobile));
    };

    // Determine if error should be visible
    const showError = error && isTouched;

    return (
        <div className="space-y-2">
            <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-white mb-1">Mobile*</label>
                <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur} // 💡 Bind handleBlur here
                    title="Mobile number must be exactly 10 digits"
                    className={`
  px-2 w-full h-10 rounded-md text-gray-700 p-1
  border bg-white focus:outline-red-500 focus:outline-2 focus:-outline-offset-2
  ${showError ? "border-red-500" : "border-gray-300 hover:border-gray-400"}
`}
                    placeholder="xxxxxxxxxx"
                />
            </div>
            {/* 💡 Display Error Message with smooth transition (as implemented in previous steps) */}
            <div 
                className={`text-sm text-red-600 overflow-hidden transition-all duration-300 ease-in-out ${
                    showError ? 'max-h-10 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}
            >
                {error}
            </div>
        </div>
    );
};

export default FormStepMobile;
