"use client";
import ReusableForm from "@/components/ReusableForm";
import { useRouter } from "next/navigation";

export default function ContactUsPage() {
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
    <div className="bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">

        {/* ── LEFT PANEL ── */}
        <div className="relative w-full lg:w-[48%] bg-[#2a619d] flex flex-col p-7 lg:p-8 overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute bottom-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-[-40px] right-[30px] w-40 h-40 rounded-full bg-white/[0.06] pointer-events-none" />

          {/* Brand icon */}
          <div className="w-11 h-11 rounded-xl bg-white/[0.15] flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-4h8" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-xl lg:text-[22px] font-bold text-white leading-snug mb-2">
            Start your learning journey today
          </h2>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Reach out to us and our team will guide you to the right course for your goals.
          </p>

          {/* Divider */}
          <div className="w-8 h-[3px] bg-[#4e9af1] rounded-full mb-8" />

          {/* Info items */}
          <div className="flex flex-col gap-6">
            {infoItems.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 min-w-[36px] mt-0.5 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-widest text-white/50 mb-0.5 font-medium">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-white leading-[1.6] whitespace-pre-line break-words">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full lg:w-[58%] flex flex-col p-4 lg:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-0.5">Contact Us</h1>
          <p className="text-xs text-gray-500 mb-4">
            Fill in your details and we&apos;ll get back to you shortly.
          </p>

          <ReusableForm
            formType="contact"
            onSubmit={handleSubmit}
            buttonText="Submit"
            className="w-full"
            successMessage="Thank you! We'll contact you soon."
          />
        </div>

      </div>
    </div>
  );
}