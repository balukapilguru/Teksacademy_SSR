"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function UniversityBranchTabs({ params }) {
  const { universityname } = params;

  const [branches, setBranches] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // 1️⃣ Fetch branches (MBA, MCA...)
  useEffect(() => {
    axios
      .get(`/api/v1/university/branches?university=${universityname}`)
      .then((res) => {
        setBranches(res.data || []);
        setActiveTab(res.data[0]); // set first tab as default
      });
  }, [universityname]);

  // 2️⃣ Fetch programs when tab changes
  useEffect(() => {
    if (!activeTab) return;

    setLoading(true);

    axios
      .get(
        `/api/v1/university/specializations?university=${universityname}&branch=${activeTab}`
      )
      .then((res) => {
        setPrograms(res.data || []);
        setPage(1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  // Pagination Logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = programs.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(programs.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6 overflow-x-auto">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => setActiveTab(branch)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition
              ${
                activeTab === branch
                  ? "bg-[#ea6329] text-white"
                  : "bg-gray-200 text-gray-700"
              }
            `}
          >
            {branch}
          </button>
        ))}
      </div>

      <div className="text-xl font-bold mb-4">{activeTab} Specializations</div>

      {/* Loading */}
      {loading && <p className="py-10 text-center">Loading...</p>}

      {/* Cards */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border shadow p-4 bg-white hover:shadow-lg transition"
            >
              <div className="w-full h-32 relative mb-3">
                <Image
                  src={item.image}
                  alt={item.heading}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>

              <h3 className="font-bold text-lg mb-2">{item.heading}</h3>

              <p className="text-sm text-gray-600 mb-1">
                <b>Duration:</b> {item.duration}
              </p>

              <p className="text-sm text-gray-600">
                <b>Fee:</b> {item.fee}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {programs.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-2 border rounded-md disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-2">{page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

