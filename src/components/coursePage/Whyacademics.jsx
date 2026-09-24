"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LegacyCard from "../coursePage/LegacyCard";
import CoursepageHeading from "../../utility/CoursepageHeading";
import Image from "next/image";
import RichTextRenderer from "./RichTextRenderer";

const WhyOnline = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;
  return (
    <section className=" py-4 bg-white relative ">
      <div className=" ">
        {/* Header Section */}
        <div className="text-left">
          {/* Heading Section */}
          <div className="mb-8">
            <CoursepageHeading data={data?.heading} />
          </div>

          {/* Legacy Cards Section */}

          {/* Image Section */}
          {data?.image?.src && data.image.src !== "null" && (
            <div className="my-8 md:flex justify-center hidden ">
              <div className="relative w-full max-w-2xl h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={data.image.src}
                  alt={data.image.alt || "Why Online Program"}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          )}

          {/* Description Content */}
          <div className="space-y-4">
            {/* Always visible content */}
            <div className="text-md md:text-lg text-gray-600 leading-relaxed font-normal text-justify">
              {data?.initialDescription?.type === "richText" ? (
                <RichTextRenderer content={data.initialDescription.content} />
              ) : (
                data?.initialDescription
              )}
            </div>

            {/* Collapsible Content */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden space-y-4"
                >
                  {data?.description?.[0]?.firstDescription && (
                    <p className="text-md text-justify md:text-lg text-gray-600 leading-relaxed font-normal">
                      {data.description[0].firstDescription}
                    </p>
                  )}
                  {data?.description?.[1]?.secondDescription && (
                    <p className="text-md text-justify md:text-lg text-gray-600 leading-relaxed font-normal">
                      {data.description[1].secondDescription}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="w-12 h-12 flex items-center justify-center cursor-pointer rounded-full bg-[#2a619d] text-white shadow-lg hover:bg-[#a31930] transition-colors duration-200"
            whileTap={{ scale: 0.9 }}
            animate={{ y: expanded ? -5 : 5 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {expanded ? (
              <FaChevronUp className="w-5 h-5" />
            ) : (
              <FaChevronDown className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default WhyOnline;
