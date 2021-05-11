import * as React from 'react';
import { block } from 'bem-cn';
import './style.styl';


interface IProps {
  floorNumber: number
  printerNumber: number
  currentFloorPrinters: number
}

class SnmpAggregate extends React.Component<IProps, {}> {

  private b = block('aggregate');

  public render() {
    const b = this.b;
    const { floorNumber, printerNumber, currentFloorPrinters = 0 } = this.props;
    return (
      <div className={b()}>
        <div className={b('stat')}>
          <span className={b('title')}>Всего этажей:</span> <span className={b('value')}>{floorNumber}</span>
        </div>
        <div className={b('stat')}>
          <span className={b('title')}>Принтеров в системе:</span> <span className={b('value')}>{printerNumber}</span>
        </div>
        <div className={b('stat')}>
          <span className={b('title')}>Принтеров на этаже:</span> <span className={b('value')}>{currentFloorPrinters}</span>
        </div>
      </div>
    );
  }
}

export default SnmpAggregate;
