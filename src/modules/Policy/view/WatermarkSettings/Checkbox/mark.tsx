import * as React from 'react';

interface SvgProps {
  w?: number;
  h?: number;
}

const MarkIcon: React.SFC<SvgProps> = (props) => {
  const { w, h } = props;

  return (
    <svg
      version="1.1"
      width={w}
      height={h}
      viewBox="0 0 32 32">
      <path
        d="M 31.99414,7.5004624 14.521981,24.972623 10.916741,21.367383 28.388901,3.8952226 Z M 3.6110995,13.115687 14.99495,24.499537 11.38971,28.104777 0.0058595,16.720927 Z"
      />
    </svg>
  );
};

MarkIcon.defaultProps = {
  w: 32,
  h: 32,
};

export default MarkIcon;
