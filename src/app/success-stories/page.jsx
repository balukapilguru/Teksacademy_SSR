"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";

const SuccessStories = () => {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  const [stories, setStories] = useState([]);
  const [heading, setHeading] = useState("Success Stories");
  const [activeTab, setActiveTab] = useState("learning");
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch on client (since this is now client component)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/home/success-stories`);
        const data = await res.json();

        console.log(res, "sdfkdfhkdffdsf")

        setHeading(data?.data?.heading || "Success Stories");
        setStories(data?.data?.cards || []);
      } catch (err) {
        console.error("Failed to fetch success stories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  // 🔥 Split data for tabs
  const { learning, placed } = useMemo(() => {
    const learning = [];
    const placed = [];

    stories.forEach((item) => {
      if (item.type === "learning") learning.push(item);
      else if (item.type === "placed") placed.push(item);
    });

    return { learning, placed };
  }, [stories]);

  const currentData = activeTab === "learning" ? learning : placed;

  return (
    <div className="main_container">
      {/* Heading */}
      <div className="justify-items-center mb-8">
        <Heading data={heading} text={heading} />
      </div>

      {/* 🔥 Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab("learning")}
          className={`px-6 py-2 rounded-md transition ${
            activeTab === "learning"
              ? "bg-blue-700 text-white"
              : "border text-blue-700"
          }`}
        >
          Learning Experience
        </button>

        <button
          onClick={() => setActiveTab("placed")}
          className={`px-6 py-2 rounded-md transition ${
            activeTab === "placed"
              ? "bg-blue-700 text-white"
              : "border text-blue-700"
          }`}
        >
          Placed Students
        </button>
      </div>

      {/* 🔥 Loader */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {currentData.map((item, index) => (
            <div key={index}>
              <Image
                src={GetData({ url: item.image?.src })}
                alt={item.image?.alt || "success story"}
                width={400}
                height={300}
                className="rounded-lg w-full object-cover transition hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuccessStories;