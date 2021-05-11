import * as React from 'react';
import {block} from 'bem-cn';

const b = block('data-table');

interface IOwnProps {
  row: any;
  rowItems: any;
  index: number;
  dragElement?: boolean;
}

function getClassName(rowAction: string, rowType: string, row: any): string {
  let className: string = '';
  if (rowAction === 'permit') {
    className = 'data-table__row_green';
  } else if (rowAction === 'block') {
    className = 'data-table__row_red';
  } else {
    className = b('row');
  }

  if (row.state === true) {
    className = b('row') + ' policy-active';
  }

  return rowType === 'gen' ? className + ' gen' : className;
}

class TableRowItems extends React.PureComponent<IOwnProps, {}> {

  getStyle = (row, dataField) => {
    if((row.policyType == 'TIME' || row.policyType == 'BACKUP' || row.policyType == 'WATERMARK') && (dataField == 'state')){
      return {
        flexGrow: 0,
      }
    }
    return {}
  }

  public render() {
    const { rowItems, row } = this.props;
    let style = {}
    return (
      <div
        className={getClassName(row.action, row.type === true ? row.catalog_type : row.type || row.catalog_type, row)}
      >
        {rowItems.map((header: any, columnIndex: number) => {
          const { dataField, formatter, align, autoWidth } = header.props;

          return (
            <div
              key={columnIndex}
              className={b('row-item', { align })}
              style={this.getStyle(row, dataField)}
            >
              {formatter ? formatter(dataField, row) : row[dataField]}
            </div>
          );
        })}
      </div>
    );
  }

}

export default TableRowItems;
