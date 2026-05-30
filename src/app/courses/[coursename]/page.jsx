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
import Excel from "@/components/home-page/ui-components/Excel";
import Nutshell from "@/components/home-page/ui-components/NutShell";
import Hiring from "@/components/home-page/ui-components/Hiring";

const isGenericCourseLabel = (value) => {
  const label = typeof value === "string" ? value.trim().toLowerCase() : "";
  return (
    !label ||
    label === "course" ||
    label === "course enquiry" ||
    label === "course details"
  );
};

const getCourseLabelValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") {
    return isGenericCourseLabel(value) ? "" : value.trim();
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const label = getCourseLabelValue(item);
      if (label) return label;
    }
    return "";
  }
  if (typeof value === "object") {
    const directValue =
      value.mainHeading ||
      value.heading ||
      value.programName ||
      value.courseName ||
      value.course ||
      value.title ||
      value.name ||
      value.text;

    const directLabel = getCourseLabelValue(directValue);
    if (directLabel) return directLabel;

    for (const item of Object.values(value)) {
      const label = getCourseLabelValue(item);
      if (label) return label;
    }
  }
  return "";
};

const getCourseLabelFromSlug = (slug = "") => {
  return slug
    .replace(/^best-/, "")
    .replace(/-course-training-institute$/, "")
    .replace(/-training-institute$/, "")
    .replace(/-certification-program$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

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
    isCertification || isSelfPaced ? data?.formDetails : data?.specializations;
console.log(data.advancedTools,"data.ToolsAndFeatures")
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
  courses: data.mostSearchedTerms.courses,
};
  console.log(mostSearchedTerms,"mst")

  const excelSectionData = data?.excel || data?.Excel;

  const courseLabel =
    getCourseLabelValue(data?.banner?.mainHeading) ||
    getCourseLabelValue(data?.mainHeading) ||
    getCourseLabelValue(data?.name) ||
    getCourseLabelValue(data?.banner?.name) ||
    getCourseLabelFromSlug(coursename);
  const careerServicesData = data?.careerServices ||
    data?.careerService || {
      title: ["Career Services in a", "Nutshell"],
      services: [
        {
          title: "Technical Seminars",
          icon: {
            url: "assets/img/excel/orange-1.webp",
            name: "Technical Seminars",
          },
        },
        {
          title: "Mock Interviews CRT & Job Ready Skills",
          icon: {
            url: "assets/img/excel/orange-2.webp",
            name: "Mock Interviews",
          },
        },
        {
          title: "Dedicated Job Portal",
          icon: {
            url: "assets/img/excel/orange-3.webp",
            name: "Dedicated Job Portal",
          },
        },
        {
          title: "Internship opportunity in a IT Company",
          icon: {
            url: "assets/img/excel/orange-4.webp",
            name: "Internship Opportunity",
          },
        },
      ],
      button: { text: "Request Call Back", link: "/forms/request-call-back" },
      image: {
        desktop: "assets/img/excel/blue-1.webp",
        mobile: "assets/img/excel/blue-1.webp",
        alt: "Career Services",
      },
    };

  console.log(data?.careerService, "data?.careerServices");
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
          courseName={courseLabel}
          bannerData={data.banner}
          formDetails={formDetails}
          branch={data?.branch}
        />
      )}

      {data?.excel && <Excel data={data.excel} courseName={courseLabel} />}

