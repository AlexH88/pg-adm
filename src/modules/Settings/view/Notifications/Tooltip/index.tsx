import * as React from 'react';
import {FC, ReactElement} from 'react';
import ContextMenu from 'shared/view/components/ContextMenu/';


interface Props {
  item: any;
  tooltipPosition?: any;
  contextMenuOnly?: boolean;
}

const Tooltip: FC<Props>  = (props: Props): ReactElement<HTMLDivElement> => {
  const {
      item,
      tooltipPosition,
      contextMenuOnly,
  } = props;

  const {
    snmpInfo = []
  } = item;

  const style = {
    width: '100%',
    display: 'flex',
    marginLeft: '5px',
  }

  return (
    <ContextMenu
      boxCoords={tooltipPosition}
      rightsidePointer={!contextMenuOnly}
      bottomPointer={contextMenuOnly}
      flexDirection="column"
    >

      {
        item.map(item => {
          return(
            <div style={style}>
              {item}
            </div>
          )
        })
      }


    </ContextMenu>
  );
}



export default Tooltip;