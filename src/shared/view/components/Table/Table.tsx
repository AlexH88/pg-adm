import * as React from 'react';
import * as circularTheme from './circularTheme.styl';
import {block} from 'bem-cn';

import {bind} from 'decko';
import {IResource} from 'shared/types/app';

import ProgressBar from 'react-toolbox/lib/progress_bar';
import TablePagination from './TablePagination/TablePagination';
import TableHeader, {IProps as ITableHeaderProps} from './TableHeader';
import TableRowItems from './TableRowItems';

import './style.styl';

interface IRow {
  [value: string]: string | number | undefined | null;
}

interface ISort {
  by?: string;
  order?: 'asc' | 'desc' | undefined;
}

interface IProps {
  isLoading?: boolean;
  onSort?: (value: string) => void;
  sort?: ISort;
  // children?: Array<React.ReactElement<ITableHeaderProps>>;
  children?: JSX.Element[];
  currentPage: number;
  pages: number;
  data: IResource[][];
  prompt?: any;
  handleTableRefresh: () => void;
  extraHeaderContent?: React.ReactNode;
  onChangePage: (page: number) => void;
  changeOrderItems(data: IResource[][]): void;
}

interface IHeader {
  value: string;
}

interface IState {
  headers: IHeader[];
}

interface ISortEnd {
  oldIndex: number;
  newIndex: number;
}

interface IWayPoint {
  currentPosition: string;
  previousPosition?: string;
  event?: Event;
  waypointTop?: number;
  viewportTop?: number;
  viewportBottom?: number;
}

class Table extends React.PureComponent<IProps, IState > {
  private tableBodyRef: HTMLElement;

  private b = block('data-table');

  public render() {
    const b = this.b;
    const {
      isLoading,
      currentPage,
      pages,
      prompt,
      handleTableRefresh
    } = this.props;

    return (
      <div className={b()}>
        <section className={b('wrapper')}>
          <div className={b('table')} >
            <div className={b('header')}>
              {this.renderHeader()}
            </div>
            <div
              onMouseOver={this.onShowScrollbar}
              onMouseEnter={this.onShowScrollbar}
              onMouseLeave={this.onHideScrollbar}
              className={b('body', { loading: isLoading })}
              ref={(e: HTMLDivElement) => this.setTableBodyRef(e)}
            >
              {
                isLoading
                  ? <ProgressBar theme={circularTheme} type="circular" mode="indeterminate" />
                  : this.renderTableBody()
              }
            </div>
            {currentPage > 0 ? <div onClick={this.returnToFirstPage} className={b('up-arrow')} /> : null}
            {(prompt && prompt.length > 0) && (
              <div
                className={b('notification')}
                onClick={handleTableRefresh}
              >
                <span>{this.getPromptMessage(prompt)}</span>
              </div>
            )}
          </div>
        </section>
        <TablePagination
          currentPage={currentPage}
          pages={pages}
          onChangePage={this.handleChangePage}
        />
      </div>
    );
  }

  @bind
  private getPromptMessage(prompt: any[]) {
    const digits = prompt.length.toString().split('');
    const lastDigit = Number(digits[digits.length - 1]);
    if (prompt.length > 10 && prompt.length < 20) {
      return `${prompt.length} новых записей`;
    } else if (lastDigit === 1) {
      return `${prompt.length} новая запись`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `${prompt.length} новых записи`;
    } else {
      return `${prompt.length} новых записей`;
    }
  }

  @bind
  private onShowScrollbar() {
    this.tableBodyRef.classList.add('table-body-scroll');
  }

  @bind
  private onHideScrollbar() {
    this.tableBodyRef.classList.remove('table-body-scroll');
  }

  @bind
  private returnToFirstPage(): void {
    this.props.onChangePage(0);
    this.changeScrollPosition(0);
  }

  @bind
  private getStyle(dataField) {
    if(dataField == 'state') {
      return {
        flexGrow: 0,
      }
    }
    return {}
  }

  @bind
  private renderHeader() {
    const { children, sort } = (this.props as IProps);
    const b = this.b;
    return (
      <div className={b('row')} >
        { children && children.map((header: any, index: number) => {
          const { dataField, isSortable, autoWidth } = header.props;
          return (
            <div
              key={index}
              className={b('row-item')}
              onClick={
                isSortable
                  ? this.handleSort(dataField)
                  : undefined
              }
              style={this.getStyle(dataField)}
            >
              {React.cloneElement<ITableHeaderProps, any> (
                header,
                { ...header.props, sorted: sort && dataField === sort.by && sort.order }
              )}
            </div>
          );
        })}
        {this.props.extraHeaderContent}
      </div>
    );
  }

  @bind
  private renderTableBody() {
    const rows = this.getRows();

    const { children } = (this.props as IProps);
    return (
      [
        rows.map((currentItem, index: number) => {
          return (
            <TableRowItems
              key={index}
              index={index}
              rowItems={children}
              row={currentItem}
            />
          );
        }),
      ]
    );
  }

  @bind
  private setTableBodyRef(ref: HTMLElement) {
    this.tableBodyRef = ref;
  }

  @bind
  private changeScrollPosition(position: number) {
    this.tableBodyRef.scrollTop = position;
  }

  @bind
  private handleChangePage(targetPage: number, currentPage: number) {
    if (targetPage !== currentPage) {
      this.props.onChangePage(targetPage);
    }
    this.changeScrollPosition(0);
  }

  @bind
  private getRows() {
    const { data } = this.props;
    let rows: IRow[] = [];
    for (const page in data) {
      if (data[page]) {
        rows = rows.concat(data[page]);
      }
    }
    return rows;
  }

  @bind
  private handleSort(column: string) {
    return () => {
      this.changeScrollPosition(0);
      return this.props.onSort ? this.props.onSort(column) : undefined;
    };
  }

}

export { IHeader, ITableHeaderProps, TableHeader };
export default Table;
