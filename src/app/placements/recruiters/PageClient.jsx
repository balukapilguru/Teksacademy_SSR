"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
import ReusableForm from "@/components/ReusableForm";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import { useRouter } from "next/navigation";
import Heading from "@/utility/Heading";

const Recruiters = () => {
  const [data, setData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔥 Format name properly
  const formatName = (name = "") =>
    name
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // ✅ Submit handler
  const handleSubmit = async (formValues, mappedPayload) => {
    try {
      const response = await fetch(
        buildApiUrl(blogsApplyBaseUrl, "/lead/create"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mappedPayload),
        }
      );

      const res = await response.json();

      if (!response.ok) throw new Error(res.message);

      router.push("/thankyou");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch API
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
        process.env.NEXT_TEKS_SSR_API_URL;

      try {
        const res = await fetch(
          `${baseUrl}/api/v1/placements/recruiters`
        );
        const json = await res.json();

        // IMPORTANT: correct mapping
        setData(json?.data?.recruitersSection || {});
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  // ✅ Safe extraction
  const title = data?.title || "Recruiters";
  const hero = data?.heroSection || {};
  const recruiterCards = data?.recruitersCardsSection?.cards || [];
// console.log(recruiterCards,"cards")
  return (
    <>
      {/* TITLE */}
      <div className="text-center mt-6">
        <Heading
          data={title}
          as="h1"
          className="!text-2xl !font-semibold !mb-0"
        />
      </div>

      {/* HERO */}
      <div className="bg-[#2A619D] mt-6">
        <div className="main_container grid lg:grid-cols-2 justify-items-end py-10 text-white">

          {/* LEFT */}
          <div>
            <h2 className="text-2xl xl:text-3xl font-medium text-white leading-tight md:text-2xl mb-4">
              {hero.heading}
            </h2>

            <h3 className="text-lg font-semibold mt-1">
              {hero.subHeading}
            </h3>

            {/* 🔥 FIXED DESCRIPTION */}
            <div className="mt-4 text-md space-y-4 text-justify">
              {Array.isArray(hero.description)
                ? hero.description.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                : <p>{hero.description}</p>}
            </div>

            {/* HIGHLIGHTS */}
            <div className="grid grid-cols-2 gap-4 space-y-3.5 mt-6 bg-[#2C5581] p-4 mb-3 rounded">
              {hero.highlights?.map((h) => (
                <p key={h.id} className="text-md font-medium">
                  • {h.text}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white max-w-md rounded-lg p-6 text-black">
            <ReusableForm
              formType="recruiter"
              onSubmit={handleSubmit}
              buttonText="Submit"
            />
          </div>
        </div>
      </div>

      {/* 🔥 RECRUITER CARDS (REAL UI FIX) */}
      <div className="main_container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {recruiterCards.map((ele) => {
            const name = formatName(ele.name);

            return (
              <div
                key={ele.id}
                onClick={() => setSelectedVideo(ele.videoUrl)}
                className="flex items-center justify-between  rounded-xl p-4 cursor-pointer hover:shadow-md transition"
              >
                {/* LEFT TEXT */}
                

                {/* RIGHT IMAGE */}
                <div className="relative w-full ">
                  <Image
                   src={ele.thumbnail.src}
                    // src={GetData({url:ele.thumbnail)}}
                    alt={ele.thumbnail.alt}
                    width={560}
                    height={160}
                    className="rounded-mdw-full  object-cover"
                  />

                  {/* PLAY BUTTON */}
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              controls
              autoPlay
              className="w-full rounded-lg"
            >
              <source src={selectedVideo} type="video/mp4" />
            </video>

            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 right-0 text-white text-xl"
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
