// app/terms-conditions/page.jsx

import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// ============================
// Fetch Terms Data
// ============================
async function getTerms() {
  const res = await fetch(`${baseUrl}/api/v1/home/terms-conditions`, {
    next: { revalidate: 60 }, // ISR - refresh every 60 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Terms & Conditions");
  }

  return res.json();
}

// ============================
// Dynamic Metadata
// ============================
export async function generateMetadata() {
  try {
    const response = await getTerms();
    const meta = response?.data?.meta;

    return {
      title: meta?.title || "Terms & Conditions | Teksversity",
      description:
        meta?.description ||
        "Read Teksversity Terms & Conditions including policies, fees, certification, and legal guidelines.",

      openGraph: {
        title: meta?.title,
        description: meta?.description,
        url: `${siteUrl}/terms-conditions`,
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: meta?.title,
        description: meta?.description,
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
      title: "Terms & Conditions | Teksversity",
      description:
        "Read Teksversity Terms & Conditions including policies, fees, certification, and legal guidelines.",
    };
  }
}

// ============================
// Page Component
// ============================
export default async function TermsConditions() {
  const response = await getTerms();
  const data = response?.data || {};

  // Remove meta from sections
  const terms = Object.entries(data)
    .filter(([key]) => key !== "meta")
    .map(([key, value]) => ({
      title: value.heading || key,
      points: value.points || [],
    }));

  return (
    <div className="main_container">
      <div className="grid gap-6 mt-6 px-6">

        {terms.map((section, index) => (
          <div key={index}>
            <h2 className="font-bold text-[#221638] text-xl">
              {section.title}
            </h2>

            <ul className="list-disc pl-6 text-lg mt-3 space-y-3 text-[#606060]">
              {section.points.map((point, i) => (
                <li key={i}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mb-32" />
      </div>
    </div>
  );
}