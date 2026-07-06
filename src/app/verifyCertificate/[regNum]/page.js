// app/verify/[regNum]/page.js

// No "use client" – this is a server component

async function getStudentData(regNum) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${API_URL}/sc/verifiycertificate/${regNum}`, {
      cache: "no-store", // server‑side fresh data
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return null; // will be treated as "not found"
  }
}

export default async function VerifyCertificatePage({ params }) {
  const { regNum } = params;
  const data = await getStudentData(regNum);

  // Determine the state, exactly like your client logic
  const notFound = !data || data.error === "Student not found";
  const notVerified = data?.error === "Not Verified";
  const studentData = (!notFound && !notVerified) ? data : null;

  // Render the same UI – no changes here!
  return (
    <div
      className="min-h-fit bg-cover bg-center py-12 bg-[#f8f8f9]"
      style={{
        backgroundImage:
          "url('https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel_bg.webp')",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white bg-opacity-90 shadow-md rounded-lg sm:p-0 md:p-6">
          {/* ✅ Certificate Verified Section */}
          {!notFound && !notVerified && studentData && (
            <>
              <table className="w-full text-left border border-gray-50 mb-6 sm:text-xs md:text-sm lg:text-xl">
                <tbody>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Name</th>
                    <td className="p-2">: {studentData.fullname}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Enrollment ID</th>
                    <td className="p-2">: {studentData.registrationnumber}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Course</th>
                    <td className="p-2">: {studentData.course}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Branch</th>
                    <td className="p-2">: {studentData.branch}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Start Date</th>
                    <td className="p-2">: {studentData.courseStartDate}</td>
                  </tr>
                  <tr>
                    <th className="p-2 font-semibold">End Date</th>
                    <td className="p-2">: {studentData.courseEndDate}</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-center text-green-600 md:text-lg lg:text-2xl font-medium">
                ✅ Certificate Issued
              </div>
            </>
          )}

          {/* ❌ Certificate Not Verified */}
          {!notFound && notVerified && (
            <div className="text-center mt-6 text-yellow-600 md:text-lg lg:text-2xl font-medium">
              ❗ Certificate Not Issued
            </div>
          )}

          {/* ❌ Student Not Found */}
          {notFound && (
            <div className="text-center mt-6 text-red-600 md:text-lg lg:text-2xl font-medium">
              ❌ Student Not Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}