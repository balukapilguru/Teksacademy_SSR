import BranchClient from "../BranchClient";
import { notFound } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;

async function getBranchData(branchname) {
  if (!baseUrl || !branchname) return null;

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/branch/${encodeURIComponent(branchname)}`,
      { next: { revalidate: 300 } }
    );

    if (res.status === 404) {
      notFound();
    }

    if (!res.ok) {
      throw new Error(`Branch API error: ${res.status}`);
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Branch detail fetch failed:", error);
    throw error;
  }
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
  return <BranchClient branchName={branchname} />;
}
