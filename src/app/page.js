import Home from "@/components/home-page/main-component/Home";

export const dynamic = "force-dynamic";


export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${baseUrl}/api/v1/home`, {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("SEO API failed");

    const json = await res.json();
    const meta = json?.data?.meta;


    

    return {
      title: meta?.title || "Best Software Courses Training Institute in Hyderabad | Teks Academy",
      description:
        meta?.description ||
        "Teks Academy - Best software training institute in Hyderabad offering job-oriented courses.",
     
    };
  } catch (error) {
    return {
      title: "Best Software Courses Training Institute in Hyderabad | Teks Academy",
      description:
        "Teks Academy - Best software training institute in Hyderabad offering job-oriented courses.",
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
