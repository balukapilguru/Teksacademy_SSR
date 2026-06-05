'use client'

import GetData from '@/utility/GetData';
import Heading from '@/utility/Heading';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react'

export default function Gallery({ gallery, data }) {
  const galleryData = gallery || data;
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalRef = useRef(null);
 
  if (!galleryData) return null;

  const openModal = (index) => setActiveIndex(index);
  const closeModal = () => setActiveIndex(null);
  
  // Mobile carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryData?.images?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryData?.images?.length) % galleryData?.images?.length);
  };

  // Continuous auto slide for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const pauseAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resumeAutoSlide = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    }
  };

  const handleTouchStart = (e) => {
    pauseAutoSlide();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
    resumeAutoSlide();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex !== null) {
        if (e.key === 'Escape') closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <>
      <div className="py-10 overflow-hidden">
        <div className="main_container mx-auto">
          <div className="text-center mb-6">
            <Heading data={galleryData?.heading}/>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {galleryData?.images?.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-[#EFF6F3] flex justify-center items-center p-2 cursor-pointer"
                onClick={() => openModal(index)}
              >
                <Image
                  className="rounded-lg transition-transform duration-300 hover:scale-105 w-full h-auto"
                  src={GetData({ url: item?.src || item?.imgsrc })}
                  alt={item?.alt || item?.image?.alt || "gallery"}
                  width={300}
                  height={200}
                />
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden w-full px-2">
            <div className="relative flex items-center justify-center">
              {/* Previous Button */}
              <button
                onClick={() => {
                  pauseAutoSlide();
                  prevSlide();
                  resumeAutoSlide();
                }}
                onTouchStart={pauseAutoSlide}
                onTouchEnd={resumeAutoSlide}
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 bg-[#2a619d] text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-[#1e4a7a] transition-all z-20 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Carousel Container */}
              <div 
                className="overflow-hidden rounded-lg w-full"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {galleryData?.images?.map((item, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 cursor-pointer"
                      onClick={() => openModal(index)}
                    >
                      <div className="rounded-lg bg-[#EFF6F3] flex justify-center items-center p-4">
                        <Image
                          className="rounded-lg w-full h-auto"
                          src={GetData({ url: item?.src || item?.imgsrc })}
                          alt={item?.alt || item?.image?.alt || "gallery"}
                          width={400}
                          height={300}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => {
                  pauseAutoSlide();
                  nextSlide();
                  resumeAutoSlide();
                }}
                onTouchStart={pauseAutoSlide}
                onTouchEnd={resumeAutoSlide}
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 bg-[#2a619d] text-white rounded-full w-8 h-8 sm:w-12 sm:h-8 flex items-center justify-center hover:bg-[#1e4a7a] transition-all z-20 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal - No Left/Right Arrows */}
      {activeIndex !== null && galleryData?.images?.[activeIndex] && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999]"
          onClick={closeModal}
        >
          {/* Close Button Only */}
          <button 
            onClick={closeModal} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 bg-black/50 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-black/80 transition-all group"
          >
            <span className="text-white text-3xl sm:text-4xl font-light leading-none">×</span>
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GetData({ url: galleryData?.images[activeIndex]?.src || galleryData?.images[activeIndex]?.imgsrc })}
              alt={galleryData?.images[activeIndex]?.alt || "Gallery image"}
              width={800}
              height={600}
              className="w-auto h-auto max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      )}

      {/* Custom CSS for perfect centering */}
      <style jsx global>{`
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        
        button span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        
        /* Ensure SVG icons are centered */
        button svg {
          display: block;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}