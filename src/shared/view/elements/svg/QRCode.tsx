import * as React from 'react';

interface SvgProps {
  className?: string;
  w?: number;
  h?: number;
}

const QRCode: React.StatelessComponent<SvgProps> = (props) => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  width={props.w}  preserveAspectRatio="none" height={props.h} className={props.className} viewBox="0 0 16 16">
      <path fill="#000000" d="M6 0h-6v6h6v-6zM5 5h-4v-4h4v4z"></path>
      <path fill="#000000" d="M2 2h2v2h-2v-2z"></path>
      <path fill="#000000" d="M0 16h6v-6h-6v6zM1 11h4v4h-4v-4z"></path>
      <path fill="#000000" d="M2 12h2v2h-2v-2z"></path>
      <path fill="#000000" d="M10 0v6h6v-6h-6zM15 5h-4v-4h4v4z"></path>
      <path fill="#000000" d="M12 2h2v2h-2v-2z"></path>
      <path fill="#000000" d="M2 7h-2v2h3v-1h-1z"></path>
      <path fill="#000000" d="M7 9h2v2h-2v-2z"></path>
      <path fill="#000000" d="M3 7h2v1h-2v-1z"></path>
      <path fill="#000000" d="M9 12h-2v1h1v1h1v-1z"></path>
      <path fill="#000000" d="M6 7v1h-1v1h2v-2z"></path>
      <path fill="#000000" d="M8 4h1v2h-1v-2z"></path>
      <path fill="#000000" d="M9 8v1h2v-2h-3v1z"></path>
      <path fill="#000000" d="M7 6h1v1h-1v-1z"></path>
      <path fill="#000000" d="M9 14h2v2h-2v-2z"></path>
      <path fill="#000000" d="M7 14h1v2h-1v-2z"></path>
      <path fill="#000000" d="M9 11h1v1h-1v-1z"></path>
      <path fill="#000000" d="M9 3v-2h-1v-1h-1v4h1v-1z"></path>
      <path fill="#000000" d="M12 14h1v2h-1v-2z"></path>
      <path fill="#000000" d="M12 12h2v1h-2v-1z"></path>
      <path fill="#000000" d="M11 13h1v1h-1v-1z"></path>
      <path fill="#000000" d="M10 12h1v1h-1v-1z"></path>
      <path fill="#000000" d="M14 10v1h1v1h1v-2h-1z"></path>
      <path fill="#000000" d="M15 13h-1v3h2v-2h-1z"></path>
      <path fill="#000000" d="M10 10v1h3v-2h-2v1z"></path>
      <path fill="#000000" d="M12 7v1h2v1h2v-2h-2z"></path>
    </svg>
  );
};

QRCode.defaultProps = {
  className: 'blankfile-icon',
  w: 100,
  h: 100,
};

export { QRCode };