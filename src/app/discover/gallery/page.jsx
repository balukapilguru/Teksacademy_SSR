export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/v1/discover/gallery`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("API error");

    const result = await res.json();
    const meta = result?.data?.meta;

    return {
      title: meta?.title || "Default Title",
      description: meta?.description || "Default Description",
    };
  } catch (err) {
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}

// 👇 import client component
import GalleryClient from "./GalleryClient";

export default function Page() {
  return <GalleryClient />;
}