"use client";

import React from "react";

export default function Loader({
  text = "Loading...",
  size = 50,
  bgColor = "bg-zinc-900",
  textColor = "text-white",
  className = "",
}) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center ${bgColor} z-50 ${className}`}
    >
      <img
        src="/svgs/loader.svg"
        alt="Loading..."
        className={`mb-4`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <p className={`font-medium text-lg ${textColor}`}>{text}</p>
    </div>
  );
}
