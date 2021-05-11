import * as React from 'react';
import { block } from 'bem-cn';
import { bind } from 'decko';
import {generateIdElement} from 'shared/helpers';
import './SnmpPagination.styl';

export interface IProps {
  currentPage: number;
  pages: any;
  onChangePage: Function;
  errorFloors: any
}

class SnmpPagination extends React.PureComponent<IProps, {}> {
  private b = block('snmp-pagination');

  public render() {
    const b = this.b;
    const { pages } = this.props;

    return (
      <div className={b()}>
        {pages.length > 0 && this.getPagesButtons()}
      </div>
    );
  }

  @bind
  private getPagesButtons() {
    const { pages, currentPage, errorFloors } = this.props;
    let currentPageId = currentPage === 0 ? localStorage.getItem('storageCurrentFloor') : currentPage
    const b = this.b;

    
    const pageBtns = pages.map((item) => { 
      const pagesColor = item == Number(localStorage.getItem('storageCurrentFloor'))
      return (
      <div
        key={item}
        onClick={this.props.onChangePage.bind(this, item)}
        className={b('page', { current: pagesColor, error: errorFloors.includes(item)})}
        id={`floor_item-${generateIdElement()}`}
      >
        {item}
      </div>
    )})

    return pageBtns;
  }
};

export default SnmpPagination;
