// app/courses/page.jsx

import CoursesClient from "./CoursesClient";

export async function generateMetadata() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${baseUrl}/api/v1/courses`, {
      next: { revalidate: 300 }, // cache for 5 minutes
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    return {
      title:
        data?.meta?.title ||
        "Online Courses & Certifications | Teksversity",

      description:
        data?.meta?.description ||
        "Explore industry-ready certification and academic programs.",

      openGraph: {
        title: data?.meta?.title,
        description: data?.meta?.description,
        url: "https://teksversity.com/courses",
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: data?.meta?.title,
        description: data?.meta?.description,
      },

      alternates: {
        canonical: "https://teksversity.com/courses",
      },
    };
  } catch (error) {
    return {
      title: "Courses | Teksversity",
      description:
        "Browse our certification and academic programs for career growth.",
    };
  }
}

export default function Page() {
  return <CoursesClient />;
}