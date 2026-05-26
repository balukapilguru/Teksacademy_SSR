"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/utility/Heading";

import PrimaryButton from "@/utility/PrimaryButton";
import ReusableForm from "../ReusableForm";
import Loader from "../Loader";   // optional, you can style your own loader
import CourseCard from "../allcoursepage/Coursecards";

const Page = ({ data, branchData }) => {
  const router = useRouter();

  // State for fetched courses
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state (unchanged)
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses from API (same as CoursesOffered)
  useEffect(() => {
    const fetchCourses = async () => {
      let branchName = "ameerpet";
      if (branchData?.branchLocation?.address) {
        branchName = branchData.branchLocation.address.split(",")[0].toLowerCase();
      }

      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
          process.env.NEXT_TEKS_SSR_API_URL;
        const response = await fetch(
          `${baseUrl}/api/v1/course?branches=${branchName}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success && result.data && Array.isArray(result.data)) {
          setCourses(result.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [branchData]);

  // Existing handleSubmit (unchanged except router fix)
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

  // Modal handler (unchanged)
  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <section>
        <div className="main_container mx-auto mt-5 px-4 sm:px-6 lg:px-8">
          <Heading data={data?.heading} />
          <div className="flex justify-center items-center h-40">
            <Loader />   {/* or a simple spinner */}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section>
        <div className="main_container mx-auto mt-5 px-4 sm:px-6 lg:px-8">
          <Heading data={data?.heading} />
          <div className="text-center text-red-600 py-10">
            <p>Failed to load courses: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Main render (exactly as original, but `courses` now comes from API)
  return (
    <section>
      <div className="main_container mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <Heading data={data?.heading} />

        <ReusableForm
          formType="enquiry"
          onSubmit={handleSubmit}
          buttonText="Submit"
          className="w-full"
          successMessage="Thank you! We'll contact you soon."
        />

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, idx) => (
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
            label="View All Courses"
            href="/courses"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;