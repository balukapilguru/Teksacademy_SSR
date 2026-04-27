import React from "react";



const Mainheading = ({ text = "Default Heading",data, className = "" }) => {
  if (!text) return null;

  const words = text.split(" ");
  const firstPart = words.slice(0, -2).join(" ");
  const lastPart = words.slice(-2).join(" ");

  return (
    <h1 className={`text-3xl md:text-5xl lg:text-5xl font-bold leading-snug ${className}`}>
      {firstPart}{" "}
      <span className="text-white">{lastPart}</span>
    </h1>
  );
};

export default Mainheading;

