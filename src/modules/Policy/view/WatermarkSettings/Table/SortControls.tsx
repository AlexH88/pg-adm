import * as React from 'react';

interface SvgProps {
  name: string;
  state: 'asc' | 'desc' | 'none';
  onClick: (name, state) => void;
}

const SortControls: React.SFC<SvgProps> = (props) => {
  const {
    name,
    state = 'none',
    onClick
  } = props;

  const handleClick = (e) => {
    e.stopPropagation();
    const cycleState = { 'asc': 'desc', 'desc': 'none', 'none': 'asc' };
    
    onClick(name, cycleState[state]);
  }

  return (
    <div
      onClick={handleClick}
      style={{
        marginLeft: '8px',
        cursor: 'pointer'
      }}
    >
      <svg
        version="1.1"
        viewBox="0 0 32 32"
        width="12"
        height="12"
      >
        <path
          //d="M 30.541477,14.49412 16,0 1.4585233,14.49412 Z"
          d="M 29,12.957667 16,0 3.0000002,12.957667 Z"
          fill={state === 'asc' ? '#30a3e6' : '#ccc'}
        />
        <path
          //d="M 1.4585233,17.50588 16,32 30.541477,17.50588 Z"
          d="M 3.0000002,19.042333 16,32 29,19.042333 Z"
          fill={state === 'desc' ? '#30a3e6' : '#ccc'}
        />
        {/*<path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"/>
        <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"/>*/}
      </svg>
    </div>
  );
};

SortControls.defaultProps = {
  state: 'none'
};

export default SortControls;