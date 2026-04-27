
import React from "react";

async function getPrivacyPolicy() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  const res = await fetch(`${baseUrl}/api/v1/home/privacy-policy`, {
    // next: { revalidate: 60 }, // SSR fetch each request
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Privacy Policy");
  }

  const json = await res.json();
  return json.data?.privacyPolicy?.sections || [];
}

export default async function PrivacyPolicyPage() {
  const sections = await getPrivacyPolicy();
  return (
    <>
      <div>
        <div className="main_container pb-10">
          <div className="flex sm:text-2xl bg-[#eee] font-bold justify-center mt-4 mb-8 p-4">
            Privacy Policy
          </div>

          <div className="grid gap-5 main_container">
            {sections.map((section, index) => (
              <div key={section.id || index} className="grid gap-5">
                {/* Heading */}
                <div className="font-bold text-[#221638] text-xl">
                  {section.id}. {section.heading} :
                </div>

                {/* Paragraph */}
                {section.paragraph && (
                  <div className="text-[#606060] pl-4 text-lg text-justify">
                    {section.paragraph}
                  </div>
                )}

                {/* Points */}
                {section.points && (
                  <div className="pl-7 text-[#606060] text-lg">
                    {section.points.map((point, i) => (
                      <div key={i}>{point}</div>
                    ))}
                  </div>
                )}

                {/* Contact */}
                {section.contact && (
                  <>
                    <div className="text-[#606060] pl-4 text-lg">
                      For any questions or concerns about our privacy practices,
                      please contact us at:
                    </div>
                    <div className="text-[#606060] pl-4 text-lg">
                      Email:{" "}
                      <a
                        href={`mailto:${section.contact.email}`}
                        className="text-blue-600 underline"
                      >
                        {section.contact.email}
                      </a>
                    </div>
                    <div className="text-[#606060] pl-4 text-lg">
                      Call:{" "}
                      <a
                        href={`tel:${section.contact.phone}`}
                        className="text-blue-600 underline"
                      >
                        {section.contact.phone}
                      </a>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

