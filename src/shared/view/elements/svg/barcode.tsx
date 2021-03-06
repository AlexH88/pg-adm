import * as React from 'react';

interface SvgProps {
  className?: string;
  w?: number;
  h?: number;
}

const Barcode: React.StatelessComponent<SvgProps> = (props) => {
  return (
    <svg width={props.w} height={props.h} className={props.className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 55">
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <rect x="18.44" width="2.42" height="54.96"/>
          <rect x="13.52" width="1.21" height="54.96"/>
          <rect x="27.03" width="1.21" height="54.96"/>
          <rect x="24.57" width="1.21" height="54.96"/>
          <rect x="3.67" width="1.25" height="54.96"/>
          <rect x="7.38" width="1.21" height="54.96"/>
          <rect width="2.46" height="55"/>
          <rect x="29.49" width="1.21" height="54.96"/>
          <rect x="54.02" width="2.46" height="54.96"/>
          <rect x="60.2" width="3.67" height="54.96"/>
          <rect x="65.08" width="1.25" height="54.96"/>
          <rect x="67.54" width="2.46" height="55"/>
          <rect x="45.43" width="2.46" height="54.96"/>
          <rect x="50.35" width="2.46" height="54.96"/>
          <rect x="40.51" width="2.46" height="54.96"/>
          <rect x="34.37" width="2.46" height="54.96"/>
        </g>
      </g>
    </svg>
  );
};

Barcode.defaultProps = {
  className: 'blankfile-icon',
  w: 100,
  h: 100,
};

export { Barcode };