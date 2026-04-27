// app/ebook/page.jsx

import EbookClient from "@/app/ebook/EbooksClient";

const baseurl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

/* ===========================
   ✅ METADATA (HEAD SECTION)
=========================== */
export async function generateMetadata() {
  if (!baseurl) return {};

  try {
    const res = await fetch(
      `${baseurl.replace(/\/$/, "")}/api/v1/home/ebooks`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return {};

    const json = await res.json();
    const meta = json?.data?.meta;

    if (!meta) return {};

    return {
      title: meta.title || "Ebooks",
      description: meta.description || "",
      openGraph: {
        title: meta.title,
        description: meta.description,
      },
      twitter: {
        title: meta.title,
        description: meta.description,
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {};
  }
}

/* ===========================
   ✅ PAGE COMPONENT
=========================== */
export default async function Page() {
  if (!baseurl) {
    console.error("NEXT_PUBLIC_TEKSSKILL_API_URL is not defined");
    return <div>API base URL not defined</div>;
  }

  const url = `${baseurl.replace(/\/$/, "")}/api/v1/home/ebooks`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      const text = await res.text();
      console.error("API ERROR RESPONSE:", text);
      throw new Error("Failed to fetch JSON from API");
    }

    const json = await res.json();
    const data = json?.data;

    if (!data) {
      return <div>No data found</div>;
    }

    return (
      <>
        {/* ✅ JSON-LD Schema (if exists) */}
        {data?.meta?.schemaCode && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                typeof data.meta.schemaCode === "string"
                  ? data.meta.schemaCode
                  : JSON.stringify(data.meta.schemaCode),
            }}
          />
        )}

        {/* ✅ Ebooks Section */}
        <EbookClient data={data} />
      </>
    );
  } catch (err) {
    console.error("Fetch Error:", err);
    return <div>Unable to load ebooks and community section</div>;
  }
}