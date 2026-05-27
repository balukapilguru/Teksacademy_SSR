"use client";

import GetData from "@/utility/GetData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import Popupform from "@/components/clientcomponents/forms/Popupform";

export default function Nutshell({ data, courseData, courseName = "" }) {
  const { title, services, button, image } = data || {};
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const isBFSI = courseData?.coursename === "BFSI-Course";
  const selectedCourse =
    courseName ||
    courseData?.coursename ||
    courseData?.courseName ||
    courseData?.name ||
    "";

  const handleSubmit = async (_formValues, mappedPayload) => {
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

      setShowModal(false);
      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  return (
    <div className="main_container">
      {showModal && (
        <Popupform
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse}
          courseName={selectedCourse}
          title="Request Callback"
          subtitle="Fill in your details and our team will call you back shortly."
          onSubmit={handleSubmit}
          formType="requestCallback"
          buttonText="Request Callback"
          successMessage="Thank you! We'll contact you soon."
        />
      )}

      <div className="flex flex-col items-center">

        {/* Heading */}
        <div className=" my-6 text-center">
          <h2 className="text-xl md:text-3xl font-semibold">
            {title?.[0]}
            <span className="text-[#2A619D]">{title?.[1]}</span>
          </h2>
        </div>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-6 px-4 w-full">

          {/* LEFT SIDE */}
          <div className="space-y-6 xl:mt-10">

            {services?.map((item, index) => {
              const words = item.title.split(" ");

              return (
                <div key={index} className="flex items-center gap-3">

                  <Image
                    src={GetData({url:item.icon.url})}
                    alt={item.icon.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 object-fill"
                  />

                  {/* Text Logic */}
                  <div className="flex flex-wrap items-end text-sm md:text-xl">

                    {words.map((word, i) => {
                      const highlight =
                        word.toLowerCase().includes("technical") ||
                        word.toLowerCase().includes("interviews") ||
                        word.toLowerCase().includes("job") ||
                        word.toLowerCase().includes("portal") ||
                        word.toLowerCase().includes("it");

                      return (
                        <span
                          key={i}
                          className={`mr-1 ${
                            highlight ? "text-[#FE543D] font-medium" : ""
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}

                    {/* Arrow except last */}
                    {index !== services.length - 1 && (
                      <FaArrowDownLong className="ml-2 text-[#FE543D]" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 px-6 py-2 border border-[#2a619d] text-[#2a619d] rounded-lg hover:bg-[#2a619d] hover:text-white transition"
            >
              {button?.text || "Request Callback"}
            </button>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="flex justify-center items-center">
            <Image
              src={GetData({url:image?.mobile})}
              alt={image?.alt}
              width={500}
              height={500}
              className="lg:hidden w-[80%]"
            />

            <Image
              src={GetData({url:isBFSI ? image?.desktop : image?.desktop})}
              alt={image?.alt}
              width={700}
              height={700}
              className="hidden lg:block w-[90%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
