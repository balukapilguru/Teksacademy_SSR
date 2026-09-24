import MediaClient from "@/app/discover/media/MediaClient"

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/v1/discover/media`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("API error");

    const result = await res.json();
    const meta = result?.data?.meta;
// console.log(result,"media")
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

export default function Page() {
  return <MediaClient />;
}