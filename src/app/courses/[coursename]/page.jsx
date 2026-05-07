import { getCourseData } from "@/lib/getCourseData";

export async function generateMetadata({ params }) {
  try {
    const data = await getCourseData(params.coursename);

    return {
      title: data?.meta?.title || "Tekacademy Courses",
      description:
        data?.meta?.description || "Explore online courses at Tekacademy.",
    };
  } catch {
    return {
      title: "Tekacademy Courses",
      description: "Explore online courses at Tekacademy.",
    };
  }
}


/* =====================================================
   COMPONENT IMPORTS (UNCHANGED)
===================================================== */
import Banner from "@/components/coursePage/Banner";
import ReserveYourSpot from "@/components/coursePage/ReserveYourSpot";
import ReserveYourSpots from "@/components/coursePage/ReserveYourSpots";
import OverViewOfOnline from "@/components/coursePage/OverViewOfOnline";
import HiringCompanies from "@/components/coursePage/HiringCompanies";
import Accordian from "@/components/coursePage/Accordian";
import WhyOnline from "@/components/coursePage/WhyOnline";
import DownloadCourseBrochure from "@/components/coursePage/DownloadCourseBrochure";
import CourseInfoTable from "@/components/coursePage/UniversitiesTable";
import Oppurtunities from "@/components/coursePage/Oppurtunities";
import ToolsAndFeatures from "@/components/coursePage/ToolsSection";
import IndustryProjects from "@/components/coursePage/IndustryProjects";
import CareerPath from "@/components/coursePage/CareerPath";
import Admission from "@/components/coursePage/AdmissionProcedure";
import Platform from "@/components/coursePage/Platform";
import Testimonials from "@/components/coursePage/Testimonials";
import MostSearchedTerms from "@/components/coursePage/Mostsearchedterms";
import Talktoour from "@/components/coursePage/Talktoour";
import KeyHighLights from "@/components/coursePage/KeyHighlights";
import CourseScrollBar from "@/components/coursePage/CourseScrollBar";
import Specializations from "@/components/coursePage/Specializations";
import Whyacademics from "@/components/coursePage/Whyacademics";
import CourseFlowProvider from "@/components/coursePage/CourseFlowProvider";
import Programfee from "@/components/coursePage/Programfee";

