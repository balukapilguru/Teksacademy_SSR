import BranchClient from "../BranchClient";
import { notFound } from "next/navigation";

const baseUrl =
  process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
  process.env.NEXT_TEKS_SSR_API_URL


function getSlugVariants(rawName = "") {
  try {
    const decoded = decodeURIComponent(rawName).trim().toLowerCase();
    const hyphenated = decoded.replace(/\s+/g, "-");
    const variants = [hyphenated];
    if (!hyphenated.startsWith("best-software-training-institute-")) {
      variants.push(`best-software-training-institute-${hyphenated}`);
    }
    return [...new Set(variants)];
  } catch {
    return [rawName];
  }
}

async function getBranchData(branchname) {
  if (!baseUrl || !branchname) return null;

  const slugs = getSlugVariants(branchname);

  for (const slug of slugs) {
    try {
      const res = await fetch(
        `${baseUrl}/api/v1/branch/${encodeURIComponent(slug)}`,
        { next: { revalidate: 300 } }
      );

      if (res.ok) {
        const json = await res.json();
        if (json?.data) return json.data;
      }
    } catch (error) {
      console.error(`Branch detail fetch failed for ${slug}:`, error);
    }
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { branchname } = await params;

  try {
    const branchData = await getBranchData(branchname);
    const meta = branchData?.meta;

    return {
      title: meta?.title || "Best Software Training Institute | Teks Academy",
      description:
        meta?.description ||
        "Join Teks Academy for industry-oriented software training courses with placement assistance, internships, certifications, and real-time projects.",
      openGraph: {
        title: meta?.title,
        description: meta?.description,
        url: `https://teksacademy.com/branch/${branchname}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: meta?.title,
        description: meta?.description,
      },
      alternates: {
        canonical: `https://teksacademy.com/branch/${branchname}`,
      },
    };
  } catch {
    return {
      title: "Best Software Training Institute | Teks Academy",
      description:
        "Join Teks Academy for industry-oriented software training courses with placement assistance.",
    };
  }
}

export default async function Page({ params }) {
  const { branchname } = await params;
  const branchData = await getBranchData(branchname);
  const schemaData = branchData?.meta?.schemaCode;

  return (
    <>
      {schemaData && (
        <script
          id="course-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof schemaData === "string"
                ? schemaData
                : JSON.stringify(schemaData),
          }}
        />
      )}

      <BranchClient branchName={branchname} data={branchData} />
    </>
  );
}
