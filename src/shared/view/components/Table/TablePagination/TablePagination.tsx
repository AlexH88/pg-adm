import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import './TablePagination.styl';

export interface IProps {
  currentPage: number;
  pages: number;
  onChangePage: Function;
}

class TablePagination extends React.PureComponent<IProps, {}> {
  private b = block('table-pagination');

  public render() {
    const b = this.b;
    const { pages } = this.props;

    return (
      <div className={b()}>
        {pages > 1 && this.getPagesButtons()}
      </div>
    );
  }

  @bind
  private lessBtns(btns: JSX.Element[]) {
    const { pages, currentPage } = this.props;
    const b = this.b;
    const range = 3;
    let firstBtns = btns.slice(0, range);
    let middleBtns = null;
    let lastBtns = btns.slice(-range);
    const separator = <div className={b('separator')}>...</div>;

    if (currentPage >= 0 && currentPage < (range * 2) - 1) {
      firstBtns = firstBtns.concat(btns.slice(range, range + (currentPage)));
    } else if (currentPage <= pages && currentPage > pages + 1 - (range * 2)) {
      lastBtns = btns.slice(currentPage - 1, pages - range + 1).concat(lastBtns);
    } else {
      middleBtns = btns.slice(currentPage - Math.floor(range / 2), currentPage + Math.ceil(range / 2));
    }

    return (
      <div>
        {firstBtns}
        {middleBtns ? separator : null}
        {!middleBtns ? separator : middleBtns}
        {middleBtns ? separator : null}
        {lastBtns}
      </div>
    );
  }

  @bind
  private getPagesButtons() {
    const { pages, currentPage } = this.props;
    const b = this.b;
    const pageBtns = Array.from({ length: pages }, (_, i) => (
      <div
        key={i}
        onClick={this.onClick.bind(this, i, currentPage)}
        className={b('page', { current: i === currentPage })}
      >
        {i + 1}
      </div>
    ));

    return pages > 9 ? this.lessBtns(pageBtns) : pageBtns;
  }

  @bind
  private onClick(targetPage: number, currentPage: number) {
    this.props.onChangePage(targetPage, currentPage);
  }
};

export default TablePagination;
