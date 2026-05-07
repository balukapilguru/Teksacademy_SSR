import Banner from "@/components/universitypage/Banner";
import AboutUniversity from "@/components/universitypage/AboutUniversity";
import OnlineFacts from "@/components/universitypage/OnlineFacts";
import ApprovedByUniversity from "@/components/universitypage/ApprovedByUniversity";
import AdmissionProcess from "@/components/coursePage/AdmissionProcedure";
import Accordian from "@/components/coursePage/Accordian";
import Talktoour from "@/components/coursePage/Talktoour";
import BottomNavbar from "@/components/universitypage/BottomNavbar";
import UniversityCards from "@/components/universitypage/UniversityCards";
import CourseCategories from "@/components/universitypage/CourseCategories";
import Examinationpattern from "@/components/universitypage/Examinationpattern";

const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

// ✅ Dynamic Metadata
export async function generateMetadata({ params }) {
  const { universityname } = params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(
      `${baseUrl}/api/v1/university/${universityname}`,
      { cache: "no-store", signal: controller.signal }
    );

    clearTimeout(timeoutId);
    const result = await res.json();
    const data = result?.data;

    return {
      title:
        data?.meta?.title ||
        `${data?.banner?.heading || universityname} | Tekacademy`,
      description:
        data?.meta?.description ||
        data?.aboutSection?.description?.slice(0, 160),
      openGraph: {
        title: data?.meta?.title,
        description: data?.meta?.description,
        images: [
          {
            url: data?.banner?.image,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "University | Tekacademy",
      description: "Explore online universities and courses.",
    };
  }
}

export default async function UniversityPage({ params }) {
  const { universityname } = params;

  let data = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(
      `${baseUrl}/api/v1/university/${universityname}`,
      { cache: "no-store", signal: controller.signal }
    );

    clearTimeout(timeoutId);
    const result = await res.json();
    data = result?.data;
  } catch (error) {
    console.error('Failed to fetch university data:', error);
  }

  if (!data) {
    return <p className="text-center p-6">University not found</p>;
  }

  const {
    banner,
    aboutSection,
    course,
    universityOnlineFacts,
    examinationPattern,
    approvedBy,
    otherUniversities,
    OnlineAdmissionProcedure,
    questionSection,
    letsTalk,
    secondNavbar,
  } = data;

  const bottomNavData = secondNavbar
    ? {
        instituteName:
          secondNavbar.university?.name || "Amity University Online",
        image: secondNavbar.university?.image,
        rating: secondNavbar.university?.rating,
        buttons:
          secondNavbar.button?.map((btn) => ({
            text: btn.name,
            action: { src: btn.url || null },
          })) || [],
        formDetails: data?.formDetails || null,
      }
    : null;

  return (
    <>
      <div className=" ">
        {banner && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <Banner data={banner}
            formDetails={data?.formDetails} 
            sourceId={data?.formDetails?.specializations?.ProductId}
            ProductId={data?.formDetails?.specializations?.sourceId}/>
            
          </div>
        )}
        {aboutSection && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <AboutUniversity data={aboutSection} />
          </div>
        )}
        {course && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <CourseCategories
            formDetails={data?.formDetails} 
             data={course} universityName={universityname} />
          </div>
        )}

        {universityOnlineFacts && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <OnlineFacts data={universityOnlineFacts} />
          </div>
        )}
        {examinationPattern && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <Examinationpattern data={examinationPattern} />
          </div>
        )}

        {approvedBy && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <ApprovedByUniversity data={approvedBy} />
          </div>
        )}
        {OnlineAdmissionProcedure && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <AdmissionProcess data={OnlineAdmissionProcedure} />
          </div>
        )}

        <div
          className="rounded-lg border main_container"
          style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
        >
          <UniversityCards
            params={{ universityname }}
            data={otherUniversities}
          />
        </div>

        {questionSection && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <Accordian faq={questionSection} />
          </div>
        )}

        {letsTalk && (
          <div
            className="rounded-lg border main_container"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <Talktoour data={letsTalk} />
          </div>
        )}
        {bottomNavData && (
          <div>
            <BottomNavbar data={bottomNavData} />
          </div>
        )}

        {/* {banner && <Banner data={banner}  />}
      {aboutSection && <AboutUniversity data={aboutSection} />}
      {course && <CourseCategories data={course} universityName={universityname} />}
      {universityOnlineFacts && (
        <OnlineFacts data={universityOnlineFacts} />
      )}
      {approvedBy && <ApprovedByUniversity data={approvedBy} />}
      {OnlineAdmissionProcedure && (
        <AdmissionProcess data={OnlineAdmissionProcedure} />
      )}

      
      <UniversityCards params={{ universityname }} />

      {questionSection && <Accordian faq={questionSection} />}

      {letsTalk ? (
        <Talktoour data={letsTalk} />
      ) : (
        <Talktoour />
      )}

      {universityFooter && <BottomNavbar data={universityFooter} />} */}
      </div>
    </>
  );
}