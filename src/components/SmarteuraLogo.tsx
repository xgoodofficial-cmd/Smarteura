import React from 'react';

interface SmarteuraLogoProps {
  className?: string;
  variant?: 'default' | 'white' | 'monochrome';
  primaryColor?: string;
  secondaryColor?: string;
}

export const SmarteuraLogo: React.FC<SmarteuraLogoProps> = ({
  className = 'w-10 h-10',
  variant = 'default',
  primaryColor,
  secondaryColor
}) => {
  // Determine palette based on variant
  let primary = '#123F32';
  let secondary = '#849C8F';

  if (variant === 'white') {
    primary = '#FFFFFF';
    secondary = '#A3C2B0';
  } else if (variant === 'monochrome') {
    primary = 'currentColor';
    secondary = 'currentColor';
  }

  if (primaryColor) primary = primaryColor;
  if (secondaryColor) secondary = secondaryColor;

  return (
    <svg
      viewBox="0 0 214 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SMARTEURA Logo"
    >
      {/* Piece 1: Main Diagonal Beam */}
      <polygon
        points="20,130 46,130 106,78 106,56"
        fill={primary}
      />

      {/* Piece 2: Sage Blade Accent */}
      <polygon
        points="110,74 124,14 135,22 121,82"
        fill={secondary}
      />

      {/* Piece 3: Lower Base Runner */}
      <polygon
        points="88,104 118,116 180,116 194,130 108,130 76,114"
        fill={primary}
      />
    </svg>
  );
};
