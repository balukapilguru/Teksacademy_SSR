"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoStar } from "react-icons/io5";
import Loader from "@/components/Loader";
import GetData from "@/utility/GetData";
import Topscroll from "@/components/home-page/ui-components/Topscroll";
import Excel from "@/components/home-page/ui-components/Excel";
import Nutshell from "@/components/home-page/ui-components/NutShell";
import SuccessStoriesComponent from "@/components/home-page/ui-components/SuccessStories";
import Awards from "@/components/home-page/ui-components/Awards";
import Featuredin from "@/components/home-page/ui-components/Featuredin";
import Gallery from "@/components/home-page/ui-components/Gallery";
import AboutTeks from "@/components/coursePage/AboutTeks";
import ExploreBranch from "@/components/coursePage/ExploreBranch";
import Faq from "@/components/coursePage/Faq";
import CoursesOffered from "@/components/coursePage/CoursesOffered";
import ReusableForm from "@/components/ReusableForm";
import Popupform from "@/components/clientcomponents/forms/Popupform";
import { blogsApplyBaseUrl, buildApiUrl } from "@/lib/apiBaseUrls";
import { storeBranchData } from "@/lib/branchStorage";

const baseUrl = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;

const BRANCH_LABELS = {
  ameerpet: "Ameerpet",
  kukatpally: "Kukatpally",
  mehdipatnam: "Mehdipatnam",
  hiteccity: "Hitec City",
  secunderabad: "Secunderabad",
  dilsukhnagar: "Dilsukhnagar",
  bangalore: "Bangalore",
  visakhapatnam: "Visakhapatnam",
  salem: "Salem",
};

const getBranchNameFromSlug = (value = "") => {
  const slug = value
    .replace(/^best-software-training-institute-/, "")
    .replace(/^software-training-institute-/, "")
    .replace(/-branch$/, "")
    .trim();

  return BRANCH_LABELS[slug] || slug.replace(/-/g, " ");
};

const getBranchLabel = ({ branchName = "", branchLocation, heroData } = {}) => {
  const fromSlug = getBranchNameFromSlug(branchName);
  if (fromSlug) return fromSlug;

  const fromLocation =
    branchLocation?.address?.split(",")?.[0] ||
    branchLocation?.title ||
    branchLocation?.name ||
    "";

  const fromHeroTitle = heroData?.title || heroData?.heading || heroData?.mainHeading || "";
  const branchFromHero = fromHeroTitle.match(/in\s+([A-Za-z\s-]+)$/i)?.[1] || "";

  return branchFromHero || fromLocation || "Secunderabad";
};

// ─── Submit Handler with SessionStorage (NO URL PARAMETERS) ───────────────
const handleSubmit = async (formValues, mappedPayload) => {
  console.log("Mapped payload being sent:", mappedPayload);

  try {
    const response = await fetch(buildApiUrl(blogsApplyBaseUrl, "/lead/create"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mappedPayload),
    });

    const responseData = await response.json();
    console.log("API Response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Submission failed");
    }

    // Store branch data in sessionStorage before redirect
    const branchName = formValues.branch || "Secunderabad";
    storeBranchData(branchName);
    
    // Redirect to thank you page WITHOUT query parameters
    window.location.href = "/thankyou";
  } catch (error) {
    console.error("Submission error:", error);
    throw error;
  }
};

const FeaturedIn = Featuredin;

const aboutFallbackImage =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/About_teks/teks_about_banner2.webp";
const aboutStatIcons = [
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/Vector_img.webp",
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/Hand_shake.webp",
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/people.webp",
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/Book_img.webp",
];
const aboutArrow =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/About_arrow.webp";

// ─── Fallback / placeholder ────────────────────────────────────────────────
function Img({ src, alt, className, fill, width, height, style }) {
  const [err, setErr] = useState(false);
  const placeholder =
    "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/excel/teks_logo.webp";
  const getImageSrc = (url) => {
    if (!url) return "";

    if (url.includes("teksacademy.com/_next/image")) {
      const imageParam = url.split("url=")[1]?.split("&")[0];
      return imageParam ? decodeURIComponent(imageParam) : url;
    }

    if (url.startsWith("/") && !url.startsWith("/_next")) {
      return GetData({ url });
    }

    return url;
  };
  const imageSrc = getImageSrc(src);
  const props = {
    src: err || !imageSrc ? placeholder : imageSrc,
    alt: alt || "",
    className,
    onError: () => setErr(true),
    style,
  };
  if (fill) return <Image {...props} fill />;
  return <Image {...props} width={width || 400} height={height || 300} />;
}

