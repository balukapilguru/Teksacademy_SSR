// app/contactus/page.jsx
"use client";

import ReusableForm from "@/components/ReusableForm";
import Image from "next/image";

export default function ContactUsPage() {
  const handleSubmit = async (formData) => {
    console.log("Contact Form Submitted:", formData);

    // Send data to your API
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for contacting us! We will get back to you soon.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 mb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-lg text-gray-600">We'd love to hear from you</p>
          <div className="w-24 h-1 bg-[#2a619d] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Two Column Layout - Image Left, Form Right */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Image Section */}
            <div className="relative bg-gradient-to-br from-[#2a619d] to-[#1e4975] p-8 lg:p-12 flex flex-col justify-center">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                {/* Illustration/Image */}
                <div className="mb-8 flex justify-center">
                  <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Get in Touch With Us
                </h3>
                
                <p className="text-blue-100 text-center mb-8">
                  Have questions about our courses? Our team is here to help you make the right decision for your career.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-100">Phone</p>
                      <p className="font-semibold">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-100">Email</p>
                      <p className="font-semibold">info@traininginstitute.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-100">Visit Us</p>
                      <p className="font-semibold">Hyderabad, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className=""> 
              <ReusableForm
                onSubmit={handleSubmit}
                hiddenFields={[
                  "career",        // Hide career field
                  "background",    // Hide background field
                  "preferredMode", // Hide preferred mode field
                  "message"        // Hide message field
                ]}
                showBrochure={false}
                buttonText="Send Message"
                customValidations={{
                  name: (value) => {
                    if (value && value.length < 2) {
                      return "Name must be at least 2 characters";
                    }
                    if (value && value.length > 50) {
                      return "Name must be less than 50 characters";
                    }
                    return "";
                  },
                  course: (value) => {
                    if (!value) return "Please select a course";
                    return "";
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}