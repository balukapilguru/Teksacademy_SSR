import React from "react";
import Topscroll from "../ui-components/Topscroll";
import HomepageBanner from "../ui-components/HomepageBanner";
import Awards from "../ui-components/Awards";
import Gallery from "../ui-components/Gallery";
import Featuredin from "../ui-components/Featuredin";
import Academics from "../../allcoursepage/Academics";
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
    console.log(homeData,"homedata")
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

    {
      component: (
        <Hiring hiringData={homeData?.hiringPartners} />
      ), bg: "#fff", border: "#fff"
    },

    {
      component: <CertificationCourse data={homeData?.certificationCourse} />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    {
      component: <Academics data={homeData?.academicsCards} />,
      bg: "#fff",
      border: "#fff",
    },
    {
      component: <Excel />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    {
      component: <Nutshell data={homeData?.careerServices}/>,
      bg: "#fff",
      border: "#fff",
    },
    {
      component: <FinanceApp />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    {
      component: <Awards awardsData={homeData?.awards} />,
      bg: "#fff",
      border: "#fff",
    },
    {
      component: <Gallery gallery={homeData?.gallery} />,
      bg: "#fbf5f6",
      border: "#fbf5f6",
    },
    {
      component: <Featuredin featuredIn={homeData?.featuredIn} />,
      bg: "#fff",
      border: "#fff",
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
            className="md:py-4 xl:py-6 rounded-lg"
          >
            {sec.component}
          </section>
        ))}
      </div>
    </>
  );
}