// ─── Section Heading ──────────────────────────────────────────────────────
function SectionHeading({ parts = [], className = "" }) {
  return (
    <h2 className={`text-3xl font-bold text-center mb-8 ${className}`}>
      {parts.map((p, i) =>
        i === 0 ? (
          <span key={i} className="text-[#003366]">{p}</span>
        ) : (
          <span key={i} className="text-[#e84c1f]">{p}</span>
        )
      )}
    </h2>
  );
}

// ─── 1. HERO SECTION ──────────────────────────────────────────────────────
function HeroSection({ data, branchName = "", branchLocation, onEnrollClick }) {
  if (!data) return null;
  const branchLabel = getBranchLabel({ branchName, branchLocation, heroData: data });

  const branchData = {
    Rating: data.Rating || data.rating || data.ratingText,
    Reviews: data.Reviews || data.reviews || data.reviewText,
    title: data.title || data.heading || data.mainHeading,
    subtitle: data.subtitle || data.subTitle || data.label || "learn IT courses",
    about: data.about || data.description || data.desc,
    buttonText: data.button?.text || data.button?.name || data.ctaText || "Enroll Now",
    buttonLink: data.button?.link || data.ctaLink || "/discover/contact-us",
    background:
      data.backgroundImage?.src ||
      data.backgroundImage?.url ||
      data.bgImage?.src ||
      data.bgImage?.url ||
      "assets/img/coursepage/banner_img.webp",
    heroImage:
      data.image?.src ||
      data.image?.url ||
      data.bannerImage?.src ||
      data.bannerImage?.url,
  };
  const backgroundImage = branchData.background?.startsWith("http")
    ? branchData.background
    : GetData({ url: branchData.background });

  return (
    <div
      className="bg-cover bg-center bg-[#04264d]"
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className="main_container mx-auto flex sm:px-6 xl:px-0 3xl:py-14 2xl:py-12 xl:py-8 lg:py-6 py-4">
        <div className="flex flex-col xl:flex-row w-full gap-2 lg:gap-4 xl:gap-8">
          {/* Text Section - 60% */}
          <div className="flex-[60%] 2xl:flex-[70%] text-[#f5f6f7] pb-5">
            {(branchData.Rating || branchData.Reviews) && (
              <div className="flex items-center space-x-1 text-[0.68rem] 2xl:text-base 3xl:text-lg">
                {branchData.Rating && <span className="font-medium">{branchData.Rating}</span>}
                <span className="flex flex-row items-center">
                  <IoStar className="text-[#FCD503]" />
                  <IoStar className="text-[#FCD503]" />
                  <IoStar className="text-[#FCD503]" />
                  <IoStar className="text-[#FCD503]" />
                  <IoStar className="text-[#FCD503]" />
                </span>
                {branchData.Reviews && (
                  <span className="2xl:text-[11px] 3xl:text-[0.9rem] font-light">
                    {branchData.Reviews}
                  </span>
                )}
              </div>
            )}
            <div className="grid gap-3 lg:gap-4 2xl:gap-8">
              {branchData.title && (
                <h1 className="text-white text-[20px] lg:text-[32px] xl:text-[40px] 2xl:text-[48px] 3xl:text-[54px] font-Nunito,sans-serif leading-tight">
                  {branchData.title}
                </h1>
              )}

              {/* <div className="text-[#F24E1E] text-[0.8rem] xl:text-lg lg:text-md 2xl:text-[1.2rem] font-semibold xl:mt-4">
                {branchData.subtitle} →
              </div> */}

              {branchData.about && (
                <div className="3xl:leading-9 font-light text-justify text-[0.8rem] xl:text-lg lg:text-md lg:leading-6 2xl:text-[1.2rem] 3xl:text-[1.5rem] text-white">
                  {branchData.about}
                </div>
              )}

              <button
                type="button"
                onClick={onEnrollClick}
                className="bg-[#FE543D] text-[0.8rem] xl:text-lg lg:text-md 2xl:text-[1.2rem] text-white p-2 xl:px-6 xl:py-3 rounded-md font-semibold shadow-md w-fit inline-block cursor-pointer hover:bg-[#e14b36] transition"
              >
                Get Directions »
              </button>
            </div>
          </div>

          {/* Form Section - 40% */}
          <div className="flex-[40%] bg-white rounded-xl 2xl:flex-[25%] 3xl:mx-14 2xl:p-4 3xl:p-6 lg:p-4 mx-6 lg:mx-40 p-3 xl:mx-0">
            <ReusableForm
              formType="enquiry"
              onSubmit={handleSubmit}
              initialValues={branchLabel ? { branch: branchLabel } : {}}
              buttonText="Submit"
              className="w-full"
              successMessage="Thank you! We'll contact you soon."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 5. ABOUT SECTION ────────────────────────────────────────────────────
function BranchAboutSection({ data }) {
  if (!data) return null;

  const { title, heading, description, statistics, button, image } = data;
  const headingParts = Array.isArray(heading)
    ? heading
    : typeof heading === "string"
      ? [heading]
      : ["About", "Teks Academy"];
  const firstHeading = headingParts[0] || "About";
  const secondHeading = headingParts.slice(1).join(" ") || "Teks Academy";
  const aboutImage = image?.url || image?.src || aboutFallbackImage;
  const tagline = data.tagline || title || "Teks - Making Job Cracking Easier!";
  const [taglinePrefix, ...taglineRest] = tagline.split("-");
  const missionTitle = description?.subHeading1 || data.mission?.title || "OUR MISSION :";
  const missionText = description?.text1 || data.mission?.description;
  const visionTitle = description?.subHeading2 || data.vision?.title || "OUR VISION :";
  const visionText = description?.text2 || data.vision?.description;
  const aboutButton = button || data.cta || {};
  const stats = statistics?.length ? statistics : data.stats || [];

  return (
    <>
      <div className="main_container flex flex-col xl:mt-4 2xl:pt-4 3xl:pt-6 gap-y-4 lg:gap-y-8 3xl:gap-y-10">
        <div className="h-fit flex flex-col items-center">
          <div className="relative w-fit flex flex-col items-center">
            <div className="font-semibold text-[1rem] lg:text-[1.6rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
              <h2 className="text-[#2A619D]">{firstHeading}&nbsp;</h2>
              <h2>{secondHeading}</h2>
            </div>
            <svg className="absolute top-8 w-[110%] h-auto" viewBox="0 0 110 12">
              <path d="M0 10 Q80 -2 190 27" stroke="orangered" strokeWidth="0.4" fill="transparent" strokeLinecap="square" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-10 xl:grid-cols-11 px-6 gap-y-4 xl:px-0 2xl:mt-4 3xl:mt-0">
          <div className="col-span-10 xl:col-span-6">
            <Img src={aboutImage} width={920} height={520} alt={image?.alt || "Teks Academy About Block"} className="border rounded-md h-40 sm:h-48 md:h-56 lg:h-[380px] xl:h-[340px] 2xl:h-[480px] 3xl:h-[500px] w-[900px] object-cover" />
          </div>
          <div className="col-span-10 xl:col-span-5 flex w-full justify-center items-center xl:px-4">
            <div className="text-[#FE543D] flex flex-col justify-center items-start xl:gap-y-3 2xl:w-[90%] 2xl:mx-auto">
              <div className="text-[1rem] lg:text-[1.5rem] xl:text-[1.24rem] 2xl:text-[2rem] 3xl:text-[2.4rem] text-black font-semibold">
                <Link rel="preconnect" href={aboutButton.link || "/discover/about-us"}>
                  <div>
                    {taglinePrefix.trim()} -&nbsp;
                    <span className="text-[#FE543D]">{taglineRest.join("-").trim() || "Making Job Cracking Easier!"}</span>
                  </div>
                </Link>
              </div>
              <div className="flex flex-col gap-y-4 my-4 2xl:mt-2">
                {missionText && (
                  <div className="w-full font-semibold text-black">
                    <div className="pb-1 text-[0.68rem] lg:text-[0.75rem] 2xl:text-[1.1rem] 3xl:text-[1.2rem]">{missionTitle}</div>
                    <div className="text-[10px] lg:text-[0.8rem] xl:text-[12px] text-justify 2xl:text-[0.84rem] 3xl:text-[1rem] 2xl:leading-relaxed 3xl:leading-loose font-normal text-black">{missionText}</div>
                  </div>
                )}
                {visionText && (
                  <div className="w-full font-semibold text-black">
                    <div className="pb-1 text-[0.68rem] lg:text-[0.75rem] 2xl:text-[1.1rem] 3xl:text-[1.2rem]">{visionTitle}</div>
                    <div className="text-[10px] lg:text-[0.8rem] text-justify xl:text-[12px] 2xl:text-[0.84rem] 3xl:text-[1rem] 2xl:leading-relaxed 3xl:leading-loose font-normal text-black">{visionText}</div>
                  </div>
                )}
              </div>
              <div className="w-full flex justify-center 2xl:justify-start">
                <Link rel="preconnect" href={aboutButton.link || "/discover/about-us"}>
                  <button className="min-w-[48px] min-h-[48px] mt-3 flex bg-[#FE543D] justify-center items-center rounded-full text-white text-[0.84rem] lg:text-[0.8rem] xl:text-[1rem] w-[140px] h-10 xl:h-12 xl:w-[180px] 3xl:h-14 3xl:w-[220px] relative">
                    <span className="text-center -translate-x-1/4">{aboutButton.text || "Learn More"}</span>
                    <Img src={aboutArrow} width={240} height={15} alt="learn more arrow" className="absolute right-0 top-0 h-full w-auto" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {stats.length > 0 && (
        <div className="main_container py-4 lg:py-6 xl:py-8 2xl:py-12">
          <div className="border w-11/12 xl:w-4/5 2xl:w-2/3 h-16 lg:h-24 2xl:h-28 3xl:h-36 mx-auto rounded-full bg-[#2A619D] flex items-center justify-around text-white">
            {stats.slice(0, 4).map((stat, index) => {
              const statIcon = stat.image?.src || stat.image?.url || stat.icon?.src || stat.icon?.url || aboutStatIcons[index];
              return (
                <div key={stat.id || index} className="flex justify-center items-center gap-x-1 lg:gap-x-2">
                  <div className="border w-7 h-7 lg:w-12 lg:h-12 2xl:w-14 2xl:h-14 3xl:w-[72px] 3xl:h-[72px] flex justify-center items-center rounded-full bg-white">
                    <Img src={statIcon} width={74} height={74} alt={stat.label || stat.title || "teks academy statistic"} className="w-2/3 h-2/3 object-contain" />
                  </div>
                  <div className="text-justify font-semibold text-[8px] md:text-[9px] lg:text-[0.84rem] xl:text-[0.9rem] 2xl:text-[1rem] 3xl:text-[1.34rem]">
                    <div>{stat.count || stat.value}</div>
                    <div className="font-normal">{stat.label || stat.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ─── 6. CAREER SERVICES ──────────────────────────────────────────────────
function CareerServices({ data }) {
  if (!data) return null;
  return (
    <section className="py-14 bg-[#003366] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          {data.title?.[0]}
          <span className="text-yellow-400">{data.title?.[1]}</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            {data.services?.map((s, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 rounded-xl px-5 py-4 hover:bg-white/20 transition">
                <div className="w-10 h-10 rounded-full bg-[#e84c1f] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <p className="font-semibold text-sm">{s.title}</p>
              </div>
            ))}
            {data.button && (
              <Link
                href={data.button.link || "#"}
                className="inline-block mt-2 bg-[#e84c1f] hover:bg-[#c73d14] text-white font-bold px-6 py-3 rounded text-sm transition"
              >
                {data.button.text}
              </Link>
            )}
          </div>
          <div className="relative h-72 rounded-2xl overflow-hidden">
            <Img
              src={data.image?.desktop || data.image?.src}
              alt={data.image?.alt || "career"}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. SUCCESS STORIES ──────────────────────────────────────────────────
function SuccessStories({ data }) {
  if (!data) return null;
  const [tab, setTab] = useState("placed");
  const placed = data.data?.placedStudents || data.placedStudents;
  const learning = data.data?.LearningExperience || data.LearningExperience;
  const current = tab === "placed" ? placed : learning;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading parts={data.heading || ["Our Success ", "Stories"]} />
        {/* Tab */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { key: "placed", label: "Placed Students" },
            { key: "learning", label: "Learning Experience" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${tab === t.key
                  ? "bg-[#003366] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Video cards */}
        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Video Testimonials</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(current?.cards?.videoCards || current?.Cards?.videoCards || []).map((v, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 shadow">
              <Img
                src={v.thumbnail?.src || v.thumbnail}
                alt={v.thumbnail?.alt || v.name}
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#e84c1f]/90 flex items-center justify-center">
                  <span className="text-white text-lg">▶</span>
                </div>
              </div>
              <p className="absolute bottom-2 left-2 text-white text-xs font-bold drop-shadow">{v.name}</p>
            </div>
          ))}
        </div>

        {/* Placement cards */}
        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Placement Cards</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(current?.cards?.placementCards || current?.Cards?.placementCards || []).map((p, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-100 shadow">
              <Img src={p.image?.src || p.image} alt={p.image?.alt || p.name} fill style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROOT CLIENT COMPONENT ────────────────────────────────────────────────
export default function BranchClient({ data: initialData = null, branchName = "" }) {
  const [data, setData] = useState(initialData);
  const [pageLoading, setPageLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);

  const api = process.env.NEXT_PUBLIC_TEKS_SSR_API_URL || process.env.NEXT_TEKS_SSR_API_URL;
  const branchApiPath = branchName
    ? `/api/v1/branch/${encodeURIComponent(branchName)}`
    : "/api/v1/branch";

  useEffect(() => {
    if (initialData || !api) {
      setPageLoading(false);
      if (!api) setError("Branch API URL is not configured.");
      return;
    }

    const controller = new AbortController();

    const fetchBranchData = async () => {
      setPageLoading(true);
      setError(null);

      try {
        const res = await fetch(`${api}${branchApiPath}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Branch API error: ${res.status}`);
        }

        const json = await res.json();
        setData(json?.data || null);
        console.log("Fetching branch data from:", json?.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Branch page data fetch error:", err);
          setError("Failed to load branch data. Please try again later.");
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetchBranchData();

    return () => controller.abort();
  }, [api, branchApiPath, initialData]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center bg-white h-100">
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        {error || "Failed to load branch data. Please try again later."}
      </div>
    );
  }

  return (
    <main className="min-h-screen font-sans bg-white text-gray-800">
      <HeroSection
        data={data.heroSection}
        branchName={branchName}
        branchLocation={data.branchLocation}
        onEnrollClick={() => setShowEnrollPopup(true)}
      />
      <Popupform
        show={showEnrollPopup}
        onClose={() => setShowEnrollPopup(false)}
        university={getBranchLabel({ branchName, branchLocation: data.branchLocation, heroData: data.heroSection })}
        formType="enquiry"
        title="Enroll Now"
        subtitle="Fill in your details and verify your mobile number to reserve your seat."
        buttonText="Enroll Now"
        onSubmit={handleSubmit}
      />
      <Topscroll data={data.topScroll} />
      <CoursesOffered data={data.courseOffered || data.CoursesOffered} />
      <section className="md:py-4 xl:py-0 bg-[#fbf5f6]">
        <Excel data={data.Excel} />
      </section>
      {/* <section className="bg-[#eaf0f6] rounded-lg">
        <AboutTeks data={data.AboutTeks} />
      </section> */}
      <section className="md:py-4 xl:py-0 bg-white">
        <Nutshell data={data.careerServices} />
      </section>
      <section className="md:py-4 xl:py-6 bg-[#eaf0f6]">
        <SuccessStoriesComponent successStoriesData={data.ourSuccessStories} />
      </section>
      <section className="md:py-4 xl:py-3 bg-white">
        <Awards awards={data.awards} />
      </section>
      <section className="bg-[#fbf5f6]">
        <Gallery gallery={data.gallery} />
      </section>
      <FeaturedIn featuredIn={data.featuredIn || data.featuredin} />
      <ExploreBranch data={data.branchLocation} />
      <Faq data={data.faq} />
    </main>
  );
}