{data?.advancedTools && (
        <ToolsAndFeatures data={data.advancedTools} />
      )}
      {data?.industryProjects && (
        <IndustryProjects data={data.industryProjects} />
      )}

      {data?.careerPath && (
        <CareerPath
          data={data.careerPath}
          formDetails={formDetails}
          courseName={courseLabel}
        />
      )}

      {data?.OnlineAdmissionProcedure && (
        <Admission data={data.OnlineAdmissionProcedure} />
      )}

      {data?.platFormSupport && <Platform data={data.platFormSupport} />}

      {data?.testimonials && <Testimonials data={data.testimonials} />}

      {/* {!isSelfPaced && !isAcademic && (
        <Programfee
          data={data?.offeringUniversity}
          universityLsit={data?.formDetails}
        />
      )} */}
    </CourseFlowProvider>
  );

  /* =====================================================
     SECTIONS CONFIG (UNCHANGED)
  ===================================================== */
  const sectionsConfig = [
    {
      key: "course-scrollbar",
      component: data?.sections && (
        <CourseScrollBar sections={data?.sections} />
      ),
    },

    ...(isCertification
      ? [
          {
            key: "course-overview",
            component: data?.overViewOfOnline && (
              <OverViewOfOnline
                data={data.overViewOfOnline}
                formDetails={formDetails}
                courseName={courseLabel}
                category={true}
              />
            ),
          },
          {
            key: "certification-excel",
            component: data?.Excel && (
              <Excel data={data.Excel} courseName={courseLabel} />
            ),
          },
          { component: data?.whyOnline && <WhyOnline data={data.whyOnline} /> },
          {
            key: "course-key-highlights",
            component: data?.keyHighlights && (
              <KeyHighLights data={data.keyHighlights} />
            ),
          },
          {
            key: "course-download-brochure",
            component: data?.downloadOurCourseBrochure && (
              <DownloadCourseBrochure
                data={data.downloadOurCourseBrochure}
                formDetails={formDetails}
                courseName={courseLabel}
                courseSlug={coursename}
                category={true}
              />
            ),
          },
          { key: "course-flow-wrapper", component: <CourseFlowWrapper /> },
        ]
      : [
          {
            key: "course-overview",
            component: data?.overViewOfOnline && (
              <OverViewOfOnline
                data={data.overViewOfOnline}
                formDetails={formDetails}
                courseName={courseLabel}
                category={isCertification}
                branch={data?.branch}
                isSelfPaced={isSelfPaced}
              />
            ),
          },
          {
            key: "course-why-online",
            component: data?.whyOnline && (
              <Whyacademics data={data.whyOnline} />
            ),
          },
          {
            key: "course-key-highlights",
            component: data?.keyHighlights && (
              <KeyHighLights data={data.keyHighlights} />
            ),
          },
          {
            key: "course-download-brochure",
            component: data?.downloadOurCourseBrochure && (
              <DownloadCourseBrochure
                data={data.downloadOurCourseBrochure}
                formDetails={formDetails}
                courseName={courseLabel}
                courseSlug={coursename}
                category={isCertification}
                branch={data?.branch}
                isSelfPaced={isSelfPaced}
              />
            ),
          },
          {
            key: "course-specializations",
            component: data?.specializations && (
              <Specializations data={data?.specializations} />
            ),
          },
          { key: "course-flow-wrapper", component: <CourseFlowWrapper /> },
        ]),
    {
      key: "course-hiring-partners",
      component: data?.hiringPartners && (
        <Hiring hiringData={data.hiringPartners} />
      ),
    },
    {
      key: "course-questions",
      component: data?.questionSection && (
        <Accordian faq={data.questionSection} />
      ),
    },
    {
      key: "course-lets-talk",
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
            courseLabel={courseLabel}
          />
        )}

       
        {console.log(careerServicesData, "careerServicesData")}

        {reserveSpotData &&
          (isCertification || isSelfPaced ? (
            <ReserveYourSpot
              source={31}
              data={reserveSpotData}
              formDetails={formDetails}
              courseName={courseLabel}
              isSelfPaced={isSelfPaced}
            />
          ) : (
            <ReserveYourSpots
              source={31}
              data={reserveSpotData}
              formDetails={formDetails}
              courseName={courseLabel}
              branch={data?.branch}
            />
          ))}
           {isCertification && (
          <>
            <div className="rounded-lg pt-5 hidden md:block">
              <Excel data={excelSectionData} courseName={courseLabel} />
            </div>

            <div className="main_container rounded-lg pt-5 hidden md:block">
              <Nutshell data={careerServicesData} courseName={courseLabel} />
            </div>
          </>
        )}

        {sectionsConfig.map(
          (sec, idx) =>
            sec.component && (
              <div
                key={sec.key || idx}
                className="main_container rounded-lg pt-5"
              >
                {sec.component}
              </div>
            ),
        )}

        {mostSearchedTerms && <MostSearchedTerms data={mostSearchedTerms} />}
      </div>
    </>
  );
}
