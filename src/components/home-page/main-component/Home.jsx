import React from "react";

import Topscroll from "../ui-components/Topscroll";
// import Trusted from '../ui-components/Trusted'
import Certificationcards from "@/components/allcoursepage/Certificationcards";
import HomepageBanner from "../ui-components/HomepageBanner";
import Whyteksversity from "../ui-components/Whyteksversity";
import Blueribbon from "../../home-page/ui-components/Blueribbon";
import Awards from "../ui-components/Awards";
import Gallery from "../ui-components/Gallery";
import Featuredin from "../ui-components/Featuredin";
import Accordian from "../../coursePage/Accordian";
import HiringCompanies from "../../coursePage/HiringCompanies";
import Workongprofessionals from "../ui-components/Workongprofessionals";
import Academics from "../../allcoursepage/Academics";
// import SelfLearning from "../../allcoursepage/SelfLearning";
import Testimonials from "@/components/coursePage/Testimonials";
import Excel from "../ui-components/Excel";
import Nutshell from "../ui-components/NutShell";
import FinanceApp from "../ui-components/FinanceApp";
import Hiring from "../ui-components/Hiring";
import SuccessStories from "@/components/home-page/ui-components/SuccessStories";
import CertificationCourse from "@/components/allcoursepage/CertificationCourse";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
  let homeData = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const res = await fetch(`${baseUrl}/api/v1/home`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    homeData = data?.data;
  } catch (err) {
    console.error("Failed to fetch home page data:", err);
    homeData = null;
  }

  if (!homeData) {
    console.warn("Home data not available, using fallback");
  }
  // #fbf5f6 : pink
  // #fff : white

  const sectionsConfig = [
    {
      component: (
        <SuccessStories successStoriesData={homeData?.ourSuccessStories} />
      ),
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },

    { component: <Hiring hiringData={homeData?.hiringPartners} /> },

    // { component: <Certificationcards data={homeData?.certificationCards} />, bg: "#fff", border: "#fff" },
    {
      component:<CertificationCourse data={homeData?.certificationCards?.[0]} /> ,
      bg: "#fff",
      border: "#fff",

    },
    {
      component: <Academics data={homeData?.academicsCards} />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    // { component: <SelfLearning data={homeData?.freeCourseCards} />, bg: "#fff", border: "#fff" },
    // { component: <Trusted data={homeData?.trusted} />, bg: "#fbf5f6", border: "#fbf5f6" },
    // { component: <Areaofinterest areaOfInterest={homeData?.areaOfInterest} />, bg: "#fff", border: "#fff" },

    // {component: <Testimonials data={homeData?.testimonials} /> , bg: "#ffff", border: "#fbf5f6"},
    // { component: <Awards awardsData={homeData?.awards} />, bg: "#fff", border: "#fff" },
    // { component: <Workongprofessionals workingProfessionals={homeData?.workingProfessionals} />, bg: "#fbf5f6", border: "#fbf5f6" },

    // { component: <Accordian faq={homeData?.faq} />, bg: "#fff", border: "#fff" }

    // ============= new sections harish =============
   
    {
      component: <Excel />,

      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    {
      component: <Nutshell />,
      bg: "#fff",
      border: "#fff",
    },
    // {
    //   component: <Whyteksversity whyTeksversity={homeData?.whyTeksversity} />,
    //   bg: "#fbf5f6",
    //   border: "#fbf5f6",
    // },
    // {
    //   component: (
    //     <Blueribbon blueribbon={homeData?.makingAbroadEducationEasier} />
    //   ),
    //   bg: "#fff",
    //   border: "#fff",
    // },
    {
      component: <FinanceApp />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    {
      component: <Awards awardsData={homeData?.awards} />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    {
      component: <Gallery gallery={homeData?.gallery} />,
      bg: "#fff",
      border: "#fff",
    },
    {
      component: <Featuredin featuredIn={homeData?.featuredIn} />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
  ];

  return (
    <>
      <div>
        <HomepageBanner bannerData={homeData?.banner} />
        <Topscroll data={homeData?.topScroll} />

        {sectionsConfig.map((sec, idx) => (
          <section
            key={idx}
            style={{ backgroundColor: sec.bg, borderColor: sec.border }}
            className="md:py-4 xl:py-6  main_container rounded-lg"
          >
            {sec.component}
          </section>
        ))}
      </div>
    </>
  );
}
