"use client";

import React from "react";

export default function ButtonLoader({ size = 5, text = "" }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <img
        src="/svgs/loading.svg"
        alt="Loading..."
        className={`w-${size} h-${size} animate-spin`}
      />
      {text && <span className="font-medium">{text}</span>}
    </div>
  );
}