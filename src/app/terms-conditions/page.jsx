// app/terms-conditions/page.jsx

import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// ============================
// Fetch Terms Data
// ============================
async function getTerms() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/v1/home/terms-conditions`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error("Failed to fetch Terms & Conditions");
    }

    const json = await res.json();
    return json.data || {};
  } catch (error) {
    console.error("Failed to fetch terms:", error);
    return {};
  }
}

// ============================
// Dynamic Metadata
// ============================
export async function generateMetadata() {
  try {
    const data = await getTerms();

    return {
      title: `${data.heading || "Terms & Conditions"} | Tekacademy`,
      description:
        "Read Tekacademy Terms & Conditions including policies, fees, certification, and legal guidelines.",

      openGraph: {
        title: data.heading,
        description:
          "Read Tekacademy Terms & Conditions including policies, fees, certification, and legal guidelines.",
        url: `${siteUrl}/terms-conditions`,
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: data.heading,
        description:
          "Read Tekacademy Terms & Conditions including policies, fees, certification, and legal guidelines.",
      },

      alternates: {
        canonical: `${siteUrl}/terms-conditions`,
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Terms & Conditions | Tekacademy",
      description:
        "Read Tekacademy Terms & Conditions including policies, fees, certification, and legal guidelines.",
    };
  }
}

// ============================
// Page Component
// ============================
export default async function TermsConditions() {
  const data = await getTerms();

  const heading = data.heading || "Terms & Conditions";
  const banner = data.banner || {};
  const sections = data.sections || [];

  return (
    <div className="main_container pb-10">

      {/* Page Heading */}
      <div className="flex sm:text-2xl bg-[#eee] font-bold justify-center mt-4 mb-6 p-4">
        {heading}
      </div>

      {/* Banner */}
      {/* <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#221638]">
          {banner.title}
        </h2>
        <p className="text-gray-600 mt-2">{banner.subtitle}</p>
      </div> */}

      {/* Sections */}
      <div className="grid gap-6 px-4">

        {sections.map((section, index) => (
          <div key={index} className="grid gap-3">

            {/* Section Title */}
            <h2 className="font-bold text-[#221638] text-xl">
              {section.title}
            </h2>

            {/* Content (array) */}
            {Array.isArray(section.content) && (
              <ul className="list-disc pl-6 text-lg space-y-2 text-[#606060]">
                {section.content.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}

            {/* Content (string fallback) */}
            {typeof section.content === "string" && (
              <p className="text-[#606060] pl-4 text-lg text-justify">
                {section.content}
              </p>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}