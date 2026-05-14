"use client";
import ReusableForm from "@/components/ReusableForm";
import { useRouter } from "next/navigation";

export default function ContactUsPage() {
  const router = useRouter();

  const handleSubmit = async (formValues, mappedPayload) => {
    console.log("Mapped payload being sent:", mappedPayload);
    
    try {
      const response = await fetch("https://apierp.infozit.com/lead/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPayload)
      });
      
      const responseData = await response.json();
      console.log("API Response:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }
      
      // Success - navigate to thank you page
      router.push("/thankyou");
      
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <ReusableForm 
        formType="contact" 
        onSubmit={handleSubmit}
        buttonText="Submit"
        successMessage="Thank you! We'll contact you soon."
      />
    </div>
  );
}