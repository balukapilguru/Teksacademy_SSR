"use client";
import React, { useEffect, useState, useRef } from "react";
import Heading from "@/utility/Heading";
import CourseCard from "./Coursecards";
import PrimaryButton from "@/utility/PrimaryButton";
import ReusableForm from "../ReusableForm";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
  const handleSubmit = async (formValues, mappedPayload) => {
    console.log("Mapped payload being sent:", mappedPayload);

    try {
      const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
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
const Page = ({ data }) => {
  const courses = data?.courses || [];

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  return (
    <section>
      <div className="main_container mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <Heading data={data?.heading} />

        <ReusableForm formType="enquiry"
          onSubmit={handleSubmit}
          buttonText="Submit"
          className="w-full"
          successMessage="Thank you! We'll contact you soon." />

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
            {courses.slice(0, 4).map((course, idx) => (
              <CourseCard
                key={idx}
                course={course}
                onGetDetailsClick={() => handleOpenModal(course)}
              />
            ))}
          </div>
        ) : (
          <p className="flex justify-center h-40 w-full">
            No courses available.
          </p>
        )}

        <div className="flex justify-center pt-5">
          <PrimaryButton
            variant="outline"
            label="View All Course"
            href="/course"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
