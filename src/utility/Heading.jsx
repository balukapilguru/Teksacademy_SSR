import React from "react";

const Heading = ({
  data,
  as = "div",
  className = "",
  highlightClassName = "text-[#2a619d]",
}) => {
  if (!data) return null;

  const splitHeadingString = (heading) => {
    const trimmed = heading.trim();
    const commaMatch = trimmed.match(/^(.+?,)\s*(.+)$/);

    if (commaMatch) return [commaMatch[1], commaMatch[2]];

    const lastSpace = trimmed.lastIndexOf(" ");
    if (lastSpace > 0) {
      return [
        trimmed.slice(0, lastSpace),
        trimmed.slice(lastSpace + 1),
      ];
    }

    return [trimmed];
  };

  let headingArray =
    typeof data === "string" ? splitHeadingString(data) : data;

  const Tag = as;

  return (
    <Tag className={`text-2xl xl:text-3xl font-medium ${className}`}>
      {headingArray.length > 1 ? (
        <>
          {headingArray[0]}{" "}
          <span className={`relative inline-block ${highlightClassName}`}>
            {headingArray.slice(1).join(" ")}

            {/* SVG underline */}
            <svg
              className="absolute left-0 top-full mt-1 w-full h-[10px]"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0 8 Q50 0 100 8"
                stroke="orangered"
                strokeWidth="1.5"
                fill="transparent"
              />
            </svg>
          </span>
        </>
      ) : (
        <span className="relative inline-block">
          {headingArray[0]}

          <svg
            className="absolute left-0 top-full mt-1 w-full h-[10px]"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q50 0 100 8"
              stroke="orangered"
              strokeWidth="1.5"
              fill="transparent"
            />
          </svg>
        </span>
      )}
    </Tag>
  );
};

export default Heading;