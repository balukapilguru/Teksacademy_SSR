"use client";

import ReusableForm from "@/components/ReusableForm";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();

  const handleSubmit = async (formValues, mappedPayload) => {
    // console.log("Mapped payload being sent:", mappedPayload);

    try {
      const response = await fetch("https://apierp.infozit.com/lead/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      // console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  // Support categories data
  const supportCategories = [
    {
      icon: (
        <svg className="w-8 h-8 text-[#2a619d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      title: "Enrollment Issues",
      description: "Facing trouble while enrolling?",
      action: "Get immediate help!",
      bgColor: "bg-blue-50"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#2a619d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Fee Payment Queries",
      description: "Need help with fees or payments?",
      action: "Contact us!",
      bgColor: "bg-green-50"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#2a619d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Access to E-Resources",
      description: "Can't access course videos, PDFs?",
      action: "We will assist!",
      bgColor: "bg-purple-50"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#2a619d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Batch Timings",
      description: "Need help with rescheduling?",
      action: "Let us know!",
      bgColor: "bg-orange-50"
    }
  ];

  // Info items for sidebar (contact information)
  const infoItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#7ec8f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </svg>
      ),
      label: "Address",
      value: "5th Floor, Amsri Faust Building,\nSarojini Devi Rd, Opp. Pista House,\nSecunderabad, Telangana - 500025",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#7ec8f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.02L7.5 9.5a16 16 0 006.97 6.97l1.5-1.6a1 1 0 011.02-.24l3.3 1.1A1 1 0 0121 16.7V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" />
        </svg>
      ),
      label: "Phone",
      value: "1800-120-4748",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#7ec8f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: "support@teksacademy.com",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#7ec8f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "WORKING HOURS",
      value: "Mon – Sat: 9am – 7pm",
    },
  ];

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">

        {/* LEFT PANEL - Contact Info */}
        <div className="relative w-full lg:w-[50%] bg-[#2a619d] flex flex-col p-7 lg:p-8 overflow-hidden">
          <h1 className="text-2xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-sm text-white mb-6">
            Fill in your details and we&apos;ll get back to you shortly.
          </p>
          {/* Support Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-8">

            {supportCategories.map((category, index) => (
              <div
                key={index}
                className={`${category.bgColor} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {category.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {category.description}
                    </p>
                    <p className="text-xs font-medium text-[#2a619d] group-hover:text-[#214d7d]">
                      {category.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Support Categories & Form */}
        <div className="w-full lg:w-[50%] flex flex-col p-6 lg:p-8">
          {/* Contact Form */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Submit Your Query</h2>
            <ReusableForm
              formType="support"
              onSubmit={handleSubmit}
              buttonText="Submit Request"
              className="w-full"
              successMessage="Thank you! We'll contact you soon."
            />
          </div>
        </div>
      </div>
    </div>
  );
}