// lib/getCourseData.js
export async function getCourseData(coursename) {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  const res = await fetch(`${baseUrl}/api/v1/courses/${coursename}`, {
    next: { revalidate: 60 },
  });



 if (res.status === 404) {
  return null; // Let page handle 404
}

if (!res.ok) {
  throw new Error(`API error: ${res.status}`);
}

  const json = await res.json();
  return json?.data;


  
}
