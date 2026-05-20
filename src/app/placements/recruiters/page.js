"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
import ReusableForm from "@/components/ReusableForm";
// import Recruitersform from "@/app/forms/Recruitersform";

const Recruiters = () => {
  const [data, setData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (formValues, mappedPayload) => {
    console.log("Mapped payload being sent:", mappedPayload);

    try {
      const response = await fetch("https://apierp.infozit.com/lead/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedPayload),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };
  // Fetch API
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

      try {
        const res = await fetch(`${baseUrl}/api/recruiters`);
        const json = await res.json();
        console.log("API Response:", json); // Debug log
        setData(json?.data || {});
      } catch (err) {
        console.error("Failed to fetch recruiters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Safe extraction with fallbacks
  const hero = data?.heroSection || {};
  const title = data?.title || "Recruiters";
  const heading = hero?.heading || "Become Hiring Partner with Us";
  const subHeading = hero?.subHeading || "Build Your Future Workforce!";
  const description = hero?.description || "";
  const highlights = hero?.highlights || [];
  const hiringFee = hero?.hiringFee || "Zero";
  const talentPool = hero?.talentPool || "Access to Job-Ready Talent Pool";
  const hiringModes = hero?.hiringModes || "Flexible Hiring Modes";
  const placementSupport = hero?.placementSupport || "Full Placement Support";

  const recruiterCards = data?.recruitersCardsSection?.cards || [];

  // Form fields data
  const formFields = data?.formFields || {
    firstName: { label: "First Name", placeholder: "Enter your full name", required: true },
    email: { label: "Email", placeholder: "Enter your email address", required: true },
    mobile: { label: "Mobile no", placeholder: "Enter mobile number", required: true },
    companyName: { label: "Company Name", placeholder: "Type company name...", required: true },
    designation: { label: "Designation", placeholder: "Enter your job title (e.g. Product Manager...)", required: true },
    branch: { label: "Branch", placeholder: "Select a Branch", required: true }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Title */}
        <div className="pb-5 flex justify-center items-center w-full">
          <div className="relative w-fit flex flex-col">
            <h1 className="mt-6 font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
              <span className="text-[#2A619D]">{title}</span>
            </h1>
            <svg
              className="mt-6 absolute top-8 w-full h-auto"
              viewBox="0 0 110 12"
            >
              <path
                d="M0 10 Q80 -2 190 27"
                stroke="orangered"
                strokeWidth="1.03"
                fill="transparent"
              />
            </svg>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-[#2A619D]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:gap-x-20 xl:py-6 lg:py-4">

              {/* LEFT */}
              <div className="flex pt-9 flex-col 2xl:w-4/5 text-white">

                {/* Headings */}
                <div>
                  <div className="font-semibold xl:text-[2rem] lg:text-[1.5rem] md:text-[1.2rem] xs:text-[1rem] xs:pl-4 md:pl-5 lg:pl-0">
                    {heading}
                  </div>
                  <div className="font-semibold xl:text-[2rem] lg:text-[1.4rem] md:text-[1.2rem] xs:text-[1rem] xs:pl-4 md:pl-5 lg:pl-0">
                    {subHeading}
                  </div>
                </div>

                {/* Description */}
                <div className="xl:text-[1.1rem] text-justify lg:text-[1rem] lg:pt-3 lg:pb-3 xs:text-[0.7rem] md:text-[0.8rem] md:pr-3 xs:pr-3 xs:pl-4 md:pl-5 lg:pl-0">
                  <br />
                  {description || "Teks Academy bridges the gap between industry and talent with hands-on, job-ready training. 29+ companies trust us for skilled hires in Full Stack, Data Science, GIS, and ERP. Partner with us for free and access trained professionals from 30+ courses. Let's build a future-ready, skilled workforce together!"}
                </div>

                {/* Highlights/Features */}
                <div className="grid grid-cols-2 bg-[#2C5581]  gap-4 mt-6 ">
                  <div className=" p-3 rounded-lg">
                    <div className="font-bold text-white text-lg pl-7">Hiring Fee for Recruiters – {hiringFee}</div>
                    <div className="font-bold text-white mt-8 text-lg pl-7">{placementSupport}</div>

                  </div>
                  <div className="bg-[#2C5581] p-4 rounded-lg">
                    <div className="font-bold text-white  text-lg ">{talentPool}</div>

                    <div className="font-bold text-white text-lg mt-8">{hiringModes}</div>
                  </div>
                </div>

                {/* Highlights List */}
                {highlights.length > 0 && (
                  <div className="bg-[#2C5581] px-8 font-bold rounded-lg shadow-xl xl:mt-8 text-white lg:mt-10 xs:mt-9 xs:ml-4 xs:mr-4 md:mt-9 md:ml-6 lg:ml-0 md:mr-10 lg:mr-0 py-10">
                    <div className="grid grid-cols-2 gap-y-4">
                      {highlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-start text-center xl:text-[1rem] lg:text-[0.8rem] md:text-[0.8rem] xs:text-[0.7rem]"
                        >
                          • {item.text || item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT FORM */}
              <div className="w-96 flex justify-center items-center bg-white rounded-lg shadow-lg p-6">
              <ReusableForm
                formType="recruiter"
                onSubmit={handleSubmit}
                buttonText="Submit"
                className="w-full"
                successMessage="Thank you! We'll contact you soon."
              />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Cards */}
      {recruiterCards.length > 0 && (
        <div>
          <div className="main_container overflow-hidden">
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-white lg:gap-6 2xl:gap-4 gap-y-0 3xl:gap-x-4 w-full mt-6 lg:mt-8 2xl:mt-12 3xl:mt-14">
                {recruiterCards.map((ele, idx) => (
                  ele?.thumbnail?.src && (
                    <div
                      key={ele.id || idx}
                      onClick={() => ele?.videoUrl && setSelectedVideo(ele.videoUrl)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={ele.thumbnail.src}
                        alt={ele.thumbnail.alt || ele.name || "Recruiter"}
                        width={400}
                        height={300}
                        className="w-full h-auto rounded-lg"
                      />
                      {ele.name && (
                        <p className="text-center mt-2 font-medium">{ele.name}</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl mx-4">
            <video
              controls
              autoPlay
              className="w-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Recruiters;