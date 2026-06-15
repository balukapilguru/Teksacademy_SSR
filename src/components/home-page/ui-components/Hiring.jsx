"use client";
import Image from "next/image";
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import { useEffect, useRef, useState } from "react";

export default function Hiringcompanies({ hiringData, courseName }) {
  const buildMarqueeRows = (companies) => {
    if (!companies) return [];

    const allImages = [];
    ["row1", "row2", "row3"].forEach((rowKey) => {
      const row = companies[rowKey];
      if (Array.isArray(row)) {
        row.forEach((company) => {
          if (company?.image?.src) {
            allImages.push({
              image: company.image.src,
              alt: company.image.alt || company.name || "logo",
            });
          }
        });
      }
    });

    let images = [...allImages];
    while (images.length < 20 && images.length > 0) {
      images = [...images, ...allImages];
    }
    const totalNeeded = 20;
    const finalImages = images.slice(0, totalNeeded);

    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push({
        images: finalImages.slice(i * 5, i * 5 + 5),
      });
    }
    return rows;
  };

  const marqueeRows = buildMarqueeRows(hiringData?.companies);

  return (
    <div className="bg-[#fbf5f6] main_container py-12 mt-7 border border-[#fbf5f6] rounded-lg shadow-md">
      <div className="text-center">
        <div className="">
          <Heading
            data={hiringData?.hiringPartnersHeading}
            text={hiringData?.hiringPartnersHeading}
          />
        </div>

        <div className="w-full">
          <div className="flex flex-col">
            <MarqueeContainer rows={marqueeRows} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main container that controls all rows synchronously
function MarqueeContainer({ rows }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const rowRefs = useRef([]);
  const containerRef = useRef(null);
  const [rowWidths, setRowWidths] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Duplicate images 3 times for seamless scrolling
  const getDuplicatedImages = (images) => {
    return [...images, ...images, ...images];
  };

  // Measure each row's width after images load
  useEffect(() => {
    const measureWidths = () => {
      const widths = rowRefs.current.map((row) => {
        if (row) {
          // Get width of a single set (not the full duplicated track)
          const singleSetWidth = row.scrollWidth / 3;
          return singleSetWidth;
        }
        return 0;
      });
      setRowWidths(widths);
      setIsInitialized(true);
    };

    // Small delay to ensure images are rendered
    const timer = setTimeout(measureWidths, 100);
    return () => clearTimeout(timer);
  }, [rows]);

  // Synchronized scrolling animation
  useEffect(() => {
    if (!isInitialized || rowWidths.length === 0) return;

    let lastTimestamp = 0;
    const speed = 50; // Consistent speed for all rows (pixels per second)
    let position = scrollPosition;

    const animate = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate delta time
      const deltaTime = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      // Move all rows at the same speed
      position += speed * deltaTime;
      
      // Reset position based on the smallest row width to ensure all rows reset together
      const minRowWidth = Math.min(...rowWidths);
      if (position >= minRowWidth) {
        position = 0;
      }
      
      setScrollPosition(position);
      
      // Apply same transform to all rows
      rowRefs.current.forEach((row, idx) => {
        if (row) {
          row.style.transform = `translateX(-${position}px)`;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, rowWidths]);

  return (
    <div ref={containerRef} className="main_container overflow-hidden">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="marquee-container"
        >
          <div
            ref={(el) => (rowRefs.current[rowIndex] = el)}
            className="marquee-track"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: 'auto',
              willChange: 'transform',
            }}
          >
            {getDuplicatedImages(row.images).map((img, i) => (
              <div
                key={i}
                className="marquee-item"
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                 
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Image
                  src={GetData({ url: img.image })}
                  alt={img.alt}
                  width={150}
                  height={100}
                  className="object-contain"
                  priority={false}
                  
                />
              </div>
            ))}
          </div>
        </div>
      ))}
 
    </div>
  );
}