import React from 'react';

/**
 * A customizable information icon component.
 *
 * @param {object} props - The props for the component.
 * @param {number} [props.width=24] - The width of the icon.
 * @param {number} [props.height=24] - The height of the icon.
 * @param {string} [props.color='#000000'] - The color of the icon's stroke.
 * @returns {React.ReactElement} The rendered SVG icon.
 */
const InfoIcon = ({ width = 22, height = 22, color = 'currentColor', ...props }) => {
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
        strokeLinecap="round"
        strokeLinejoin="round"
      ></circle>
      <path
        d="M12 16V11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 8.01172V8.00172"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default InfoIcon;