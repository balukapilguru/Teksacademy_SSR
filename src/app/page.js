import Home from "@/components/home-page/main-component/Home";

export const dynamic = "force-dynamic";


export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/v1/home`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("SEO API failed");

    const json = await res.json();
    const meta = json?.data?.meta;


    

    return {
      title: meta?.title || "Teksversity | Online Courses & Certifications",
      description:
        meta?.description ||
        "Explore online certifications, academic programs, and self-learning courses at Teksversity.",
     
    };
  } catch (error) {
    return {
      title: "Teksversity | Online Courses & Certifications",
      description:
        "Explore online certifications, academic programs, and self-learning courses at Teksversity.",
    };
  }
}

export default function HomePage() {
  return (
    <div>
      <Home />
    </div>
  );
}
