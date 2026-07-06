"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const VerifyCertificate = () => {
  const { regNum } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(
          `${API_URL}/sc/verifiycertificate/${regNum}`
        );

        if (response.data?.error === "Student not found") {
          setNotFound(true);
        } else if (response.data?.error === "Not Verified") {
          setNotVerified(true);
        } else {
          setStudentData(response.data);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (regNum) {
      fetchStudentData();
    }
  }, [regNum]);

  if (isLoading) {
    return <div className="text-center py-10 text-lg">Loading...</div>;
  }

  return (
    <div
      className="min-h-fit bg-cover bg-center py-12 bg-[#f8f8f9]"
      style={{
        backgroundImage:
          "url('https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel_bg.webp')",
      }}
    >
      <div className="container mx-auto px-4 ">
        <div className="max-w-3xl mx-auto bg-white bg-opacity-90 shadow-md rounded-lg sm:p-0 md:p-6 ">
          {/* ✅ Certificate Verified Section */}
          {!notFound && !notVerified && studentData && (
            <div>
              <table className="w-full text-left border border-gray-50 mb-6 sm:text-xs md:text-sm lg:text-xl">
                <tbody>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Name</th>
                    <td className="p-2">: {studentData.fullname}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Enrollment ID</th>
                    <td className="p-2">: {studentData.registrationnumber}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Course</th>
                    <td className="p-2">: {studentData.course}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Branch</th>
                    <td className="p-2">: {studentData.branch}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Start Date</th>
                    <td className="p-2">: {studentData.courseStartDate}</td>
                  </tr>
                  <tr>
                    <th className="p-2 font-semibold">End Date</th>
                    <td className="p-2">: {studentData.courseEndDate}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center text-green-600  md:text-lg lg:text-2xl font-medium">
                ✅ Certificate Issued
              </div>
            </div>
          )}

          {/* ❌ Certificate Not Verified */}
          {!isLoading && notVerified && !notFound && (
            <div className="text-center mt-6 text-yellow-600 md:text-lg lg:text-2xl font-medium">
              ❗ Certificate Not Issued
            </div>
          )}

          {/* ❌ Student Not Found */}
          {!isLoading && notFound && (
            <div className="text-center mt-6 text-red-600 md:text-lg lg:text-2xl font-medium">
              ❌ Student Not Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
