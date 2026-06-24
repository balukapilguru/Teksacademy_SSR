import { NextResponse } from "next/server";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://teksacademy.com").replace(/\/$/, "");

const fallbackRobots = `User-agent: *
Disallow: /*?ref=
Disallow: /privacy-policy
Disallow: /policyagreements/terms-of-service
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;

  if (!baseUrl) {
    return new NextResponse(fallbackRobots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/robots.txt`, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`Robots API failed with status ${response.status}`);
    }

    const text = await response.text();

    return new NextResponse(text || fallbackRobots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch {
    return new NextResponse(fallbackRobots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

}
