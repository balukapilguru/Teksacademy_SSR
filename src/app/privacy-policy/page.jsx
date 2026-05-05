import React from "react";

// Fetch API
async function getPrivacyPolicy() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/v1/home/privacy-policy`, {
      signal: controller.signal,
      // next: { revalidate: 60 }, // optional ISR
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error("Failed to fetch Privacy Policy");
    }

    const json = await res.json();

    return json.data || {};
  } catch (error) {
    console.error("Failed to fetch privacy policy:", error);
    return {};
  }
}

export default async function PrivacyPolicyPage() {
  const data = await getPrivacyPolicy();

  const sections = data.sections || [];
  const banner = data.banner || {};
  const heading = data.heading || "Privacy Policy";
  const note = data.note || "";

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
      <div className="grid gap-6">
        {sections.map((section, index) => (
          <div key={index} className="grid gap-3">

            {/* Section Title */}
            <div className="font-bold text-[#221638] text-xl">
              {section.title}
            </div>

            {/* If content is string */}
            {typeof section.content === "string" && (
              <div className="text-[#606060] pl-4 text-lg text-justify">
                {section.content}
              </div>
            )}

            {/* If content is array */}
            {Array.isArray(section.content) && (
              <ul className="pl-7 text-[#606060] text-lg list-disc space-y-1">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Note */}
      {note && (
        <div className="mt-10 text-sm text-gray-600 italic border-t pt-4">
          {note}
        </div>
      )}
    </div>
  );
}