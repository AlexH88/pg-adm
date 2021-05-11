import * as React from 'react';
import {FC, ReactElement} from 'react';
//import { Icon } from '../../../../components/elements/Icon';
import ContextMenu from '../ContextMenu/';
import DropIcon from './dropIcon';
import UptimeIcon from './uptimeIcon';
import CogIcon from './cogIcon';
import PaperIcon from './paperIcon';
import PulseIcon from './pulseIcon';
import CalendarIcon from './calendarIcon';
import AsteriskIcon from './asteriskIcon';
import CardIcon from './cardIcon';
import PrinterIcon from './printerIcon';
import EthernetIcon from './ethernetIcon';
import SerialIcon from './serialIcon';
import PencilIcon from './pencilIcon';

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

  const configLabels: any = {
    MODEL: "Вендор и модель",
    DESCR: "Описание системы",
    SERIAL: "Серийный номер",
    MAC: "Mac адрес",
    ETH: "Описание ethernet модуля",
    DATE: "Системная дата на устройстве",
    UPTIME: "Аптайм",
    PRINTED: "Всего напечатано",
    BLACK: "Уровень тонера, черный",
    CYAN: "Уровень тонера, голубой",
    MAGENTA: "Уровень тонера, малиновый",
    YELLOW: "Уровень тонера, желтый",
    SUPPLIES: "Расходники",
    STATUS: "Статус",
    OTHER: "Другое"
  }

  const configIcons: any = {
    MODEL: <PrinterIcon/>,
    DESCR: <PencilIcon/>,
    SERIAL: <SerialIcon/>,
    MAC: <CardIcon/>,
    ETH: <EthernetIcon/>,
    DATE: <CalendarIcon/>,
    UPTIME: <UptimeIcon/>,
    PRINTED: <PaperIcon/>,
    BLACK: <DropIcon color="#000000"/>,
    CYAN: <DropIcon color="#00ffff"/>,
    MAGENTA: <DropIcon color="#ff00ff"/>,
    YELLOW: <DropIcon color="#ffff00"/>,
    SUPPLIES: <CogIcon/>,
    STATUS: <PulseIcon/>,
    OTHER: <AsteriskIcon/>
  }

  return (
    <ContextMenu
      boxCoords={tooltipPosition}
      rightsidePointer={!contextMenuOnly}
      bottomPointer={contextMenuOnly}
      flexDirection="column"
    >
      {Array.isArray(snmpInfo) && Object.keys(configLabels).map(
        (param: any) => {
          const typeSubgroup = snmpInfo.filter(t => t.type === param);

          return typeSubgroup.map((info) => (
            <div
              key={info.oidFormula}
              style={{
                color: 'black',
                textAlign: 'left',
                padding: '0 16px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '800px',
              }}
            >
              <div style={{ width: '16px', height: '16px', marginRight: '8px', flex: '0 0 16px' }}>
                {configIcons[info.type]}
              </div>
              {info.name.length ? (
                <div style={{
                  fontWeight: 'bold',
                  flex: '1 0 50px',
                  position: 'relative',
                  overflow: 'auto',
                }}>
                  <div style={{ width: '100%', overflowWrap: 'break-word'}}>
                    {info.name}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    fontWeight: 'bold',
                    color: '#a6a6a6',
                    flex: '1 0 50px',
                    position: 'relative',
                    overflow: 'auto',
                  }}
                >
                  <div style={{ width: '100%', overflowWrap: 'break-word'}}>
                    {configLabels[info.type]}
                  </div>
                </div>
              )}
              <div
                style={{
                  fontWeight: 'normal',
                  marginLeft: '16px',
                  whiteSpace: 'normal',
                  color: '#30a3e6',
                  flex: '1 0 50px',
                  position: 'relative',
                  overflow: 'auto',
                }}
              >
                <div style={{ width: '100%', overflowWrap: 'break-word'}}>
                  {info.oidFormula}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 'normal',
                  marginLeft: '16px',
                  whiteSpace: 'normal',
                  flex: '1 0 50px',
                  position: 'relative',
                  overflow: 'auto',
                }}
              >
                <div style={{ width: '100%', overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}>
                  {info.value}
                </div>
              </div>
            </div>
          ));
        }
      )}
    </ContextMenu>
  );
}

export default Tooltip;