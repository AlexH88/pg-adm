import * as React from 'react';
import cn from 'classnames';
import * as style from './style.styl';

interface Coords {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

interface OwnProps {
  children: any;
  boxCoords?: Coords;
  leftsidePointer?: boolean;
  rightsidePointer?: boolean;
  bottomPointer?: boolean;
  width?: string;
  flexDirection?: string;
}

const ContextMenu = ({
  children,
  boxCoords,
  leftsidePointer,
  rightsidePointer,
  bottomPointer,
  width,
  flexDirection,
}: OwnProps): React.ReactElement<HTMLDivElement> => {
  const styleObj: any = { ...boxCoords };
  if (width) {
    styleObj.width = width;
  }
  if (flexDirection) {
    styleObj.flexDirection = flexDirection;
  }
  return (
    <div
      className={cn(
        'permissions',
        style['menu-box'],
        {
          [style['menu-box-left']]: leftsidePointer,
          [style['menu-box-right']]: rightsidePointer,
          [style['menu-box-bottom']]: bottomPointer
        },
      )}
      style={styleObj}
    >
      {children}
    </div>
  );
};

export default ContextMenu;
