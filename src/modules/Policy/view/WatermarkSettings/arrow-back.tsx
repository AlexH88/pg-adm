import React from 'react';

interface SvgProps {
  className?: string;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  onClick?(e: React.MouseEvent<HTMLOrSVGElement>): void;
}

const ArrowBackIcon: React.StatelessComponent<SvgProps> = ({
  className = 'blankfile-icon',
  w = 100,
  h = 100,
  style,
  onClick,
}) => (
  <svg
    version="1.1"
    style={style}
    className={className}
    width={w}
    height={h}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 612 612"
    onClick={onClick}
  >
    <g>
      <path
        d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
		      C474.995,612,612,474.995,612,306z M328.895,160.511l39.502,39.502L260.239,308.226l117.838,117.838l-39.335,39.335L181.375,308.03
		      L328.895,160.511z"
      />
    </g>
  </svg>
);

export default ArrowBackIcon;
