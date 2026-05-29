import Contactusclient from '@/app/discover/contact-us/Contactusclient';

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEKS_SSR_API_URL ||
    process.env.NEXT_TEKS_SSR_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/v1/discover/contact-us`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("API error");

    const result = await res.json();
    const meta = result?.data?.meta;

    return {
      title: meta?.title || "Contact Us",
      description: meta?.description || "Get in touch with us",
    };
  } catch (err) {
    return {
      title: "Contact Us",
      description: "Get in touch with us",
    };
  }
}

export default function Page() {
  return <Contactusclient />;
}
