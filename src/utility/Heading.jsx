import React from "react";

const Heading = ({ data, as = "div" }) => {
  if (!data) {
    console.warn("Heading: No data provided");
    return null;
  }

  let headingArray = [];

  if (Array.isArray(data)) {
    headingArray = data;
  } else if (data.firstHeading && Array.isArray(data.firstHeading)) {
    headingArray = data.firstHeading;
  } else if (data.heading && Array.isArray(data.heading)) {
    headingArray = data.heading;
  } else if (typeof data === "string") {
    headingArray = [data];
  } else {
    console.warn(data);
    return null;
  }

  const validHeadings = headingArray.filter(
    (item) => item && typeof item === "string" && item.trim() !== ""
  );

  if (validHeadings.length === 0) return null;

  const Tag = as; // 👈 dynamic tag

  return (
    <Tag className="text-2xl xl:text-3xl font-medium text-black leading-tight md:text-2xl mb-4">
      {validHeadings.length > 1 ? (
        <>
          {validHeadings[0]}{" "}
          <span className="text-[#c41e3a]">{validHeadings[1]}</span>
        </>
      ) : (
        validHeadings[0]
      )}
    </Tag>
  );
};

export default Heading;
