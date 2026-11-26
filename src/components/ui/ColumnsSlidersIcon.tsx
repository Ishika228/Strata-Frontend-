import React from 'react';

interface ColumnsSlidersIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export const ColumnsSlidersIcon: React.FC<ColumnsSlidersIconProps> = ({
  className = 'w-4 h-4',
  size = 16,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Top track */}
      <line x1="3" y1="8" x2="21" y2="8" strokeWidth="2" />
      {/* Top knob (circle) at right ~2/3 */}
      <circle cx="15" cy="8" r="2.2" fill="white" stroke="currentColor" strokeWidth="2" />

      {/* Bottom track */}
      <line x1="3" y1="16" x2="21" y2="16" strokeWidth="2" />
      {/* Bottom knob (circle) at left ~1/3 */}
      <circle cx="9" cy="16" r="2.2" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default ColumnsSlidersIcon;
