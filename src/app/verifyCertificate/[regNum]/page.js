import axios from "axios";

const VerifyCertificate = async ({ params }) => {
  const { regNum } = await params;

  let studentData = null;
  let notFound = false;
  let notVerified = false;

  try {
    const API_URL = process.env.NEXT_PUBLIC_BLOGS_APPLY_API_URL;

    const response = await axios.get(
      `${API_URL}/sc/verifiycertificate/${regNum}`,
      {
        cache: "no-store",
      }
    );

    if (response.data?.error === "Student not found") {
      notFound = true;
    } else if (response.data?.error === "Not Verified") {
      notVerified = true;
    } else {
      studentData = response.data;
    }
  } catch (err) {
    console.error("Error fetching student data:", err);
    notFound = true;
  }

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
          {!notFound && !notVerified && studentData && (
            <div>
              <table className="w-full text-left border border-gray-50 mb-6 sm:text-xs md:text-sm lg:text-xl">
                <tbody>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Name</th>
                    <td className="p-2">: {studentData.fullname}</td>
                  </tr>

                  <tr className="border-b">
                    <th className="p-2 font-semibold">Enrollment ID</th>
                    <td className="p-2">
                      : {studentData.registrationnumber}
                    </td>
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
                    <td className="p-2">
                      : {studentData.courseStartDate}
                    </td>
                  </tr>

                  <tr>
                    <th className="p-2 font-semibold">End Date</th>
                    <td className="p-2">
                      : {studentData.courseEndDate}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center text-green-600 md:text-lg lg:text-2xl font-medium">
                ✅ Certificate Issued
              </div>
            </div>
          )}

          {notVerified && !notFound && (
            <div className="text-center mt-6 text-yellow-600 md:text-lg lg:text-2xl font-medium">
              ❗ Certificate Not Issued
            </div>
          )}

          {notFound && (
            <div className="text-center mt-6 text-red-600 md:text-lg lg:text-2xl font-medium">
              ❌ Student Not Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;