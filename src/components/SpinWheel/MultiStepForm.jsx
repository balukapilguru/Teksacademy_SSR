"use client";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";

import FormStepName from "./FormStepName";
import FormStepEmail from "./FormStepEmail";
import FormStepMobile from "./FormStepMobile";
import FormStepCourse from "./FormStepCourse";
import FormStepUniversity from "./FormStepUniversity";

import SpinAnimation from "./SpinAnimation";
import Congratulations from "./Congratulations";


const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  mobile: "",
  course: "",
  university: "",
  ProductId: "",
  productId: "", // Add this line
  sourceId: "",
  source: "SpinWheel",
};

const MultiStepForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState({
    email: false,
    mobile: false,
  });
  const [forceValidation, setForceValidation] = useState(false);
  const [spinResult, setSpinResult] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [stepErrors, setStepErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    university: "",
  });

  const TOTAL_STEPS = 5;
  const baseUrl = "https://apierp.teksversity.com";

  const handleFormChange = (newValues) => {
    setFormData((prev) => ({ ...prev, ...newValues }));

    // Clear specific errors when user starts typing in that field
    if (newValues.name !== undefined && stepErrors.name) {
      setStepErrors((prev) => ({ ...prev, name: "" }));
    }
    if (newValues.email !== undefined && stepErrors.email) {
      setStepErrors((prev) => ({ ...prev, email: "" }));
    }
    if (newValues.mobile !== undefined && stepErrors.mobile) {
      setStepErrors((prev) => ({ ...prev, mobile: "" }));
    }
    if (newValues.ProductId !== undefined && stepErrors.course) {
      setStepErrors((prev) => ({ ...prev, course: "" }));
    }
    if (newValues.sourceId !== undefined && stepErrors.university) {
      setStepErrors((prev) => ({ ...prev, university: "" }));
    }
  };

  // Frontend validation functions
  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim().length === 0) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile || mobile.trim().length === 0) {
      return "Mobile number is required";
    }
    if (!/^\d{10}$/.test(mobile)) {
      return "Please enter a valid 10-digit mobile number";
    }
    return "";
  };

  // In MultiStepForm.js, update the validateCourse function:
  const validateCourse = (formData) => {
    // Check both ProductId and productId
    const productId = formData.ProductId || formData.productId || "";
    const productIdStr = String(productId);

    if (
      !productIdStr ||
      productIdStr.trim().length === 0 ||
      productIdStr === "undefined"
    ) {
      return "Please select a course";
    }
    return "";
  };

  const validateUniversity = (universityId) => {
    // Convert to string first, then check if it's empty
    const universityIdStr = String(universityId || "");
    if (!universityIdStr || universityIdStr.trim().length === 0) {
      return "Please select a university";
    }
    return "";
  };

  // Validate email through API (for duplicate checking)
  const validateEmailAPI = async (email) => {
    setLoading((prev) => ({ ...prev, email: true }));
    try {
      const res = await fetch(`${baseUrl}/lead/emailcheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      if (res.status === 200) {
        return { success: true, message: "" };
      } else if (res.status === 409) {
        return {
          success: false,
          message: data.message || "This email is already registered",
        };
      } else {
        return {
          success: false,
          message: data.message || "Email validation failed",
        };
      }
    } catch (error) {
      console.error("Email API error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  // Validate mobile through API (for duplicate checking)
  const validateMobileAPI = async (mobile) => {
    setLoading((prev) => ({ ...prev, mobile: true }));
    try {
      const res = await fetch(`${baseUrl}/lead/mobilecheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: mobile }),
      });

      const data = await res.json();

      if (res.status === 200) {
        return { success: true, message: "" };
      } else if (res.status === 409) {
        return {
          success: false,
          message: data.message || "This mobile number is already registered",
        };
      } else {
        return {
          success: false,
          message: data.message || "Mobile validation failed",
        };
      }
    } catch (error) {
      console.error("Mobile API error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    } finally {
      setLoading((prev) => ({ ...prev, mobile: false }));
    }
  };

  // Handle step progression
  const nextStep = async () => {
    setForceValidation(true);

    // Perform frontend validation for current step
    let frontendError = "";
    switch (currentStep) {
      case 1:
        frontendError = validateName(formData.name);
        if (frontendError) {
          setStepErrors((prev) => ({ ...prev, name: frontendError }));
          toast.error(frontendError);
          return;
        }
        break;
      case 2:
        frontendError = validateEmail(formData.email);
        if (frontendError) {
          setStepErrors((prev) => ({ ...prev, email: frontendError }));
          toast.error(frontendError);
          return;
        }
        break;
      case 3:
        frontendError = validateMobile(formData.mobile);
        if (frontendError) {
          setStepErrors((prev) => ({ ...prev, mobile: frontendError }));
          toast.error(frontendError);
          return;
        }
        break;
      // In the nextStep function, update the case 4 validation:
      case 4:
        frontendError = validateCourse(formData);
        if (frontendError) {
          setStepErrors((prev) => ({ ...prev, course: frontendError }));
          toast.error(frontendError);
          return;
        }
        break;
      case 5:
        frontendError = validateUniversity(formData.sourceId);
        if (frontendError) {
          setStepErrors((prev) => ({ ...prev, university: frontendError }));
          toast.error(frontendError);
          return;
        }
        break;
    }

    // Step-specific API validations (only for email and mobile)
    if (currentStep === 2) {
      // Email step - validate via API for duplicates
      const validation = await validateEmailAPI(formData.email);
      if (!validation.success) {
        setStepErrors((prev) => ({ ...prev, email: validation.message }));
        toast.error(validation.message);
        return;
      }
    }

    if (currentStep === 3) {
      // Mobile step - validate via API for duplicates
      const validation = await validateMobileAPI(formData.mobile);
      if (!validation.success) {
        setStepErrors((prev) => ({ ...prev, mobile: validation.message }));
        toast.error(validation.message);
        return;
      }
    }

    // Clear errors and proceed
    setStepErrors({
      name: "",
      email: "",
      mobile: "",
      course: "",
      university: "",
    });
    setForceValidation(false);
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    // Clear all errors when going back
    setStepErrors({
      name: "",
      email: "",
      mobile: "",
      course: "",
      university: "",
    });
    setCurrentStep((prev) => prev - 1);
  };

  // Handle spin wheel completion
  const handleSpinComplete = async (result) => {
    setSpinResult(result);

    // Show congratulations
    setShowCongrats(true);
  };

  // Render content based on current step
  const RenderedContent = useMemo(() => {
    if (showCongrats) {
      return <Congratulations result={spinResult} onClose={onClose} />;
    }

    if (currentStep === 6) {
      return (
        <SpinAnimation
          email={formData.email}
          mobile={formData.mobile}
          onSpinComplete={handleSpinComplete}
          formData={formData}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <FormStepName
            formData={formData}
            onChange={handleFormChange}
            forceValidation={forceValidation}
            error={stepErrors.name}
          />
        );
      case 2:
        return (
          <FormStepEmail
            formData={formData}
            onChange={handleFormChange}
            forceValidation={forceValidation}
            error={stepErrors.email}
            loading={loading.email}
          />
        );
      case 3:
        return (
          <FormStepMobile
            formData={formData}
            onChange={handleFormChange}
            forceValidation={forceValidation}
            error={stepErrors.mobile}
            loading={loading.mobile}
          />
        );
      case 4:
        return (
          <FormStepCourse
            formData={formData}
            onChange={handleFormChange}
            forceValidation={forceValidation}
            error={stepErrors.course}
          />
        );
      case 5:
        return (
          <FormStepUniversity
            formData={formData}
            onChange={handleFormChange}
            forceValidation={forceValidation}
            error={stepErrors.university}
          />
        );
      default:
        return <p>Error: Invalid Step</p>;
    }
  }, [
    showCongrats,
    currentStep,
    formData,
    forceValidation,
    spinResult,
    stepErrors,
    loading,
  ]);

  const getButtonText = () => {
    if (currentStep === 5) {
      return "Spin ";
    }
    if (currentStep === 2 && loading.email) {
      return "Validating...";
    }
    if (currentStep === 3 && loading.mobile) {
      return "Validating...";
    }
    return "Next";
  };

  const isButtonDisabled = () => {
    if (loading.email || loading.mobile) {
      return true;
    }
    return false;
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col h-full relative"
    >
      <div
        className="flex-grow h-64 relative overflow-clip"
        style={{ perspective: "1000px" }}
      >
        <div
          key={currentStep}
          className="mt-4 absolute inset-0 animate-fade-slide-in transition-all duration-500 ease-out"
        >
          {RenderedContent}
        </div>
      </div>

      {/* Step Navigation Buttons */}
      {!showCongrats && currentStep <= 5 && (
        <div className="flex justify-between items-center pt-6 mt-4">
          <p className="text-sm font-medium text-white">
            Step <strong className="text-[#ea6329]">{currentStep}</strong> of{" "}
            {TOTAL_STEPS}
          </p>

          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 h-10 text-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition duration-150 cursor-pointer text-sm font-medium"
                disabled={isButtonDisabled()}
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={nextStep}
              disabled={isButtonDisabled()}
              className={`px-6 h-10 font-semibold rounded-md cursor-pointer text-white text-sm
    ${
      isButtonDisabled()
        ? "bg-gray-300 text-black cursor-not-allowed"
        : "bg-[#ea6329] hover:bg-[#a81a32]"
    }
  `}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default MultiStepForm;
