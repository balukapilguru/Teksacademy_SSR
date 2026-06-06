import React from "react";

const splitHeadingString = (heading) => {
  const trimmedHeading = heading.trim();
  const commaMatch = trimmedHeading.match(/^(.+?,)\s*(.+)$/);

  if (commaMatch) {
    return [commaMatch[1], commaMatch[2]];
  }

  const lastSpaceIndex = trimmedHeading.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    return [
      trimmedHeading.slice(0, lastSpaceIndex),
      trimmedHeading.slice(lastSpaceIndex + 1),
    ];
  }

  return [trimmedHeading];
};

const Heading = ({
  data,
  as = "div",
  className = "",
  highlightClassName = "text-[#2a619d]",
}) => {
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
    headingArray = splitHeadingString(data);
  } else {
    console.warn(data);
    return null;
  }

  const validHeadings = headingArray.filter(
    (item) => item && typeof item === "string" && item.trim() !== ""
  );

  if (validHeadings.length === 0) return null;

  const Tag = as;

  return (
    <Tag
      className={`text-2xl xl:text-3xl font-medium text-black leading-tight md:text-2xl mb-4 ${className}`.trim()}
    >
      {validHeadings.length > 1 ? (
        <>
          {validHeadings[0]}{" "}
          <span className={highlightClassName}>
            {validHeadings.slice(1).join(" ")}
          </span>
        </>
      ) : (
        <span className={highlightClassName}>{validHeadings[0]}</span>
      )}
    </Tag>
  );
};

export default Heading;
