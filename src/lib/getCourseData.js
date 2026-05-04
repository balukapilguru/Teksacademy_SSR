// lib/getCourseData.js
export async function getCourseData(coursename) {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${baseUrl}/api/v1/courses/${coursename}`, {
      next: { revalidate: 60 },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.status === 404) {
      return null; // Let page handle 404
    }

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json = await res.json();
    return json?.data;
  } catch (error) {
    console.error('Failed to fetch course data:', error);
    return null; // Return null on error to prevent build hang
  }
}