/* =====================================================
   PAGE
===================================================== */
export default async function Page({ params }) {
  const { coursename } = params;

  let data;
  try {
    data = await getCourseData(coursename);
  } catch {
    return (
      <div className="p-6 text-red-600 text-center">
        Failed to load course data. Please try again later.
      </div>
    );
  }

  /* =====================================================
     COURSE TYPE LOGIC (UNCHANGED)
  ===================================================== */
  const isCertification =
    coursename.includes("certification") ||
    data?.category === "certifications" ||
    data?.banner?.name?.toLowerCase().includes("certification");



    // const schemaData = data?.meta?.schemaCode;

  const isSelfPaced =
    data?.category === "selfPacedLearning" ||
    data?.category?.toLowerCase().includes("selfpaced") ||
    data?.banner?.name?.toLowerCase().includes("self-paced") ||
    data?.banner?.name?.toLowerCase().includes("self paced");

  const isAcademic =
    data?.category === "academics" ||
    data?.category?.toLowerCase().includes("academics") ||
    data?.banner?.name?.toLowerCase().includes("academic");

  const formDetails =
    isCertification || isSelfPaced
      ? data?.formDetails
      : data?.specializations;

  /* =====================================================
     DATA MAPPING (UNCHANGED)
  ===================================================== */
  const bannerData = data?.banner && {
    firstHeading: data.banner.name,
    mainHeading: data.banner.mainHeading,
    description: data.banner.description,
    tags: data.banner.tags || [],
    button: data.banner.button,
    bgImage: data.banner.bgImage,
    bannerImage: data.banner.bannerImage,
  };

  const reserveSpotData = data?.offeredBy && {
    heading: data.offeredBy.heading,
    subHeading: data.offeredBy.subHeading,
    image: data.offeredBy.image,
    whyJoinThisCourse: data.offeredBy.whyJoinThisCourse,
    reserveYourSpotForm: data.offeredBy.reserveYourSpotForm,
  };

  const mostSearchedTerms = data?.mostSearchedTerms && {
    locations: data.mostSearchedTerms.locations,
    courses: data.mostSearchedTerms.courses,
  };

  /* =====================================================
     COURSE FLOW (UNCHANGED)
  ===================================================== */
  const CourseFlowWrapper = () => (
    <CourseFlowProvider>
      {data?.offeringUniversity && formDetails && (
        <CourseInfoTable
          data={{
            offeringUniversity: data.offeringUniversity,
            formDetails: data.formDetails,
          }}
          isSelfPaced={isSelfPaced}
          isAcademic={isAcademic}
          isCertification={isCertification}
          courseName={coursename}
          bannerData={data.banner}
          formDetails={formDetails}
          branch={data?.branch}
        />
      )}

      {data?.embraceTheEndlessOpportunities && (
        <Oppurtunities data={data.embraceTheEndlessOpportunities} />
      )}

      {data?.advancedTools && (
        <ToolsAndFeatures data={data.advancedTools} />
      )}

      {data?.industryProjects && (
        <IndustryProjects data={data.industryProjects} />
      )}

      {data?.careerPath && (
        <CareerPath data={data.careerPath} formDetails={formDetails} />
      )}

      {data?.OnlineAdmissionProcedure && (
        <Admission data={data.OnlineAdmissionProcedure} />
      )}

      {data?.platFormSupport && (
        <Platform data={data.platFormSupport} />
      )}

      {data?.testimonials && (
        <Testimonials data={data.testimonials} />
      )}

      {!isSelfPaced && !isAcademic && (
        <Programfee
          data={data?.offeringUniversity}
          universityLsit={data?.formDetails}
        />
      )}
    </CourseFlowProvider>
  );

  /* =====================================================
     SECTIONS CONFIG (UNCHANGED)
  ===================================================== */
  const sectionsConfig = [
    {
      component: data?.sections && (
        <CourseScrollBar sections={data?.sections} />
      ),
    },

    ...(isCertification
      ? [
          {
            component: data?.overViewOfOnline && (
              <OverViewOfOnline
                data={data.overViewOfOnline}
                formDetails={formDetails}
                category={true}
              />
            ),
          },
          { component: data?.whyOnline && <WhyOnline data={data.whyOnline} /> },
          {
            component: data?.keyHighlights && (
              <KeyHighLights data={data.keyHighlights} />
            ),
          },
          {
            component: data?.downloadOurCourseBrochure && (
              <DownloadCourseBrochure
                data={data.downloadOurCourseBrochure}
                formDetails={formDetails}
                category={true}
              />
            ),
          },
          { component: <CourseFlowWrapper /> },
        ]
      : [
          {
            component: data?.overViewOfOnline && (
              <OverViewOfOnline
                data={data.overViewOfOnline}
                formDetails={formDetails}
                category={isCertification}
                branch={data?.branch}
                isSelfPaced={isSelfPaced}
              />
            ),
          },
          {
            component: data?.whyOnline && (
              <Whyacademics data={data.whyOnline} />
            ),
          },
          {
            component: data?.keyHighlights && (
              <KeyHighLights data={data.keyHighlights} />
            ),
          },
          {
            component: data?.downloadOurCourseBrochure && (
              <DownloadCourseBrochure
                data={data.downloadOurCourseBrochure}
                formDetails={formDetails}
                category={isCertification}
                branch={data?.branch}
                isSelfPaced={isSelfPaced}
              />
            ),
          },
          {
            component: data?.specializations && (
              <Specializations data={data?.specializations} />
            ),
          },
          { component: <CourseFlowWrapper /> },
        ]),
    {
      component: data?.hiringPartners && (
        <HiringCompanies hiringData={data.hiringPartners} />
      ),
    },
    {
      component: data?.questionSection && (
        <Accordian faq={data.questionSection} />
      ),
    },
    {
      component: data?.letsTalk && <Talktoour data={data.letsTalk} />,
    },
  ];
const schemaData = data?.meta?.schemaCode;
  /* =====================================================
     RENDER
  ===================================================== */
  return (

<>
     {schemaData && (
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
    )}

    <div className="mt-5">
      {bannerData && (
        <Banner
          data={bannerData}
          formDetails={formDetails}
          category={isCertification}
          branch={data?.branch}
          isSelfPaced={isSelfPaced}
        />
      )}

      {reserveSpotData &&

        (isCertification || isSelfPaced ? (
          <ReserveYourSpot
            source={31}
            data={reserveSpotData}
            formDetails={formDetails}                    
            isSelfPaced={isSelfPaced}
          />
        ) : (
          <ReserveYourSpots
            source={31}            
            data={reserveSpotData}
            formDetails={formDetails}
            branch={data?.branch}
          />
          
        ))}

      {sectionsConfig.map(
        (sec, idx) =>
          sec.component && (
            <div key={idx} className="rounded-lg main_container pt-5">
              {sec.component}
            </div>
          )
      )}

      {mostSearchedTerms && <MostSearchedTerms data={mostSearchedTerms} />}
    </div>
</>

  );
}
