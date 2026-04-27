"use client";

import { useEffect, useState, useRef } from "react";
import Talkoour from "@/components/coursePage/Talktoour.jsx";

export default function LetsTalkTrigger({ data }) {
  const [openPopup, setOpenPopup] = useState(false);
  const [scrollStep, setScrollStep] = useState(0);
  const lastScroll = useRef(0);

  // Show popup after 4 scrolls
  useEffect(() => {
    if (!data) return; // if API failed, stop
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > lastScroll.current + 60) {
        lastScroll.current = scrollY;

        setScrollStep((prev) => {
          const updated = prev + 1;

          if (updated >= 4) {
            setOpenPopup(true);
          }

          return updated;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  // Also open popup if the page is too short to scroll
  useEffect(() => {
    if (!data) return;

    setTimeout(() => {
      if (window.innerHeight >= document.body.scrollHeight) {
        setOpenPopup(true);
      }
    }, 2000);
  }, [data]);

  return (
    <>
      {openPopup && (
        <Talkoour
          data={data}
          onClose={() => setOpenPopup(false)} // important
        />
      )}
    </>
  );
}

