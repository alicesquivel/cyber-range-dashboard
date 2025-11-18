import React from "react";

export default function Skeleton({
  width = "w-full",
  height = "h-3",
  className = "",
  children,
}) {
  // width/height accept tailwind utility classes
  return (
    <div className={`${width} ${height} animate-pulse rounded ${className}`}>
      {children}
    </div>
  );
}
