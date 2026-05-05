"use client";
import React, { useEffect, useState, useRef } from "react";
import Heading from "@/utility/Heading";
import CourseCard from "./Coursecards";
import Freecoursesform from "../clientcomponents/forms/Freecoursesform";
import PrimaryButton from "@/utility/PrimaryButton";

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
      <div className="max-w-8xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <Heading data={data?.heading} />

        <Freecoursesform
          source={28}
          show={showModal}
          onClose={() => setShowModal(false)}
          course={selectedCourse?.universities ? selectedCourse : null}
        />

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            label="View All Courses"
            href="/courses"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;