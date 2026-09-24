"use client";
import React, { useEffect, useRef, useState } from "react";
import CoursepageHeading from "../../utility/CoursepageHeading";
// import { HiArrowRightCircle } from "react-icons/lia";
import { HiArrowRightCircle } from "react-icons/hi2";

// import { HiArrowRightCircle } from "react-icons/io";

const sectionColors = ["bg-white", "bg-gray-50", "bg-white", "bg-gray-50"];

const Page = ({ data }) => {
  const { sections = [], tabsData = {}, heading = "" } = data || {};

  const [active, setActive] = useState(sections?.[0]?.value || "");
  const tabsRef = useRef(null);
  const [showRightFade, setShowRightFade] = useState(true);

  const handleScroll = () => {
    const el = tabsRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 10;
    setShowRightFade(!atEnd);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const positionFromTop = rect.top + window.scrollY;
    window.scrollTo({ top: positionFromTop - 120, behavior: "smooth" });
  };

  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 },
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.value);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((sec) => {
        const el = document.getElementById(sec.value);
        if (el) observer.unobserve(el);
      });
    };
  }, [sections]);

  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;

    const activeBtn = container.querySelector(`[data-id="${active}"]`);
    if (activeBtn) {
      const containerWidth = container.offsetWidth;
      const btnWidth = activeBtn.offsetWidth;
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const relativeLeft = btnRect.left - containerRect.left + container.scrollLeft;

      container.scrollTo({
        left: relativeLeft - containerWidth / 2 + btnWidth / 2,
        behavior: "smooth",
      });
    }
  }, [active]);


  if (!sections.length) {
    return (
      <div className=" px-10 py-10 text-center text-gray-500">
        <Heading data={heading || "Key Highlights"} />
        <p>No key highlights data available.</p>
      </div>
    );
  }

  return (
    <div className=" mx-auto" id="keyHighlights">
      <h2>
        {" "}
        <CoursepageHeading data={heading} />
      </h2>

      {/* Desktop View */}
      <div className="hidden md:flex gap-6 mb-10">
        <div className="w-1/3">
          <div className="sticky top-24 bg-white shadow-md rounded-xl p-4">
            <div className="text-lg font-bold mb-4">Navigate Sections</div>
            {sections.map((s) => (
              <button
                key={s.value}
                onClick={() => scrollToSection(s.value)}
                className={`cursor-pointer block w-full text-left px-4 h-12 rounded-lg mb-2 font-medium transition-all ${
                  active === s.value
                    ? "bg-[#2a619d] text-white"
                    : "bg-gray-100 hover:bg-red-100"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-2/3 space-y-6">
          {sections.map((sec, index) => (
            <section
              key={sec.value}
              id={sec.value}
              className={`p-6 rounded-xl  shadow-lg ${sectionColors[index % sectionColors.length]} transition-all`}
            >
              <div className="text-2xl font-bold mb-6">{sec.name}</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tabsData?.[sec.value]?.keyPoints?.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-800">
                    <HiArrowRightCircle className="text-[#2a619d] mt-1 w-5 h-5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                )) || <p className="text-gray-500">No points available.</p>}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mt-6 mb-4">
        <div className="relative">
          <div
            ref={tabsRef}
            onScroll={handleScroll}
            className="flex space-x-3 overflow-x-auto pb-3 scroll-smooth scrollbar-hide"
          >
            {sections.map((s) => (
              <button
                key={s.value}
                data-id={s.value}
                onClick={() => setActive(s.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full border font-medium whitespace-nowrap transition-all ${
                  active === s.value
                    ? "bg-[#2a619d] text-white border-[#2a619d]"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {showRightFade && (
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white pointer-events-none" />
          )}
        </div>

        <div className="mt-4">
          {sections.map(
            (sec, index) =>
              active === sec.value && (
                <div
                  key={sec.value}
                  className={`p-4 rounded-xl ${sectionColors[index % sectionColors.length]} transition-all`}
                >
                  <div className="text-xl font-bold mb-4">{sec.name}</div>
                  <ul className="space-y-2">
                    {tabsData?.[sec.value]?.keyPoints?.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-800"
                      >
                        <HiArrowRightCircle className="text-[#2a619d] mt-1 w-5 h-5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    )) || <p className="text-gray-500">No points available.</p>}
                  </ul>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
