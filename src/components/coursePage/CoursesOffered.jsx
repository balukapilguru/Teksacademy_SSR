"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Heading from "@/utility/Heading";
import PrimaryButton from "@/utility/PrimaryButton";
import Loader from "../Loader";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import BranchCoursecards from "../allcoursepage/BranchCoursecards";
import Popupform from "../Popupform";

const getBranchFromPath = (pathname = "") => {
  const branchSlug = pathname.split("/").filter(Boolean).pop() || "";

  return (
    branchSlug
      .replace(/^best-software-training-institute-/, "")
      .replace(/^software-training-institute-/, "")
      .replace(/-branch$/, "")
      .toLowerCase() || "ameerpet"
  );
};

const CoursesOffered = ({ data, branchData }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentBranch, setCurrentBranch] = useState("");

  useEffect(() => {
    const propCourses = data?.courses || data?.courseList || data?.coursesList || [];
    const branchValue =
      branchData?.slug ||
      branchData?.branchSlug ||
      branchData?.name ||
      getBranchFromPath(pathname);

    setCurrentBranch(branchValue);

    if (propCourses.length > 0) {
      setCourses(propCourses);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl =
          process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
          process.env.NEXT_TEKS_SSR_API_URL;
        const response = await fetch(`${baseUrl}/api/v1/course?branches=${branchValue}`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        setCourses(result.success && Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [data, branchData, pathname]);

 const handleSubmit = async (formValues, payload) => {
    try {
      const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      router.push("/thankyou");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const courseName =
    selectedCourse?.heading ||
    selectedCourse?.programName ||
    selectedCourse?.title ||
    selectedCourse?.name ||
    "";
{console.log("Courses rendered:",courses.length, courses.map(c => c.heading || c.programName || c.title || c.name))}
  if (loading) {
    return (
      <section>
        <div className="main_container mx-auto mt-5 px-4 sm:px-6 lg:px-8">
          <Heading data={data?.heading || "Course Offered"} />
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="main_container mx-auto mt-5 px-4 sm:px-6 lg:px-8">
          <Heading data={data?.heading || "Course Offered"} />
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

  return (
    <section>
      <div className="main_container mx-auto mt-5 pt-5 px-4 sm:px-6 lg:px-8">
        <Heading data={data?.heading || "Courses Offered"} />

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
            {courses.map((course, idx) => (
              <BranchCoursecards
                key={course.id || course.programName || course.heading || idx}
                course={course}
                onGetDetailsClick={() => handleOpenModal(course)}
              />
            ))}
            
          </div>
        ) : (
          <p className="flex justify-center h-40 w-full">No courses available.</p>
        )}

        <div className="flex justify-center pt-5">
          <PrimaryButton
            variant="outline"
            label={data?.moreCourses?.text || "View All Courses"}
            href={data?.moreCourses?.link || "/course"}
          />
        </div>
      </div>

      <Popupform
        show={showModal}
        onClose={() => setShowModal(false)}
        course={courseName}
        courseName={courseName}
        branch={currentBranch}
        title="Enquire Now"
        subtitle="Share your details and our counselor will reach out to you."
        formType="default"
        buttonText="Submit"
        successMessage="Thanks! We will get in touch shortly."
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default CoursesOffered;
