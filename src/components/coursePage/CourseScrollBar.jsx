"use client";
import React, { useEffect, useState, useRef } from "react";
import { useNavbar } from "@/components/coursePage/NavbarContext";

const CourseScrollBar = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [visible, setVisible] = useState(false);
  const scrollContainerRef = useRef(null);
  const { setMainNavbarVisible } = useNavbar();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const offsetTop = section.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  // Auto scroll active section into view (desktop only)
  useEffect(() => {
    if (visible && scrollContainerRef.current && window.innerWidth >= 450) {
      const activeElement = scrollContainerRef.current.querySelector(
        `[data-section="${activeSection}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }, [activeSection, visible]);

  useEffect(() => {
    const handleScroll = () => {
      // --- MOBILE CHECK ---
      if (window.innerWidth < 768) {
        setVisible(false);
        setMainNavbarVisible(true);
        return;
      }

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const bottomThreshold = 100;
      const isNearBottom = scrollTop + windowHeight >= documentHeight - bottomThreshold;

      const secondSection = document.getElementById(sections[1]?.id);
      let shouldBeVisible = false;

      if (secondSection) {
        const isPastSecondSection = scrollTop >= secondSection.offsetTop - 50;
        shouldBeVisible = isPastSecondSection && !isNearBottom;

        setVisible(shouldBeVisible);
        setMainNavbarVisible(!shouldBeVisible);
      }

      // Update active section
      if (!isNearBottom) {
        let current = activeSection;
        sections.forEach((section) => {
          const el = document.getElementById(section.id);
          if (el && scrollTop >= el.offsetTop - 120) {
            current = section.id;
          }
        });
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      setMainNavbarVisible(true);
    };
  }, [activeSection, sections, setMainNavbarVisible]);

  // Don't render if not visible
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-40 bg-[#faf3f3]/95 backdrop-blur-md shadow-md border-b transition-all duration-300">
      {/* Desktop - Horizontal Scroll */}
      <div className="hidden md:block">
        <div className="flex justify-center items-center main_container h-23"> 
          <div className="flex items-center space-x-6 lg:space-x-8 xl:space-x-10 px-4 py-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`whitespace-nowrap text-sm lg:text-base font-medium border-b-2 transition-all duration-200 flex items-center px-2 py-1 ${
                  activeSection === section.id
                    ? "text-[#c41e3a] border-[#c41e3a]"
                    : "text-gray-700 border-transparent hover:text-[#c41e3a] hover:border-[#c41e3a]"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar for mobile */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CourseScrollBar;

