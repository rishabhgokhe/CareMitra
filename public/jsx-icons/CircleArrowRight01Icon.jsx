import React from "react";

/**
 * A customizable play icon component.
 *
 * @param {object} props - The props for the component.
 * @param {number} [props.width=24] - The width of the icon.
 * @param {number} [props.height=24] - The height of the icon.
 * @param {string} [props.color='#000000'] - The color of the icon's stroke.
 * @returns {React.ReactElement} The rendered SVG icon.
 */
const CircleArrowRight01Icon = ({
  width = 22,
  height = 22,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      color={color}
      fill="none"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
      ></circle>
      <path
        d="M10.5 8C10.5 8 13.5 10.946 13.5 12C13.5 13.0541 10.5 16 10.5 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default CircleArrowRight01Icon;
