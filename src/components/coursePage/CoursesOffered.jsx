// src/components/coursePage/CoursesOffered.jsx
'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import Loader from '../Loader';

const CoursesOffered = ({ branchData }) => {
  const [courselist, setCourselist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      let branchName = 'ameerpet';
      
      if (branchData?.branchLocation?.address) {
        branchName = branchData.branchLocation.address.split(',')[0].toLowerCase();
      }
      
      try {
        setLoading(true);
        // Use the correct API endpoint with your tunnel URL
        const response = await fetch(`https://0z05cks3-4040.inc1.devtunnels.ms/api/v1/course?branches=${branchName}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("API Response:", result); // Debug log
        
        // The API returns data in result.data array
        if (result.success && result.data && Array.isArray(result.data)) {
          setCourselist(result.data);
        } else {
          console.warn("No courses found in response:", result);
          setCourselist([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
        setCourselist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [branchData]);

  // Loading state
  if (loading) {
    return (
      <div>
       <Loader />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading courses: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#2A619D] text-white rounded hover:bg-[#1e4a7a]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl font-bold">
              Course <span className="text-[#2A619D]">Offered</span>
            </h2>
            <div className="absolute -bottom-2 left-0 w-full">
              <svg className="w-full h-2" viewBox="0 0 120 8">
                <path
                  d="M0 4 Q60 -2 120 4"
                  stroke="#FE543D"
                  strokeWidth="1.5"
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Master in-demand skills with our industry-leading courses
          </p>
        </div>

        {/* No Courses Found */}
        {courselist.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-gray-600 text-lg">No courses available at the moment.</p>
            </div>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courselist.map((course, index) => (
              <div
                key={course?.programName || course?.id || index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
              >
                {/* Card Image */}
                <div className="h-48 bg-gradient-to-br from-[#2A619D] to-[#1e4a7a] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
                  {course?.image?.src ? (
                    <Image
                      src={`https://teksacademy.com${course.image.src}`}
                      alt={course?.image?.alt || course?.heading || 'Course image'}
                      fill
                      className="object-contain p-6"
                      onError={(e) => {
                        e.target.src = '/default-course-icon.png';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {course?.heading?.charAt(0) || 'C'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {course?.heading || course?.programName?.replace(/-/g, ' ') || 'Course Title'}
                  </h3>
                  
                  {/* Course Description - Generate from heading or add a default */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course?.image?.alt || 
                     `Professional ${course?.heading || 'certification'} program with industry-recognized training and placement assistance.`}
                  </p>
                  
                  {/* Course Meta Info */}
                  <div className="flex flex-col gap-2 text-xs text-gray-500 mb-4">
                    {course?.duration && (
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Duration: {course.duration}</span>
                      </div>
                    )}
                    {course?.feeRange && (
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Fee: ₹{course.feeRange}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {course?.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-[#2A619D] px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto pt-2">
                    {course?.button?.map((btn, idx) => (
                      btn.name === "Know More" ? (
                        <Link 
                          key={idx}
                          href={btn.link || '#'}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-[#2A619D] text-[#2A619D] rounded-lg hover:bg-[#2A619D] hover:text-white transition-colors text-sm font-medium"
                        >
                          {btn.name}
                          <svg 
                            className="w-4 h-4 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => {
                            // Handle enquiry - you can open a modal or redirect
                            alert(`Enquiry for ${course.heading}\nEmail: info@teksacademy.com\nPhone: +91-XXXXXXXXXX`);
                          }}
                          className="flex-1 bg-[#FE543D] text-white px-4 py-2 rounded-lg hover:bg-[#e04a35] transition-colors text-sm font-medium"
                        >
                          {btn.name}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesOffered;