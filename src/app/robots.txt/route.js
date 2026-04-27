import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  const response = await fetch(
    `${baseUrl}/api/v1/robots.txt`,
    {
      cache: "no-store",
    }
  );

  const text = await response.text();
  

  return new NextResponse(text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
