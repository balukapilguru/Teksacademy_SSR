"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Fallback / placeholder ────────────────────────────────────────────────
function Img({ src, alt, className, fill, width, height, style }) {
  const [err, setErr] = useState(false);
  const placeholder = `https://placehold.co/400x300/e2e8f0/94a3b8?text=${encodeURIComponent(alt || "Image")}`;
  const props = {
    src: err || !src ? placeholder : src,
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
function HeroSection({ data }) {
  if (!data) return null;
  return (
    <section className="relative bg-[#003366] text-white min-h-[320px] flex items-center overflow-hidden">
      {data.backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <Img src={data.backgroundImage} alt="hero-bg" fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs text-yellow-400 font-semibold mb-2 uppercase tracking-widest">
            ★★★★★ Best IT Academy
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            {data.heading}
          </h1>
          <p className="text-sm text-blue-100 font-medium mb-3">{data.subHeading}</p>
          <p className="text-sm text-blue-200 mb-6 leading-relaxed line-clamp-4">{data.description}</p>
          {data.button && (
            <Link
              href={data.button.link || "#"}
              className="inline-block bg-[#e84c1f] hover:bg-[#c73d14] text-white font-bold px-6 py-3 rounded text-sm transition"
            >
              {data.button.text}
            </Link>
          )}
        </div>
        {/* Enquiry form placeholder */}
        <div className="bg-white text-gray-800 rounded-lg p-6 shadow-xl">
          <h3 className="text-lg font-bold text-[#003366] mb-4 text-center">Quick Enquiry</h3>
          <div className="space-y-3">
            {["Full Name", "Mobile Number", "Email ID", "Select Course"].map((f) => (
              <input
                key={f}
                type="text"
                placeholder={f}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            ))}
            <button className="w-full bg-[#e84c1f] text-white font-bold py-2 rounded text-sm hover:bg-[#c73d14] transition">
              Submit Enquiry
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. PARTNERS SCROLL ───────────────────────────────────────────────────
function PartnersScroll({ data }) {
  if (!data?.list?.length) return null;
  return (
    <section className="bg-white border-b py-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
        {data.list.map((p, i) => (
          <div key={i} className="h-10 w-24 relative grayscale hover:grayscale-0 transition">
            <Img src={p.src} alt={p.alt} fill style={{ objectFit: "contain" }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 3. COURSES OFFERED ───────────────────────────────────────────────────
function CoursesOffered({ data }) {
  // If courses array is empty, render placeholder cards
  const placeholderCourses = [
    { name: "Full Stack Python", duration: "6 Months", fees: "₹40,000", badge: "Trending" },
    { name: "Full Stack Java", duration: "6 Months", fees: "₹42,000", badge: "Popular" },
    { name: "Data Science", duration: "5 Months", fees: "₹50,000", badge: "Hot" },
    { name: "AWS & DevOps", duration: "4 Months", fees: "₹45,000", badge: "In Demand" },
    { name: "Digital Marketing", duration: "3 Months", fees: "₹35,000", badge: "" },
    { name: "BIM", duration: "4 Months", fees: "₹38,000", badge: "" },
    { name: "AutoCAD", duration: "3 Months", fees: "₹30,000", badge: "" },
    { name: "React / MRP", duration: "5 Months", fees: "₹40,000", badge: "" },
  ];
  const courses = data?.courses?.length ? data.courses : placeholderCourses;

  return (
    <section className="py-14 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading parts={["Course ", "Offered"]} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => {
            const name = course.name || course.title || "Course";
            const duration = course.duration || "—";
            const fees = course.fees || "—";
            const badge = course.badge || "";
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 relative"
              >
                {badge && (
                  <span className="absolute top-3 right-3 bg-[#e84c1f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center mb-3">
                  <span className="text-[#003366] font-bold text-sm">{name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-[#003366] text-sm mb-1">{name}</h3>
                <p className="text-xs text-gray-500 mb-3">Duration: {duration}</p>
                <p className="text-xs font-semibold text-gray-700 mb-4">Fees: {fees}</p>
                <button className="w-full text-center text-xs font-bold text-white bg-[#003366] hover:bg-[#00224d] py-2 rounded transition">
                  Know More
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 4. EXCEL WITH TEKS ACADEMY ──────────────────────────────────────────
function ExcelSection({ data }) {
  if (!data) return null;
  const features = data.features?.[0] || {};
  const left = features.leftSection || [];
  const right = features.rightSection || [];

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading parts={["Excel with ", "Teks Academy"]} />
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Left features */}
          <div className="space-y-4">
            {left.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#f0f4ff] rounded-lg px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-[#003366] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {f.icon?.charAt(0)?.toUpperCase() || "✓"}
                </div>
                <div>
                  <p className="font-bold text-[#003366] text-sm leading-tight">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Center illustration */}
          <div className="flex flex-col items-center gap-6">
            {data.image?.url && (
              <div className="relative w-40 h-40">
                <Img src={data.image.url} alt={data.image.alt || "Teks"} fill style={{ objectFit: "contain" }} />
              </div>
            )}
            {/* Form */}
            {data.form?.isForm && (
              <div className="w-full bg-[#003366] rounded-xl p-5">
                <h4 className="text-white font-bold text-center text-sm mb-4">{data.form.title}</h4>
                <div className="space-y-2">
                  {["Name", "Phone", "Email"].map((f) => (
                    <input key={f} type="text" placeholder={f} className="w-full rounded px-3 py-2 text-sm" />
                  ))}
                  <button className="w-full bg-[#e84c1f] text-white font-bold py-2 rounded text-sm hover:bg-[#c73d14] transition">
                    {data.form.submitButton?.text || "Request Call Back"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right features */}
          <div className="space-y-4">
            {right.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#f0f4ff] rounded-lg px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-[#e84c1f] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {f.icon?.charAt(0)?.toUpperCase() || "✓"}
                </div>
                <div>
                  <p className="font-bold text-[#003366] text-sm leading-tight">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. ABOUT SECTION ────────────────────────────────────────────────────
function AboutSection({ data }) {
  if (!data) return null;
  const { title, heading, description, statistics, button, image } = data;
  return (
    <section className="py-14 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
          <Img src={image?.url} alt={image?.alt || "About"} fill style={{ objectFit: "cover" }} />
        </div>
        <div>
          <p className="text-xs font-bold text-[#e84c1f] uppercase tracking-widest mb-2">{title}</p>
          <h2 className="text-3xl font-extrabold text-[#003366] mb-6 leading-tight">
            {heading?.[0]}
            <span className="text-[#e84c1f]"> {heading?.[1]}</span>
          </h2>
          <div className="mb-4">
            <p className="text-xs font-bold text-[#003366] uppercase mb-1">{description?.subHeading1}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{description?.text1}</p>
          </div>
          <div className="mb-6">
            <p className="text-xs font-bold text-[#003366] uppercase mb-1">{description?.subHeading2}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{description?.text2}</p>
          </div>
          {button && (
            <Link
              href={button.link || "/about-us"}
              className="inline-flex items-center gap-2 bg-[#003366] text-white font-bold px-5 py-2.5 rounded text-sm hover:bg-[#00224d] transition"
            >
              {button.text} →
            </Link>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            {statistics?.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-extrabold text-[#e84c1f]">{s.count}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
              src={data.image?.desktop}
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
  const placed = data.data?.placedStudents;
  const learning = data.data?.LearningExperience;
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
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                tab === t.key
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
                src={v.thumbnail?.src}
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
              <Img src={p.image?.src} alt={p.image?.alt || p.name} fill style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 8. AWARDS ───────────────────────────────────────────────────────────
function Awards({ data }) {
  if (!data?.cards?.length) return null;
  return (
    <section className="py-14 bg-[#fffbf7]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading parts={["Awards"]} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {data.cards.map((a, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 text-center hover:shadow-md transition">
              <div className="relative h-24 mb-3">
                <Img src={a.image?.src} alt={a.image?.alt || a.title} fill style={{ objectFit: "contain" }} />
              </div>
              <p className="text-[10px] font-bold text-[#003366] leading-tight">{a.title}</p>
              <p className="text-[10px] text-gray-400 mt-1">{a.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. GALLERY ──────────────────────────────────────────────────────────
function Gallery({ data }) {
  if (!data?.images?.length) return null;
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading parts={data.heading || ["Gallery"]} />
        <div className="columns-2 sm:columns-3 lg:columns-5 gap-3 space-y-3">
          {data.images.slice(0, 15).map((img, i) => (
            <div key={i} className="break-inside-avoid rounded-lg overflow-hidden">
              <Img src={img.src} alt={img.alt} width={300} height={200} className="w-full object-cover hover:scale-105 transition duration-300" />
            </div>
          ))}
        </div>
        {data.button && (
          <div className="text-center mt-8">
            <Link
              href={data.button.link || "/discover/gallery"}
              className="inline-block border-2 border-[#003366] text-[#003366] font-bold px-8 py-3 rounded-full hover:bg-[#003366] hover:text-white transition text-sm"
            >
              {data.button.text}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 10. FEATURED IN ─────────────────────────────────────────────────────
function FeaturedIn({ data }) {
  if (!data?.images?.length) return null;
  return (
    <section className="py-12 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading parts={data.heading || ["Featured ", "In"]} />
        <div className="flex flex-wrap justify-center items-center gap-8">
          {data.images.map((item, i) => (
            <div key={i} className="relative h-8 w-28 grayscale hover:grayscale-0 transition">
              <Img src={item.image?.src} alt={item.image?.alt || "media"} fill style={{ objectFit: "contain" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 11. BRANCH LOCATION ─────────────────────────────────────────────────
function BranchLocation({ data }) {
  if (!data) return null;
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading parts={[data.heading || "Explore Branch"]} />
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            {data.description?.map((d, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">
                {d.firstDescription || d.secondDescription}
              </p>
            ))}
            <p className="flex items-center gap-2 text-sm font-semibold text-[#003366] mt-4">
              <span>📍</span> {data.address}
            </p>
            {data.link && (
              <a
                href={data.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-bold text-[#e84c1f] hover:underline mt-1"
              >
                View on Google Maps →
              </a>
            )}
          </div>
          <div className="relative h-72 rounded-2xl overflow-hidden shadow-md">
            <Img src={data.mapImage} alt="Branch Map" fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 12. FAQ ─────────────────────────────────────────────────────────────
function FAQ({ data }) {
  if (!data?.faq?.length) return null;
  const [open, setOpen] = useState(null);
  return (
    <section className="py-14 bg-[#f8fafd]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          <span className="text-[#003366]">{data.heading?.[0]} </span>
          <span className="text-[#e84c1f]">{data.heading?.[1]}</span>
        </h2>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-semibold text-[#003366]"
              >
                <span>{item.question}</span>
                <span className="text-[#e84c1f] text-lg font-bold shrink-0 ml-4">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROOT CLIENT COMPONENT ────────────────────────────────────────────────
export default function BranchClient({ data }) {
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Failed to load branch data. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen font-sans bg-white text-gray-800">
      <HeroSection data={data.heroSection} />
      <PartnersScroll data={data.topScroll} />
      <CoursesOffered data={data.courseOffered} />
      <ExcelSection data={data.excelWithTeksacademy} />
      <AboutSection data={data.aboutTeksAcandemy} />
      <CareerServices data={data.careerServices} />
      <SuccessStories data={data.ourSuccessStories} />
      <Awards data={data.awards} />
      <Gallery data={data.gallery} />
      <FeaturedIn data={data.featuredIn} />
      <BranchLocation data={data.branchLocation} />
      <FAQ data={data.faq} />
    </main>
  );
}