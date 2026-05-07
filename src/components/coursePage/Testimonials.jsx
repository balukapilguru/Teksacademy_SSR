"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Heading from "@/utility/Heading";
import GetData from "@/utility/GetData";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import PrimaryButton from "@/utility/PrimaryButton";

const fallbackImg =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/fallback-user.png";

const convertToEmbedUrl = (url) => {
  if (!url) return "";
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  const id = match ? match[1] : null;
  return id ? `https://www.youtube.com/embed/${id}` : url;
};

export default function Testimonials({ data }) {
  const { tabs, studentVoices, testimonialCards, heading } = data;

  const [activeTab, setActiveTab] = useState("studentVoices");
  const [index2, setIndex2] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [modalVideo, setModalVideo] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 768) setVisibleCount(2);
      else if (width < 1024) setVisibleCount(3);
      else if (width < 1440) setVisibleCount(5);
      else setVisibleCount(7);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (studentVoices && studentVoices.length > 0) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % studentVoices.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [studentVoices]);

  useEffect(() => {
    if (modalVideo) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [modalVideo]);

  useEffect(() => {
    if (!testimonialCards || testimonialCards.length === 0) return;

    const interval = setInterval(() => {
      setIndex2((prev) => (prev + 1) % testimonialCards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonialCards]);

  const closeModal = () => {
    setModalVideo(null);
  };

  const goToVideo = (dir) => {
    if (!studentVoices || studentVoices.length === 0) return;

    setCurrentVideoIndex((prev) =>
      dir === "prev"
        ? prev === 0
          ? studentVoices.length - 1
          : prev - 1
        : (prev + 1) % studentVoices.length,
    );
    setModalVideo(null);
  };

  const handleVideoEnd = () => {
    closeModal();
    if (studentVoices && studentVoices.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % studentVoices.length);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    if (modalVideo) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [modalVideo]);

  const next2 = () => {
    if (!testimonialCards || testimonialCards.length === 0) return;
    setIndex2((prev) => (prev + 1) % testimonialCards.length);
  };

  const prev2 = () => {
    if (!testimonialCards || testimonialCards.length === 0) return;
    setIndex2(
      (prev) => (prev - 1 + testimonialCards.length) % testimonialCards.length,
    );
  };

  const getTriple = (arr, idx) => {
    if (!arr || arr.length === 0) return [];
    let total = arr.length;
    return [arr[(idx - 1 + total) % total], arr[idx], arr[(idx + 1) % total]];
  };

  const getImageUrl = (imageData) => {
    if (!imageData || !imageData.src || imageData.src === "null") {
      return fallbackImg;
    }
    return GetData({ url: imageData.src });
  };

  const getVideoUrl = (videoUrl) => {
    if (!videoUrl) return "";

    if (videoUrl.startsWith("http") || videoUrl.startsWith("//")) {
      return videoUrl;
    }

    return GetData({ url: videoUrl });
  };

  const safeStudentVoices = studentVoices || [];
  const safeTestimonialCards = testimonialCards || [];
  const safeTabs = tabs || [];

  return (
    <section
      className="w-full bg-[#f6f6f8] rounded-2xl py-10 px-5 sm:px-10"
      id="testimonials"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-6">
          <Heading data={data?.heading} />
        </div>

        <div className="flex justify-center gap-4 mb-5">
          {safeTabs.map((tab) => (
            <PrimaryButton
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              variant={activeTab === tab.value ? "filled" : "outline"}
              className="px-5 py-2 rounded-md text-sm"
            >
              {tab.name}
            </PrimaryButton>
          ))}
        </div>

        {activeTab === "studentVoices" && (
          <div className="max-w-8xl mx-auto relative h-[450px] flex items-center justify-center overflow-visible">
            {safeStudentVoices.length > 0 ? (
              <>
                {safeStudentVoices.map((item, index) => {
                  const position =
                    (index - currentVideoIndex + safeStudentVoices.length) %
                    safeStudentVoices.length;
                  const half = Math.floor(visibleCount / 2);
                  const visibleRange = Array.from(
                    { length: visibleCount },
                    (_, i) => i - half,
                  );
                  const offset =
                    position <= half
                      ? position
                      : position - safeStudentVoices.length;

                  let className =
                    "absolute w-[280px] h-[450px] p-1 rounded-xl overflow-hidden shadow-sm transition-all duration-500 ease-in-out cursor-pointer flex flex-col items-center";
                  let style = {};

                  if (!visibleRange.includes(offset)) {
                    className += " hidden";
                  } else {
                    const translateX = offset * 170;
                    const scale = 1 - Math.abs(offset) * 0.1;
                    const opacity = 1 - Math.abs(offset) * 0.2;
                    const zIndex = 10 - Math.abs(offset);
                    style = {
                      transform: `translateX(${translateX}px) scale(${scale})`,
                      opacity,
                      zIndex,
                    };
                  }

                  return (
                    <div
                      key={index}
                      className={className}
                      style={style}
                      onClick={() =>
                        offset === 0 &&
                        setModalVideo(getVideoUrl(item.videoUrl))
                      }
                    >
                      <div
                        className={`relative w-full h-full transition-all duration-300 ease-in-out rounded-xl overflow-hidden ${
                          offset === 0
                            ? "z-50 scale-105 shadow-2xl ring-4 ring-white"
                            : "z-10"
                        }`}
                      >
                        <Image
                          src={getImageUrl(item.thumbnail)}
                          alt={item.name || "Student"}
                          width={280}
                          height={450}
                          className="w-full h-full object-cover rounded-xl"
                        />

                        {offset !== 0 && (
                          <div className="absolute inset-0 bg-black/80 rounded-xl" />
                        )}

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-lg ${
                              offset === 0
                                ? "bg-transparent border-white"
                                : "bg-transparent border-gray-950"
                            }`}
                          >
                            <FaPlay
                              className={`text-xl ml-1 ${
                                offset === 0 ? "text-white" : "text-gray-950"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => goToVideo("prev")}
                  aria-label="Previous student video"
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 z-20"
                >
                  <IoIosArrowBack size={24} aria-hidden="true" />
                  <span className="sr-only">Previous student video</span>
                </button>
                <button
                  onClick={() => goToVideo("next")}
                  aria-label="Next student video"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 z-20"
                >
                  <IoIosArrowForward size={24} aria-hidden="true" />
                  <span className="sr-only">Next student video</span>
                </button>
              </>
            ) : (
              <div className="text-gray-500">No student videos available</div>
            )}
          </div>
        )}

        {activeTab === "testimonialCards" && (
          <div className="relative w-full flex justify-center items-center min-h-[300px]">
            {safeTestimonialCards.length > 0 ? (
              <>
                {/* LEFT ARROW */}
                <button
                  onClick={prev2}
                  aria-label="Previous testimonial"
                  className="absolute -left-2 sm:left-0 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
                >
                  <span aria-hidden="true">❮</span>
                  <span className="sr-only">Previous testimonial</span>
                </button>

                {/* RIGHT ARROW */}
                <button
                  onClick={next2}
                  aria-label="Next testimonial"
                  className="absolute -right-2 sm:right-0 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
                >
                  <span aria-hidden="true">❯</span>
                  <span className="sr-only">Next testimonial</span>
                </button>

                {/* 📱 MOBILE – 1 CARD */}
                <div className="block md:hidden w-full max-w-sm px-4">
                  <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col min-h-[360px]">
                    {/* IMAGE + NAME */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-[100px] h-[100px] rounded-full overflow-hidden border bg-gray-200">
                        <Image
                          src={getImageUrl(safeTestimonialCards[index2]?.image)}
                          alt={safeTestimonialCards[index2]?.name || "Student"}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <div className="font-bold text-gray-800 text-start">
                          {safeTestimonialCards[index2]?.name}
                        </div>
                        <div className="text-sm text-gray-600 text-start">
                          {safeTestimonialCards[index2]?.course}
                        </div>
                      </div>
                    </div>

                    <p
                      className="text-gray-600 text-sm leading-relaxed overflow-y-auto pr-2"
                      style={{ maxHeight: "160px" }}
                    >
                      {safeTestimonialCards[index2]?.review}
                    </p>
                  </div>
                </div>

                {/* 🖥️ TABLET & ABOVE – 3 CARDS (UNCHANGED LOGIC) */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                  {getTriple(safeTestimonialCards, index2).map((item, i) => (
                    <div
                      key={i}
                      className={`bg-white p-6 rounded-xl shadow-md border transition-all duration-500 
                flex flex-col min-h-[360px] max-h-[360px] 
                ${
                  i === 1
                    ? "border-[#ea6329] scale-105 shadow-xl"
                    : "opacity-80 scale-95 border-gray-200"
                }`}
                    >
                      {/* IMAGE + NAME */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border bg-gray-200">
                          <Image
                            src={getImageUrl(item.image)}
                            alt={item.name || "Student"}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="font-bold text-gray-800 text-start">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600 text-start">
                            {item.course}
                          </div>
                        </div>
                      </div>

                      <p
                        className="text-gray-600 text-sm text-justify leading-relaxed mt-2 overflow-y-auto pr-2"
                        style={{ maxHeight: "160px" }}
                      >
                        {item.review}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                No testimonial cards available
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-3 mt-8">
          {(activeTab === "studentVoices"
            ? safeStudentVoices
            : safeTestimonialCards
          ).map((_, i) => {
            const active =
              activeTab === "studentVoices" ? currentVideoIndex : index2;

            return (
              <button
                key={i}
                onClick={() =>
                  activeTab === "studentVoices"
                    ? setCurrentVideoIndex(i)
                    : setIndex2(i)
                }
                aria-label={`Go to ${
                  activeTab === "studentVoices" ? "video" : "testimonial"
                } ${i + 1}`}
                aria-current={active === i ? "true" : "false"}
                className={`w-3 h-3 rounded-full transition 
    ${active === i ? "bg-[#ea6329] scale-125" : "bg-gray-400"}
  `}
              >
                <span className="sr-only">
                  {`Go to ${
                    activeTab === "studentVoices" ? "video" : "testimonial"
                  } ${i + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {modalVideo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="fixed inset-0" onClick={closeModal} />

          <div
            ref={modalRef}
            className="bg-white rounded-xl w-[95%] max-w-3xl shadow-lg p-4 relative z-50 transform transition-all duration-300 ease-out scale-95 animate-fadeIn"
          >
            <button
              onClick={closeModal}
              aria-label="Close video modal"
              className="absolute -top-3 -right-3 text-gray-600 hover:text-black text-2xl bg-white rounded-full shadow-md p-2 z-50 hover:scale-110 transition-transform"
            >
              <IoMdClose aria-hidden="true" />
              <span className="sr-only">Close video</span>
            </button>

            <div className="relative pb-[56.25%] h-0">
              {modalVideo.endsWith(".mp4") ? (
                <video
                  key={modalVideo}
                  src={modalVideo}
                  autoPlay
                  controls
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onEnded={handleVideoEnd}
                  className="absolute p-6 top-0 left-0 w-full h-full rounded-lg"
                />
              ) : (
                <iframe
                  key={modalVideo}
                  src={convertToEmbedUrl(modalVideo)}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
