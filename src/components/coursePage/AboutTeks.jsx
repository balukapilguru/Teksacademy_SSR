import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Reusable section renderer for branch.json `aboutTeksAcandemy`
 * Expected shape:
 * {
 *  title, heading: [..], description:{subHeading1,text1,subHeading2,text2},
 *  button:{text,link}, image:{url,alt}, statistics:[{count,label,icon?}]
 * }
 */
const AboutTeks = ({ data }) => {
  if (!data) return null;

  const { title, heading, description, statistics, button, image } = data;

  const headingParts = Array.isArray(heading)
    ? heading
    : typeof heading === "string"
      ? heading.split(" ")
      : [];

  const firstHeading = headingParts[0] || "";
  const secondHeading = headingParts.slice(1).join(" ") || "";

  return (
    <section className="py-14 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={image?.url || image?.src || "/assets/images/about-teks-academy.png"}
            alt={image?.alt || "About Teks Academy"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          {title && (
            <p className="text-xs font-bold text-[#e84c1f] uppercase tracking-widest mb-2">
              {title}
            </p>
          )}

          {headingParts.length > 0 && (
            <h2 className="text-3xl font-extrabold text-[#003366] mb-6 leading-tight">
              {firstHeading}
              {secondHeading && <span className="text-[#e84c1f]"> {secondHeading}</span>}
            </h2>
          )}

          {description?.subHeading1 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-[#003366] uppercase mb-1">{description.subHeading1}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{description.text1}</p>
            </div>
          )}

          {description?.subHeading2 && (
            <div className="mb-6">
              <p className="text-xs font-bold text-[#003366] uppercase mb-1">{description.subHeading2}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{description.text2}</p>
            </div>
          )}

          {button?.text && button?.link && (
            <Link
              href={button.link}
              className="inline-flex items-center gap-2 bg-[#003366] text-white font-bold px-5 py-2.5 rounded text-sm hover:bg-[#00224d] transition"
            >
              {button.text} →
            </Link>
          )}

          {Array.isArray(statistics) && statistics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {statistics.map((stat, index) => (
                <div key={stat.label || stat.title || index} className="text-center">
                  <p className="text-2xl font-extrabold text-[#e84c1f]">{stat.count || stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label || stat.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutTeks;

