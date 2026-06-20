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
import MostSearchedTerms from "@/components/coursePage/Mostsearchedterms";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;
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
 console.log(homeData.gallery,"homegallery")
   const schemaData = homeData?.meta?.schemaCode;

  const sectionsConfig = [
    {
      component: (
        <SuccessStories successStoriesData={homeData?.ourSuccessStories} />
      ),
      bg: "#fff",
      border: "#fff",
    },

    {
      component: (
        <Hiring hiringData={homeData?.hiringPartners} />
      ), bg: "#fff", border: "#fff"
    },
    

    {
      component: <CertificationCourse data={homeData?.certificationCourse} />,
      bg: "#fff",
      border: "#fff",
    },
   
    {
      component: <Excel data={homeData?.excelWithTeksacademy}/>,
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
      component: <Awards awards={homeData?.awards} />,
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
     {
      component: <MostSearchedTerms data={homeData?.mostSearchedTerms} />,
      bg: "#fff",
      border: "#fff",
    },
  ];
console.log(homeData?.mostSearchedTerms,"homeData?.mostSearchedTerms")
  return (
    <>
     {schemaData && (
        <script
          id="home-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof schemaData === "string"
                ? schemaData
                : JSON.stringify(schemaData),
          }}
        />
      )}
      <div>
        <HomepageBanner bannerData={homeData?.banner} />
        <Topscroll data={homeData?.topScroll} />

        {sectionsConfig.map((sec, idx) => (
          <section
            key={idx}
            style={{ backgroundColor: sec.bg, borderColor: sec.border }}
            className="rounded-lg"
          >
            {sec.component}
          </section>
        ))}
      </div>
    </>
  );
}
