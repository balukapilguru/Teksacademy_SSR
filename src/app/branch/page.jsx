// app/branch/page.jsx

import BranchClient from "./BranchClient";

export async function generateMetadata() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/v1/branch`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = await res.json();
    const meta = json?.data?.meta;

    return {
      title: meta?.title || "Best Software Training Institute | Teks Academy",
      description:
        meta?.description ||
        "Join Teks Academy for industry-oriented software training courses with placement assistance, internships, certifications, and real-time projects.",
      openGraph: {
        title: meta?.title,
        description: meta?.description,
        url: "https://teksacademy.com/branch",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: meta?.title,
        description: meta?.description,
      },
    };
  } catch (error) {
    return {
      title: "Best Software Training Institute | Teks Academy",
      description:
        "Join Teks Academy for industry-oriented software training courses with placement assistance.",
    };
  }
}

export default function Page() {
  return <BranchClient />;
}
