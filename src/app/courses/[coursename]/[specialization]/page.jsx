import React from "react";
import { notFound } from "next/navigation";
import Banner from "@/components/coursePage/Banner";
import ReserveYourSpot from "@/components/coursePage/ReserveYourSpot";
import Whyacademics from "@/components/coursePage/Whyacademics";
import KeyHighLights from "@/components/coursePage/KeyHighlights";
import DownloadCourseBrochure from "@/components/coursePage/DownloadCourseBrochure";
import CourseInfoTable from "@/components/coursePage/UniversitiesTable";
import Admission from "@/components/coursePage/AdmissionProcedure";
import Platform from "@/components/coursePage/Platform";
import Testimonials from "@/components/coursePage/Testimonials";
import HiringCompanies from "@/components/coursePage/HiringCompanies";
import Accordian from "@/components/coursePage/Accordian";
import Talktoour from "@/components/coursePage/Talktoour";
import MostSearchedTerms from "@/components/coursePage/Mostsearchedterms";
import OverViewOfOnline from "@/components/coursePage/OverViewOfOnline";
import CourseScrollBar from "@/components/coursePage/CourseScrollBar";
import CourseFlowProvider from "@/components/coursePage/CourseFlowProvider";
import Programfee from "@/components/coursePage/Programfee";

const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

export async function generateMetadata({ params }) {
  const { coursename, specialization } = params;

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/course/${coursename}/specializations/${specialization}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return {};

    const json = await res.json();
    const meta = json?.data?.meta;

    if (!meta) return {};

    return {
      title: meta.title || "Course",
      description: meta.description || "",
      openGraph: {
        title: meta.title,
        description: meta.description,
      },
      twitter: {
        title: meta.title,
        description: meta.description,
      },
    };
  } catch {
    return {};
  }
}
export default async function Page({ params }) {
  const { coursename, specialization } = params;

 let courseData;

try {
  const res = await fetch(
    `${baseUrl}/api/v1/course/${coursename}/specializations/${specialization}`,
    { next: { revalidate: 60 } }
  );

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();
  courseData = json?.data;

  if (!courseData) {
    notFound();
  }
} catch (error) {
  console.error("Course fetch failed:", error);
  throw error; // let Next handle real errors
}

  const {
    banner,
    offeredBy,
    sections,
    overViewOfOnline,
    whyOnline,
    keyHighlights,
    downloadOurCourseBrochure,
    offeringUniversity,
    OnlineAdmissionProcedure,
    platFormSupport,
    testimonials,
    hiringPartners,
    questionSection,
    letsTalk,
    mostSearchedTerms,
    formDetails,
    meta,
  } = courseData || {};

  // Create a component that wraps all CourseFlow-dependent components
  const CourseFlowSection = () => (
    <>
      {/* CourseInfoTable */}
      {offeringUniversity && formDetails && (
        <div
          className="rounded-lg border main_container"
          style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
        >
          <CourseInfoTable
            data={{
              offeringUniversity: offeringUniversity,
              formDetails: formDetails,
            }}
          />
        </div>
      )}

      {OnlineAdmissionProcedure && (
        <div
          className="rounded-lg border main_container"
          style={{ backgroundColor: "#fbf5f6", borderColor: "#fbf5f6" }}
        >
          <Admission data={OnlineAdmissionProcedure} />
        </div>
      )}

      {platFormSupport && (
        <div
          className="rounded-lg border main_container"
          style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
        >
          <Platform data={platFormSupport} />
        </div>
      )}

      {testimonials && (
        <div
          className="rounded-lg border main_container"
          style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
        >
          <Testimonials data={testimonials} />
        </div>
      )}

      {/* Programfee */}
      {offeringUniversity && formDetails && (
        <div
          className="rounded-lg border main_container"
          style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
        >
          <Programfee data={offeringUniversity} universityLsit={formDetails} />
        </div>
      )}
    </>
  );

  const schemaData = courseData?.meta?.schemaCode;

  return (
    <>
{
      schemaData && (
        <script
          id="course-schema"      

          type="application/ld+json"


          dangerouslySetInnerHTML={{
            __html:
              typeof schemaData === "string"

                ? schemaData
                : JSON.stringify(schemaData),
          }}
        />
      )
}

      <div className="mt-5">
        

        {banner && (
          <Banner
            data={banner}
            formDetails={formDetails}
            category={true}
            source={29}
          />
        )}
        {offeredBy && (
          <ReserveYourSpot
            data={offeredBy}
            source={31}
            formDetails={formDetails}
            category={true}
          />
        )}

        {sections && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <CourseScrollBar sections={sections} />
          </div>
        )}

        {overViewOfOnline && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#fbf5f6", borderColor: "#fbf5f6" }}
          >
            <OverViewOfOnline
              data={overViewOfOnline}
              formDetails={formDetails}
              category={true}
            />
          </div>
        )}

        {whyOnline && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <Whyacademics data={whyOnline} />
          </div>
        )}

        {keyHighlights && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <KeyHighLights data={keyHighlights} />
          </div>
        )}

        {downloadOurCourseBrochure && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#e5e7eb", borderColor: "#e5e7eb" }}
          >
            <DownloadCourseBrochure
              data={downloadOurCourseBrochure}
              formDetails={formDetails}
              category={true}
            />
          </div>
        )}

        {/* Wrap ALL CourseFlow-dependent components together */}
        {offeringUniversity && formDetails && (
          <CourseFlowProvider>
            <CourseFlowSection />
          </CourseFlowProvider>
        )}

        {hiringPartners && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <HiringCompanies hiringData={hiringPartners} />
          </div>
        )}

        {questionSection && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <Accordian faq={questionSection} />
          </div>
        )}

        {letsTalk && (
          <div
            className="rounded-lg border main_container pt-5"
            style={{ backgroundColor: "#ffffff", borderColor: "#ffffff" }}
          >
            <Talktoour data={letsTalk} />
          </div>
        )}

        {mostSearchedTerms && <MostSearchedTerms data={mostSearchedTerms} />}
      </div>
    </>
  );
}
