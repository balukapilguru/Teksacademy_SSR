import React from "react";

export default function PrimaryButton({
  children,
  label,
  href,
  variant = "filled",
  tabVariant, // tab variant
  className = "",
  ...props
}) {
  const baseStyles =
    "px-4 py-2 rounded-md font-semibold transition-all duration-300";

  // Normal button variants
  const variants = {
    filled:
      "cursor-pointer text-sm bg-[#ea6329] text-white hover:bg-[#a31a32] h-10 px-4 flex items-center justify-center",
    outline:
      "cursor-pointer text-sm border border-[#ea6329] text-[#ea6329] hover:bg-[#ea6329] hover:text-white h-10 px-4 flex items-center justify-center",
    light:
      "cursor-pointer text-sm bg-white text-gray-700 hover:bg-gray-100 h-10 px-4 flex items-center justify-center",
  };

  // TAB variants
  const tabVariantsStyles = {
    filled: "bg-[#0e2a47] text-white border border-[#0e2a47]",
    outline:
      "bg-white text-[#0e2a47] border border-[#0e2a47] hover:bg-[#0e2a47] hover:text-white",
  };

  // Choose final style
  const finalClass = `${baseStyles} 
    ${tabVariant ? tabVariantsStyles[tabVariant] : variants[variant]} 
    ${className}`;

  const content = children || label;

  // If href exists, render link-like button
  if (href) {
    return (
      <a href={href} className={finalClass} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={finalClass} {...props}>
      {content}
    </button>
  );
}

