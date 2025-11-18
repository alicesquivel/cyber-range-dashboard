import React from "react";

export default function IconChevron({ className = "", direction = "right" }) {
  const transform =
    direction === "right" ? "" : direction === "left" ? "rotate-180" : "";
  return (
    <svg
      className={`h-4 w-4 ${transform} ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
