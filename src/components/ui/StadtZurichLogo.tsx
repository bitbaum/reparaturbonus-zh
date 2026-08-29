import React from 'react';

interface StadtZurichLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function StadtZurichLogo({
  className = '',
  width = 240,
  height = 60,
}: StadtZurichLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stadt Zürich Coat of Arms */}
      <g transform="translate(10, 10)">
        {/* Shield background */}
        <path
          d="M20 5 L35 5 L35 15 L30 20 L25 20 L20 15 Z"
          fill="#003f7f"
          stroke="#003f7f"
          strokeWidth="1"
        />

        {/* Diagonal stripes */}
        <g fill="#ffffff">
          <rect x="21" y="6" width="1" height="8" transform="rotate(45 21.5 10)" />
          <rect x="23" y="6" width="1" height="8" transform="rotate(45 23.5 10)" />
          <rect x="25" y="6" width="1" height="8" transform="rotate(45 25.5 10)" />
          <rect x="27" y="6" width="1" height="8" transform="rotate(45 27.5 10)" />
          <rect x="29" y="6" width="1" height="8" transform="rotate(45 29.5 10)" />
          <rect x="31" y="6" width="1" height="8" transform="rotate(45 31.5 10)" />
          <rect x="33" y="6" width="1" height="8" transform="rotate(45 33.5 10)" />
        </g>

        {/* Crossed tools */}
        <g fill="#ffffff" stroke="#ffffff" strokeWidth="0.5">
          {/* Left tool (hammer) */}
          <rect x="15" y="12" width="6" height="1" />
          <rect x="14" y="11" width="2" height="3" />

          {/* Right tool (wrench) */}
          <rect x="34" y="12" width="6" height="1" />
          <circle cx="41" cy="12.5" r="1.5" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        </g>
      </g>

      {/* Text */}
      <g fill="#003f7f">
        {/* "Stadt Zürich" */}
        <text x="60" y="20" fontSize="12" fontWeight="600" fontFamily="Arial, sans-serif">
          Stadt Zürich
        </text>

        {/* "Reparaturbonus" */}
        <text x="60" y="40" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">
          Reparaturbonus
        </text>
      </g>
    </svg>
  );
}
